import os
import logging
import httpx

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")


async def send_email(subject: str, recipients: list[str], body: str):
    if not RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY not set")

    payload = {
        "from": FROM_EMAIL,
        "to": recipients,
        "subject": subject,
        "html": body,
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

    if response.status_code >= 400:
        logger.error(f"Resend error: {response.text}")
        raise RuntimeError("Email send failed")

    logger.info("✅ Email sent via Resend")
