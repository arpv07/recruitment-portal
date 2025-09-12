"""
MongoDB database configuration and connection management using Motor.
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from jobportal.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    """
    A class to manage the MongoDB connection and provide a database instance.
    """
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

# Instantiate the MongoDB manager
mongodb = MongoDB()

async def connect_to_mongo():
    """
    Establishes the connection to the MongoDB server.
    This function is called during application startup.
    """
    logger.info("Connecting to MongoDB...")
    try:
        mongodb.client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
        mongodb.db = mongodb.client[settings.MONGO_DATABASE_NAME]
        # Create indexes
        await mongodb.db["users"].create_index("email", unique=True)
        await mongodb.db["jobs"].create_index("recruiter_id")
        await mongodb.db["job_applications"].create_index([("job_id", 1), ("applicant_id", 1)])
        logger.info("Successfully connected to MongoDB!")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

async def close_mongo_connection():
    """
    Closes the MongoDB connection.
    This function is called during application shutdown.
    """
    logger.info("Closing MongoDB connection...")
    if mongodb.client:
        mongodb.client.close()
        logger.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function to get the database instance for API endpoints.
    """
    if not mongodb.db:
        raise RuntimeError("Database not initialized")
    return mongodb.db