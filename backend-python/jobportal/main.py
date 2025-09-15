from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import logging

from . import auth, models, schemas, crud
from .database import connect_to_mongo, close_mongo_connection, get_database
from .routers import users, jobs, parser
from .routers import auth_router




logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Startup & Shutdown Events ---
@app.on_event("startup")
async def startup_db_client():
    """
    Establish MongoDB connection at app startup.
    """
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    """
    Close MongoDB connection on shutdown.
    """
    await close_mongo_connection()

# --- Dashboard Endpoint ---
@app.get("/api/dashboard", dependencies=[Depends(auth.get_current_user)])
async def get_dashboard_data(db=Depends(get_database)):
    """
    Provides aggregated data for the recruiter dashboard.
    """
    try:
        total_jobs = await db["jobs"].count_documents({})
        active_jobs = await db["jobs"].count_documents({"status": "active"})

        # Placeholder stats - replace with real aggregation when you have applications collection
        total_applications = 125
        reviewed_applications = 45
        rejected_applications = 15

        candidates_per_job = [
            {"name": "React Developer", "applications": 30, "priority": "high"},
            {"name": "Node.js Engineer", "applications": 20, "priority": "medium"},
            {"name": "QA Tester", "applications": 15, "priority": "low"},
        ]

        return {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "reviewed_applications": reviewed_applications,
            "rejected_applications": rejected_applications,
            "candidates_per_job": candidates_per_job,
        }
    except Exception as e:
        logger.error(f"Error while fetching dashboard data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}",
        )

# --- Root Endpoint ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Job Portal API"}

# --- Include Routers ---
app.include_router(auth_router.router, prefix="/api", tags=["authentication"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(parser.router, prefix="/api", tags=["parser"])
