from fastapi import UploadFile, HTTPException, status
from models.dto.request import EmailTextDTO
import pdfplumber
import logging
from typing import Optional

class EmailReaderService:

    ALLOWED_CONTENT_TYPES = {"text/plain", "application/pdf"}

    async def from_upload(self, file: UploadFile) -> EmailTextDTO:
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo não enviado.",
            )

        if file.content_type not in self.ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de arquivo não suportado: {file.content_type}. "
                       f"Use .txt ou .pdf.",
            )

        if file.content_type == "text/plain":
            content = await self._read_txt(file)
            return EmailTextDTO(content=content, source="file")

        content = await self._read_pdf(file)
        return EmailTextDTO(content=content, source="file")

    async def from_text(self, text: str) -> EmailTextDTO:
        if text is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Texto do email não enviado.",
            )

        cleaned = text.strip()
        if not cleaned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Texto do email está vazio.",
            )

        return EmailTextDTO(content=cleaned, source="text")

    async def _read_txt(self, file: UploadFile) -> str:
        raw = await file.read()
        decoded = raw.decode("utf-8", errors="ignore").strip()
        if not decoded:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo .txt está vazio.",
            )
        return decoded

    async def _read_pdf(self, file: UploadFile) -> str:
        raw = await file.read()
        if not raw:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo .pdf está vazio.",
            )

        try:
            text_parts: list[str] = []
            with pdfplumber.open(file=raw) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    stripped = page_text.strip()
                    if stripped:
                        text_parts.append(stripped)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Falha ao ler conteúdo do PDF.",
            )

        joined = "\n".join(text_parts).strip()
        if not joined:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nenhum texto legível encontrado no PDF.",
            )

        return joined
    
    async def process_input(
            self,
            file: Optional[UploadFile],
            text: Optional[str],
        ) -> EmailTextDTO:
        logger = logging.getLogger(__name__)

        if not file and not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Envie arquivo OU texto, não ambos nem nenhum.",
            )

        if file and text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Envie apenas arquivo OU texto.",
            )

        if file:
            logger.info(f"Processando arquivo: {file.filename}")
            email_text = await self.from_upload(file)
            logger.info(f"Arquivo lido ({len(email_text.content)} chars): {email_text.short_preview()}")
            return email_text

        #Se é texto
        logger.info("Processando texto direto")
        email_text = await self.from_text(text)
        logger.info(f"Texto lido ({len(email_text.content)} chars): {email_text.short_preview()}")
        return email_text
