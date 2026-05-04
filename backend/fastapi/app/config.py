from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "PoliCourt FastAPI"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: str = "5433"
    POSTGRES_USER: str = "test"
    POSTGRES_PASSWORD: str = "test"
    POSTGRES_DB: str = "test"
    CORS_ORIGINS: List[str] = ["http://localhost:4000"]
    JWT_SECRET: str = "secret" 

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file_encoding = "utf-8"

settings = Settings()