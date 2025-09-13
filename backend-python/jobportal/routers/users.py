"""
Router for user-related endpoints in the Job Portal API.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jobportal.database import get_database
from jobportal import crud, auth
from jobportal.models import User  # DB model
from jobportal.schemas import UserCreate, UserPublic, Token 
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/users/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Create a new user with hashed password and store in MongoDB.
    """
    try:
        db_user = await crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        hashed_password = auth.get_password_hash(user.password)
        user_dict = user.dict()
        user_dict["hashed_password"] = hashed_password
        del user_dict["password"]
        new_user = await crud.create_user(db, user_dict)
        return new_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Authenticate user and return JWT access token.
    """
    user = await auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    """
    Get the current authenticated user's information.
    """
    return current_user

@router.post("/logout")
async def logout(token: str = Depends(auth.oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Blacklist the JWT token to log out the user.
    """
    await auth.blacklist_token(db, token)
    return {"message": "Successfully logged out"}