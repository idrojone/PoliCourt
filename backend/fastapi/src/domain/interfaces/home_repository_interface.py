from abc import ABC, abstractmethod
from domain.entities.home import Home

class HomeRepositoryInterface(ABC):
    @abstractmethod
    async def get_home(self) -> Home | None:
        pass

    @abstractmethod
    async def update_home(self, home: Home) -> Home:
        pass