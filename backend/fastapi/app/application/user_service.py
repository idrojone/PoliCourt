from typing import List
from app.domain.user import User
from app.infrastructure.repository.user_repository import UserRepository

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def get_all_users(self) -> List[User]:
        return self.repository.get_all()

    def get_active_published_users(self) -> List[User]:
        return self.repository.get_only_active_published()