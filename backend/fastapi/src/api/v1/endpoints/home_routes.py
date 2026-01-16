from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from domain.schemas.home_schemas import HomeCreate, HomeResponse, HomeUpdate
from services.home_service import HomeService
from infrastructure.repositories.home_repository import HomeRepository
from infrastructure.dependencies import get_db

router = APIRouter(
    prefix="/home",
    tags=["home"],
)

async def get_home_service(db: AsyncSession = Depends(get_db)) -> HomeService:
    repository = HomeRepository(db)
    return HomeService(repository)

@router.get("/", response_model=HomeResponse, summary="Obtener configuración del Home")
async def get_home(service: HomeService = Depends(get_home_service)):
    home_data = await service.get_home()
    
    return {
        "success": True,
        "message": "Configuración recuperada correctamente",
        "data": home_data
    }

@router.post("/", response_model=HomeResponse, status_code=status.HTTP_201_CREATED, summary="Crear configuración del Home")
async def create_home(home_in: HomeCreate, service: HomeService = Depends(get_home_service)):
    home_data = await service.create_home(home_in)
    return {
        "success": True,
        "message": "Configuración creada correctamente",
        "data": home_data
    }

@router.put("/", response_model=HomeResponse, summary="Actualizar configuración del Home")
async def update_home(home_in: HomeUpdate, service: HomeService = Depends(get_home_service)):
    home_data = await service.update_home(home_in)
    return {
        "success": True,
        "message": "Configuración actualizada correctamente",
        "data": home_data
    }