from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, StudentRegistrationsDB, CreatedClassroomsDB, SessionDB
from datetime import datetime
import random, string

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_session_code(length: int = 6) -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

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

class SessionCreate(BaseModel):
    teacher_id: str
    class_id: int
    class_name: str
    subject_code: str
    session_code: Optional[str] = None
    latitude: float
    longitude: float
    radius_m: int = 100  # optional

# ----------------------
# Output schema (GET)
# ----------------------
class SessionResponse(BaseModel):
    id: int
    teacher_id: str
    class_id: int
    class_name: str
    subject_code: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    status: str
    session_code: Optional[str] = None
    latitude: float
    longitude: float
    radius_m: int = 100  # optional

    class Config:
        from_attributes = True

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

# Get all classrooms as List
@app.get('/get_classroom/{auth_id}', response_model=List[ClassroomCardResponse])
def get_classroom(auth_id: str, db: Session = Depends(get_db) ):
    classrooms = db.query(CreatedClassroomsDB).filter(CreatedClassroomsDB.auth_id == auth_id).all()
    return classrooms


# -------------------------------
# Create a new session
# -------------------------------
@app.post("/sessions/", response_model=SessionResponse)
def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    db_session = SessionDB(
        teacher_id=session.teacher_id,
        class_id=session.class_id,
        class_name=session.class_name,
        subject_code=session.subject_code,
        session_code=generate_session_code(),
        started_at=datetime.utcnow(),
        status="ongoing",
        latitude=session.latitude,
        longitude=session.longitude,
        radius_m=session.radius_m
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# -------------------------------
# Get all sessions
# -------------------------------
@app.get("/sessions/", response_model=List[SessionResponse])
def get_sessions(db: Session = Depends(get_db)):
    sessions = db.query(SessionDB).all()
    return sessions

# -------------------------------
# Get a single session by ID
# -------------------------------
@app.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(SessionDB).filter(SessionDB.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

# -------------------------------
# End a session
# -------------------------------
@app.put("/sessions/{session_id}/end", response_model=SessionResponse)
def end_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(SessionDB).filter(SessionDB.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.ended_at = datetime.utcnow()
    session.status = "ended"
    
    db.commit()
    db.refresh(session)
    return session

# -------------------------------
# Optional: Get ongoing sessions
# -------------------------------
@app.get("/sessions/ongoing", response_model=List[SessionResponse])
def get_ongoing_sessions(db: Session = Depends(get_db)):
    sessions = db.query(SessionDB).filter(SessionDB.status == "ongoing").all()
    return sessions