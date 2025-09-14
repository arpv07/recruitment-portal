"""
CRUD operations for MongoDB collections.
"""
from pymongo import errors
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

# ----------------------------
# USER CRUD OPERATIONS
# ----------------------------

async def get_user_by_email(db, email: str):
    try:
        return await db["users"].find_one({"email": email})
    except (errors.ConnectionFailure, errors.ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error fetching user")


async def get_user_by_username(db, username: str):
    try:
        return await db["users"].find_one({"username": username})
    except (errors.ConnectionFailure, errors.ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error fetching user")


async def get_user_by_phone(db, phone: str):
    try:
        return await db["users"].find_one({"phone": phone})
    except (errors.ConnectionFailure, errors.ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error while fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error fetching user")


async def get_all_users(db):
    try:
        cursor = db["users"].find({})
        return await cursor.to_list(length=None)
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching users")


async def create_user(db, user_data: dict):
    try:
        result = await db["users"].insert_one(user_data)
        new_user = await db["users"].find_one({"_id": result.inserted_id})
        return new_user
    except errors.DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except (errors.ConnectionFailure, errors.ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection error while creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")


async def update_user(db, user_id, user_data: dict):
    try:
        await db["users"].update_one({"_id": user_id}, {"$set": user_data})
        return await db["users"].find_one({"_id": user_id})
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating user")

# ... (rest of the file remains the same)

# ----------------------------
# JOB CRUD OPERATIONS
# ----------------------------

async def create_job(db, job_data: dict):
    """
    Insert a new job into the jobs collection.
    """
    try:
        result = await db["jobs"].insert_one(job_data)
        return {**job_data, "_id": result.inserted_id}
    except (errors.ConnectionFailure, errors.ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection error while creating job: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error creating job: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating job: {str(e)}")


async def get_jobs(db, filter_query: dict = None):
    """
    Retrieve all jobs with optional filtering.
    """
    try:
        cursor = db["jobs"].find(filter_query or {})
        return await cursor.to_list(length=None)
    except Exception as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching jobs")


async def get_job_by_id(db, job_id):
    """
    Retrieve a single job by its ID.
    """
    from bson import ObjectId
    try:
        return await db["jobs"].find_one({"_id": ObjectId(job_id)})
    except Exception as e:
        logger.error(f"Error fetching job by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching job")


async def delete_job(db, job_id):
    """
    Delete a job by its ID.
    """
    from bson import ObjectId
    try:
        result = await db["jobs"].delete_one({"_id": ObjectId(job_id)})
        return result.deleted_count
    except Exception as e:
        logger.error(f"Error deleting job: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting job")
