from server import app
from payments import router as payments_router

# The primary Infrastructure frontend moved from yahsharal.info to yasharal.vip.
# server.py retains the legacy CORS list; this middleware explicitly permits the
# current production origin without altering the existing application routes.
from starlette.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://solutions.yasharal.vip"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments_router)
