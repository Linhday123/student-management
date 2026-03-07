from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any

import models, schemas, crud
from database import engine, get_db, SessionLocal

# Create table if not exists
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

# Setup CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Startup Event to Seed Data ---
@app.on_event("startup")
def seed_initial_classes():
    db = SessionLocal()
    try:
        class_count = db.query(models.Class).count()
        if class_count == 0:
            mock_classes = [
                {"class_id": "C01", "class_name": "Khoa học máy tính 1", "advisor": "Nguyễn Văn An"},
                {"class_id": "C02", "class_name": "Khoa học máy tính 2", "advisor": "Trần Thị Bình"},
                {"class_id": "C03", "class_name": "Kỹ thuật phần mềm 1", "advisor": "Lê Văn Công"},
                {"class_id": "C04", "class_name": "Hệ thống thông tin 1", "advisor": "Phạm Thị Dung"},
                {"class_id": "C05", "class_name": "Trí tuệ nhân tạo 1", "advisor": "Hoàng Văn Em"}
            ]
            for c_data in mock_classes:
                db_class = models.Class(**c_data)
                db.add(db_class)
            db.commit()
            print("Successfully seeded initial 5 class records.")
    finally:
        db.close()

# --- Statistics Route ---
@app.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_statistics(db)

# --- Class Routes ---
@app.get("/classes", response_model=List[schemas.ClassResponse])
def read_classes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_classes(db, skip=skip, limit=limit)

@app.get("/classes/{class_id}", response_model=schemas.ClassResponse)
def read_class(class_id: str, db: Session = Depends(get_db)):
    db_class = crud.get_class(db, class_id=class_id)
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class

@app.post("/classes", response_model=schemas.ClassResponse)
def create_class(class_data: schemas.ClassCreate, db: Session = Depends(get_db)):
    db_class = crud.get_class(db, class_id=class_data.class_id)
    if db_class:
        raise HTTPException(status_code=400, detail="Class ID already registered")
    return crud.create_class(db=db, class_data=class_data)

@app.put("/classes/{class_id}", response_model=schemas.ClassResponse)
def update_class(class_id: str, class_data: schemas.ClassUpdate, db: Session = Depends(get_db)):
    db_class = crud.get_class(db, class_id)
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return crud.update_class(db=db, class_id=class_id, class_update=class_data)

@app.delete("/classes/{class_id}")
def delete_class(class_id: str, db: Session = Depends(get_db)):
    db_class = crud.get_class(db, class_id)
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    crud.delete_class(db=db, class_id=class_id)
    return {"message": "Class deleted successfully"}


# --- Student Routes ---
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
