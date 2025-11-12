from backend.src.settings import settings
from backend.src.models import User 
from backend.src.db_models import UserTable, SkinTable   
from sqlalchemy import create_engine, select, insert,text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from typing import List, Dict

DATABASE_URL = (
    f"{settings.database_driver}://"
    f"{settings.database_username}:{settings.database_password}@"
    f"{settings.database_host}:{settings.database_port}/"
    f"{settings.database_name}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class DatabaseService:
    def __init__(self):
        pass
    def create_user(self, user: User, db: Session) -> str:       
        try:
            db_user = UserTable(
                name=user.name,
                email=user.email,
                password=user.password,
                role=user.role,
                funds=user.funds
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return str(db_user.id)
        except IntegrityError as e:
                db.rollback()
                raise ValueError("User with this email already exists") from e
    def create_admin(self, user: User, db: Session) -> str:       
        try:
            db_user = UserTable(
                id=user.id,
                name=user.name,
                email=user.email,
                password=user.password,
                role=user.role,
                funds=user.funds
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return str(db_user.id)
        except IntegrityError as e:
                db.rollback()
                raise ValueError("ADMIN with this id or email already exist") from e
    
    def get_user_by_email(self, email: str, db: Session) -> User | None:
        query = select(UserTable).where(UserTable.email == email)
        result = db.execute(query).scalar_one_or_none()
        if result:
            return User.model_validate(result)
        return None
        
    def get_all_users(self,db: Session) -> List[Dict]:
            query = select(UserTable)
            db_users = db.scalars(query).all()
            users_data = []
            for user in db_users:
                users_data.append({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "funds": user.funds
                })
            return users_data
    def get_user_skins(self,user_id:int,db: Session) -> List[Dict]:
            query = select(SkinTable).where(SkinTable.owner_id == user_id)
            db_skins = db.scalars(query).all()
            skins_data = []
            for skin in db_skins:
                skins_data.append({
                    "id": skin.id,
                    "name": skin.name,
                    "type": skin.type,
                    "float_value": skin.float_value,
                    "owner_id": skin.owner_id,
                    "date_created": skin.date_created
                })
            return skins_data
Database = DatabaseService

def get_db():
     db = SessionLocal()
     try:
         yield db
     finally:
         db.close()
         
if __name__ == "__main__":
    breakpoint()