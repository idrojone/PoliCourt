from pydantic import BaseModel
from typing import Optional

class CourtResponse(BaseModel):
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


class CourtFilteredResponse(BaseModel):
    min_price: Optional[float]
    max_price: Optional[float]
    min_capacity: Optional[int]
    max_capacity: Optional[int]
