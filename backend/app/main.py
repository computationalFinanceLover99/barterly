from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from .database import engine, get_db, Base
from . import models, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="barterly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    name: str
    email: str
    university: str
    year: Optional[str] = ""
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    bio: Optional[str] = ""
    year: Optional[str] = ""
    skills_offered: Optional[List[str]] = []
    skills_sought: Optional[List[str]] = []

@app.get("/")
def root():
    return {"message": "barterly API is running"}

@app.post("/auth/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = models.User(
        name=data.name, email=data.email,
        university=data.university, year=data.year,
        password_hash=auth.hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}

@app.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not auth.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = auth.create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}

@app.get("/profile/me")
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "university": current_user.university,
        "year": current_user.year,
        "bio": current_user.bio,
        "credits": current_user.credits,
        "trust_score": current_user.trust_score,
        "skills_offered": [s.skill_name for s in current_user.skills_offered],
        "skills_sought":  [s.skill_name for s in current_user.skills_sought],
    }

@app.put("/profile/me")
def update_profile(data: ProfileUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    current_user.bio  = data.bio
    current_user.year = data.year
    db.query(models.SkillOffered).filter(models.SkillOffered.user_id == current_user.id).delete()
    db.query(models.SkillSought).filter(models.SkillSought.user_id  == current_user.id).delete()
    for s in data.skills_offered:
        db.add(models.SkillOffered(user_id=current_user.id, skill_name=s))
    for s in data.skills_sought:
        db.add(models.SkillSought(user_id=current_user.id, skill_name=s))
    db.commit()
    return {"message": "Profile updated."}

@app.get("/users")
def browse_users(search: Optional[str] = None, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.id != current_user.id).all()
    if search:
        q = search.lower()
        users = [u for u in users if q in u.name.lower() or q in u.university.lower()
                 or any(q in s.skill_name.lower() for s in u.skills_offered)]
    return [{"id": u.id, "name": u.name, "university": u.university,
             "trust_score": u.trust_score,
             "skills_offered": [s.skill_name for s in u.skills_offered],
             "skills_sought":  [s.skill_name for s in u.skills_sought]} for u in users]