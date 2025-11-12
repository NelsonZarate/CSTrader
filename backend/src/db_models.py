from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class UserTable(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # password_hash
    role = Column(String, default="player")
    funds = Column(Float, default=0.0)
    date_created = Column(DateTime, default=datetime.utcnow) 


class SkinTable(Base):
    __tablename__ = "skins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    float_value = Column(Float, nullable=False)
    owner_id = Column(Integer, nullable=False)
    date_created = Column(DateTime, default=datetime.utcnow)
