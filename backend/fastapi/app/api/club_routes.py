from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.repository.club_repository import ClubRepository
from app.application.club_service import ClubService
from app.schemas.club_schema import ClubResponse, PaginatedResponse
from app.schemas.apiResponse import ApiResponse

club_router = APIRouter(tags=["Clubs"])

@club_router.get("/clubs", response_model=ApiResponse[PaginatedResponse[ClubResponse]])
def search_clubs(
    q: Optional[str] = Query(None, description="Texto de búsqueda general (nombre)"),
    name: Optional[str] = Query(None, description="Filtrar por nombre"),
    sport_slugs: Optional[List[str]] = Query(None, alias="sportSlugs", description="Filtrar por slugs de deportes"),
    page: int = Query(0, ge=0, description="Número de página (0-indexed)"),
    limit: int = Query(10, ge=1, description="Cantidad de elementos por página"),
    sort: Optional[str] = Query(None, description="Ordenamiento (ej: name_asc, name_desc)"),
    db: Session = Depends(get_db),
):
    """
    Busca clubes con filtros opcionales, paginación y ordenamiento.
    Solo devuelve clubes activos y publicados.
    """
    service = ClubService(ClubRepository(db))
    result = service.search_clubs(
        q=q,
        name=name,
        sport_slugs=sport_slugs,
        page=page,
        limit=limit,
        sort=sort,
    )
    return ApiResponse.success_response(result)
