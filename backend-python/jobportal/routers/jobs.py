"""
Router for job-related endpoints in the Job Portal API.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from jobportal.database import get_database
from jobportal import crud, auth, schemas
from jobportal.models import User, Job
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

router = APIRouter()

@router.post("/jobs/", response_model=schemas.JobPublic, status_code=status.HTTP_201_CREATED)
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

@router.get("/jobs/", response_model=List[schemas.JobPublic])
async def get_jobs(db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve all job postings.
    """
    return await crud.get_jobs(db)

@router.get("/jobs/{job_id}", response_model=schemas.JobPublic)
async def get_job_by_id(job_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve a single job by its ID.
    """
    job = await crud.get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
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