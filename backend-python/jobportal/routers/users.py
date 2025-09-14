"""
User router for Job Portal API.
Handles user authentication, creation, and retrieval.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase
from jobportal import crud, schemas
from jobportal.auth import verify_password, get_password_hash, create_access_token, role_checker, get_current_user
from jobportal.database import get_database

router = APIRouter()

# --- Request & Response Models ---
class LoginRequest(BaseModel):
    username: str = Field(..., example="johndoe")
    password: str = Field(..., example="strongpassword")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreateRequest(BaseModel):
    username: str
    password: str
    role: str = "user"  # default role

class UserResponse(BaseModel):
    username: str
    role: str

# --- Login Endpoint ---
@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    user_dict = await crud.get_user_by_username(db, request.username)
    if not user_dict:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(request.password, user_dict["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token_data = {"sub": user_dict["username"], "role": user_dict["role"]}
    access_token = create_access_token(token_data)

    return {"access_token": access_token, "token_type": "bearer"}

# --- Register Endpoint (New) ---
@router.post("/register", response_model=TokenResponse)
async def register(request: UserCreateRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing_user = await crud.get_user_by_username(db, request.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = get_password_hash(request.password)
    user_dict = {
        "username": request.username,
        "password": hashed_password,
        "role": request.role
    }
    await crud.create_user(db, user_dict)

    token_data = {"sub": request.username, "role": request.role}
    access_token = create_access_token(token_data)

    return {"access_token": access_token, "token_type": "bearer"}

# --- Create User Endpoint (Admin / Internal Use) ---
@router.post("/users", response_model=UserResponse)
async def create_user(request: UserCreateRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing_user = await crud.get_user_by_username(db, request.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = get_password_hash(request.password)
    user_dict = {"username": request.username, "password": hashed_password, "role": request.role}
    await crud.create_user(db, user_dict)
    return {"username": request.username, "role": request.role}

# --- Get Current User Endpoint ---
@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user=Depends(get_current_user)):
    return {"username": current_user.username, "role": current_user.role}

# --- Admin-only example endpoint ---
@router.get("/admin", response_model=UserResponse)
async def admin_only_route(current_user=Depends(role_checker(["admin"]))):
    return {"username": current_user.username, "role": current_user.role}
