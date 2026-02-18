from sqlalchemy import (
    Column, String, Boolean, DateTime, Text, Enum as SQLAlchemyEnum, 
    Integer, Numeric, ForeignKey, BigInteger, CheckConstraint, UniqueConstraint, Date
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database import Base
import enum

# ============================================================================
# ENUMS
# ============================================================================

class GeneralStatus(str, enum.Enum):
    PUBLISHED = 'PUBLISHED'
    DRAFT = 'DRAFT'
    ARCHIVED = 'ARCHIVED'
    SUSPENDED = 'SUSPENDED'

class CourtSurfaceEnum(str, enum.Enum):
    HARD = 'HARD'
    CLAY = 'CLAY'
    GRASS = 'GRASS'
    SYNTHETIC = 'SYNTHETIC'
    WOOD = 'WOOD'
    OTHER = 'OTHER'

class UserRoleEnum(str, enum.Enum):
    ADMIN = 'ADMIN'
    USER = 'USER'
    COACH = 'COACH'
    MONITOR = 'MONITOR'
    CLUB_ADMIN = 'CLUB_ADMIN'

class BookingTypeEnum(str, enum.Enum):
    RENTAL = 'RENTAL'
    CLASS = 'CLASS'
    TRAINING = 'TRAINING'

class BookingStatusEnum(str, enum.Enum):
    CONFIRMED = 'CONFIRMED'
    PENDING = 'PENDING'
    CANCELLED = 'CANCELLED'
    COMPLETED = 'COMPLETED'

class MaintenanceStatusEnum(str, enum.Enum):
    SCHEDULED = 'SCHEDULED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'


# ============================================================================
# MODELS
# ============================================================================

class UserModel(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    date_of_birth = Column(Date)
    gender = Column(String(20))
    avatar_url = Column(Text)
    role = Column(SQLAlchemyEnum(UserRoleEnum, name='user_role'), nullable=False, default=UserRoleEnum.USER)
    status = Column(SQLAlchemyEnum(GeneralStatus, name='general_status'), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    organized_bookings = relationship("BookingModel", back_populates="organizer", foreign_keys="BookingModel.organizer_id")
    club_memberships = relationship("ClubMemberModel", back_populates="user")
    created_maintenances = relationship("CourtMaintenanceModel", back_populates="creator")
    booking_attendances = relationship("BookingAttendeeModel", back_populates="user")


class SportModel(Base):
    __tablename__ = "sports"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    img_url = Column(Text)
    status = Column(SQLAlchemyEnum(GeneralStatus, name='general_status'), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    court_sports = relationship("CourtSportModel", back_populates="sport")
    bookings = relationship("BookingModel", back_populates="sport")
    clubs = relationship("ClubModel", back_populates="sport")


class CourtModel(Base):
    __tablename__ = "courts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    location_details = Column(Text)
    img_url = Column(Text)
    price_h = Column(Numeric(10, 2), nullable=False, default=0)
    capacity = Column(Integer, nullable=False, default=4)
    is_indoor = Column(Boolean, nullable=False, default=False)
    surface = Column(SQLAlchemyEnum(CourtSurfaceEnum, name='court_surface_enum'), nullable=False, default=CourtSurfaceEnum.HARD)
    status = Column(SQLAlchemyEnum(GeneralStatus, name='general_status'), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    court_sports = relationship("CourtSportModel", back_populates="court")
    bookings = relationship("BookingModel", back_populates="court")
    maintenances = relationship("CourtMaintenanceModel", back_populates="court")


class CourtSportModel(Base):
    __tablename__ = "court_sports"
    __table_args__ = (
        UniqueConstraint('court_id', 'sport_id', name='court_sports_court_id_sport_id_key'),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    court_id = Column(BigInteger, ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(BigInteger, ForeignKey("sports.id", ondelete="CASCADE"), nullable=False)

    court = relationship("CourtModel", back_populates="court_sports")
    sport = relationship("SportModel", back_populates="court_sports")


class ClubModel(Base):
    __tablename__ = "clubs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    img_url = Column(Text)
    sport_id = Column(BigInteger, ForeignKey("sports.id", ondelete="RESTRICT"), nullable=False)
    status = Column(SQLAlchemyEnum(GeneralStatus, name='general_status'), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    sport = relationship("SportModel", back_populates="clubs")
    members = relationship("ClubMemberModel", back_populates="club")
    bookings = relationship("BookingModel", back_populates="club")


class ClubMemberModel(Base):
    __tablename__ = "club_members"
    __table_args__ = (
        UniqueConstraint('club_id', 'user_id', name='club_members_club_id_user_id_key'),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    club_id = Column(BigInteger, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False, default='MEMBER')
    status = Column(SQLAlchemyEnum(GeneralStatus, name='general_status'), nullable=False, default=GeneralStatus.PUBLISHED)
    is_active = Column(Boolean, default=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    club = relationship("ClubModel", back_populates="members")
    user = relationship("UserModel", back_populates="club_memberships")


class BookingModel(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        CheckConstraint("end_time > start_time", name="check_dates"),
        CheckConstraint(
            "(type IN ('CLASS', 'TRAINING') AND sport_id IS NOT NULL) OR (type = 'RENTAL' AND sport_id IS NULL)",
            name="check_sport_required"
        ),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    slug = Column(String(255), unique=True, nullable=False)
    court_id = Column(BigInteger, ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    organizer_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(BigInteger, ForeignKey("sports.id", ondelete="RESTRICT"))
    club_id = Column(BigInteger, ForeignKey("clubs.id", ondelete="CASCADE"))
    type = Column(SQLAlchemyEnum(BookingTypeEnum, name='booking_type_enum'), nullable=False, default=BookingTypeEnum.RENTAL)
    title = Column(String(150))
    description = Column(Text)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    total_price = Column(Numeric(10, 2), default=0)
    attendee_price = Column(Numeric(10, 2), default=0)
    status = Column(SQLAlchemyEnum(BookingStatusEnum, name='booking_status_enum'), nullable=False, default=BookingStatusEnum.CONFIRMED)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    court = relationship("CourtModel", back_populates="bookings")
    organizer = relationship("UserModel", back_populates="organized_bookings")
    sport = relationship("SportModel", back_populates="bookings")
    club = relationship("ClubModel", back_populates="bookings")
    attendees = relationship("BookingAttendeeModel", back_populates="booking")


class BookingAttendeeModel(Base):
    __tablename__ = "booking_attendees"
    __table_args__ = (
        UniqueConstraint('booking_id', 'user_id', name='booking_attendees_booking_id_user_id_key'),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    booking_id = Column(BigInteger, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default='CONFIRMED')
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("BookingModel", back_populates="attendees")
    user = relationship("UserModel", back_populates="booking_attendances")


class CourtMaintenanceModel(Base):
    __tablename__ = "court_maintenances"
    __table_args__ = (
        CheckConstraint("end_time > start_time", name="check_maintenance_dates"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    slug = Column(String(255), unique=True, nullable=False)
    court_id = Column(BigInteger, ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(SQLAlchemyEnum(MaintenanceStatusEnum, name='maintenance_status_enum'), nullable=False, default=MaintenanceStatusEnum.SCHEDULED)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    court = relationship("CourtModel", back_populates="maintenances")
    creator = relationship("UserModel", back_populates="created_maintenances")
