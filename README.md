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

## Features

### Sprint 1 — User Auth & Skill Discovery
- User registration with university email
- Secure login with JWT token authentication
- Profile setup — bio, year, skills offered, skills sought
- Browse all registered students
- Search students by name, skill, or university

### Sprint 2 — Matching, Booking & Credits
- AI-based smart matching — students ranked by skill compatibility score
- Session booking — 4-step flow: select student, skill, duration, date/time
- View and cancel upcoming sessions
- Mark sessions as complete (tutor side)
- Credit wallet — view balance and full transaction history
- Credit enforcement — cannot book without sufficient credits
- Auto credit deduction on booking, refund on cancel, earn on completion

---

## Folder Structure

```
barterly/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes (auth, profile, matching, sessions, credits)
│   │   ├── auth.py          # JWT + bcrypt authentication
│   │   ├── database.py      # Azure SQL Edge connection
│   │   ├── models.py        # SQLAlchemy models
│   │   └── __init__.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── Matches.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Sessions.jsx
│   │   │   └── Credits.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── schema.sql
│   ├── schema_sprint2.sql
│   └── seed.sql
├── docs/
│   ├── Iteration_1.docx
│   ├── Iteration_2.docx
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

```bash
docker start sql
```

### Step 2 — Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### Step 3 — Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Pages

| URL | Description |
|-----|-------------|
| `/login` | Login page |
| `/register` | Register new account |
| `/profile` | View and edit your profile |
| `/browse` | Browse and search all students |
| `/matches` | AI-matched student recommendations |
| `/booking` | Book a session (4-step flow) |
| `/sessions` | View, cancel, complete sessions |
| `/credits` | Credit balance and transaction history |

---

## Environment Variables

Copy `.env.example` to `.env`:

```
DATABASE_URL=mssql+pyodbc://sa:YourPassword@localhost:1433/barterly?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

> Never commit your `.env` file. It is in `.gitignore`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new student |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/profile/me` | Get my profile |
| PUT | `/profile/me` | Update profile and skills |
| GET | `/users` | Browse all students |
| GET | `/users?search=keyword` | Search students |
| GET | `/users/{id}` | Get specific student profile |
| GET | `/matches` | Get AI-matched recommendations |
| POST | `/sessions` | Book a session |
| GET | `/sessions` | Get my sessions |
| PUT | `/sessions/{id}/cancel` | Cancel a session |
| PUT | `/sessions/{id}/complete` | Mark session as complete |
| GET | `/credits` | Get credit balance and history |
