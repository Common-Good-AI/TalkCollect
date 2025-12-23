from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, deps

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

# TODO: Add dependency to verify current active user (from JWT/Session)
# For now, we will pass user_id as a query param or header for testing, 
# or implemented a proper get_current_user dependency.
# Since we haven't implemented full JWT verification middleware yet, I'll add a mock dependency.

def get_current_user_id():
    # Placeholder: In real app this comes from token
    # For now, hardcode to 1 (Assuming first user) or from header
    return 1

@router.get("/", response_model=List[schemas.Project])
def read_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(get_current_user_id)
):
    projects = crud.get_projects(db, user_id=user_id)
    return projects

@router.post("/", response_model=schemas.Project)
def create_project(
    project: schemas.ProjectCreate, 
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(get_current_user_id)
):
    return crud.create_project(db=db, project=project, user_id=user_id)

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    project_id: int, 
    db: Session = Depends(deps.get_db)
):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.post("/{project_id}/groups", response_model=schemas.Group)
def create_group_for_project(
    project_id: int, 
    group: schemas.GroupCreate, 
    db: Session = Depends(deps.get_db)
):
    return crud.create_group(db=db, group=group, project_id=project_id)

@router.get("/{project_id}/groups", response_model=List[schemas.Group])
def read_groups(
    project_id: int, 
    db: Session = Depends(deps.get_db)
):
    return crud.get_groups(db, project_id=project_id)
