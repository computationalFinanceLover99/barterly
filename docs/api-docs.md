# barterly API Documentation

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs`

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new student account | No |
| POST | `/auth/login` | Login and receive JWT token | No |

#### POST /auth/register
```json
// Request
{
  "name": "Arfa Khan",
  "email": "arfa@nu.edu.pk",
  "university": "FAST-NUCES",
  "year": "Year 3",
  "password": "securepassword"
}

// Response 201
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_id": 1
}
```

#### POST /auth/login
```json
// Request
{
  "email": "arfa@nu.edu.pk",
  "password": "securepassword"
}

// Response 200
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_id": 1
}
```

---

### Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/me` | Get logged-in user's profile | Yes |
| PUT | `/profile/me` | Update profile, skills offered/sought | Yes |

#### PUT /profile/me
```json
// Request
{
  "bio": "CS student at FAST",
  "year": "Year 3",
  "skills_offered": ["Python", "FastAPI"],
  "skills_sought": ["UI/UX Design", "Machine Learning"]
}
```

---

### Users / Browse & Search

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Browse all users (optional ?search=keyword) | Yes |
| GET | `/users/{user_id}` | Get a specific user's public profile | Yes |

#### GET /users?search=python
Returns all users whose name, university, or offered skills match "python".
