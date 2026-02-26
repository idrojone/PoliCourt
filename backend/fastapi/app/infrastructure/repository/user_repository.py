from typing import Optional
from sqlalchemy.orm import Session
from app.infrastructure.models import UserModel
from app.domain.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> Optional[User]:
        """
        Busca un usuario por su username. Devuelve None si no existe.
        """
        user = self.db.query(UserModel).filter(
            UserModel.username == username
        ).first()
        if user is None:
            return None
        return User.model_validate(user)

    def get_by_id(self, user_id: int) -> Optional[User]:
        """
        Busca un usuario por su ID. Devuelve None si no existe.
        """
        user = self.db.query(UserModel).filter(
            UserModel.id == user_id
        ).first()
        if user is None:
            return None
        return User.model_validate(user)

    def count_all(self) -> int:
        """
        Devuelve el número total de usuarios registrados.
        """
        return self.db.query(UserModel).count()
