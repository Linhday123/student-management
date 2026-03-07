from sqlalchemy import Column, Integer, String, Float
from database import Base

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    birth_year = Column(Integer)
    major = Column(String)
    gpa = Column(Float)
