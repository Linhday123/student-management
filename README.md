# Student Management Web Application

A full-stack student management application built with a React + Vite frontend and a FastAPI + SQLite backend.

## Architecture

- **Frontend**: React, Vite, TailwindCSS, React Router DOM, Axios, Lucide React (Icons).
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Uvicorn, SQLite.

## Project Structure

```text
student-management/
├── backend/
│   ├── requirements.txt      # Python dependencies
│   ├── database.py           # Database connection
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── crud.py               # Database interaction operations
│   ├── main.py               # FastAPI application entry point
│   └── students.db           # SQLite database (auto-generated)
└── frontend/
    ├── package.json          # Node dependencies
    ├── tailwind.config.js    # TailwindCSS configuration
    └── src/
        ├── api.js            # Axios configuration
        ├── App.jsx           # Main layout and routing
        ├── components/       # React components
        │   ├── StudentList.jsx
        │   └── StudentForm.jsx
        └── index.css         # Base styles
```

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload
```
The FastAPI backend will run on `http://127.0.0.1:8000`. Swagger API docs are available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

Run the Vite development server:
```bash
npm run dev
```
The React frontend will typically run on `http://127.0.0.1:5173`. Open this URL in your browser to interact with the application.

---

## Example API Responses

### Create Student (`POST /students`)
**Request Body:**
```json
{
  "student_id": "S1001",
  "name": "Alice Johnson",
  "birth_year": 2002,
  "major": "Computer Science",
  "gpa": 3.85
}
```
**Response (200 OK):**
```json
{
  "name": "Alice Johnson",
  "birth_year": 2002,
  "major": "Computer Science",
  "gpa": 3.85,
  "student_id": "S1001"
}
```

### Get All Students (`GET /students`)
**Response (200 OK):**
```json
[
  {
    "name": "Alice Johnson",
    "birth_year": 2002,
    "major": "Computer Science",
    "gpa": 3.85,
    "student_id": "S1001"
  }
]
```

### Update Student (`PUT /students/S1001`)
**Request Body:**
```json
{
  "name": "Alice Smith",
  "birth_year": 2002,
  "major": "Software Engineering",
  "gpa": 3.9
}
```
**Response (200 OK):**
```json
{
  "name": "Alice Smith",
  "birth_year": 2002,
  "major": "Software Engineering",
  "gpa": 3.9,
  "student_id": "S1001"
}
```

### Delete Student (`DELETE /students/S1001`)
**Response (200 OK):**
```json
{
  "message": "Student deleted successfully"
}
```
