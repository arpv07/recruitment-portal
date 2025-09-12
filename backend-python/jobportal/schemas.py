"""
Pydantic schemas for data validation and serialization.
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

# This class helps Pydantic work with MongoDB's ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, *args, **kwargs):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )

# --- Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    is_recruiter: bool = False

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v) or not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one uppercase letter and one digit")
        return v

class UserPublic(UserBase):
    id: PyObjectId = Field(..., alias="_id")
    is_recruiter: bool

    class Config:
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    company: str
    location: str

class JobCreate(JobBase):
    pass

class JobPublic(JobBase):
    id: PyObjectId = Field(..., alias="_id")
    posted_date: datetime
    recruiter_id: PyObjectId

    class Config:
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

# --- Job Application Schemas ---
class JobApplicationBase(BaseModel):
    job_id: PyObjectId
    applicant_id: PyObjectId

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationPublic(JobApplicationBase):
    id: PyObjectId = Field(..., alias="_id")
    application_date: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}