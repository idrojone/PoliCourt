from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.models import SportModel, GeneralStatus
from app.domain.sport import Sport

class SportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_only_active_published(self) -> List[Sport]:
        """
        Hace una petición de todos los deportes que esten PUBLISHED y esten activos
        """
        sports = self.db.query(SportModel).filter(
            SportModel.status == GeneralStatus.PUBLISHED,
            SportModel.is_active == True
        ).all()
        return [Sport.model_validate(sport) for sport in sports]

    def get_active_published_slug_name(self) -> List[dict]:
        """
        Hace una petición de todos los deportes que esten PUBLISHED y esten activos
        y devuelve solo el slug y el nombre
        """
        results = self.db.query(SportModel.slug, SportModel.name).filter(
            SportModel.status == GeneralStatus.PUBLISHED,
            SportModel.is_active == True
        ).all()
        # SQLAlchemy returns tuples for specific column queries (slug, name)
        return [{"slug": row.slug, "name": row.name} for row in results]
