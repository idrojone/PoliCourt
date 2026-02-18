from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class SportResponse(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    imgUrl: Optional[str] = Field(None, alias="img_url", serialization_alias="imgUrl")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class SimpleSportResponse(BaseModel):
    slug: str
    name: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
