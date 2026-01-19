from fastapi import APIRouter, UploadFile, File, Form, Request
from typing import Optional
from services.email_reader_service import EmailReaderService
from services.openai_service import OpenAIService
from models.dto.response import ClassificationResultDTO
from middlewares.rate_limiter import limiter
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/email/classify",
    summary="Classificar e-mail e sugerir resposta automática",
    response_model=ClassificationResultDTO
)
@limiter.limit("1/minute")
@limiter.limit("10/hour")
async def classify_email(
    request: Request,
    file: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None),
):
    email_reader = EmailReaderService()
    openai_service = OpenAIService()

    email_text = await email_reader.process_input(file, text)

    logger.info(f"Classificando email...")
    result = await openai_service.classify_and_reply(email_text)
    logger.info(result.audit_log())

    return result
