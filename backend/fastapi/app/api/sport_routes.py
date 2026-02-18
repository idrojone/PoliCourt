from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database import get_db
from app.infrastructure.repository.sport_repository import SportRepository
from app.application.sport_service import SportService
from app.schemas.sport_schema import SportResponse, SimpleSportResponse
from app.schemas.apiResponse import ApiResponse

sport_router = APIRouter(tags=["Sports"])

@sport_router.get("/sports", response_model=ApiResponse[List[SportResponse]])
def get_sports(db: Session = Depends(get_db)):
    """
    Todos los deportes activos y publicados con todos sus datos
    """
    return ApiResponse.success_response(SportService(SportRepository(db)).get_active_published_sports())

@sport_router.get("/sports/list", response_model=ApiResponse[List[SimpleSportResponse]])
def get_sports_list(db: Session = Depends(get_db)):
    """
    Todos los deportes activos y publicados con solo su slug y nombre
    """
    return ApiResponse.success_response(SportService(SportRepository(db)).get_active_published_slug_name())
