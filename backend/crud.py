from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas

# --- Class CRUD ---
def get_class(db: Session, class_id: str):
    return db.query(models.Class).filter(models.Class.class_id == class_id).first()

def get_classes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Class).offset(skip).limit(limit).all()

def create_class(db: Session, class_data: schemas.ClassCreate):
    db_class = models.Class(
        class_id=class_data.class_id,
        class_name=class_data.class_name,
        advisor=class_data.advisor
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

def update_class(db: Session, class_id: str, class_update: schemas.ClassUpdate):
    db_class = get_class(db, class_id)
    if db_class:
        db_class.class_name = class_update.class_name
        db_class.advisor = class_update.advisor
        db.commit()
        db.refresh(db_class)
    return db_class

def delete_class(db: Session, class_id: str):
    db_class = get_class(db, class_id)
    if db_class:
        db.delete(db_class)
        db.commit()
    return db_class


# --- Student CRUD ---
def get_student(db: Session, student_id: str):
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        student_id=student.student_id,
        name=student.name,
        birth_year=student.birth_year,
        major=student.major,
        gpa=student.gpa,
        class_id=student.class_id
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: str, student_update: schemas.StudentUpdate):
    db_student = get_student(db, student_id)
    if db_student:
        db_student.name = student_update.name
        db_student.birth_year = student_update.birth_year
        db_student.major = student_update.major
        db_student.gpa = student_update.gpa
        db_student.class_id = student_update.class_id
        db.commit()
        db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: str):
    db_student = get_student(db, student_id)
    if db_student:
        db.delete(db_student)
        db.commit()
    return db_student


# --- Statistics ---
def get_statistics(db: Session):
    total_students = db.query(models.Student).count()
    
    avg_gpa = db.query(func.avg(models.Student.gpa)).scalar() or 0.0
    
    students_by_major_raw = db.query(
        models.Student.major, func.count(models.Student.student_id)
    ).group_by(models.Student.major).all()
    students_by_major = [{"major": r[0], "count": r[1]} for r in students_by_major_raw]

    students_by_class_raw = db.query(
        models.Class.class_name, func.count(models.Student.student_id)
    ).outerjoin(models.Student).group_by(models.Class.class_name).all()
    students_by_class = [{"class_name": r[0] if r[0] else "N/A", "count": r[1]} for r in students_by_class_raw]
    
    return {
        "total_students": total_students,
        "average_gpa": round(avg_gpa, 2),
        "students_by_major": students_by_major,
        "students_by_class": students_by_class
    }
