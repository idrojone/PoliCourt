from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.models import UserModel, GeneralStatus
from app.domain.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[User]:
        # Consulta a la BD usando el modelo ORM
        models = self.db.query(UserModel).all()

        # Mapeo manual de Modelo -> Entidad de Dominio
        return [
            User(
                id=m.id,
                username=m.username,
                email=m.email,
                first_name=m.first_name,
                last_name=m.last_name,
                phone=m.phone,
                img_url=m.img_url,
                role=m.role.value,
                status=m.status.value,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at
            ) for m in models
        ]

    def get_only_active_published(self) -> List[User]:

        models = self.db.query(UserModel).filter(UserModel.is_active == True, UserModel.status == GeneralStatus.PUBLISHED).all()

        return [
            User(
                id=m.id,
                username=m.username,
                email=m.email,
                first_name=m.first_name,
                last_name=m.last_name,
                phone=m.phone,
                img_url=m.img_url,
                role=m.role.value,
                status=m.status.value,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at,
            ) for m in models
        ]