from sqlalchemy import Column, Integer, String, Float, DateTime,ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime,timezone

Base = declarative_base()

class UserTable(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="player")
    funds = Column(Float, default=0.0)
    date_created = Column(DateTime, default=datetime.now(timezone.utc)) 


class SkinTable(Base):
    __tablename__ = "skins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    float_value = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date_created = Column(DateTime, default=datetime.now(timezone.utc))
    link = Column(String,nullable=True)
