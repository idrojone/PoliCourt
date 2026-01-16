from typing import List, Optional, Union
from pydantic import BaseModel, Field, HttpUrl, validator
import re

class Photo(BaseModel):
    url: Union[HttpUrl, str]
    alt: Optional[str] = None
    caption: Optional[str] = None
    
    @validator('url')
    def validate_local_path(cls, v):
        # Accept http(s) URLs or local asset paths that start with /src/assets/
        if isinstance(v, str):
            # If it's an absolute web URL, accept it
            if re.match(r'^https?://', v):
                return v

            # Otherwise validate as a local asset path
            local_pattern = r'^/src/assets/.+\.[a-zA-Z0-9]+$'
            if not re.match(local_pattern, v):
                raise ValueError(
                    "Ruta local debe tener formato: /src/assets/nombre.extension"
                )
        return v


class Home(BaseModel):
    carrusel: List[Photo] = Field(default_factory=list)

    class Config:
        schema_extra = {
            "example": {
                "carrusel": [
                    {
                        "url": "https://example.com/images/1.jpg",
                        "alt": "Imagen web",
                        "caption": "Foto web"
                    },
                    {
                        "url": "/src/assets/logo.svg",
                        "alt": "Logo SVG",
                        "caption": "Logo de la empresa"
                    }
                ]
            }
        }