import asyncio
import sys
from infrastructure.models.home_model import HomeModel
from sqlalchemy.exc import SQLAlchemyError

from infrastructure.database import engine, Base


async def create_tables() -> None:
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created (or already exist)")
    except SQLAlchemyError as exc:
        print("❌ Failed to create tables:", exc)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(create_tables())
