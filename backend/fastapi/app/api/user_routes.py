from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.infrastructure.database import get_db
from app.infrastructure.repository.user_repository import UserRepository
from app.application.user_service import UserService
from app.schemas.user_schema import UserProfileResponse
from app.schemas.apiResponse import ApiResponse

user_router = APIRouter(tags=["Users"])


@user_router.get("/users/count", response_model=ApiResponse[int])
def get_total_users(db: Session = Depends(get_db)):
    """
    Devuelve el número total de usuarios registrados.
    """
    total = UserService(UserRepository(db)).get_user_count()
    return ApiResponse.success_response(total)


@user_router.get("/users/{username}", response_model=ApiResponse[UserProfileResponse])
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """
    Devuelve la información personal de un usuario a partir de su username.
    """
    user = UserService(UserRepository(db)).get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=404, detail=f"Usuario '{username}' no encontrado")
    return ApiResponse.success_response(user)
