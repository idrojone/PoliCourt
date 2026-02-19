from typing import List, Optional, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.infrastructure.models import CourtModel, CourtSportModel, SportModel, GeneralStatus


class CourtRepository:
    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        q: Optional[str] = None,
        name: Optional[str] = None,
        location_details: Optional[str] = None,
        price_min: Optional[Decimal] = None,
        price_max: Optional[Decimal] = None,
        capacity_min: Optional[int] = None,
        capacity_max: Optional[int] = None,
        is_indoor: Optional[bool] = None,
        surfaces: Optional[List[str]] = None,
        sports: Optional[List[str]] = None,
        page: int = 0,
        limit: int = 10,
        sort: Optional[str] = None,
    ) -> Tuple[list, int]:
        """
        Busca pistas con filtros dinámicos, paginación y ordenamiento.
        Siempre filtra por is_active=True y status=PUBLISHED.
        """
        query = (
            self.db.query(CourtModel)
            .outerjoin(CourtSportModel, CourtModel.id == CourtSportModel.court_id)
            .outerjoin(SportModel, CourtSportModel.sport_id == SportModel.id)
        )

        # Siempre solo activos y publicados
        query = query.filter(
            CourtModel.is_active == True,
            CourtModel.status == GeneralStatus.PUBLISHED,
        )

        # Búsqueda general (nombre o ubicación)
        if q:
            like = f"%{q.lower()}%"
            query = query.filter(
                or_(
                    func.lower(CourtModel.name).like(like),
                    func.lower(CourtModel.location_details).like(like),
                )
            )

        # Filtros individuales
        if name:
            query = query.filter(func.lower(CourtModel.name).like(f"%{name.lower()}%"))

        if location_details:
            query = query.filter(func.lower(CourtModel.location_details).like(f"%{location_details.lower()}%"))

        if price_min is not None:
            query = query.filter(CourtModel.price_h >= price_min)

        if price_max is not None:
            query = query.filter(CourtModel.price_h <= price_max)

        if capacity_min is not None:
            query = query.filter(CourtModel.capacity >= capacity_min)

        if capacity_max is not None:
            query = query.filter(CourtModel.capacity <= capacity_max)

        if is_indoor is not None:
            query = query.filter(CourtModel.is_indoor == is_indoor)

        if surfaces:
            query = query.filter(CourtModel.surface.in_(surfaces))

        if sports:
            query = query.filter(SportModel.slug.in_(sports)).distinct(CourtModel.id)

        # Ordenamiento
        sort_map = {
            "name_asc": CourtModel.name.asc(),
            "name_desc": CourtModel.name.desc(),
            "price_asc": CourtModel.price_h.asc(),
            "price_desc": CourtModel.price_h.desc(),
            "capacity_asc": CourtModel.capacity.asc(),
            "capacity_desc": CourtModel.capacity.desc(),
        }

        order = sort_map.get(sort, CourtModel.id.asc())
        query = query.order_by(order, CourtModel.id.asc())

        # Paginación
        total = query.count()
        items = query.offset(page * limit).limit(limit).all()

        return items, total
