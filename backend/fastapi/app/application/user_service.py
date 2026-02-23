from typing import Optional
from app.domain.user import User
from app.infrastructure.repository.user_repository import UserRepository


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def get_user_by_username(self, username: str) -> Optional[User]:
        return self.repository.get_by_username(username)
