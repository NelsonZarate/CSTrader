from backend.src.settings import settings
from sqlalchemy import create_engine,text
from backend.src.models import User
from sqlalchemy.exc import IntegrityError

class Database:
    def __init__(self):
        self.engine = create_engine(f"{settings.database_driver}://{settings.database_username}:{settings.database_password}@{settings.database_host}:{settings.database_port}/{settings.database_name}")
    
    def create_user(self,user: User):
        try:
            with self.engine.begin() as connection:
                query_result = connection.execute(
                    text("INSERT INTO users(name, email, password, role, funds) VALUES (:name, :email, :password, :role, :funds) RETURNING id ;"),
                    parameters={"name": user.name, "email": user.email, "password": user.password, "role": user.role, "funds": user.funds}
                )
                user_id = query_result.scalar_one()
                print(f"User created with ID: {user_id}")
                return str(user_id)
        except IntegrityError as e:
            raise ValueError("User with this email already exists") from e
    
    """
    def check_user_exists(self,email: str) -> bool:
        with self.engine.begin() as connection:
            query_result = connection.execute(
                text("SELECT id FROM Users WHERE email = :email"),
                parameters={"email": email}
            )
            existing_user = query_result.first()
            return existing_user is not None
    """
    
    def get_user_by_email(self,email: str) -> User:
        with self.engine.begin() as connection:
            query_result = connection.execute(
                text("SELECT id, name, email, password, role, funds FROM users WHERE email = :email"),
                parameters={"email": email}
            )
            row = query_result.first()
            if row:
                return User(id=row.id, name=row.name, email=row.email, password=row.password, role=row.role, funds=row.funds)
            return None
    def get_all_users(self) -> list:
        with self.engine.begin() as connection:
            query_result = connection.execute(
                text("SELECT id, name, email, role, funds FROM users")
            )
            users = []
            for row in query_result.fetchall():
                users.append({
                    "id": row.id,
                    "name": row.name,
                    "email": row.email,
                    "role": row.role,
                    "funds": row.funds
                })
            return users
        
if __name__ == "__main__":
    breakpoint()