from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from backend.src.utils.auth_utils import decode_access_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    return payload  # pode retornar o email, role, etc.
