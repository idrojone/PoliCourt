from pydantic import BaseModel
from typing import Generic, TypeVar, Any
from datetime import datetime

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: T
    timestamp: str

    @classmethod
    def success_response(cls, data: T, message: str = "Operación realizada correctamente") -> "ApiResponse[T]":
        return cls(
            success=True,
            message=message,
            data=data,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )

    @classmethod
    def error_response(cls, message: str, data: Any = None) -> "ApiResponse[Any]":
        return cls(
            success=False,
            message=message,
            data=data,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
