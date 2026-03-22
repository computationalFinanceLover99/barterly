from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    university    = Column(String(150), nullable=False)
    year          = Column(String(20))
    bio           = Column(Text, default="")
    password_hash = Column(String(255), nullable=False)
    credits       = Column(Integer, default=100)
    trust_score   = Column(Float, default=0.0)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, server_default=func.now())

    skills_offered      = relationship("SkillOffered", back_populates="user")
    skills_sought       = relationship("SkillSought",  back_populates="user")
    sessions_as_learner = relationship("Session", foreign_keys="Session.learner_id", back_populates="learner")
    sessions_as_tutor   = relationship("Session", foreign_keys="Session.tutor_id",   back_populates="tutor")

class SkillOffered(Base):
    __tablename__ = "skills_offered"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category   = Column(String(50))
    user       = relationship("User", back_populates="skills_offered")

class SkillSought(Base):
    __tablename__ = "skills_sought"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category   = Column(String(50))
    user       = relationship("User", back_populates="skills_sought")

class Session(Base):
    __tablename__ = "sessions"
    id           = Column(Integer, primary_key=True, index=True)
    learner_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill        = Column(String(100), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    duration_min = Column(Integer, nullable=False)
    credits_cost = Column(Integer, nullable=False)
    status       = Column(String(20), default="scheduled")
    attended     = Column(Boolean, default=False)
    on_time      = Column(Boolean, default=False)
    created_at   = Column(DateTime, server_default=func.now())
    learner      = relationship("User", foreign_keys=[learner_id], back_populates="sessions_as_learner")
    tutor        = relationship("User", foreign_keys=[tutor_id],   back_populates="sessions_as_tutor")

class Review(Base):
    __tablename__ = "reviews"
    id                  = Column(Integer, primary_key=True, index=True)
    session_id          = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    reviewer_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewee_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    overall_rating      = Column(Integer, nullable=False)
    quality_score       = Column(Integer)
    punctuality_score   = Column(Integer)
    preparation_score   = Column(Integer)
    communication_score = Column(Integer)
    comment             = Column(Text, default="")
    created_at          = Column(DateTime, server_default=func.now())
