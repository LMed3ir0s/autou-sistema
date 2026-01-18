from pydantic import BaseModel, Field
from typing import Optional

class EmailTextDTO(BaseModel):
    content: str = Field(..., min_length=1, max_length=50000, description="Conteúdo do email")
    source: str = Field(..., description="'file' ou 'text'")

    def is_from_file(self) -> bool:
        return self.source == "file"

    def is_from_text(self) -> bool:
        return self.source == "text"

    def short_preview(self, max_chars: int = 80) -> str:
        preview = self.content[:max_chars].strip()
        return preview + "..." if len(self.content) > max_chars else preview
