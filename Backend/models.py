from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./database.db"  # stored in project root

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class StudentRegistrationsDB(Base):
    __tablename__ = "Student_Registrations"

    id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(String, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    enrollment_no = Column(Integer, index=True)      
    face_image_path = Column(String, index=True)

class CreatedClassroomsDB(Base):
    __tablename__ = "Created_Classrooms"

    id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(String, index=True)
    class_name = Column(String, index=True)
    subject_code = Column(String, index=True)
    total_student_count = Column(Integer, index=True)      

class TeacherRegistrationsDB(Base):
    __tablename__ = "Teacher_Registrations"

    id = Column(Integer, primary_key=True, index=True)      
    name = Column(String, index=True)


# Create tables
Base.metadata.create_all(bind=engine)

