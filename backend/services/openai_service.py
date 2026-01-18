from openai import AsyncOpenAI
from models.dto.request import EmailTextDTO
from models.dto.response import ClassificationResultDTO
from config import settings
from typing import Dict, Any
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def classify_and_reply(self, email: EmailTextDTO) -> ClassificationResultDTO:
        if not email.content:
            self.logger.error("EmailTextDTO sem conteúdo válido.")
            raise ValueError("EmailTextDTO sem conteúdo válido.")
        
        self.logger.info(f"Classificando email [{email.source}]: {email.short_preview()}")

        prompt = self._build_prompt(email)
        response = await self._call_openai(prompt)

        if not response:
            self.logger.error("Resposta vazia da OpenAI.")
            raise ValueError("Resposta vazia da OpenAI.")

        self.logger.debug(f"OpenAI raw response: {response[:200]}...")

        parsed = self._parse_response(response)
        result = ClassificationResultDTO(
            category=parsed["category"],
            confidence=parsed["confidence"],
            suggested_reply=parsed["reply"],
            model_name=settings.model_name,
        )

        self.logger.info(result.audit_log())
        return result

    def _build_prompt(self, email: EmailTextDTO) -> str:
        few_shots = """
Exemplo 1:
Email: "Bom dia, poderia me informar o status da minha requisição #12345?"
Classificação: produtivo
Resposta: "Bom dia! Vou verificar o status da requisição #12345 e retorno em breve."

Exemplo 2: 
Email: "Feliz Natal e um ótimo 2026 para toda equipe!"
Classificação: improdutivo  
Resposta: "Obrigado pelo carinho! Feliz Natal também! 🎄"
"""

        return f"""Você é um classificador de emails para setor financeiro.

CRITÉRIOS:
- PRODUTIVO: requer ação, resposta específica, status, dúvida, arquivo, solicitação.
- IMPRODUTIVO: saudações, feriados, spam, conversas informais.

{ few_shots }

Email a classificar:

{email.content}

Responda APENAS em JSON válido:
{{
  "category": "produtivo" ou "improdutivo",
  "confidence": 0.95,
  "reply": "resposta curta e formal (máx 2 frases)"
}}"""

    async def _call_openai(self, prompt: str) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=settings.model_name,
                messages=[
                    {"role": "system", "content": "Você é um assistente JSON preciso."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            raise ValueError(f"Falha na chamada OpenAI: {str(e)}")

    def _parse_response(self, raw_response: str) -> Dict[str, Any]:
        import json

        try:
            parsed = json.loads(raw_response)
            
            if "category" not in parsed:
                raise ValueError("JSON sem campo 'category'")
            if parsed["category"] not in ["produtivo", "improdutivo"]:
                raise ValueError("Categoria inválida")
            if "confidence" not in parsed or not 0 <= parsed["confidence"] <= 1:
                raise ValueError("Confidence inválido")
            if "reply" not in parsed or not parsed["reply"].strip():
                raise ValueError("Resposta vazia")
                
            return {
                "category": parsed["category"],
                "confidence": float(parsed["confidence"]),
                "reply": parsed["reply"].strip(),
            }
        except json.JSONDecodeError:
            raise ValueError("Resposta da OpenAI não é JSON válido")
        except (KeyError, ValueError) as e:
            raise ValueError(f"JSON inválido: {str(e)}")
