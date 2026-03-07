from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud
from database import engine, get_db

# Create table if not exists
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

# Setup CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/students", response_model=List[schemas.StudentResponse])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    students = crud.get_students(db, skip=skip, limit=limit)
    return students

@app.post("/students", response_model=schemas.StudentResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student.student_id)
    if db_student:
        raise HTTPException(status_code=400, detail="Student ID already registered")
    return crud.create_student(db=db, student=student)

@app.put("/students/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: str, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return crud.update_student(db=db, student_id=student_id, student_update=student)

@app.delete("/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    crud.delete_student(db=db, student_id=student_id)
    return {"message": "Student deleted successfully"}
