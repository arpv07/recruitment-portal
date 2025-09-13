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
from passlib.context import CryptContext

from jobportal.config import settings
from jobportal import crud, models
from jobportal.database import get_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# -------- Password Utilities --------
def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


# -------- Authentication --------
async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    """
    Authenticate a user:
    1. Find user by email
    2. Verify password
    3. Return user object if valid
    """
    user = await crud.get_user_by_email(db, email)
    if not user:
        logger.warning(f"Authentication failed: user {email} not found")
        return None
    if not verify_password(password, user.get("hashed_password", "")):
        logger.warning(f"Authentication failed: invalid password for {email}")
        return None
    return models.User(**user)  # return as Pydantic model


# -------- JWT Token Creation --------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    if "sub" not in data or not isinstance(data["sub"], str):
        raise ValueError("Token data must include a 'sub' claim with a valid email")

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})

    if settings.JWT_ISSUER:
        to_encode.update({"iss": settings.JWT_ISSUER})
    if settings.JWT_AUDIENCE:
        to_encode.update({"aud": settings.JWT_AUDIENCE})

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


# -------- Current User Dependency --------
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
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )

        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

    except JWTError as e:
        logger.error(f"Token validation failed: {str(e)}")
        raise credentials_exception

    user = await crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    user_model = models.User(**user)
    user_dict = user_model.model_dump(by_alias=True)
    user_dict["id"] = str(user_dict["_id"])
    user_dict["is_recruiter"] = payload.get("is_recruiter", user_dict["is_recruiter"])
    return user_dict


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return current_user


async def get_current_active_recruiter(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_recruiter"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted for non-recruiter users")
    return current_user


# -------- Token Blacklist --------
async def blacklist_token(db: AsyncIOMotorDatabase, token: str):
    await db["blacklisted_tokens"].insert_one({"token": token})
