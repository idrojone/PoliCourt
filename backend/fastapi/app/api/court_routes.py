from typing import Optional, List
from decimal import Decimal
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.infrastructure.database import get_db
from app.infrastructure.repository.court_repository import CourtRepository
from app.application.court_service import CourtService
from app.schemas.court_schema import CourtResponse, PaginatedResponse
from app.schemas.apiResponse import ApiResponse

court_router = APIRouter(tags=["Courts"])


@court_router.get("/courts", response_model=ApiResponse[PaginatedResponse[CourtResponse]])
def search_courts(
    q: Optional[str] = Query(None, description="Texto de búsqueda (nombre o ubicación)"),
    name: Optional[str] = Query(None, description="Filtrar por nombre"),
    location_details: Optional[str] = Query(None, alias="locationDetails", description="Filtrar por ubicación"),
    price_min: Optional[Decimal] = Query(None, alias="priceMin", ge=0, description="Precio mínimo"),
    price_max: Optional[Decimal] = Query(None, alias="priceMax", ge=0, description="Precio máximo"),
    capacity_min: Optional[int] = Query(None, alias="capacityMin", ge=1, description="Capacidad mínima"),
    capacity_max: Optional[int] = Query(None, alias="capacityMax", ge=1, description="Capacidad máxima"),
    is_indoor: Optional[bool] = Query(None, alias="isIndoor", description="Filtrar por interior/exterior"),
    surfaces: Optional[List[str]] = Query(None, description="Filtrar por superficie"),
    sports: Optional[List[str]] = Query(None, description="Filtrar por deportes (slugs)"),
    page: int = Query(1, ge=1, description="Número de página (1-indexed)"),
    limit: int = Query(10, ge=1, description="Cantidad de elementos por página"),
    sort: Optional[str] = Query(None, description="Ordenamiento (ej: name_asc, price_desc)"),
    db: Session = Depends(get_db),
):
    """
    Busca pistas con filtros opcionales, paginación y ordenamiento.
    Solo devuelve pistas activas y publicadas.
    """
    service = CourtService(CourtRepository(db))
    result = service.search_courts(
        q=q,
        name=name,
        location_details=location_details,
        price_min=price_min,
        price_max=price_max,
        capacity_min=capacity_min,
        capacity_max=capacity_max,
        is_indoor=is_indoor,
        surfaces=surfaces,
        sports=sports,
        page=page,
        limit=limit,
        sort=sort,
    )
    return ApiResponse.success_response(result)
