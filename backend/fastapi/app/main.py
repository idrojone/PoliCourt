from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="PoliCourt FastAPI Service")

app.include_router(router, prefix="/api/v1")
