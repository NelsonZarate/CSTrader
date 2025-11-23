from backend.src.settings import settings
from backend.src.models import User, skins, CreateSkinRequest,EditSkinRequest
from backend.src.db_models import UserTable, SkinTable, Transaction, Marketplace
from sqlalchemy import create_engine, select, insert,text,distinct
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from typing import List, Dict
from datetime import datetime,timezone

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
    
    def get_user_by_email(self, email: str, db: Session) -> UserTable | None:
        try:
            query = select(UserTable).where(UserTable.email == email)
            result = db.execute(query).scalar_one_or_none()  # Retorna ORM UserTable
            return result
        except Exception as e:
            raise ValueError(f"Erro ao buscar usuário por email: {str(e)}")

        
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
            query_skins = select(SkinTable).outerjoin(Marketplace, Marketplace.skin_id == SkinTable.id
            ).where(SkinTable.owner_id == user_id,Marketplace.skin_id == None)
            db_skins = db.scalars(query_skins).all()
            skins_data = []
            for skin in db_skins:
                skins_data.append({
                    "id": skin.id,
                    "name": skin.name,
                    "type": skin.type,
                    "float_value": skin.float_value,
                    "owner_id": skin.owner_id,
                    "date_created": skin.date_created,
                    "link": skin.link
                })
            return skins_data
    def create_skin(self, skin: CreateSkinRequest, db: Session) -> str:       
        try:
            db_skin = SkinTable(
                name=skin.name,
                type=skin.type,
                float_value=skin.float_value,
                owner_id=0,
                date_created=datetime.now(timezone.utc),
                link=skin.link
            )
            db.add(db_skin)
            db.commit()
            db.refresh(db_skin)
            return str(db_skin.id)
        except IntegrityError as e:
                db.rollback()
                raise ValueError("Error creating skin") from e
            
    def edit_skin(self, skin_id: int, skin: EditSkinRequest, db: Session) -> str:
        try:
            skin_update = db.get(SkinTable, skin_id)
            if not skin_update:
                raise ValueError("Skin not found")
            
            if skin.name is not None:
                skin_update.name = skin.name
            if skin.type is not None:
                skin_update.type = skin.type
            if skin.float_value is not None:
                skin_update.float_value = skin.float_value 
            if skin.owner_id is not None:
                skin_update.owner_id = skin.owner_id
            if skin.link is not None:
                skin_update.link = skin.link  
            db.commit()
            return str(skin_id) 
            
        except IntegrityError as e:
            db.rollback()
            raise ValueError("Error updating skin (possible invalid owner_id)") from e
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error updating skin: {str(e)}") from e
        
    def get_all_skins(self,db: Session) -> List[Dict]:
            query = select(SkinTable).order_by(SkinTable.type)
            result = db.execute(query).scalars().all()
            return result
    
    def delete_skin(self, skin_id: int, db: Session) -> None:
        try:
            skin_to_delete = db.get(SkinTable, skin_id)
            if not skin_to_delete:
                raise ValueError("Skin not found")
            db.delete(skin_to_delete)
            db.commit()
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error deleting skin: {str(e)}") from e
        
    def create_transaction(self, user_id: int, amount: float, transaction_type: str, db: Session):
        transaction = Transaction(
            user_id=user_id,
            amount=amount,
            type=transaction_type
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return transaction.id
    
    def get_marketplace_skins(self, user_email, db: Session) -> List[Dict]:
        try:
            query = select(UserTable.id).where(UserTable.email == user_email)
            user_id = db.execute(query).scalar_one_or_none()
            query = select(SkinTable.id, SkinTable.name, SkinTable.type, SkinTable.float_value, SkinTable.date_created, SkinTable.link, SkinTable.owner_id, Marketplace.value
                    ).join(
                        Marketplace, Marketplace.skin_id == SkinTable.id
                    ).where(SkinTable.owner_id != user_id)
            result = db.execute(query)
            skins_data = []
            for row in result:
                skins_data.append({
                    "id": row.id,
                    "name": row.name,
                    "type": row.type,
                    "float_value": row.float_value,
                    "date_created": row.date_created,
                    "owner_id": row.owner_id,
                    "link": row.link,
                    "value": row.value
                })
            return skins_data
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error adding skin to marketplace : {str(e)}") from e
    def add_marketplace_skin(self, skin_id: int, value: float, db : Session ) -> str :
        try:
            verify_existing_skin_query = select(Marketplace.id).where(Marketplace.skin_id == skin_id)
            verify_existing_skin = db.execute(verify_existing_skin_query).scalar_one_or_none()
            if verify_existing_skin:
                raise ValueError(f"Skin with id: {skin_id} is already listed in the marketplace")
            marketplace_skin = Marketplace(
                skin_id=skin_id,
                value=value
            )
            db.add(marketplace_skin)
            db.commit()
            db.refresh(marketplace_skin)
            return str(marketplace_skin.id)
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error fetching marketplace skins : {str(e)}") from e
    def buy_marketplace_skin(self, skin_id: int, buyer_id: int, db: Session) -> None:
        try:
            marketplace_skin_query = select(Marketplace).where(Marketplace.skin_id == skin_id)
            marketplace_skin = db.execute(marketplace_skin_query).scalar_one_or_none()
            if not marketplace_skin:
                raise ValueError(f"Skin with id: {skin_id} is not listed in the marketplace")
            skin_query = select(SkinTable).where(SkinTable.id == skin_id)
            skin = db.execute(skin_query).scalar_one_or_none()
            if not skin:
                raise ValueError(f"Skin with id: {skin_id} does not exist")
            buyer_query = select(UserTable).where(UserTable.id == buyer_id)
            buyer = db.execute(buyer_query).scalar_one_or_none()
            if not buyer:
                raise ValueError(f"Buyer with id: {buyer_id} does not exist")
            if buyer.funds < marketplace_skin.value:
                raise ValueError("Buyer has insufficient funds")
            seller_query = select(UserTable).where(UserTable.id == skin.owner_id)
            seller = db.execute(seller_query).scalar_one_or_none()
            if not seller:
                raise ValueError(f"Seller with id: {skin.owner_id} does not exist")
            buyer.funds -= marketplace_skin.value
            seller.funds += marketplace_skin.value
            skin.owner_id = buyer_id
            
            transaction_query_buyer = Transaction(
                user_id=buyer_id,
                amount= -marketplace_skin.value,
                type="purchase"
            )
            transaction_query_seller = Transaction(
                user_id=seller.id,
                amount= marketplace_skin.value,
                type="sale"
            )
            db.add(transaction_query_buyer)
            db.add(transaction_query_seller)
            db.delete(marketplace_skin)
            db.commit()
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error buying marketplace skin : {str(e)}") from e
    def remove_marketplace_skin(self, skin_id: int, db: Session) -> None:
        try:
            marketplace_skin_query = select(Marketplace).where(Marketplace.skin_id == skin_id)
            marketplace_skin = db.execute(marketplace_skin_query).scalar_one_or_none()
            if not marketplace_skin:
                raise ValueError(f"Skin with id: {skin_id} is not listed in the marketplace")
            db.delete(marketplace_skin)
            db.commit()
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error removing skin from marketplace : {str(e)}") from e
        
    def get_user_marketplace_skins(self, user_email: str, db: Session) -> List[Dict]:
        try:
            query_user = select(UserTable.id).where(UserTable.email == user_email)
            user_id = db.execute(query_user).scalar_one_or_none()
            if user_id is None:
                raise ValueError(f"User with email: {user_email} does not exist")
            
            query = select(SkinTable.id, SkinTable.name, SkinTable.type, SkinTable.float_value, SkinTable.date_created, SkinTable.link, SkinTable.owner_id, Marketplace.value
                    ).join(
                        Marketplace, Marketplace.skin_id == SkinTable.id
                    ).where(SkinTable.owner_id == user_id)
            result = db.execute(query)
            skins_data = []
            for row in result:
                skins_data.append({
                    "id": row.id,
                    "name": row.name,
                    "type": row.type,
                    "float_value": row.float_value,
                    "date_created": row.date_created,
                    "owner_id": row.owner_id,
                    "link": row.link,
                    "value": row.value
                })
            return skins_data
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error fetching user's marketplace skins : {str(e)}") from e
Database = DatabaseService

def get_db():
     db = SessionLocal()
     try:
         yield db
     finally:
         db.close()
         
if __name__ == "__main__":
    breakpoint()
