"""
Authentication utilities using JWT (JSON Web Tokens) for MongoDB.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

from jobportal.config import settings
from jobportal import crud, models
from jobportal.database import get_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    if "sub" not in data or not isinstance(data["sub"], str):
        raise ValueError("Token data must include a 'sub' claim with a valid email")
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    if settings.JWT_ISSUER:
        to_encode.update({"iss": settings.JWT_ISSUER})
    if settings.JWT_AUDIENCE:
        to_encode.update({"aud": settings.JWT_AUDIENCE})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Check token blacklist
        if await db["blacklisted_tokens"].find_one({"token": token}):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked"
            )
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing 'sub' claim"
            )
    except JWTError as e:
        logger.error(f"Token validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}"
        )
    user = await crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    user_model = models.User(**user)
    user_dict = user_model.model_dump(by_alias=True)
    user_dict['id'] = str(user_dict['_id'])
    user_dict['is_recruiter'] = payload.get("is_recruiter", user_dict['is_recruiter'])
    return user_dict

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return current_user

async def get_current_active_recruiter(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_recruiter"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted for non-recruiter users"
        )
    return current_user