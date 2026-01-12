from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone
from enum import Enum

from utils.email import send_email

# ----------------------------
# Setup
# ----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("jonesaica-backend")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "jonesaica_db")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ----------------------------
# Models
# ----------------------------
class InterestType(str, Enum):
    SOLAR = "solar"
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    CARPENTRY = "carpentry"
    QUOTE = "quote"
    OTHER = "other"


class ProductCategory(str, Enum):
    INVERTERS = "inverters"
    BATTERIES = "batteries"
    PANELS = "panels"
    ACCESSORIES = "accessories"


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    specific_needs: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    specific_needs: Optional[str] = None


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: ProductCategory
    description: str
    regular_price: float
    sale_price: float
    image_url: str
    specs: Optional[dict] = None
    features: Optional[List[str]] = None
    in_stock: bool = True
    backorder: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    category: ProductCategory
    description: str
    regular_price: float
    sale_price: float
    image_url: str
    specs: Optional[dict] = None
    features: Optional[List[str]] = None
    in_stock: bool = True
    backorder: bool = False


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    products: List[str] = []
    specific_needs: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class QuoteRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    products: List[str] = []
    specific_needs: Optional[str] = None


# ----------------------------
# Basic / Health
# ----------------------------
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "jonesaica-backend"}


@api_router.get("/")
async def root():
    return {"message": "Jonesaica Infrastructure Solutions API"}


# ----------------------------
# Leads
# ----------------------------
@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)

    admin_email = os.getenv("ADMIN_EMAIL")
    if admin_email:
        admin_body = f"""
        <h2>New Website Inquiry</h2>
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Parish:</strong> {lead.parish}</p>
        <p><strong>District:</strong> {lead.district}</p>
        <p><strong>Interest:</strong> {lead.interest}</p>
        <p><strong>Details:</strong><br>{lead.specific_needs or "N/A"}</p>
        """
        try:
            await send_email(
                subject="New Website Inquiry",
                recipients=[admin_email],
                body=admin_body,
            )
        except Exception as e:
            logger.error(f"Lead admin email failed: {e}")

    return lead


@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get("created_at"), str):
            lead["created_at"] = datetime.fromisoformat(lead["created_at"])
    return leads


# ----------------------------
# Quotes
# ----------------------------
@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote(input: QuoteRequestCreate):
    quote = QuoteRequest(**input.model_dump())
    doc = quote.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.quotes.insert_one(doc)

    admin_email = os.getenv("ADMIN_EMAIL")
    product_list = "<br>".join(quote.products) if quote.products else "N/A"

    # Admin notification
    if admin_email:
        admin_body = f"""
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> {quote.name}</p>
        <p><strong>Email:</strong> {quote.email}</p>
        <p><strong>Phone:</strong> {quote.phone}</p>
        <p><strong>Parish:</strong> {quote.parish}</p>
        <p><strong>District:</strong> {quote.district}</p>
        <p><strong>Interest:</strong> {quote.interest}</p>
        <p><strong>Products:</strong><br>{product_list}</p>
        <p><strong>Details:</strong><br>{quote.specific_needs or "N/A"}</p>
        """
        try:
            await send_email(
                subject="New Quote Request",
                recipients=[admin_email],
                body=admin_body,
            )
        except Exception as e:
            logger.error(f"Quote admin email failed: {e}")

    # Customer confirmation
    customer_body = f"""
    <h2>Quote Request Received</h2>
    <p>We received your request and will review it shortly.</p>

    <p><strong>Requested Service:</strong> {quote.interest}</p>
    <p><strong>Products:</strong><br>{product_list}</p>

    <p>If you have more details to share, reply to this email.</p>
    <p>— Jonesaica Infrastructure Solutions</p>
    """
    try:
        await send_email(
            subject="Your Quote Request Was Received",
            recipients=[str(quote.email)],
            body=customer_body,
        )
    except Exception as e:
        logger.error(f"Quote customer email failed: {e}")

    return quote


@api_router.get("/quotes", response_model=List[QuoteRequest])
async def get_quotes():
    quotes = await db.quotes.find({}, {"_id": 0}).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get("created_at"), str):
            quote["created_at"] = datetime.fromisoformat(quote["created_at"])
    return quotes


# ----------------------------
# Products
# ----------------------------
@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_obj = Product(**input.model_dump())
    doc = product_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.products.insert_one(doc)
    return product_obj


@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[ProductCategory] = None):
    query: dict[str, Any] = {}
    if category:
        query["category"] = category.value
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get("created_at"), str):
        product["created_at"] = datetime.fromisoformat(product["created_at"])
    return product


