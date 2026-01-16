from fastapi import APIRouter

from .endpoints.home_routes import router as home_router

routers = APIRouter()
router_list = [home_router]

for router_item in router_list:
    routers.include_router(router_item, tags=["v1"])