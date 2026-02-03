from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database import get_db
from app.infrastructure.repository.sport_repository import SportRepository
from app.application.sport_service import SportService
from app.schemas.sport import SportResponse
from app.schemas.apiResponse import ApiResponse

router = APIRouter()

@router.get("/sports", response_model=ApiResponse[List[SportResponse]])
def get_sports(db: Session = Depends(get_db)):
    return ApiResponse.success_response(SportService(SportRepository(db)).get_all_sports())

@router.get("/sports/active-published", response_model=ApiResponse[List[SportResponse]])
def get_active_published_sports(db: Session = Depends(get_db)):
    return ApiResponse.success_response( SportService(SportRepository(db)).get_active_published_sports())