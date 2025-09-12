"""
CRUD operations for the MongoDB database.
"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from . import schemas, models
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
import pymongo

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- User CRUD ---
async def get_user_by_email(db: AsyncIOMotorDatabase, email: str):
    return await db["users"].find_one({"email": email})

async def create_user(db: AsyncIOMotorDatabase, user: schemas.UserCreate):
    try:
        hashed_password = get_password_hash(user.password)
        db_user = {
            "email": user.email,
            "hashed_password": hashed_password,
            "full_name": user.full_name,
            "is_recruiter": user.is_recruiter
        }
        result = await db["users"].insert_one(db_user)
        db_user["_id"] = result.inserted_id
        return db_user
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except pymongo.errors.ConnectionError:
        raise HTTPException(status_code=500, detail="Database connection error")

# --- Job CRUD ---
async def get_jobs(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 100):
    cursor = db["jobs"].find().skip(skip).limit(limit)
    return [models.Job(**job).model_dump(by_alias=True) async for job in cursor]

async def get_job_by_id(db: AsyncIOMotorDatabase, job_id: str):
    try:
        job = await db["jobs"].find_one({"_id": ObjectId(job_id)})
        return job if job is None else models.Job(**job).model_dump(by_alias=True)
    except ValueError:
        return None

async def create_job(db: AsyncIOMotorDatabase, job: schemas.JobCreate, recruiter_id: str):
    try:
        db_job = job.model_dump()
        db_job["recruiter_id"] = ObjectId(recruiter_id)
        db_job["posted_date"] = datetime.utcnow()
        result = await db["jobs"].insert_one(db_job)
        db_job["_id"] = result.inserted_id
        return models.Job(**db_job).model_dump(by_alias=True)
    except pymongo.errors.ConnectionError:
        raise HTTPException(status_code=500, detail="Database connection error")

# --- Job Application CRUD ---
async def create_job_application(db: AsyncIOMotorDatabase, job_id: str, applicant_id: str):
    try:
        db_application = {
            "job_id": ObjectId(job_id),
            "applicant_id": ObjectId(applicant_id),
            "application_date": datetime.utcnow()
        }
        result = await db["job_applications"].insert_one(db_application)
        db_application["_id"] = result.inserted_id
        return models.JobApplication(**db_application).model_dump(by_alias=True)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job or applicant ID")
    except pymongo.errors.ConnectionError:
        raise HTTPException(status_code=500, detail="Database connection error")

async def get_applications_for_job(db: AsyncIOMotorDatabase, job_id: str):
    try:
        cursor = db["job_applications"].find({"job_id": ObjectId(job_id)})
        return [models.JobApplication(**app).model_dump(by_alias=True) async for app in cursor]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job ID")

async def get_user_applications(db: AsyncIOMotorDatabase, user_id: str):
    try:
        cursor = db["job_applications"].find({"applicant_id": ObjectId(user_id)})
        return [models.JobApplication(**app).model_dump(by_alias=True) async for app in cursor]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID")