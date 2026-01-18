import sys
import os
import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from controllers.classify_controller import router as classify_router
from middlewares.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded

sys.path.append(os.path.dirname(__file__))
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="AutoU Email Classifier API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# RATE LIMIT GLOBAL
app.add_middleware(SlowAPIMiddleware)

# Rate limit handler
app.add_exception_handler(RateLimitExceeded, lambda e: JSONResponse(
    status_code=429,
    content={"detail": f"Rate limit: {e.detail}"}
))
app.state.limiter = limiter  # ← CRÍTICO

# ROTAS
app.include_router(
    classify_router,
    prefix="/api/v1",
    tags=["classification"],
)