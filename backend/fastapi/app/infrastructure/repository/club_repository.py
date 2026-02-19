from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.infrastructure.models import ClubModel, SportModel, GeneralStatus

class ClubRepository:
    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        q: Optional[str] = None,
        name: Optional[str] = None,
        sport_slugs: Optional[List[str]] = None,
        page: int = 0,
        limit: int = 10,
        sort: Optional[str] = None,
    ) -> Tuple[list, int]:
        """
        Busca clubes con filtros dinámicos, paginación y ordenamiento.
        Siempre filtra por is_active=True y status=PUBLISHED.
        """
        query = (
            self.db.query(ClubModel)
            .outerjoin(SportModel, ClubModel.sport_id == SportModel.id)
        )

        # Siempre solo activos y publicados
        query = query.filter(
            ClubModel.is_active == True,
            ClubModel.status == GeneralStatus.PUBLISHED,
        )

        # Búsqueda general (nombre)
        if q:
            like = f"%{q.lower()}%"
            query = query.filter(func.lower(ClubModel.name).like(like))

        # Filtros individuales
        if name:
            query = query.filter(func.lower(ClubModel.name).like(f"%{name.lower()}%"))

        if sport_slugs:
            query = query.filter(SportModel.slug.in_(sport_slugs))

        # Ordenamiento
        sort_map = {
            "name_asc": ClubModel.name.asc(),
            "name_desc": ClubModel.name.desc(),
        }

        order = sort_map.get(sort, ClubModel.id.asc())
        query = query.order_by(order, ClubModel.id.asc())

        # Paginación
        total = query.count()
        items = query.offset(page * limit).limit(limit).all()

        return items, total
