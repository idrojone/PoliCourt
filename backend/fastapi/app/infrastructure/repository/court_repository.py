from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.models import CourtModel, GeneralStatus
from app.domain.court import Court

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
