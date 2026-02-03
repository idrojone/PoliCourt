from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class Court:
    id: uuid.UUID
    slug: str
    name: str
    location_details: Optional[str]
    img_url: Optional[str]
    price_h: float
    capacity: int
    is_indoor: bool
    surface: str
    status: str
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
