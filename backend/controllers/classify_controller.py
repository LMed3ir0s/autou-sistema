from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
#import DTO
#request
#reponse

router = APIRouter()

@router.post(
    "/email/classify",
    summary="Classificar e-mail e sugerir resposta automática",
)
async def classify_email(
    file: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None),
):
    #validar se file ou text
    #ler conteudo (services/email_reader)
    #requisitar OpenAI (service/openai_service)
    #return DTO response
    return {"message": "Endpoint /email/classify, falta implementar lógica"}
