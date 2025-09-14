"""
Router for user-related endpoints in the Job Portal API.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from jobportal.database import get_database
from jobportal import crud, auth, schemas
from jobportal.models import User
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=schemas.UserPublic, status_code=status.HTTP_201_CREATED)
async def register(user: schemas.UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Create a new user with hashed password and store in MongoDB.
    """
    if await crud.get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken",
        )
    if await crud.get_user_by_email(db, email=user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )
    if user.phone and await crud.get_user_by_phone(db, phone=user.phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is already registered",
        )

    all_users = await crud.get_all_users(db)
    role = "SuperAdmin" if not all_users else "User"

    hashed_password = auth.get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["role"] = role
    user_dict["created_at"] = datetime.utcnow()


    new_user = await crud.create_user(db, user_dict)
    return new_user


@router.post("/login")
async def login(login_dto: schemas.LoginUserReqDto, db: AsyncIOMotorDatabase = Depends(get_database)):
    user = await crud.get_user_by_username(db, username=login_dto.username)
    if not user or not auth.verify_password(login_dto.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user["username"], "role": user["role"]})
    return {
        "message": "Login successful",
        "token": access_token,
        "user": {
            "FullName": user["full_name"],
            "Email": user["email"],
            "Phone": user["phone"],
            "LinkedInUrl": user.get("linked_in_url"),
            "Location": user.get("location"),
            "CreatedAt": user["created_at"],
        }
    }


@router.post("/add-role")
async def add_role(dto: schemas.AssignRoleDto, db: AsyncIOMotorDatabase = Depends(get_database), current_user: User = Depends(auth.role_checker(["SuperAdmin"]))):
    user = await crud.get_user_by_username(db, dto.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user["role"] == dto.role:
        return {"message": f"User '{user['username']}' already has role '{dto.role}'"}
    await crud.update_user(db, user["_id"], {"role": dto.role})
    return {"message": f"Role '{dto.role}' assigned to {user['username']} successfully"}


@router.post("/assign-role")
async def assign_role(dto: schemas.AssignRoleDto, db: AsyncIOMotorDatabase = Depends(get_database), current_user: User = Depends(auth.role_checker(["Admin", "SuperAdmin"]))):
    user = await crud.get_user_by_username(db, dto.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if dto.role == "SuperAdmin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot assign SuperAdmin role")
    await crud.update_user(db, user["_id"], {"role": dto.role})
    return {"message": f"Role '{dto.role}' assigned to {user['username']} successfully"}


@router.post("/apply")
async def apply(current_user: User = Depends(auth.role_checker(["User", "SuperAdmin"]))):
    return {"message": "Application submitted successfully", "user": current_user.username}

@router.get("/dashboard")
async def dashboard(current_user: User = Depends(auth.role_checker(["Admin", "SuperAdmin"]))):
    return {"message": "Welcome to Admin Dashboard", "user": current_user.username}