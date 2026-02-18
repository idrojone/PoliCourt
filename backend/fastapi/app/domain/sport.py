
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel
from app.domain.enums.general_status import GeneralStatus

class Sport(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str] = None
    img_url: Optional[str] = None
    status: GeneralStatus
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

