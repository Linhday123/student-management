from pydantic import BaseModel, Field
from typing import Optional, List

# --- Class Schemas ---
class ClassBase(BaseModel):
    class_name: str = Field(..., min_length=1, max_length=150)
    advisor: str = Field(..., min_length=1, max_length=100)

class ClassCreate(ClassBase):
    class_id: str = Field(..., min_length=1, max_length=50)

class ClassUpdate(ClassBase):
    pass

class ClassResponse(ClassBase):
    class_id: str

    class Config:
        from_attributes = True

# --- Student Schemas ---
class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    birth_year: int = Field(..., ge=1900, le=2100)
    major: str = Field(..., min_length=1, max_length=100)
    gpa: float = Field(..., ge=0.0, le=4.0)
    class_id: str = Field(..., min_length=1, max_length=50)

class StudentCreate(StudentBase):
    student_id: str = Field(..., min_length=1, max_length=50)

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    student_id: str
    class_name: Optional[str] = None
    advisor: Optional[str] = None

    class Config:
        from_attributes = True
