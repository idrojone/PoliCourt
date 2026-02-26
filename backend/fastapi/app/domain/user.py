from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel
from app.domain.enums.general_status import GeneralStatus
from app.domain.enums.user_role import UserRole


class User(BaseModel):
    id: int
    username: Optional[str] = None
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    status: GeneralStatus
    is_active: bool
    is_email_verified: bool
    session_version: int = 0
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
