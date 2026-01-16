from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class ResponseModel(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operación exitosa"
    data: Optional[T] = None