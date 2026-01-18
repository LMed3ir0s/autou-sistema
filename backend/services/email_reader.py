from fastapi import UploadFile, HTTPException, status
from models.dto.request import EmailTextDTO
import pdfplumber

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