# ----------------------------
# Orders (admin + customer email)
# ----------------------------
@api_router.post("/orders")
async def create_order(order: dict):
    admin_email = os.getenv("ADMIN_EMAIL")

    items_html = "".join(
        f"<li>{item.get('name')} × {item.get('qty')}</li>"
        for item in order.get("items", [])
    ) or "<li>No items listed</li>"

    admin_body = f"""
    <h2>New Order Submitted</h2>
    <p><strong>Name:</strong> {order.get('name')}</p>
    <p><strong>Email:</strong> {order.get('email')}</p>
    <p><strong>Phone:</strong> {order.get('phone')}</p>

    <h3>Items</h3>
    <ul>{items_html}</ul>
    """

    if admin_email:
        try:
            await send_email(
                subject="New Order Submitted",
                recipients=[admin_email],
                body=admin_body,
            )
        except Exception as e:
            logger.error(f"Order admin email failed: {e}")

    customer_email = order.get("email")
    if customer_email:
        customer_body = f"""
        <h2>Order Received</h2>
        <p>We received your order request and will review it shortly.</p>

        <p><strong>What happens next?</strong></p>
        <ul>
            <li>We review your request</li>
            <li>We contact you to confirm details</li>
            <li>We prepare next steps</li>
        </ul>

        <p>If you have questions, reply to this email.</p>
        <p>— Jonesaica Infrastructure Solutions</p>
        """
        try:
            await send_email(
                subject="We Received Your Order",
                recipients=[customer_email],
                body=customer_body,
            )
        except Exception as e:
            logger.error(f"Order customer email failed: {e}")

    return {"success": True}


# ----------------------------
# Payments: receipt (manual trigger)
# ----------------------------
@api_router.post("/payments/receipt")
async def payment_receipt(payment: dict):
    customer_email = payment.get("email")
    admin_email = os.getenv("ADMIN_EMAIL")

    receipt_body = f"""
    <h2>Payment Received</h2>
    <p><strong>Amount:</strong> {payment.get("amount")}</p>
    <p><strong>Reference:</strong> {payment.get("reference")}</p>
    <p><strong>Date:</strong> {payment.get("date")}</p>
    <p>— Jonesaica Infrastructure Solutions</p>
    """

    if customer_email:
        try:
            await send_email(
                subject="Payment Receipt",
                recipients=[customer_email],
                body=receipt_body,
            )
        except Exception as e:
            logger.error(f"Payment customer email failed: {e}")

    if admin_email:
        try:
            await send_email(
                subject="Payment Received (Admin Copy)",
                recipients=[admin_email],
                body=receipt_body,
            )
        except Exception as e:
            logger.error(f"Payment admin email failed: {e}")

    return {"success": True}


# ----------------------------
# Invoices: send notice (manual trigger)
# ----------------------------
@api_router.post("/invoices/send")
async def send_invoice(invoice: dict):
    customer_email = invoice.get("email")
    admin_email = os.getenv("ADMIN_EMAIL")

    invoice_body = f"""
    <h2>Invoice Issued</h2>
    <p><strong>Invoice Number:</strong> {invoice.get("invoice_number")}</p>
    <p><strong>Amount Due:</strong> {invoice.get("amount_due")}</p>
    <p><strong>Due Date:</strong> {invoice.get("due_date")}</p>
    <p>— Jonesaica Infrastructure Solutions</p>
    """

    if customer_email:
        try:
            await send_email(
                subject="Invoice Notice",
                recipients=[customer_email],
                body=invoice_body,
            )
        except Exception as e:
            logger.error(f"Invoice customer email failed: {e}")

    if admin_email:
        try:
            await send_email(
                subject="Invoice Sent (Admin Copy)",
                recipients=[admin_email],
                body=invoice_body,
            )
        except Exception as e:
            logger.error(f"Invoice admin email failed: {e}")

    return {"success": True}


# ----------------------------
# Seed Products
# ----------------------------
@api_router.post("/seed-products")
async def seed_products():
    await db.products.delete_many({})

    # PASTE YOUR full products_data list BELOW this line.
    # Keep it exactly as a Python list: products_data = [ ... ]
    products_data = [
        # Example item (you can remove this once you paste your full list)
        {
            "name": "Example Product",
            "category": "inverters",
            "description": "Example description",
            "regular_price": 100.0,
            "sale_price": 90.0,
            "image_url": "https://example.com/image.png",
            "specs": {},
            "features": [],
            "in_stock": True,
            "backorder": False,
        }
    ]

    inserted = 0
    for product_data in products_data:
        # Allow category as string in seed list
        if isinstance(product_data.get("category"), str):
            # Validate it matches enum values
            category_value = product_data["category"]
            if category_value not in [c.value for c in ProductCategory]:
                raise HTTPException(status_code=400, detail=f"Invalid category: {category_value}")

        product_obj = Product(**product_data)
        doc = product_obj.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        await db.products.insert_one(doc)
        inserted += 1

    return {"message": f"Seeded {inserted} products"}


# ----------------------------
# App wiring
# ----------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
