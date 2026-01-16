from sqlalchemy import Column, Integer, JSON
from infrastructure.database import Base

class HomeModel(Base):
    __tablename__ = "home"
    id = Column(Integer, primary_key=True, index=True)
    carrusel = Column(JSON, default=list)