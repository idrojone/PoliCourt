from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.models import SportModel, GeneralStatus
from app.domain.sport import Sport

class SportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Sport]:
        # Consulta a la BD usando el modelo ORM
        models = self.db.query(SportModel).all()
        
        # Mapeo manual de Modelo -> Entidad de Dominio
        return [
            Sport(
                id=m.id,
                slug=m.slug,
                name=m.name,
                description=m.description,
                img_url=m.img_url,
                status=m.status.value,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at
            ) for m in models
        ]
    
    def get_only_active_published(self) -> List[Sport]:

        models = self.db.query(SportModel).filter(SportModel.is_active == True, SportModel.status == GeneralStatus.PUBLISHED).all()
        
        return [
            Sport(
                id=m.id,
                slug=m.slug,
                name=m.name,
                description=m.description,
                img_url=m.img_url,
                status=m.status.value,  # Since status is enum, get the value
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at,
            ) for m in models
        ]
