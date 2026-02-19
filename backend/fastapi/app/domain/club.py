from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class Club(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str] = None
    img_url: Optional[str] = None
    sport_id: int
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
