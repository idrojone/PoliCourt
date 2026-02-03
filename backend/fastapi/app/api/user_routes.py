from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database import get_db
from app.infrastructure.repository.user_repository import UserRepository
from app.application.user_service import UserService
from app.schemas.user import UserResponse
from app.schemas.apiResponse import ApiResponse

user_router = APIRouter()

@user_router.get("/users", response_model=ApiResponse[List[UserResponse]])
def get_users(db: Session = Depends(get_db)):
    users = UserService(UserRepository(db)).get_all_users()
    return ApiResponse.success_response(users)

@user_router.get("/users/active-published", response_model=ApiResponse[List[UserResponse]])
def get_active_published_users(db: Session = Depends(get_db)):
    users = UserService(UserRepository(db)).get_active_published_users()
    return ApiResponse.success_response(users)