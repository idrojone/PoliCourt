from domain.entities.home import Home
from domain.interfaces.home_repository_interface import HomeRepositoryInterface 
from domain.schemas.home_schemas import HomeCreate, HomeUpdate

class HomeService:
    def __init__(self, repository: HomeRepositoryInterface):
        self.repository = repository

    async def get_home(self) -> Home:
        home = await self.repository.get_home()
        if not home:
            return Home(carrusel=[])
        return home

    async def create_home(self, home_in: HomeCreate) -> Home:
        home_entity = Home(**home_in.dict())
        return await self.repository.update_home(home_entity)

    async def update_home(self, home_in: HomeUpdate) -> Home:
        home_entity = Home(**home_in.dict())
        return await self.repository.update_home(home_entity)