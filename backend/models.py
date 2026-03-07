from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Class(Base):
    __tablename__ = "classes"

    class_id = Column(String, primary_key=True, index=True)
    class_name = Column(String, index=True)
    advisor = Column(String)

    # Relationship to students
    students = relationship("Student", back_populates="student_class")

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    birth_year = Column(Integer)
    major = Column(String)
    gpa = Column(Float)
    
    # Foreign key to classes
    class_id = Column(String, ForeignKey("classes.class_id"))

    # Relationship to Class
    student_class = relationship("Class", back_populates="students")

    @property
    def class_name(self):
        return self.student_class.class_name if self.student_class else None
    
    @property
    def advisor(self):
        return self.student_class.advisor if self.student_class else None
