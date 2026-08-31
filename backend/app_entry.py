from server import app
from payments import router as payments_router

app.include_router(payments_router)
