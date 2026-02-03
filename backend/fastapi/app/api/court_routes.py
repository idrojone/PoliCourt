from app.infrastructure.database import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from typing import List
from app.application.court_service import CourtService
from app.infrastructure.repository.court_repository import CourtRepository
from app.schemas.apiResponse import ApiResponse
from app.schemas.court import CourtResponse


court_router = APIRouter()
@court_router.get("/courts", response_model=ApiResponse[List[CourtResponse]])
def get_courts(db: Session = Depends(get_db)):
    return ApiResponse.success_response(CourtService(CourtRepository(db)).get_all_courts())

@court_router.get("/courts/active-published", response_model=ApiResponse[List[CourtResponse]])
def get_active_published_courts(db: Session = Depends(get_db)):
    return ApiResponse.success_response( CourtService(CourtRepository(db)).get_active_published_courts())