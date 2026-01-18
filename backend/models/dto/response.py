from pydantic import BaseModel, Field

class ClassificationResultDTO(BaseModel):
    category: str = Field(..., description="produtivo ou improdutivo")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confiança da classificação")
    suggested_reply: str = Field(..., min_length=1, max_length=500, description="Resposta automática sugerida")
    model_name: str = Field(..., description="Nome do modelo usado na classificação")

    def is_productive(self) -> bool:
        return self.category.lower() == "produtivo"

    def is_unproductive(self) -> bool:
        return self.category.lower() == "improdutivo"
    
    def audit_log(self) -> str:
        return (
            f"[model={self.model_name}] "
            f"[category={self.category}] "
            f"[confidence={self.confidence:.2f}] "
            f"[reply_size={len(self.suggested_reply)}]"
        )

