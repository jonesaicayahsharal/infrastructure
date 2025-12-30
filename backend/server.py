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

app = FastAPI()
api_router = APIRouter(prefix="/api")


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


@api_router.get("/")
async def root():
    return {"message": "Jonesaica Infrastructure Solutions API"}


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


@api_router.post("/seed-products")
async def seed_products():
    existing = await db.products.count_documents({})
    if existing > 0:
        await db.products.delete_many({})
    
    # Products based on your price list with competitive pricing vs Enersave
    products_data = [
        # INVERTERS - Deye (from your price list)
        {
            "name": "Deye 6kW Hybrid Solar Inverter",
            "category": "inverters",
            "description": "Deye SUN-6K-SG01LP1-US 6000W Hybrid Inverter. Perfect for residential solar systems with built-in MPPT charge controller. Supports lithium and lead-acid batteries.",
            "regular_price": 295000,
            "sale_price": 244000,
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
            "specs": {"power": "6000W", "voltage": "48V", "type": "Hybrid", "mppt": "2 MPPT"},
            "features": ["Pure sine wave output", "Built-in MPPT controller", "Wi-Fi monitoring", "Battery priority settings", "Grid-tie capable"]
        },
        {
            "name": "Deye 8kW Hybrid Solar Inverter",
            "category": "inverters",
            "description": "Deye SUN-8K-SG01LP1-US 8000W Hybrid Inverter. Mid-range capacity for homes with higher energy demands. Advanced monitoring and smart grid features.",
            "regular_price": 320000,
            "sale_price": 258000,
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
            "specs": {"power": "8000W", "voltage": "48V", "type": "Hybrid", "mppt": "2 MPPT"},
            "features": ["Pure sine wave output", "Parallel capability", "LCD display", "Multiple working modes", "Remote monitoring"]
        },
        {
            "name": "Deye 10kW Hybrid Solar Inverter", 
            "category": "inverters",
            "description": "Deye SUN-10K-SG01LP1-US 10000W Hybrid Inverter. High-capacity solution for larger homes and small commercial applications.",
            "regular_price": 350000,
            "sale_price": 293000,
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
            "specs": {"power": "10000W", "voltage": "48V", "type": "Hybrid", "mppt": "2 MPPT"},
            "features": ["High efficiency >97%", "Wide PV input range", "Smart load management", "Anti-islanding protection", "Expandable system"]
        },
        {
            "name": "Deye 12kW Hybrid Solar Inverter",
            "category": "inverters",
            "description": "Deye SUN-12K-SG01LP1-US 12000W Hybrid Inverter. Maximum residential capacity for complete energy independence.",
            "regular_price": 420000,
            "sale_price": 318000,
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
            "specs": {"power": "12000W", "voltage": "48V", "type": "Hybrid", "mppt": "2 MPPT"},
            "features": ["Maximum output power", "Seamless grid switching", "Generator input support", "Advanced BMS compatibility", "IP65 rating"]
        },
        # BATTERIES - BSL Series (from your price list)
        {
            "name": "BSL 5kWh Rack Mount LiFePO4 Battery",
            "category": "batteries",
            "description": "BSL-B-LFP48-100E 5kWh Rack Mount Lithium Iron Phosphate Battery. Safe, reliable energy storage with 6000+ cycle life.",
            "regular_price": 189000,
            "sale_price": 162000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "5kWh", "voltage": "48V", "chemistry": "LiFePO4", "cycles": "6000+"},
            "features": ["Built-in BMS", "Rack mountable", "Expandable design", "10-year warranty", "Safe LFP chemistry"]
        },
        {
            "name": "BSL 5kWh Rack Mounting Brackets",
            "category": "batteries",
            "description": "Professional mounting brackets for BSL 5kWh batteries. Secure installation solution.",
            "regular_price": 4000,
            "sale_price": 3400,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"compatibility": "BSL 5kWh", "material": "Steel", "type": "Rack Mount"},
            "features": ["Heavy-duty steel", "Easy installation", "Secure fit", "Corrosion resistant"]
        },
        {
            "name": "BSL 10kWh Rack Mount LiFePO4 Battery",
            "category": "batteries",
            "description": "BSL-B-LFP48-200E 10kWh Rack Mount Lithium Battery. Double capacity for extended backup and larger systems.",
            "regular_price": 280000,
            "sale_price": 245000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "10kWh", "voltage": "48V", "chemistry": "LiFePO4", "cycles": "6000+"},
            "features": ["High capacity", "Parallel connection", "Smart BMS", "Temperature protection", "Long lifespan"]
        },
        {
            "name": "BSL 10kWh Rack Mounting Brackets",
            "category": "batteries",
            "description": "Heavy-duty mounting brackets for BSL 10kWh battery systems.",
            "regular_price": 5500,
            "sale_price": 4400,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"compatibility": "BSL 10kWh", "material": "Steel", "type": "Rack Mount"},
            "features": ["Reinforced design", "Professional grade", "Quick assembly"]
        },
        {
            "name": "BSL Li-Pro 10.24kWh Wall Mount Battery",
            "category": "batteries",
            "description": "BSL-Li-Pro 10240 Wall Mounted LiFePO4 Battery. Space-saving design for residential installations.",
            "regular_price": 320000,
            "sale_price": 269000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "10.24kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "mount": "Wall"},
            "features": ["Sleek wall mount", "IP65 rated", "LCD display", "CAN/RS485 communication", "Expandable to 61kWh"]
        },
        # BATTERIES - Deye Series (from your price list)
        {
            "name": "Deye 5.12kWh LiFePO4 Battery",
            "category": "batteries",
            "description": "Deye 5.12kWh Lithium Iron Phosphate Battery. Compact and efficient storage solution for solar systems.",
            "regular_price": 160000,
            "sale_price": 132000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "5.12kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "brand": "Deye"},
            "features": ["Modular design", "Built-in heater", "Smart monitoring", "10-year warranty"]
        },
        {
            "name": "Deye 10.24kWh LiFePO4 Battery",
            "category": "batteries",
            "description": "Deye 10.24kWh Lithium Battery. Mid-range capacity for average household energy needs.",
            "regular_price": 285000,
            "sale_price": 240000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "10.24kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "brand": "Deye"},
            "features": ["High efficiency", "Fast charging", "Low self-discharge", "Safe operation"]
        },
        {
            "name": "Deye 12kWh LiFePO4 Battery",
            "category": "batteries",
            "description": "Deye 12kWh Lithium Battery. Extended capacity for homes with higher energy consumption.",
            "regular_price": 360000,
            "sale_price": 304000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "12kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "brand": "Deye"},
            "features": ["Premium cells", "Advanced BMS", "Remote monitoring", "Parallel capable"]
        },
        {
            "name": "Deye 16kWh LiFePO4 Battery",
            "category": "batteries",
            "description": "Deye 16kWh Lithium Battery. Maximum capacity for complete energy independence.",
            "regular_price": 420000,
            "sale_price": 343000,
            "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
            "specs": {"capacity": "16kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "brand": "Deye"},
            "features": ["Highest capacity", "Multi-unit stacking", "Intelligent management", "Long cycle life"]
        },
        # SOLAR PANELS (from your price list)
        {
            "name": "450W SunPower Maxeon Bi-Facial Panel",
            "category": "panels",
            "description": "450W SunPower Maxeon Black Bi-Facial Solar Panel. Premium efficiency with bifacial technology for maximum power generation from both sides.",
            "regular_price": 18000,
            "sale_price": 15200,
            "image_url": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600",
            "specs": {"power": "450W", "type": "Bi-Facial", "brand": "SunPower Maxeon", "efficiency": "22.8%"},
            "features": ["Bifacial technology", "All-black aesthetic", "25-year warranty", "Anti-reflective glass", "High wind resistance"]
        },
        {
            "name": "545W SunPower Maxeon Bifacial Panel",
            "category": "panels",
            "description": "545W SunPower Maxeon Bifacial Solar Panel. High-output panel for maximum energy harvest and commercial applications.",
            "regular_price": 22000,
            "sale_price": 16200,
            "image_url": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600",
            "specs": {"power": "545W", "type": "Bi-Facial", "brand": "SunPower Maxeon", "efficiency": "23.5%"},
            "features": ["Industry-leading efficiency", "Bifacial gain up to 30%", "Robust frame", "Premium performance", "40-year lifespan"]
        },
    ]
    
    for product_data in products_data:
        product = Product(**product_data)
        doc = product.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.products.insert_one(doc)
    
    return {"message": f"Successfully seeded {len(products_data)} products"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
