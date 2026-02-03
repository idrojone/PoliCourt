from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class Sport:
    id: uuid.UUID
    slug: str
    name: str
    description: Optional[str]
    img_url: Optional[str]
    status: str
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
