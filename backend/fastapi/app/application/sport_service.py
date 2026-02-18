from typing import List
from app.domain.sport import Sport
from app.infrastructure.repository.sport_repository import SportRepository

class SportService:
    def __init__(self, repository: SportRepository):
        self.repository = repository

    def get_active_published_sports(self) -> List[Sport]:
        return self.repository.get_only_active_published()

    def get_active_published_slug_name(self) -> List[dict]:
        return self.repository.get_active_published_slug_name()
