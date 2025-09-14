"""
Pydantic models for MongoDB documents.
These models define the structure of the data stored in the collections.
"""
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

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

# --- User Model ---
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    password: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linked_in_url: Optional[str] = None
    location: Optional[str] = None
    role: str = "User"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Job Application Model ---
class JobApplication(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    job_id: PyObjectId
    applicant_id: PyObjectId
    application_date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Job Model ---
class Job(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    company: str
    location: str
    posted_date: datetime = Field(default_factory=datetime.utcnow)
    recruiter_id: PyObjectId

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}