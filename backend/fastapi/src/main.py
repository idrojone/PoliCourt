from fastapi import FastAPI
from utils.class_object import singleton
from config import configs
from api.v1 import routes

@singleton
class AppCreator:
    def __init__(self):
        self.app = FastAPI(
            title=configs.PROJECT_NAME,
            openapi_url=f"{configs.API_V1_STR}/openapi.json",
            version="1.0.0"
        )
        self.app.include_router(routes.routers, prefix=configs.API_V1_STR)


app_creator = AppCreator()

app = app_creator.app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=4003, reload=True)