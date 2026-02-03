from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.sport_routes import sport_router
from app.api.court_routes import court_router
from app.api.user_routes import user_router


app = FastAPI(title="PoliCourt FastAPI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sport_router, prefix="/api/v1")
app.include_router(court_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")

