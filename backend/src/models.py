from pydantic import BaseModel,Field,EmailStr,field_validator,ConfigDict

class User(BaseModel):
    id: int 
    name: str 
    email: EmailStr
    password: str
    role: str = "player"
    funds: float = 0.0
    @field_validator('name')
    @classmethod
    def validate_username(cls, v):
        """Validate username is not empty"""
        if not v or not v.strip():
            raise ValueError('Username cannot be empty')
        return v.strip()
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                "role": "user",
                "funds": 100.0
            }

        }
    )
    
class skins(BaseModel):
    id: int
    name: str
    type: str
    float_value: float
    owner_id: int
    date_created: str
    model_config = ConfigDict(
        populate_by_name=True, # Permite que o Pydantic leia 'float' do banco de dados como 'float_value'
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "AK-47 | Redline",
                "type": "Rifle",
                "float": 0.15,
                "owner_id": 0
            }
        }
    )


class marketplace(BaseModel):
    id: int
    skin_id: int
    price: float
    listed_at: str

class RegisterRequest(BaseModel):
    name: str = Field(..., description="The name of the user")
    email: EmailStr = Field(..., description="The email of the user")
    password: str = Field(..., min_length=8, description="The password of the user")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "SecurePassword123#",
                "role":"player",
                "funds": 00.0
            }
        }
    )

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="The email of the user")
    password: str = Field(..., description="The password of the user")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "john@example.com",
                "password": "SecurePassoword123#"
            }
        }
    )