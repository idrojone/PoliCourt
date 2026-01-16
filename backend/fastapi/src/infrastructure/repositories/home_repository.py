from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from domain.entities.home import Home
from domain.interfaces.home_repository_interface import HomeRepositoryInterface
from infrastructure.models.home_model import HomeModel

class HomeRepository(HomeRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_home(self) -> Home | None:
        result = await self.db.execute(select(HomeModel).limit(1))
        home_db = result.scalars().first()

        if home_db:
            return Home(carrusel=home_db.carrusel)
        return None

    async def update_home(self, home: Home) -> Home:
        result = await self.db.execute(select(HomeModel).limit(1))
        home_db = result.scalars().first()

        carrusel_data = [photo.dict() for photo in home.carrusel]

        if home_db:
            home_db.carrusel = carrusel_data
        else:
            home_db = HomeModel(carrusel=carrusel_data)
            self.db.add(home_db)

        await self.db.commit()
        await self.db.refresh(home_db)
        
        return Home(carrusel=home_db.carrusel)