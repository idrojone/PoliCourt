from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class User:
    id: uuid.UUID
    username: Optional[str]
    email: str
    first_name: str
    last_name: str
    phone: Optional[str]
    img_url: Optional[str]
    role: str
    status: str
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]