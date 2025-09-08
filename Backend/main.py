from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, StudentRegistrationsDB

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CreateUser(BaseModel):
    name : str
    auth_id : str
    email: str

class CreateNewStudent(CreateUser):
    enrollment_no: int
    face_image_path: str

class StudentResponse(CreateNewStudent):
    id: int
    class Config:
        form_attributes = True

@app.post('/register_student', response_model=CreateNewStudent)
def register_new_student(user: CreateNewStudent, db: Session = Depends(get_db) ):
    new_student = StudentRegistrationsDB(auth_id=user.auth_id, name=user.name, email=user.email, enrollment_no=user.enrollment_no, face_image_path=user.face_image_path)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student