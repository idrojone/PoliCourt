from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    username: Optional[str]
    email: str
    first_name: str
    last_name: str
    phone: Optional[str]
    img_url: Optional[str]
    role: str
    status: str
    is_active: bool