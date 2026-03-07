from pydantic import BaseModel, Field

class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    birth_year: int = Field(..., ge=1900, le=2100)
    major: str = Field(..., min_length=1, max_length=100)
    gpa: float = Field(..., ge=0.0, le=4.0)

class StudentCreate(StudentBase):
    student_id: str = Field(..., min_length=1, max_length=50)

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    student_id: str

    class Config:
        from_attributes = True
