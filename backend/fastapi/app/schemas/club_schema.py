from typing import Optional, List, Generic, TypeVar
from pydantic import BaseModel, Field, ConfigDict

T = TypeVar("T")

class ClubResponse(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    img_url: Optional[str] = Field(None, alias="img_url", serialization_alias="imgUrl")
    sport_slug: Optional[str] = Field(None, serialization_alias="sportSlug")
    # status: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class PaginatedResponse(BaseModel, Generic[T]):
    content: List[T]
    page: int
    limit: int
    totalElements: int = Field(serialization_alias="totalItems")
    totalPages: int = Field(serialization_alias="totalPages")

    model_config = ConfigDict(populate_by_name=True)
