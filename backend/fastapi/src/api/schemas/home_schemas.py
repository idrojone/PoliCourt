from typing import List, Optional, Union
from pydantic import BaseModel, Field, HttpUrl, validator
import re
from domain.schemas.response import ResponseModel

class PhotoSchema(BaseModel):
    url: Union[HttpUrl, str]
    alt: Optional[str] = None
    caption: Optional[str] = None

    @validator('url')
    def validate_path(cls, v):
        # Validamos que sea URL o ruta local permitida
        if isinstance(v, str) and not v.startswith(('http://', 'https://')):
            local_pattern = r'^/src/assets/.+\.[a-zA-Z0-9]+$'
            if not re.match(local_pattern, v):
                raise ValueError(
                    "Ruta local debe tener formato: /src/assets/nombre.extension"
                )
        return v

class HomeBase(BaseModel):
    carrusel: List[PhotoSchema] = Field(default_factory=list)

class HomeCreate(HomeBase):
    pass

class HomeUpdate(HomeBase):
    pass

class HomeResponse(ResponseModel[HomeBase]):
    pass