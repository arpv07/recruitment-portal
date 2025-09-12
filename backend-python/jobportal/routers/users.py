"""
API router for user-related endpoints (MongoDB version).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta
from bson import ObjectId
import logging

from jobportal import crud, schemas, auth
from jobportal.auth import oauth2_scheme  # Added import
from jobportal.database import get_database
from jobportal.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/users/", response_model=schemas.UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(user: schemas.UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Create a new user account.
    """
    try:
        db_user = await crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        created_user = await crud.create_user(db=db, user=user)
        return models.User(**created_user).model_dump(by_alias=True)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Authenticate a user and return an access token.
    """
    try:
        user = await crud.get_user_by_email(db, email=form_data.username)
        if not user or not crud.verify_password(form_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user["email"], "is_recruiter": user["is_recruiter"]},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Revoke a user's access token.
    """
    try:
        await db["blacklisted_tokens"].insert_one({"token": token, "blacklisted_at": datetime.utcnow()})
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"Error revoking token: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/users/me/", response_model=schemas.UserPublic)
async def read_users_me(current_user: dict = Depends(auth.get_current_active_user)):
    """
    Get the details of the currently authenticated user.
    """
    try:
        return schemas.UserPublic(**current_user)
    except Exception as e:
        logger.error(f"Error retrieving user details: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")