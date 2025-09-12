"""
API router for job-related endpoints (MongoDB version).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging

from jobportal import crud, schemas, models, auth
from jobportal.database import get_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/jobs/", response_model=schemas.JobPublic, status_code=status.HTTP_201_CREATED)
async def create_job(
    job: schemas.JobCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(auth.get_current_active_recruiter)
):
    """
    Create a new job posting. Only accessible by recruiters.
    """
    try:
        created_job = await crud.create_job(db=db, job=job, recruiter_id=str(current_user['id']))
        return created_job
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/jobs/", response_model=List[schemas.JobPublic])
async def read_jobs(
    skip: int = 0,
    limit: int = 10,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve a list of all job postings.
    """
    try:
        jobs = await crud.get_jobs(db, skip=skip, limit=limit)
        return jobs
    except Exception as e:
        logger.error(f"Error retrieving jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/jobs/{job_id}", response_model=schemas.JobPublic)
async def read_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve a single job posting by its ID.
    """
    try:
        db_job = await crud.get_job_by_id(db, job_id=job_id)
        if db_job is None:
            raise HTTPException(status_code=404, detail="Job not found")
        return db_job
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/jobs/{job_id}/apply", response_model=schemas.JobApplicationPublic)
async def apply_for_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(auth.get_current_active_user)
):
    """
    Apply for a job. Accessible by any authenticated user.
    """
    try:
        job = await crud.get_job_by_id(db, job_id=job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="Job not found")
        application = await crud.create_job_application(db, job_id=job_id, applicant_id=str(current_user['id']))
        return application
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error applying for job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/jobs/{job_id}/applications", response_model=List[schemas.JobApplicationPublic])
async def get_job_applications(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(auth.get_current_active_recruiter)
):
    """
    Get all applications for a specific job. Only accessible by recruiters.
    """
    try:
        job = await crud.get_job_by_id(db, job_id=job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="Job not found")
        if str(job['recruiter_id']) != str(current_user['id']):
            raise HTTPException(status_code=403, detail="Not authorized to view these applications")
        applications = await crud.get_applications_for_job(db, job_id=job_id)
        return applications
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving applications for job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


