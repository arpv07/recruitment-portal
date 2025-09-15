from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from jobportal.database import get_database
from jobportal import crud, auth

router = APIRouter()

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await crud.get_user_by_username(db, form_data.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    if not auth.verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    access_token = auth.create_access_token(
        data={"sub": user["username"], "role": user.get("role", "user")}
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(new_user: dict, db: AsyncIOMotorDatabase = Depends(get_database)):
    if await crud.get_user_by_username(db, new_user["username"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    hashed_password = auth.get_password_hash(new_user["password"])
    new_user["password"] = hashed_password
    created_user = await crud.create_user(db, new_user)

    return {"message": "User registered successfully", "user_id": str(created_user["_id"])}
