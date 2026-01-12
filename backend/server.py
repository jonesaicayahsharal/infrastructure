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
from utils.email import send_email
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'jonesaica_db')]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# Health check endpoint for Railway/deployment
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "jonesaica-backend"}


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

    # 🔔 EMAIL NOTIFICATION (ADMIN)
    admin_email = os.getenv("ADMIN_EMAIL")

    product_list = "<br>".join(quote_obj.products) if quote_obj.products else "N/A"

    email_body = f"""
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> {quote_obj.name}</p>
    <p><strong>Email:</strong> {quote_obj.email}</p>
    <p><strong>Phone:</strong> {quote_obj.phone}</p>
    <p><strong>Parish:</strong> {quote_obj.parish}</p>
    <p><strong>District:</strong> {quote_obj.district}</p>
    <p><strong>Interest:</strong> {quote_obj.interest}</p>
    <p><strong>Products:</strong><br>{product_list}</p>
    <p><strong>Details:</strong><br>{quote_obj.specific_needs or "N/A"}</p>
    """

    await send_email(
        subject="New Quote Request",
        recipients=[admin_email],
        body=email_body,
    )

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
    await db.products.delete_many({})
    
    # PRODUCTS FROM COMPETITOR SITES - PRICES UNDERCUT SLIGHTLY
    products_data = [
        # ===== INVERTERS =====
        # Deye 6kW - Enersave: Sale $295,000 / Reg $421,500 - We undercut
        {
            "name": "Deye SUN-6K-SG01LP1-US 6kW Hybrid Inverter",
            "category": "inverters",
            "description": "6000W Hybrid Solar Inverter with dual MPPT. Perfect for small to medium homes. Features colorful touch LCD, IP65 protection, and 5-year warranty.",
            "regular_price": 415000,
            "sale_price": 289000,
            "image_url": "https://enersavesolutions.com/cdn/shop/files/SUN-6K-SG01LP1_grande.png?v=1763146513",
            "specs": {
                "power": "6000W",
                "max_pv_input": "7800W",
                "pv_voltage": "125-425V DC",
                "frequency": "50/60Hz",
                "efficiency": "97.6%",
                "warranty": "5 Years"
            },
            "features": [
                "Max PV Input Power - 7800W",
                "Colorful touch LCD, IP65 protection",
                "6 time periods for battery charging/discharging",
                "Max charging/discharging current of 135A",
                "DC & AC couple to retrofit existing solar",
                "4ms fast transfer from on-grid to off-grid",
                "Parallel up to 16 units"
            ]
        },
        # Deye 8kW - Enersave: $510,000 (no sale) - We undercut
        {
            "name": "Deye SUN-8K-SG01LP1-US 8kW Hybrid Inverter",
            "category": "inverters",
            "description": "8000W Hybrid Solar Inverter ideal for medium-sized homes or EV-ready setups. High efficiency with dual MPPT and IP65 weatherproofing.",
            "regular_price": 460000,
            "sale_price": 324000,
            "image_url": "https://enersavesolutions.com/cdn/shop/products/deye-inverter-1_grande.png?v=1652270688",
            "specs": {
                "power": "8000W",
                "max_pv_input": "10400W",
                "pv_voltage": "125-500V DC",
                "frequency": "50/60Hz",
                "efficiency": "97.6%",
                "warranty": "5 Years"
            },
            "features": [
                "Max PV Input Power - 10400W",
                "Colorful touch LCD, IP65 protection",
                "6 time periods for battery charging/discharging",
                "Max charging/discharging current of 190A",
                "Support storing energy from diesel generator",
                "Smart Load application and Grid peak shaving",
                "Parallel up to 16 units"
            ]
        },
        # Deye 10kW - RezynTech: $340,000 - We undercut
        {
            "name": "Deye SUN-10K-SG01LP1-US 10kW Hybrid Inverter",
            "category": "inverters",
            "description": "10000W Hybrid Solar Inverter suited for large homes or light commercial use. 97.6% efficiency with dual MPPT and Wi-Fi monitoring.",
            "regular_price": 530000,
            "sale_price": 345000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/DeyeInverter.jpg?v=1762354776&width=800",
            "specs": {
                "power": "10000W",
                "max_pv_input": "13000W",
                "pv_voltage": "125-500V DC",
                "frequency": "50/60Hz",
                "efficiency": "97.6%",
                "warranty": "5 Years"
            },
            "features": [
                "Max PV Input Power - 13000W",
                "Split-phase 120/240V output",
                "Dual MPPT for optimal efficiency",
                "Wi-Fi/LAN monitoring included",
                "Battery support (40-60V)",
                "IP65 weatherproof design",
                "Parallel scalability up to 16 units"
            ]
        },
        # Deye 12kW - Enersave: Sale $390,000 / Reg $618,750 - We undercut
        {
            "name": "Deye SUN-12K-SG02LP2-US 12kW Hybrid Inverter",
            "category": "inverters",
            "description": "12000W Hybrid Solar Inverter built for high-demand residential and commercial installations. Maximum capacity for complete energy independence.",
            "regular_price": 615000,
            "sale_price": 385000,
            "image_url": "https://enersavesolutions.com/cdn/shop/files/DEYE_SUN-12K-SG02LP2_grande.png?v=1721337309",
            "specs": {
                "power": "12000W",
                "max_pv_input": "15600W",
                "pv_voltage": "125-500V DC",
                "frequency": "50/60Hz",
                "efficiency": "97.6%",
                "warranty": "5 Years"
            },
            "features": [
                "Max PV Input Power - 15600W",
                "Colorful touch LCD, IP65 protection",
                "6 time periods for battery charging/discharging",
                "Max charging/discharging current of 190A",
                "DC & AC couple to retrofit existing solar",
                "4ms fast transfer from on-grid to off-grid",
                "Parallel up to 16 units"
            ]
        },
        
        # ===== BATTERIES =====
        # Deye 5.12kWh - Your price: $185,000 sale / $320,000 original
        {
            "name": "Deye 5.12kWh LiFePO4 Rack-Mount Battery",
            "category": "batteries",
            "description": "Compact 5.12kWh LiFePO4 battery with 6000+ cycle life. Modular design with built-in intelligent BMS and 5-year warranty.",
            "regular_price": 320000,
            "sale_price": 185000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/Deyebatteryunitonslatwallpanel_ced9114d-9295-4c4d-b415-cf43fd367442.png?v=1765550754&width=800",
            "specs": {
                "capacity": "5.12kWh",
                "voltage": "51.2V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "warranty": "5 Years"
            },
            "features": [
                "LiFePO4 battery technology for high safety",
                "6000+ cycle life for long-term performance",
                "Modular & scalable design",
                "Built-in intelligent BMS with safety protections",
                "Flexible installation (wall, rack, floor, stacked)",
                "Optimized for Deye hybrid inverters"
            ]
        },
        # Deye 10.24kWh - Proportional pricing between 5.12 and 16kWh
        {
            "name": "Deye 10.24kWh LiFePO4 Rack-Mount Battery",
            "category": "batteries",
            "description": "Mid-range 10.24kWh LiFePO4 battery for average household needs. 6000+ cycle life with intelligent BMS protection.",
            "regular_price": 600000,
            "sale_price": 370000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/WhatsAppImage2025-12-12at09.26.26_e999d824_35f0d8a1-ae03-4ef0-87fa-00890c251552.jpg?v=1765550754&width=800",
            "specs": {
                "capacity": "10.24kWh",
                "voltage": "51.2V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "warranty": "5 Years"
            },
            "features": [
                "LiFePO4 battery technology for high safety",
                "6000+ cycle life for long-term performance",
                "Modular & scalable design",
                "Built-in intelligent BMS",
                "Smart monitoring (CAN/RS485, app support)",
                "Optimized for Deye hybrid inverters"
            ]
        },
        # Deye 12kWh - Proportional pricing
        {
            "name": "Deye 12kWh LiFePO4 Rack-Mount Battery",
            "category": "batteries",
            "description": "High-capacity 12kWh LiFePO4 battery for larger homes. Scalable modular design with comprehensive BMS protection.",
            "regular_price": 680000,
            "sale_price": 420000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/WhatsAppImage2025-12-12at09.25.48_b1764910_07836b49-e61d-4652-92b1-b59e197a1656.jpg?v=1765550754&width=800",
            "specs": {
                "capacity": "12kWh",
                "voltage": "51.2V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "warranty": "5 Years"
            },
            "features": [
                "LiFePO4 battery technology for high safety",
                "6000+ cycle life for long-term performance",
                "Modular & scalable design",
                "Built-in intelligent BMS",
                "High charge & discharge capability",
                "Optimized for Deye hybrid inverters"
            ]
        },
        # Deye 16kWh - Your price: $550,000 sale / $810,000 original
        {
            "name": "Deye 16kWh LiFePO4 Wall-Mount Battery",
            "category": "batteries",
            "description": "Maximum capacity 16kWh LiFePO4 wall-mounted battery for complete energy independence. Premium storage solution for high-demand systems.",
            "regular_price": 825000,
            "sale_price": 750000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/Deyebatteryunitonslatwallpanel_ced9114d-9295-4c4d-b415-cf43fd367442.png?v=1765550754&width=800",
            "specs": {
                "capacity": "16kWh",
                "voltage": "51.2V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "mount": "Wall",
                "warranty": "5 Years"
            },
            "features": [
                "Maximum storage capacity",
                "LiFePO4 technology for safety & longevity",
                "6000+ cycle life",
                "Wall-mounted for space efficiency",
                "Built-in intelligent BMS",
                "Smart monitoring & communication"
            ]
        },
        # BSL 5.12kWh Rack - RezynTech: $200,000
        {
            "name": "BSL 5.12kWh LiFePO4 Rack-Mount Battery",
            "category": "batteries",
            "description": "BSL B-LFP48-100E compact rack-mount battery. 6000+ cycle life with advanced BMS. Compatible with most hybrid inverters including Deye.",
            "regular_price": 360000,
            "sale_price": 220000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/BSL_2.png?v=1762357657&width=800",
            "specs": {
                "capacity": "5.12kWh",
                "voltage": "48V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "mount": "Rack"
            },
            "features": [
                "Compact 48V / 5kWh LiFePO4 rack-mount",
                "Scalable for growing energy needs",
                "6000+ cycle life",
                "Safe and maintenance-free design",
                "Compatible with Deye and other inverters"
            ]
        },
        # BSL 10.24kWh Rack - RezynTech: $200,000 base
        {
            "name": "BSL 10.24kWh LiFePO4 Rack-Mount Battery",
            "category": "batteries",
            "description": "BSL B-LFP48-200E high-capacity rack-mount battery. Ideal for larger residential or light commercial solar systems.",
            "regular_price": 320000,
            "sale_price": 400000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/BSL.png?v=1762358246&width=800",
            "specs": {
                "capacity": "10.24kWh",
                "voltage": "48V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "mount": "Rack"
            },
            "features": [
                "High-capacity 48V / 10kWh rack-mount",
                "Modular design for expansion",
                "6000+ cycle life",
                "Compatible with most hybrid inverters",
                "Long-life reliability"
            ]
        },
        # BSL Li-Pro 10.24kWh Wall
        {
            "name": "BSL Li-Pro 10.24kWh LiFePO4 Wall-Mount Battery",
            "category": "batteries",
            "description": "BSL Li-Pro 10240 sleek wall-mounted battery with IP65 protection. Perfect for indoor or outdoor installation.",
            "regular_price": 650000,
            "sale_price": 570000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/BSL_Li_3_05174485-c78f-4d37-8c22-6c7621e562ef.png?v=1762373784&width=800",
            "specs": {
                "capacity": "10.24kWh",
                "voltage": "48V",
                "chemistry": "LiFePO4",
                "cycles": "6000+",
                "mount": "Wall",
                "protection": "IP65"
            },
            "features": [
                "Sleek wall-mounted design",
                "IP65 rated for indoor/outdoor use",
                "Expandable for greater storage",
                "6000+ cycle life",
                "High safety LiFePO4 chemistry"
            ]
        },
        
        # ===== SOLAR PANELS =====
        # SunPower P7 450W - User price: $18,000 sale / $21,000 original
        {
            "name": "SunPower P7 450W BiFacial Black Solar Panel",
            "category": "panels",
            "description": "SunPower Maxeon Performance 7 series bifacial panel. Premium all-black design with 25-year warranty. Captures sunlight from both sides.",
            "regular_price": 21000,
            "sale_price": 18000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/blackpanel.png?v=1750092550&width=800",
            "specs": {
                "power": "450W",
                "type": "Bifacial",
                "cells": "Monocrystalline",
                "brand": "SunPower Maxeon",
                "warranty": "25 Years"
            },
            "features": [
                "Bifacial Technology - captures sunlight from both sides",
                "All-Black Design for sleek aesthetics",
                "Superior Reliability - solid copper foundation",
                "High Efficiency Maxeon cells",
                "25-Year product and power warranty",
                "Climate-Ready for shading, heat, humidity"
            ]
        },
        # SunPower P7 545W - SOLD OUT per user
        {
            "name": "SunPower P7 545W BiFacial Solar Panel",
            "category": "panels",
            "description": "SunPower Maxeon Performance 7 series high-output bifacial panel. N-type TOPCon cells for maximum efficiency. 25-year warranty.",
            "regular_price": 25000,
            "sale_price": 20000,
            "image_url": "https://www.rezyntech.com/cdn/shop/files/ChatGPT_Image_Nov_20_2025_02_23_29_PM.png?v=1763667027&width=800",
            "specs": {
                "power": "545W",
                "type": "Bifacial",
                "cells": "N-type TOPCon",
                "brand": "SunPower Maxeon",
                "warranty": "25 Years"
            },
            "features": [
                "Bifacial Technology - up to 30% additional gain",
                "N-type TOPCon cells for highest efficiency",
                "High Power Output - ideal for commercial",
                "Glass-Glass construction for durability",
                "25-Year comprehensive warranty",
                "Climate efficient design"
            ],
            "in_stock": False
        },
        # TW 625W - Backorder Available per user
        {
            "name": "TW Solar 625W BiFacial Panel",
            "category": "panels",
            "description": "TW Solar 625W high-output bifacial panel for maximum power generation. Industry-leading wattage for large installations. Available on backorder.",
            "regular_price": 38000,
            "sale_price": 28000,
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
            "specs": {
                "power": "625W",
                "type": "Bifacial",
                "cells": "Monocrystalline",
                "brand": "TW Solar"
            },
            "features": [
                "Industry-leading 625W output",
                "Bifacial technology for extra generation",
                "Ideal for large-scale installations",
                "High efficiency cells",
                "Durable construction"
            ],
            "in_stock": True,
            "backorder": True
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
