from typing import Union,Dict
from fastapi import FastAPI,Body, Request, status, HTTPException
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.src.models import User, RegisterRequest
from backend.src.utils.validation_utils import hash_password,verify_password
from backend.src.utils.security import get_current_user
from backend.src.utils.auth_utils import create_access_token
from backend.src.database import DatabaseService, get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
db_service = DatabaseService()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,           
    allow_methods=["*"],              
    allow_headers=["*"],              
)

@app.post("/register_user", status_code=status.HTTP_201_CREATED, response_model=Dict[str, str])
def register_user(
    user_data: RegisterRequest = Body(...,description="User registration data"),
    db: Session = Depends(get_db) 
    ) -> Dict[str, str]:
        
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
        user_id = db_service.create_user(new_user,db)
        return {"message": "User registered successfully", "user_id": user_id}   
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error creating user: {str(e)}") from e

@app.get("/get_users", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, list]])
def get_users(db: Session = Depends(get_db)) -> Dict[str, Union[str, list]]:
    try:
        users = db_service.get_all_users(db)
        return {"message": "Users retrieved successfully", "users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}") from e
    
    
@app.get("/get_user/{email}", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, Dict]])
def get_user_by_email(email: str, db: Session = Depends(get_db)) -> Dict[str, Union[str, Dict]]:
    try:
        user = db_service.get_user_by_email(email, db)
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
def login_user(email: str = Body(..., embed=True), password: str = Body(..., embed=True), db: Session = Depends(get_db) ) -> Dict[str, str]:
    try:
        user = db_service.get_user_by_email(email,db)
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
