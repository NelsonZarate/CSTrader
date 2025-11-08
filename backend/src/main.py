from typing import Union,Dict
from fastapi import FastAPI,Body, Request, status, HTTPException
from contextlib import asynccontextmanager

from fastapi.params import Depends
from backend.src.models import User, RegisterRequest
from backend.src.utils.validation_utils import hash_password,verify_password
from backend.src.utils.security import get_current_user
from backend.src.utils.auth_utils import create_access_token
from backend.src.database import DatabaseService as Database

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = Database()
    yield
app = FastAPI(lifespan=lifespan)


@app.post("/register_user", status_code=status.HTTP_201_CREATED, response_model=Dict[str, str])
def register_user(
    user_data: RegisterRequest = Body(...,description="User registration data"),
    request: Request = None
    ) -> Dict[str, str]:
    #Validate if user with email already exists
    
    #hash password
    password_hashed = hash_password(user_data.password)
    new_user = User(
        id=0,
        name=user_data.name,
        email=user_data.email,
        password=password_hashed,
        role="user",
        funds=0.0
    )
    #Save user to database
    try:
        db_instance = request.app.state.db
        user_id = db_instance.create_user(new_user)
        return {"message": "User registered successfully", "user_id": user_id}   
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error creating user: {str(e)}") from e

@app.get("/get_users", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, list]])
def get_users(request: Request = None) -> Dict[str, Union[str, list]]:
    try:
        db_instance = request.app.state.db
        users = db_instance.get_all_users()
        return {"message": "Users retrieved successfully", "users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}") from e
    
    
@app.get("/get_user/{email}", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, Dict]])
def get_user(email: str, request: Request = None) -> Dict[str, Union[str, Dict]]:
    try:
        db_instance = request.app.state.db
        user = db_instance.get_user_by_email(email)
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "funds": user.funds
            }
            return {"message": "User retrieved successfully", "user": user_data}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}") from e

@app.post("/login",status_code=status.HTTP_200_OK)
def login_user(email: str = Body(..., embed=True), password: str = Body(..., embed=True), request: Request = None) -> Dict[str, str]:
    try:
        db_instance = request.app.state.db
        user = db_instance.get_user_by_email(email)
        if  user and verify_password(password,user.password):
            token = create_access_token({"sub": user.email, "role": user.role})
            return {"message": "Login successful", "user_id": str(user.id), "access_token":token, "token_type":"bearer"}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}") from e
    

@app.get("/users/me")
def get_my_data(current_user: dict = Depends(get_current_user)):
    return {"message": f"Olá {current_user['sub']}!"}
