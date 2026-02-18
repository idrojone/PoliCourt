from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    COACH = "COACH"
    MONITOR = "MONITOR"
    CLUB_ADMIN = "CLUB_ADMIN"
