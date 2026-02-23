from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.sport_routes import sport_router
from app.api.court_routes import court_router
from app.api.club_routes import club_router
from app.api.user_routes import user_router


tags_metadata = [
    {
        "name": "Sports",
        "description": "Operaciones relacionadas con deportes.",
    },
    {
        "name": "Courts",
        "description": "Operaciones relacionadas con pistas.",
    },
    {
        "name": "Clubs",
        "description": "Operaciones relacionadas con clubes.",
    },
    {
        "name": "Users",
        "description": "Operaciones relacionadas con usuarios.",
    },
]

app = FastAPI(title="PoliCourt FastAPI Service", openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sport_router, prefix="/api/v1")
app.include_router(court_router, prefix="/api/v1")
app.include_router(club_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")

