from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
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


# Models
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    message: Optional[str] = None


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
    in_stock: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    category: ProductCategory
    description: str
    regular_price: float
    sale_price: float
    image_url: str
    specs: Optional[dict] = None
    in_stock: bool = True


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    parish: str
    district: str
    interest: InterestType
    products: List[str] = []  # Product IDs
    service_description: Optional[str] = None
    message: Optional[str] = None
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
    service_description: Optional[str] = None
    message: Optional[str] = None


# Helper function for serialization
def serialize_datetime(obj):
    if isinstance(obj.get('created_at'), datetime):
        obj['created_at'] = obj['created_at'].isoformat()
    return obj


# Routes
@api_router.get("/")
async def root():
    return {"message": "Jonesaica Infrastructure Solutions API"}


# Lead routes
@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead_dict = input.model_dump()
    lead_obj = Lead(**lead_dict)
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead_obj


@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads


# Product routes
@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_dict = input.model_dump()
    product_obj = Product(**product_dict)
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj


@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[ProductCategory] = None):
    query = {}
    if category:
        query["category"] = category.value
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product


# Quote routes
@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote(input: QuoteRequestCreate):
    quote_dict = input.model_dump()
    quote_obj = QuoteRequest(**quote_dict)
    doc = quote_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
    return quote_obj


@api_router.get("/quotes", response_model=List[QuoteRequest])
async def get_quotes():
    quotes = await db.quotes.find({}, {"_id": 0}).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quotes


