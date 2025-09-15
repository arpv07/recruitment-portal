"""
Router for job-related endpoints in the Job Portal API (MongoDB, async).
"""
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from jobportal.database import get_database
from jobportal import crud, auth, schemas
from jobportal.models import User

router = APIRouter()

# ----------------------------
# CREATE A NEW JOB
# ----------------------------
@router.post("/", response_model=schemas.JobPublic, status_code=status.HTTP_201_CREATED)
async def create_job(
    job: schemas.JobCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: User = Depends(auth.role_checker(["Admin", "SuperAdmin"])),
):
    """
    Create a new job posting.
    """
    job_dict = job.dict()
    job_dict["recruiter_id"] = current_user.id
    new_job = await crud.create_job(db, job_dict)
    return new_job

# ----------------------------
# GET ALL JOBS
# ----------------------------
@router.get("/", response_model=List[schemas.JobPublic])
async def get_jobs(db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve all job postings.
    """
    jobs = await crud.get_jobs(db)
    return jobs

# ----------------------------
# GET JOB BY ID
# ----------------------------
@router.get("/{job_id}", response_model=schemas.JobPublic)
async def get_job_by_id(job_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve a single job by its ID.
    """
    job = await crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

# ----------------------------
# UPDATE JOB
# ----------------------------
@router.put("/{job_id}", response_model=schemas.JobPublic)
async def update_job(
    job_id: str,
    job: schemas.JobCreate = Body(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: User = Depends(auth.role_checker(["Admin", "SuperAdmin"])),
):
    """
    Update an existing job posting.
    """
    updated_job = await crud.update_job(db, job_id, job.dict())
    if not updated_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return updated_job

# ----------------------------
# DELETE JOB
# ----------------------------
@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: User = Depends(auth.role_checker(["Admin", "SuperAdmin"])),
):
    """
    Delete a job posting.
    """
    deleted_count = await crud.delete_job(db, job_id)
    if deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
