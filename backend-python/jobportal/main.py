from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import auth, models, schemas, crud
from .database import SessionLocal, engine
from .routers import users, jobs, parser

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Middleware
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(parser.router, prefix="/api", tags=["parser"])


# ✅ ADDED: Dashboard Endpoint
@app.get("/api/dashboard", dependencies=[Depends(auth.get_current_user)])
async def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Provides aggregated data for the recruiter dashboard.
    """
    try:
        total_jobs = db.query(models.Job).count()
        active_jobs = db.query(models.Job).filter(models.Job.status == 'active').count()
        # These are placeholders; you'll need an Application model to implement these properly.
        total_applications = 125 
        reviewed_applications = 45
        rejected_applications = 15
        
        # Placeholder for candidates per job
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}",
        )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Job Portal API"}