# Seed products endpoint
@api_router.post("/seed-products")
async def seed_products():
    # Check if products already exist
    existing = await db.products.count_documents({})
    if existing > 0:
        return {"message": f"Products already seeded. {existing} products exist."}
    
    products_data = [
        # Inverters
        {
            "name": "Deye 6kW Hybrid Inverter",
            "category": "inverters",
            "description": "Deye-SUN-6k-SG01LP1-US hybrid solar inverter. Perfect for residential solar installations with 6kW capacity.",
            "regular_price": 250000,
            "sale_price": 245000,
            "image_url": "https://images.pexels.com/photos/9875409/pexels-photo-9875409.jpeg",
            "specs": {"power": "6kW", "type": "Hybrid", "model": "SG01LP1-US"}
        },
        {
            "name": "Deye 8kW Hybrid Inverter",
            "category": "inverters",
            "description": "Deye-SUN-8k-SG01LP1-US hybrid solar inverter. Ideal for medium-sized homes with higher energy demands.",
            "regular_price": 265000,
            "sale_price": 259000,
            "image_url": "https://images.pexels.com/photos/9875409/pexels-photo-9875409.jpeg",
            "specs": {"power": "8kW", "type": "Hybrid", "model": "SG01LP1-US"}
        },
        {
            "name": "Deye 10kW Hybrid Inverter",
            "category": "inverters",
            "description": "Deye-SUN-10k-SG01LP1-US hybrid solar inverter. High-capacity solution for larger residential or small commercial use.",
            "regular_price": 300000,
            "sale_price": 294000,
            "image_url": "https://images.pexels.com/photos/9875409/pexels-photo-9875409.jpeg",
            "specs": {"power": "10kW", "type": "Hybrid", "model": "SG01LP1-US"}
        },
        {
            "name": "Deye 12kW Hybrid Inverter",
            "category": "inverters",
            "description": "Deye-SUN-12k-SG01LP1-US hybrid solar inverter. Our most powerful inverter for maximum energy independence.",
            "regular_price": 325000,
            "sale_price": 318000,
            "image_url": "https://images.pexels.com/photos/9875409/pexels-photo-9875409.jpeg",
            "specs": {"power": "12kW", "type": "Hybrid", "model": "SG01LP1-US"}
        },
        # Batteries - BSL
        {
            "name": "BSL 5kWh Rack Battery",
            "category": "batteries",
            "description": "BSL-B-LFP48-100E 5kWh Rack Mount LiFePO4 Battery. Reliable energy storage with long cycle life.",
            "regular_price": 165000,
            "sale_price": 162000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "5kWh", "type": "LiFePO4", "mount": "Rack"}
        },
        {
            "name": "BSL 5kWh Rack Brackets",
            "category": "batteries",
            "description": "BSL-B-LFP48-100E 5kWh Rack Brackets. Professional mounting solution for BSL batteries.",
            "regular_price": 3500,
            "sale_price": 3400,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"compatibility": "BSL 5kWh", "type": "Mounting Bracket"}
        },
        {
            "name": "BSL 10kWh Rack Battery",
            "category": "batteries",
            "description": "BSL-B-LFP48-200E 10kWh Rack Mount LiFePO4 Battery. Double capacity for extended backup power.",
            "regular_price": 250000,
            "sale_price": 245000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "10kWh", "type": "LiFePO4", "mount": "Rack"}
        },
        {
            "name": "BSL 10kWh Rack Brackets",
            "category": "batteries",
            "description": "BSL-B-LFP48-200E 10kWh Rack Brackets. Secure mounting for larger battery systems.",
            "regular_price": 4500,
            "sale_price": 4400,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"compatibility": "BSL 10kWh", "type": "Mounting Bracket"}
        },
        {
            "name": "BSL Li-Pro 10.24kWh Wall Battery",
            "category": "batteries",
            "description": "BSL-Li-Pro 10240 10.24kWh Wall Mount Battery. Sleek wall-mounted design for space efficiency.",
            "regular_price": 275000,
            "sale_price": 269000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "10.24kWh", "type": "LiFePO4", "mount": "Wall"}
        },
        # Batteries - Deye
        {
            "name": "Deye 5.12kWh Battery",
            "category": "batteries",
            "description": "Deye 5.12kWh LiFePO4 Battery. Compact and efficient energy storage solution.",
            "regular_price": 135000,
            "sale_price": 132000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "5.12kWh", "brand": "Deye", "type": "LiFePO4"}
        },
        {
            "name": "Deye 10.24kWh Battery",
            "category": "batteries",
            "description": "Deye 10.24kWh LiFePO4 Battery. Mid-range capacity for everyday household needs.",
            "regular_price": 245000,
            "sale_price": 240000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "10.24kWh", "brand": "Deye", "type": "LiFePO4"}
        },
        {
            "name": "Deye 12kWh Battery",
            "category": "batteries",
            "description": "Deye 12kWh LiFePO4 Battery. Extended capacity for larger homes.",
            "regular_price": 310000,
            "sale_price": 304000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "12kWh", "brand": "Deye", "type": "LiFePO4"}
        },
        {
            "name": "Deye 16kWh Battery",
            "category": "batteries",
            "description": "Deye 16kWh LiFePO4 Battery. Maximum capacity for complete energy independence.",
            "regular_price": 350000,
            "sale_price": 343000,
            "image_url": "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
            "specs": {"capacity": "16kWh", "brand": "Deye", "type": "LiFePO4"}
        },
        # Panels
        {
            "name": "450W SunPower Maxeon Bi-Facial Panel",
            "category": "panels",
            "description": "450w SunPower Maxeon Blk Bi-Facial solar panel. Premium efficiency with bifacial technology for maximum power generation.",
            "regular_price": 15500,
            "sale_price": 15200,
            "image_url": "https://images.pexels.com/photos/9875423/pexels-photo-9875423.jpeg",
            "specs": {"power": "450W", "type": "Bi-Facial", "brand": "SunPower Maxeon"}
        },
        {
            "name": "545W SunPower Maxeon Bifacial Panel",
            "category": "panels",
            "description": "545W SunPower Maxeon Bifacial solar panel. High-output panel for maximum energy harvest.",
            "regular_price": 16500,
            "sale_price": 16200,
            "image_url": "https://images.pexels.com/photos/9875423/pexels-photo-9875423.jpeg",
            "specs": {"power": "545W", "type": "Bi-Facial", "brand": "SunPower Maxeon"}
        }
    ]
    
    for product_data in products_data:
        product = Product(**product_data)
        doc = product.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.products.insert_one(doc)
    
    return {"message": f"Successfully seeded {len(products_data)} products"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
