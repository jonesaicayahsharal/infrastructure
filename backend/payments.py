import os
import uuid
import logging
from datetime import datetime, timezone
from typing import List
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from server import db
from utils.mailer import send_email

router = APIRouter(prefix="/api/payments", tags=["payments"])
stripe.api_key = os.environ.get("STRIPE_API_KEY")
PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
logger = logging.getLogger(__name__)


class CheckoutItem(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=99)


class CheckoutRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str | None = None
    shipping_parish: str | None = None
    shipping_district: str | None = None
    items: List[CheckoutItem]
    origin_url: str


def _money(value):
    return f"J${float(value):,.2f}"


async def send_paid_order_emails(order: dict):
    """Send one admin notification and one customer receipt for a paid order."""
    if not order or order.get("payment_status") != "paid" or order.get("payment_emails_sent"):
        return

    # Claim this order before sending so Stripe webhook/status retries do not
    # generate duplicate customer/admin confirmations.
    claimed = await db.orders.update_one(
        {
            "id": order["id"],
            "payment_status": "paid",
            "payment_emails_sent": {"$ne": True},
        },
        {
            "$set": {
                "payment_emails_sent": True,
                "payment_emails_claimed_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    if claimed.modified_count == 0:
        return

    items_html = "".join(
        f"<li>{item.get('quantity', 1)} × {item.get('name', 'Item')} — {_money(item.get('price', 0))}</li>"
        for item in order.get("items", [])
    ) or "<li>Order items unavailable</li>"

    order_id = order.get("id", "N/A")
    total = _money(order.get("total", 0))
    admin_email = os.getenv("ADMIN_EMAIL")
    customer_email = order.get("customer_email")

    admin_body = f"""
    <h2>Paid Order Received</h2>
    <p><strong>Order:</strong> {order_id}</p>
    <p><strong>Name:</strong> {order.get('customer_name', 'N/A')}</p>
    <p><strong>Email:</strong> {customer_email or 'N/A'}</p>
    <p><strong>Phone:</strong> {order.get('customer_phone') or 'N/A'}</p>
    <p><strong>Parish:</strong> {order.get('shipping_parish') or 'N/A'}</p>
    <p><strong>District / Address:</strong> {order.get('shipping_district') or 'N/A'}</p>
    <p><strong>Items:</strong></p>
    <ul>{items_html}</ul>
    <p><strong>Total Paid:</strong> {total} JMD</p>
    <p><strong>Stripe Session:</strong> {order.get('stripe_session_id', 'N/A')}</p>
    """

    customer_body = f"""
    <h2>Thank You — Your Payment Was Received</h2>
    <p>Hi {order.get('customer_name', 'there')},</p>
    <p>Your payment to Jonesaica Infrastructure Solutions has been confirmed.</p>
    <p><strong>Order:</strong> {order_id}</p>
    <p><strong>Your Order:</strong></p>
    <ul>{items_html}</ul>
    <p><strong>Total Paid:</strong> {total} JMD</p>
    <p>We will contact you regarding fulfillment, delivery, pickup, or any additional project details.</p>
    <p>Jonesaica Infrastructure Solutions<br>https://solutions.yasharal.vip</p>
    """

    failures = []
    if admin_email:
        try:
            await send_email(
                subject=f"Paid Order Received — {order_id}",
                recipients=[admin_email],
                body=admin_body,
            )
        except Exception as exc:
            failures.append(f"admin: {exc}")
            logger.error(f"Paid order admin email failed: {exc}")
    else:
        failures.append("admin: ADMIN_EMAIL is not configured")
        logger.error("ADMIN_EMAIL is not set — skipping paid order admin email")

    if customer_email:
        try:
            await send_email(
                subject=f"Your Jonesaica Order Confirmation — {order_id}",
                recipients=[customer_email],
                body=customer_body,
            )
        except Exception as exc:
            failures.append(f"customer: {exc}")
            logger.error(f"Paid order customer email failed: {exc}")
    else:
        failures.append("customer: order has no customer email")

    if failures:
        # Allow a later Stripe status/webhook retry to attempt delivery again.
        await db.orders.update_one(
            {"id": order["id"]},
            {
                "$set": {
                    "payment_emails_sent": False,
                    "payment_email_error": "; ".join(failures),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            },
        )
    else:
        await db.orders.update_one(
            {"id": order["id"]},
            {
                "$set": {
                    "payment_emails_sent_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                "$unset": {"payment_email_error": ""},
            },
        )


async def mark_order_paid_and_notify(session_id: str):
    now = datetime.now(timezone.utc).isoformat()
    await db.orders.update_one(
        {"stripe_session_id": session_id},
        {"$set": {"payment_status": "paid", "updated_at": now}},
    )
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if order:
        await send_paid_order_emails(order)
    return order


@router.post("/create-checkout")
async def create_checkout(input: CheckoutRequest):
    if not stripe.api_key or not PUBLISHABLE_KEY:
        raise HTTPException(status_code=503, detail="Stripe API and publishable keys must both be configured")
    if not input.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    ids = [item.product_id for item in input.items]
    products = await db.products.find({"id": {"$in": ids}}, {"_id": 0}).to_list(100)
    by_id = {p["id"]: p for p in products}
    line_items = []
    order_items = []
    total = 0

    for requested in input.items:
        product = by_id.get(requested.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product not found: {requested.product_id}")
        if not product.get("in_stock") and not product.get("backorder"):
            raise HTTPException(status_code=400, detail=f"Product unavailable: {product['name']}")
        price = int(round(float(product["sale_price"]) * 100))
        total += price * requested.quantity
        order_items.append(
            {
                "product_id": product["id"],
                "name": product["name"],
                "quantity": requested.quantity,
                "price": float(product["sale_price"]),
            }
        )
        line_items.append(
            {
                "price_data": {
                    "currency": "jmd",
                    "unit_amount": price,
                    "product_data": {
                        "name": product["name"],
                        "description": (product.get("description") or "")[:500],
                    },
                },
                "quantity": requested.quantity,
            }
        )

    order_id = str(uuid.uuid4())
    # The checkout return target is fixed to the production site so a browser
    # cannot supply an arbitrary redirect origin.
    origin = "https://solutions.yasharal.vip"

    try:
        session = stripe.checkout.Session.create(
            ui_mode="embedded",
            mode="payment",
            line_items=line_items,
            customer_email=str(input.customer_email),
            return_url=f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}",
            metadata={"order_id": order_id},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Unable to start Stripe checkout: {exc}")

    now = datetime.now(timezone.utc).isoformat()
    await db.orders.insert_one(
        {
            "id": order_id,
            "customer_name": input.customer_name,
            "customer_email": str(input.customer_email),
            "customer_phone": input.customer_phone,
            "shipping_parish": input.shipping_parish,
            "shipping_district": input.shipping_district,
            "items": order_items,
            "total": total / 100,
            "currency": "JMD",
            "payment_status": "pending",
            "payment_emails_sent": False,
            "stripe_session_id": session.id,
            "created_at": now,
            "updated_at": now,
        }
    )
    return {
        "order_id": order_id,
        "session_id": session.id,
        "client_secret": session.client_secret,
        "publishable_key": PUBLISHABLE_KEY,
    }


@router.get("/checkout-status/{session_id}")
async def checkout_status(session_id: str):
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.get("payment_status") != "paid" and stripe.api_key:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                order = await mark_order_paid_and_notify(session_id)
        except Exception as exc:
            logger.error(f"Stripe checkout status refresh failed: {exc}")
    elif order.get("payment_status") == "paid" and not order.get("payment_emails_sent"):
        await send_paid_order_emails(order)
        order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})

    return {
        "order_id": order["id"],
        "payment_status": order.get("payment_status", "pending"),
    }


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("stripe-signature")
    secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    if not secret:
        raise HTTPException(status_code=503, detail="Stripe webhook is not configured")

    try:
        event = stripe.Webhook.construct_event(payload, signature, secret)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid webhook: {exc}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if session.get("payment_status") == "paid":
            await mark_order_paid_and_notify(session["id"])

    return {"received": True}
