from sqlalchemy.orm import Session
import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_google_sub(db: Session, google_sub: str):
    return db.query(models.User).filter(models.User.google_sub == google_sub).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        email=user.email,
        name=user.name,
        google_sub=user.google_sub,
        picture=user.picture
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_projects(db: Session, user_id: int):
    return db.query(models.Project).filter(models.Project.owner_id == user_id).all()

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    db_project = models.Project(
        name=project.name,
        owner_id=user_id,
        drive_folder_id=project.drive_folder_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_groups(db: Session, project_id: int):
    return db.query(models.Group).filter(models.Group.project_id == project_id).all()

def create_group(db: Session, group: schemas.GroupCreate, project_id: int):
    db_group = models.Group(
        name=group.name,
        project_id=project_id
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group
