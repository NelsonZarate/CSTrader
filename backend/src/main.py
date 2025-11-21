from typing import Union,Dict,List
from fastapi import FastAPI,Body, Request, status, HTTPException
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.src.models import User, RegisterRequest, CreateSkinRequest,EditSkinRequest,SkinDisplay, DepositRequest,MarketplaceSkinDisplay
from backend.src.utils.validation_utils import hash_password,verify_password
from backend.src.utils.security import get_current_user, get_current_admin_user
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
            return {"message": "Login successful", "user_id": str(user.id), "access_token":token, "token_type":"bearer", "role": user.role}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}") from e
    

@app.get("/users/me")
def get_my_data(current_user: dict = Depends(get_current_user)):
    return {"message": f"Olá {current_user['sub']}!"}


#endpoint de logout (simples, apenas para demonstração)
@app.get("/logout",status_code=status.HTTP_200_OK)
def logout_user(current_user: dict = Depends(get_current_user)) -> Dict[str, str]:
    return {"message": "Logout successful"}


@app.get("/inventory", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, List]])
def get_my_skins(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Union[str, List]]:
    try:
        user_email = current_user['sub']
        user = db_service.get_user_by_email(user_email, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        skins = db_service.get_user_skins(user.id, db)
        return {"message": "User skins retrieved successfully", "skins": skins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user skins: {str(e)}") from e
    
    
@app.get("/user/skins/{user_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, Union[str, List]])
def get_user_skins_by_id(user_id: int, db: Session = Depends(get_db)) -> Dict[str, Union[str, List]]:
    try:
        skins = db_service.get_user_skins(user_id, db)
        return {"message": "User skins retrieved successfully", "skins": skins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user skins: {str(e)}") from e
    
@app.post("/admin/skins", status_code=status.HTTP_201_CREATED, response_model=Dict[str,Union[str, str]])
def create_skin_admin(
    skin_data: CreateSkinRequest = Body(..., description="Skin data to be created"),
    current_admin: dict = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
    ) -> Dict[str, Union[str, str]]:
    try:
        skin_id = db_service.create_skin(skin_data, db)
        return {"message": "Skin created successfully", "skin_id": skin_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating skin: {str(e)}") from e
    
@app.put("/admin/skin/edit{skin_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
def edit_skin_admin(
    skin_id: int,
    skin_data: EditSkinRequest = Body(..., description="Skin data to be updated"),
    current_admin: dict = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
    ) -> Dict[str, str]:
    try:
        if not skin_data.model_dump(exclude_none=True, by_alias=True):
            raise HTTPException(status_code=400, detail="No fields provided for update.")
        
        db_service.edit_skin(skin_id, skin_data, db)
        return {"message": "Skin updated successfully"}
    except ValueError as e:
        error_message = str(e)
        if "Skin not found" in error_message:
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
             
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing update: {str(e)}")
    
@app.get("/skins/all", status_code=status.HTTP_200_OK, response_model=List[SkinDisplay])
def get_all_skins(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)
    ) -> Dict[str, List[str]]:
    try:
        skins = db_service.get_all_skins(db)
        return skins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving skin types: {str(e)}") from e
    
@app.get("/admin/skin/delete/{skin_id}", status_code=status.HTTP_200_OK, response_model=str)
def delete_skin_admin(
    skin_id: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
    ) -> str:
    try:
        db_service.delete_skin(skin_id, db)
        return f"Skin with id: {skin_id} deleted successfully"
    except ValueError as e:
        error_message = str(e)
        if "Skin not found" in error_message:
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting skin: {str(e)}") from e
    

@app.post("/wallet/deposit", status_code=status.HTTP_200_OK)
def deposit_funds(
    deposit: DepositRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        user_email = current_user["sub"]
        user = db_service.get_user_by_email(user_email, db)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Atualizar saldo
        user.funds += deposit.amount
        db.commit()
        db.refresh(user)

        # Registrar transação na tabela Transaction
        db_service.create_transaction(
            user_id=user.id,
            amount=deposit.amount,
            transaction_type="deposit",
            db=db
        )

        return {
            "message": "Depósito realizado com sucesso.",
            "new_balance": user.funds
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar depósito: {str(e)}")
   
@app.get("/marketplace/skins", status_code=status.HTTP_200_OK, response_model=List[MarketplaceSkinDisplay])
def get_marketplace_skins(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
    ) -> Dict[str, List[str]]:
    try:
        skins = db_service.get_marketplace_skins(db)
        print(skins)
        return skins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving skin types: {str(e)}") from e


@app.post("/marketplace/add/skin", status_code=status.HTTP_201_CREATED, response_model=Dict[str,Union[str, str]])
def marketplace_add_skin(
    skin_id,value,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
    ) -> List[SkinDisplay]:
    try:
        skinId = db_service.add_marketplace_skin(skin_id,value, db)
        return {"message": "Skin added successfully to the market", "skin_id": skinId}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating skin: {str(e)}") from e

@app.delete("/marketplace/remove/skin/{marketplace_skin_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
def marketplace_remove_skin(
    marketplace_skin_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
    ) -> Dict[str, str]:
    try:
        db_service.remove_marketplace_skin(marketplace_skin_id, db)
        return {"message": "Skin removed successfully from the market"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing skin: {str(e)}") from e

@app.post("/marketplace/buy/skin/{marketplace_skin_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
def marketplace_buy_skin(
    marketplace_skin_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
    ) -> Dict[str, str]:
    try:
        user_email = current_user["sub"]
        user = db_service.get_user_by_email(user_email, db)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        db_service.buy_marketplace_skin(marketplace_skin_id, user.id, db)

        return {"message": "Skin purchased successfully"}
    except ValueError as e:
        error_message = str(e)
        if "not found" in error_message:
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error purchasing skin: {str(e)}") from e