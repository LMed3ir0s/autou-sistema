from fastapi import FastAPI
from controllers.classify_controller import router as classify_router

app = FastAPI(
    title="AutoU Email Classifier API",
    version="1.0.0",
)

# ROTAS
app.include_router(
    classify_router,
    prefix="/api/v1",
    tags=["classification"],
)