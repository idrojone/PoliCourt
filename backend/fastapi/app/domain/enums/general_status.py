from enum import Enum

class GeneralStatus(str, Enum):
    PUBLISHED = "PUBLISHED"
    DRAFT = "DRAFT"
    ARCHIVED = "ARCHIVED"
    SUSPENDED = "SUSPENDED"
