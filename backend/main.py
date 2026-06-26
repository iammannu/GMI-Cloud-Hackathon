import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.routes import router
from utils.logging_config import configure_logging, get_logger

load_dotenv()
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "LaunchPilot AI starting",
        model=os.getenv("GMI_MODEL", "meta-llama/Llama-3.3-70B-Instruct"),
        env=os.getenv("APP_ENV", "development"),
    )
    yield
    logger.info("LaunchPilot AI shutting down")


app = FastAPI(
    title="LaunchPilot AI",
    description="Turn any startup idea into a launch-ready business plan in under 2 minutes",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": "LaunchPilot AI",
        "version": "1.0.0",
        "status": "running",
        "powered_by": "GMI Cloud",
        "docs": "/docs",
    }


@app.get("/health")
async def health_root():
    return {
        "status": "ok",
        "version": "1.0.0",
        "model": os.getenv("GMI_MODEL", "meta-llama/Llama-3.3-70B-Instruct"),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", "8000")),
        reload=os.getenv("APP_ENV") == "development",
        log_level="info",
    )
