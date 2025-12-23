from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    google_sub: str
    picture: Optional[str] = None

class User(UserBase):
    id: int
    picture: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True # updated for Pydantic v2

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    drive_folder_id: Optional[str] = None

class Project(ProjectBase):
    id: int
    owner_id: int
    drive_folder_id: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RecordingBase(BaseModel):
    pass

class Recording(RecordingBase):
    id: int
    project_id: int
    group_id: Optional[int]
    drive_file_id: Optional[str]
    transcript_text: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
