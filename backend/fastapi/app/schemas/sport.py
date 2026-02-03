from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class SportResponse(BaseModel):
    # id: UUID
    slug: str
    name: str
    description: Optional[str]
    img_url: Optional[str]
    status: str
    # is_active: bool
    # created_at: Optional[datetime]
    # updated_at: Optional[datetime]
