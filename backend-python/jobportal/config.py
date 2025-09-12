"""
Configuration management for the application.
Loads settings from environment variables defined in a .env file.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import validator
from typing import Optional
import os

class Settings(BaseSettings):
    """
    Defines the application's settings, loaded from environment variables.
    """
    # MongoDB settings
    MONGO_CONNECTION_STRING: str
    MONGO_DATABASE_NAME: str

    # JWT settings
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_ISSUER: Optional[str] = None
    JWT_AUDIENCE: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @validator("JWT_SECRET_KEY")
    def validate_jwt_secret_key(cls, v):
        if len(v) < 32:
            raise ValueError("JWT_SECRET_KEY must be at least 32 characters long for security")
        return v

    @validator("JWT_ALGORITHM")
    def validate_jwt_algorithm(cls, v):
        supported_algorithms = ["HS256", "HS384", "HS512"]
        if v not in supported_algorithms:
            raise ValueError(f"JWT_ALGORITHM must be one of {supported_algorithms}")
        return v

    @validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    def validate_token_expiry(cls, v):
        if v < 1 or v > 1440:  # 1 minute to 24 hours
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 1 and 1440")
        return v

# Create a single instance of the settings
settings = Settings()