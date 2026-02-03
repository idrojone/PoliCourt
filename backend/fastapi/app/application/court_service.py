from typing import List
from app.domain.court import Court
from app.infrastructure.repository.court_repository import CourtRepository

class CourtService:
    def __init__(self, repository: CourtRepository):
        self.repository = repository

    def get_all_courts(self) -> List[Court]:
        return self.repository.get_all()

    def get_active_published_courts(self) -> List[Court]:
        return self.repository.get_only_active_published()
