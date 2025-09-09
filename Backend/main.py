from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, StudentRegistrationsDB, CreatedClassroomsDB

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

class ClassroomCard(BaseModel):
    auth_id : str
    class_name : str
    subject_code : str
    total_student_count : int

class ClassroomCardResponse(ClassroomCard):
    id: int
    class Config:
        form_attributes = True

# Register new student
@app.post('/register_student', response_model=StudentResponse)
def register_new_student(user: CreateNewStudent, db: Session = Depends(get_db) ):
    new_student = StudentRegistrationsDB(auth_id=user.auth_id, name=user.name, email=user.email, enrollment_no=user.enrollment_no, face_image_path=user.face_image_path)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

# Add new classroom
@app.post('/create_classroom', response_model=ClassroomCardResponse)
def create_classroom(user: ClassroomCard, db: Session = Depends(get_db) ):
    new_classroom = CreatedClassroomsDB(auth_id=user.auth_id, class_name=user.class_name, subject_code=user.subject_code, total_student_count=user.total_student_count)
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    return new_classroom
