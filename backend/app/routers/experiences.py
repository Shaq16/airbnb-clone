from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/api/experiences",
    tags=["experiences"],
)

@router.get("", response_model=List[schemas.ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).all()

@router.get("/{experience_id}", response_model=schemas.ExperienceResponse)
def get_experience(experience_id: int, db: Session = Depends(get_db)):
    experience = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found")
    return experience
