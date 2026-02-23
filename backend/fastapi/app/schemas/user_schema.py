from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.domain.enums.user_role import UserRole
from app.domain.enums.general_status import GeneralStatus


class UserProfileResponse(BaseModel):
    username: Optional[str] = None
    email: str
    firstName: Optional[str] = Field(None, alias="first_name", serialization_alias="firstName")
    lastName: Optional[str] = Field(None, alias="last_name", serialization_alias="lastName")
    phone: Optional[str] = None
    dateOfBirth: Optional[date] = Field(None, alias="date_of_birth", serialization_alias="dateOfBirth")
    gender: Optional[str] = None
    avatarUrl: Optional[str] = Field(None, alias="avatar_url", serialization_alias="avatarUrl")
    role: UserRole
    status: GeneralStatus
    isActive: bool = Field(alias="is_active", serialization_alias="isActive")
    isEmailVerified: bool = Field(alias="is_email_verified", serialization_alias="isEmailVerified")
    lastLoginAt: Optional[datetime] = Field(None, alias="last_login_at", serialization_alias="lastLoginAt")
    createdAt: datetime = Field(alias="created_at", serialization_alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
