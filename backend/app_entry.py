from server import app, db, seed_products
from payments import router as payments_router
from starlette.middleware.cors import CORSMiddleware
from utils.mailer import send_email
import logging

logger = logging.getLogger(__name__)

# Replace the legacy CORS middleware imported from server.py with the current
# Infrastructure production origins. This removes the old yahsharal.info origin
# from the running application while preserving Railway/local development access.
app.user_middleware = [
    middleware
    for middleware in app.user_middleware
    if middleware.cls is not CORSMiddleware
]
app.middleware_stack = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://solutions.yasharal.vip",
        "https://unique-charisma-production-ea90.up.railway.app",
        "https://infrastructure-production-cc30.up.railway.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def ensure_product_catalog():
    """Restore the existing catalog only when Mongo has no products at all."""
    product_count = await db.products.count_documents({})
    if product_count == 0:
        logger.warning("Product catalog is empty — restoring existing seeded catalog")
        await seed_products()
        restored_count = await db.products.count_documents({})
        logger.info(f"Restored {restored_count} products to Mongo")
        return restored_count
    return product_count


@app.on_event("startup")
async def restore_catalog_if_empty():
    try:
        await ensure_product_catalog()
    except Exception as exc:
        logger.error(f"Product catalog startup check failed: {exc}")


@app.middleware("http")
async def restore_catalog_before_product_requests(request, call_next):
    """Guarantee catalog restoration before product pages receive an empty response."""
    if request.method == "GET" and request.url.path == "/api/products":
        try:
            await ensure_product_catalog()
        except Exception as exc:
            logger.error(f"Product catalog request-time restoration failed: {exc}")
    return await call_next(request)


@app.middleware("http")
async def customer_submission_confirmation(request, call_next):
    """Send customer confirmations for successful lead/contact and quote submissions."""
    payload = None
    if request.method == "POST" and request.url.path in {"/api/leads", "/api/quotes"}:
        try:
            payload = await request.json()
        except Exception:
            payload = None

    response = await call_next(request)

    if payload and 200 <= response.status_code < 300 and payload.get("email"):
        customer_name = payload.get("name") or "there"

        if request.url.path == "/api/leads":
            subject = "We Received Your Inquiry"
            body = f"""
            <h2>Thank you for contacting Jonesaica Infrastructure Solutions</h2>
            <p>Hi {customer_name},</p>
            <p>We received your inquiry and your information has been sent to our team.</p>
            <p><strong>Interest:</strong> {payload.get('interest', 'N/A')}</p>
            <p><strong>Parish:</strong> {payload.get('parish', 'N/A')}</p>
            <p><strong>District:</strong> {payload.get('district', 'N/A')}</p>
            <p>We will review your request and contact you as soon as possible.</p>
            <p>Jonesaica Infrastructure Solutions<br>https://solutions.yasharal.vip</p>
            """
        else:
            subject = "We Received Your Quote Request"
            body = f"""
            <h2>Your Quote Request Has Been Received</h2>
            <p>Hi {customer_name},</p>
            <p>Thank you for requesting a quote from Jonesaica Infrastructure Solutions.</p>
            <p><strong>Service:</strong> {payload.get('interest', 'N/A')}</p>
            <p><strong>Parish:</strong> {payload.get('parish', 'N/A')}</p>
            <p><strong>District:</strong> {payload.get('district', 'N/A')}</p>
            <p>Our team will review the details you submitted and follow up with you.</p>
            <p>Jonesaica Infrastructure Solutions<br>https://solutions.yasharal.vip</p>
            """

        try:
            await send_email(
                subject=subject,
                recipients=[payload["email"]],
                body=body,
            )
        except Exception as exc:
            logger.error(f"Customer submission confirmation failed: {exc}")

    return response


app.include_router(payments_router)
