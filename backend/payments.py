import os
import uuid
from datetime import datetime, timezone
from typing import List

import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from server import db

router = APIRouter(prefix="/api/payments", tags=["payments"])
stripe.api_key = os.environ.get("STRIPE_API_KEY")

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

@router.post("/create-checkout")
async def create_checkout(input: CheckoutRequest):
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Stripe is not configured")
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
        order_items.append({"product_id": product["id"], "name": product["name"], "quantity": requested.quantity, "price": float(product["sale_price"])})
        line_items.append({"price_data": {"currency": "jmd", "unit_amount": price, "product_data": {"name": product["name"], "description": (product.get("description") or "")[:500]}}, "quantity": requested.quantity})

    order_id = str(uuid.uuid4())
    origin = input.origin_url.rstrip("/")
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
    await db.orders.insert_one({
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
        "stripe_session_id": session.id,
        "created_at": now,
        "updated_at": now,
    })
    return {"order_id": order_id, "session_id": session.id, "client_secret": session.client_secret, "publishable_key": os.environ.get("STRIPE_PUBLISHABLE_KEY", "")}

@router.get("/checkout-status/{session_id}")
async def checkout_status(session_id: str):
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.get("payment_status") != "paid" and stripe.api_key:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                await db.orders.update_one({"id": order["id"]}, {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}})
                order["payment_status"] = "paid"
        except Exception:
            pass
    return {"order_id": order["id"], "payment_status": order.get("payment_status", "pending")}

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
            await db.orders.update_one({"stripe_session_id": session["id"]}, {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"received": True}
