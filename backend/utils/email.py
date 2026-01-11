import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),
    MAIL_FROM=os.getenv("EMAIL_FROM"),
    MAIL_PORT=int(os.getenv("EMAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("EMAIL_HOST"),
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)

async def send_email(
    subject: str,
    recipients: list[EmailStr],
    body: str,
):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html",
    )
    await fm.send_message(message)
