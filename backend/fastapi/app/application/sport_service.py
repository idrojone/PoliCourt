from typing import List
from app.domain.sport import Sport
from app.infrastructure.repository.sport_repository import SportRepository

class SportService:
    def __init__(self, repository: SportRepository):
        self.repository = repository

    def get_all_sports(self) -> List[Sport]:
        return self.repository.get_all()

    def get_active_published_sports(self) -> List[Sport]:
        return self.repository.get_only_active_published()

    def get_all_slugs(self) -> List[str]:
        return self.repository.get_all_slugs()
