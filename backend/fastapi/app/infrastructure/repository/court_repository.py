from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.models import CourtModel, GeneralStatus
from app.domain.court import Court
from sqlalchemy import func

class CourtRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Court]:
        # Consulta a la BD usando el modelo ORM
        models = self.db.query(CourtModel).all()

        # Mapeo manual de Modelo -> Entidad de Dominio
        return [
            Court(
                id=m.id,
                slug=m.slug,
                name=m.name,
                location_details=m.location_details,
                img_url=m.img_url,
                price_h=float(m.price_h),
                capacity=m.capacity,
                is_indoor=m.is_indoor,
                surface=m.surface.value,
                status=m.status.value,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at
            ) for m in models
        ]

    def get_only_active_published(self) -> List[Court]:

        models = self.db.query(CourtModel).filter(CourtModel.is_active == True, CourtModel.status == GeneralStatus.PUBLISHED).all()

        return [
            Court(
                id=m.id,
                slug=m.slug,
                name=m.name,
                location_details=m.location_details,
                img_url=m.img_url,
                price_h=float(m.price_h),
                capacity=m.capacity,
                is_indoor=m.is_indoor,
                surface=m.surface.value,
                status=m.status.value,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at,
            ) for m in models
        ]

    def get_count_filtered(self) -> List[Court]:

        models = self.db.query(
            func.min(CourtModel.price_h).label("min_price_h"),
            func.max(CourtModel.price_h).label("max_price_h"),
            func.min(CourtModel.capacity).label("min_capacity"),
            func.max(CourtModel.capacity).label("max_capacity"),
        ).filter(
            CourtModel.is_active == True,
            CourtModel.status == GeneralStatus.PUBLISHED
        ).first()

        if not models:
            return {
                "min_price": None,
                "max_price": None,
                "min_capacity": None,
                "max_capacity": None,
            }

        min_price_h, max_price_h, min_capacity, max_capacity = models
        return {
            "min_price": float(min_price_h) if min_price_h is not None else None,
            "max_price": float(max_price_h) if max_price_h is not None else None,
            "min_capacity": int(min_capacity) if min_capacity is not None else None,
            "max_capacity": int(max_capacity) if max_capacity is not None else None,
        }
