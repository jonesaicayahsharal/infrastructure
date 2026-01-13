import os
import logging
import aiosmtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL")


async def send_email(subject: str, recipients: list[str], body: str):
    logger.info("📨 send_email called")
    logger.info(f"SMTP_HOST={SMTP_HOST}")
    logger.info(f"SMTP_PORT={SMTP_PORT}")
    logger.info(f"SMTP_USER={SMTP_USER}")
    logger.info(f"FROM_EMAIL={FROM_EMAIL}")
    logger.info(f"Recipients={recipients}")

    if not all([SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL]):
        raise RuntimeError("SMTP environment variables missing")

    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = ", ".join(recipients)
    message["Subject"] = subject
    message.set_content(body, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            use_tls=True,   # ← IMPORTANT
            timeout=30,
        )
        logger.info("✅ Email sent successfully")

    except Exception as e:
        logger.exception("❌ Email send failed")
        raise
