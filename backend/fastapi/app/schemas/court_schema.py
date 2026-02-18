from typing import Optional, List, Generic, TypeVar
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

T = TypeVar("T")


class CourtResponse(BaseModel):
    slug: str
    name: str
    location_details: Optional[str] = Field(None, alias="location_details", serialization_alias="locationDetails")
    img_url: Optional[str] = Field(None, alias="img_url", serialization_alias="imgUrl")
    price_h: Decimal = Field(alias="price_h", serialization_alias="priceH")
    capacity: int
    is_indoor: bool = Field(alias="is_indoor", serialization_alias="isIndoor")
    surface: str
    sports: List[str] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    page: int
    limit: int
    total_items: int = Field(serialization_alias="totalItems")
    total_pages: int = Field(serialization_alias="totalPages")

    model_config = ConfigDict(populate_by_name=True)
