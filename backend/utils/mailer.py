import os
import aiosmtplib
from email.message import EmailMessage

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL")


from typing import List

async def send_email(subject: str, recipients: List[str], body: str):
    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = ", ".join(recipients)
    message["Subject"] = subject
    message.set_content(body, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASS,
        start_tls=True,
    )


import logging
logger = logging.getLogger("server")

async def send_email(subject: str, recipients: list[str], body: str):
    logger.info(f"SMTP send_email called. subject={subject} recipients={recipients}")

    # hard fail if missing config (so you SEE it)
    missing = []
    if not SMTP_HOST: missing.append("SMTP_HOST")
    if not SMTP_USER: missing.append("SMTP_USER")
    if not SMTP_PASS: missing.append("SMTP_PASS")
    if not FROM_EMAIL: missing.append("FROM_EMAIL")
    if missing:
        raise RuntimeError(f"Missing SMTP env vars: {', '.join(missing)}")

    ...
    await aiosmtplib.send(...)
    logger.info("SMTP send_email completed")
