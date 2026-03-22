# barterly

> *barterly is a peer-to-peer skill exchange platform where university students trade what they know for what they want to learn — no money, just knowledge.*

---

## Team Members

| Name | Roll Number | Role |
|------|-------------|------|
| Arfa | 24L-2616 | Project Lead / Backend Developer |
| Doureesha | 23L-2651 | Frontend Developer / QA |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Database | Azure SQL Edge (Microsoft SQL Server) running in Docker |
| Authentication | JWT (JSON Web Tokens) + bcrypt password hashing |
| ORM | SQLAlchemy |

---

## Features (Sprint 1)

- User Registration with university email
- User Login with JWT token authentication
- Profile setup — bio, year, skills offered, skills sought
- Browse all registered students
- Search students by name, skill, or university

---

## Folder Structure

```
barterly/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes
│   │   ├── auth.py          # JWT + bcrypt authentication
│   │   ├── database.py      # Azure SQL Edge connection
│   │   ├── models.py        # SQLAlchemy models
│   │   └── __init__.py
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── profile.jsx
│   │   │   └── Browse.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── schema.sql           # CREATE TABLE statements
│   └── seed.sql             # Sample data
├── docs/
│   ├── Iteration_1.docx
│   └── api-docs.md
└── README.md
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- Docker Desktop (for Azure SQL Edge database)

---

## How to Run

### Step 1 — Start the Database

Make sure Docker is running, then start the SQL container:

```bash
docker start sql
```

### Step 2 — Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your sa password and JWT secret

# Run the backend
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

API docs available at: `http://localhost:8000/docs`

### Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
DATABASE_URL=mssql+pyodbc://sa:YourPassword@localhost:1433/barterly?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

> Never commit your `.env` file. It is listed in `.gitignore`.

---

## Database Setup

Once the Docker container is running, create the database and tables:

```bash
# Create the barterly database
docker exec -it sql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourPassword" -Q "CREATE DATABASE barterly"

# Tables are created automatically when the backend starts
# To load sample data run database/seed.sql via SQLTools in VS Code
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new student |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/profile` | Get logged in user profile |
| PUT | `/profile` | Update profile and skills |
| GET | `/browse` | Browse all students |



