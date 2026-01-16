import os
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()

class Configs(BaseSettings):
    ENV: str = os.getenv("ENV", "development")
    API: str = "/api"
    API_V1_STR: str = f"{API}/v1"
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "PoliCourt")

    PROJECT_ROOT: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    DATETIME_FORMAT: str = "%Y-%m-%dT%H:%M:%S"
    DATE_FORMAT: str = "%Y-%m-%d"

    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    DB: str = os.getenv("POSTGRES_DB", "users_db")
    DB_USER: str = os.getenv("POSTGRES_USER", "idrojone")
    DB_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "idrojone_user")
    DB_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    DB_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    DB_ENGINE: str = "postgresql+asyncpg"
    
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL",
        f"{DB_ENGINE}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB}"
    )

    class Config:
        case_sensitive = True


class TestConfigs(Configs):
    ENV: str = "test"


configs = Configs()

if configs.ENV == "prod":
    pass
elif configs.ENV == "stage":
    pass
elif configs.ENV == "test":
    configs = TestConfigs()