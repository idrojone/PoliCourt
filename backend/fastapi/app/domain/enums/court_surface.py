from enum import Enum

class CourtSurface(str, Enum):
    HARD = "HARD"
    CLAY = "CLAY"
    GRASS = "GRASS"
    SYNTHETIC = "SYNTHETIC"
    WOOD = "WOOD"
    OTHER = "OTHER"
