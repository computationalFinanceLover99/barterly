from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
 
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
 
# ── Schemas ───────────────────────────────────────────────────────────────────
 
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
 
class BookingRequest(BaseModel):
    tutor_id: int
    skill: str
    scheduled_at: str
    duration_min: int
 
# ── Credit cost helper ────────────────────────────────────────────────────────
 
def calc_credits(duration_min: int) -> int:
    costs = {15: 10, 30: 20, 45: 30, 60: 40}
    return costs.get(duration_min, 30)
 
# ── Auth routes ───────────────────────────────────────────────────────────────
 
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
 
# ── Profile routes ────────────────────────────────────────────────────────────
 
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
 
# ── Browse & Search ───────────────────────────────────────────────────────────
 
@app.get("/users")
def browse_users(search: Optional[str] = None, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.id != current_user.id).all()
    if search:
        q = search.lower()
        users = [u for u in users if q in u.name.lower() or q in u.university.lower()
                 or any(q in s.skill_name.lower() for s in u.skills_offered)]
    return [{"id": u.id, "name": u.name, "university": u.university,
             "trust_score": u.trust_score, "credits": u.credits,
             "skills_offered": [s.skill_name for s in u.skills_offered],
             "skills_sought":  [s.skill_name for s in u.skills_sought]} for u in users]
 
@app.get("/users/{user_id}")
def get_user(user_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "id": user.id, "name": user.name, "university": user.university,
        "year": user.year, "bio": user.bio, "trust_score": user.trust_score,
        "credits": user.credits,
        "skills_offered": [s.skill_name for s in user.skills_offered],
        "skills_sought":  [s.skill_name for s in user.skills_sought],
    }
 
# ── Matching ──────────────────────────────────────────────────────────────────
 
@app.get("/matches")
def get_matches(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    my_offered = {s.skill_name.lower() for s in current_user.skills_offered}
    my_sought  = {s.skill_name.lower() for s in current_user.skills_sought}
 
    users = db.query(models.User).filter(models.User.id != current_user.id).all()
    matches = []
 
    for u in users:
        their_offered = {s.skill_name.lower() for s in u.skills_offered}
        their_sought  = {s.skill_name.lower() for s in u.skills_sought}
 
        # I can teach them something they want
        i_can_teach = len(my_offered & their_sought)
        # They can teach me something I want
        they_can_teach = len(their_offered & my_sought)
 
        if i_can_teach == 0 and they_can_teach == 0:
            continue
 
        # Simple compatibility score out of 100
        total = max(len(my_offered), 1) + max(len(my_sought), 1)
        score = round(((i_can_teach + they_can_teach) / total) * 100)
        score = min(score, 99)  # cap at 99
 
        matches.append({
            "id": u.id,
            "name": u.name,
            "university": u.university,
            "trust_score": u.trust_score,
            "skills_offered": [s.skill_name for s in u.skills_offered],
            "skills_sought":  [s.skill_name for s in u.skills_sought],
            "compatibility_score": score,
            "i_can_teach": list(my_offered & their_sought),
            "they_can_teach": list(their_offered & my_sought),
        })
 
    matches.sort(key=lambda x: x["compatibility_score"], reverse=True)
    return matches
 
# ── Sessions ──────────────────────────────────────────────────────────────────
 
@app.post("/sessions", status_code=201)
def book_session(data: BookingRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    tutor = db.query(models.User).filter(models.User.id == data.tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found.")
 
    if current_user.id == data.tutor_id:
        raise HTTPException(status_code=400, detail="You cannot book a session with yourself.")
 
    cost = calc_credits(data.duration_min)
 
    if current_user.credits < cost:
        raise HTTPException(status_code=400, detail=f"Not enough credits. You need {cost} credits but have {current_user.credits}.")
 
    try:
        scheduled = datetime.fromisoformat(data.scheduled_at)
    except:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DDTHH:MM:SS")
 
    # Deduct credits from learner
    current_user.credits -= cost
 
    # Create session
    session = models.Session(
        learner_id=current_user.id,
        tutor_id=data.tutor_id,
        skill=data.skill,
        scheduled_at=scheduled,
        duration_min=data.duration_min,
        credits_cost=cost,
        status="scheduled"
    )
    db.add(session)
    db.flush()
 
    # Log credit transaction
    db.add(models.CreditTransaction(
        user_id=current_user.id,
        session_id=session.id,
        amount=cost,
        type="spend",
        note=f"Booked session: {data.skill} with {tutor.name}"
    ))
 
    db.commit()
    db.refresh(session)
 
    return {
        "message": "Session booked successfully.",
        "session_id": session.id,
        "skill": session.skill,
        "scheduled_at": str(session.scheduled_at),
        "duration_min": session.duration_min,
        "credits_cost": cost,
        "your_new_balance": current_user.credits,
        "tutor": tutor.name,
    }
 
@app.get("/sessions")
def get_my_sessions(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    as_learner = db.query(models.Session).filter(models.Session.learner_id == current_user.id).all()
    as_tutor   = db.query(models.Session).filter(models.Session.tutor_id   == current_user.id).all()
 
    def fmt(s, role):
        other_id = s.tutor_id if role == "learner" else s.learner_id
        other = db.query(models.User).filter(models.User.id == other_id).first()
        return {
            "id": s.id,
            "skill": s.skill,
            "role": role,
            "with": other.name if other else "Unknown",
            "scheduled_at": str(s.scheduled_at),
            "duration_min": s.duration_min,
            "credits_cost": s.credits_cost,
            "status": s.status,
        }
 
    sessions = [fmt(s, "learner") for s in as_learner] + [fmt(s, "tutor") for s in as_tutor]
    sessions.sort(key=lambda x: x["scheduled_at"])
    return sessions
 
@app.put("/sessions/{session_id}/cancel")
def cancel_session(session_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only cancel your own sessions.")
    if session.status != "scheduled":
        raise HTTPException(status_code=400, detail="Only scheduled sessions can be cancelled.")
 
    session.status = "cancelled"
    current_user.credits += session.credits_cost
 
    db.add(models.CreditTransaction(
        user_id=current_user.id,
        session_id=session.id,
        amount=session.credits_cost,
        type="earn",
        note=f"Refund: cancelled session {session.skill}"
    ))
 
    db.commit()
    return {"message": "Session cancelled. Credits refunded.", "new_balance": current_user.credits}
 
@app.put("/sessions/{session_id}/complete")
def complete_session(session_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.tutor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the tutor can mark a session as complete.")
    if session.status != "scheduled":
        raise HTTPException(status_code=400, detail="Only scheduled sessions can be completed.")
 
    session.status = "completed"
    session.attended = True
 
    # Pay tutor
    tutor = db.query(models.User).filter(models.User.id == session.tutor_id).first()
    tutor.credits += session.credits_cost
 
    db.add(models.CreditTransaction(
        user_id=tutor.id,
        session_id=session.id,
        amount=session.credits_cost,
        type="earn",
        note=f"Earned: taught {session.skill}"
    ))
 
    db.commit()
    return {"message": "Session marked complete. Credits earned.", "new_balance": tutor.credits}
 
# ── Credits ───────────────────────────────────────────────────────────────────
 
@app.get("/credits")
def get_credits(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    txns = db.query(models.CreditTransaction).filter(
        models.CreditTransaction.user_id == current_user.id
    ).order_by(models.CreditTransaction.created_at.desc()).all()
 
    return {
        "balance": current_user.credits,
        "transactions": [{
            "id": t.id,
            "amount": t.amount,
            "type": t.type,
            "note": t.note,
            "created_at": str(t.created_at),
        } for t in txns]
    }