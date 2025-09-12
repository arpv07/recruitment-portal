"""
Main application file for the FastAPI Job Portal with MongoDB.
"""
from fastapi import FastAPI
from contextlib import asynccontextmanager
from jobportal.database import connect_to_mongo, close_mongo_connection
from jobportal.routers import jobs, users
from jobportal.config import settings
import os  # Added import
import warnings

# Warn if running in production without SSL
if settings.ENV == "production":
    warnings.warn("Ensure HTTPS is configured in production for security!")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager to handle application startup and shutdown events.
    Connects to the database on startup and disconnects on shutdown.
    """
    await connect_to_mongo()
    yield
    await close_mongo_connection()

# Initialize the FastAPI application with the lifespan manager
app = FastAPI(
    title="Job Portal API with MongoDB",
    description="A FastAPI application to manage job postings and applications using MongoDB. Requires JWT authentication for protected endpoints.",
    version="1.0.0",
    lifespan=lifespan
)

# Include the API routers
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(jobs.router, prefix="/api", tags=["Jobs"])

@app.get("/", tags=["Root"])
def read_root():
    """
    Root endpoint for the API.
    """
    return {"message": "Welcome to the Job Portal API with MongoDB!"}