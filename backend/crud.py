from sqlalchemy.orm import Session
import models, schemas

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
        gpa=student.gpa
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
        db.commit()
        db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: str):
    db_student = get_student(db, student_id)
    if db_student:
        db.delete(db_student)
        db.commit()
    return db_student
