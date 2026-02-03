from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database import Base
import uuid
import enum

class GeneralStatus(enum.Enum):
    PUBLISHED = "published"
    DRAFT = "draft"
    # Add other values if needed

class CourtSurfaceEnum(enum.Enum):
    HARD = "hard"
    CLAY = "clay"
    GRASS = "grass"
    SYNTHETIC = "synthetic"
    WOOD = "wood"
    OTHER = "other"

class UserRoleEnum(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    COACH = "coach"
    MONITOR = "monitor"
    CLUB_ADMIN = "club_admin"

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

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    img_url = Column(Text)
    role = Column(Enum(UserRoleEnum), nullable=False, default=UserRoleEnum.USER)
    status = Column(Enum(GeneralStatus), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class CourtModel(Base):
    __tablename__ = "courts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    location_details = Column(Text)
    img_url = Column(Text)
    price_h = Column(Numeric(10, 2), nullable=False, default=0)
    capacity = Column(Integer, nullable=False, default=4)
    is_indoor = Column(Boolean, nullable=False, default=False)
    surface = Column(Enum(CourtSurfaceEnum), nullable=False, default=CourtSurfaceEnum.HARD)
    status = Column(Enum(GeneralStatus), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

