from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database import Base
import uuid
import enum

class GeneralStatus(enum.Enum):
    PUBLISHED = "published"
    DRAFT = "draft"
    # Add other values if needed

class SportModel(Base):
    __tablename__ = "sports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)
    img_url = Column(Text)
    # Usamos el ENUM de Postgres
    status = Column(Enum(GeneralStatus), nullable=False) 
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

