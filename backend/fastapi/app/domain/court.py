from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from app.domain.enums.general_status import GeneralStatus
from app.domain.enums.court_surface import CourtSurface


class Court(BaseModel):
    id: int
    slug: str
    name: str
    location_details: Optional[str] = None
    img_url: Optional[str] = None
    price_h: Decimal
    capacity: int
    is_indoor: bool
    surface: CourtSurface
    status: GeneralStatus
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
