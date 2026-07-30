from fastapi import HTTPException
from sqlalchemy.orm import Session

from core.security import create_access_token, hash_password, verify_password
from models.user import User
from schemas.auth import LoginRequest, RegisterRequest


def register_user(db: Session, payload: RegisterRequest) -> User:
    email = payload.email.lower()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        # Clean 400 response for duplicate emails, never leaking which
        # field of the DB constraint tripped.
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = User(email=email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User:
    email = payload.email.lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return user


def issue_token(user: User) -> str:
    return create_access_token(user_id=str(user.id), email=user.email)


def get_or_create_oauth_user(db: Session, email: str, provider: str, oauth_id: str) -> User:
    email = email.lower()
    user = db.query(User).filter(User.email == email).first()

    if user:
        if not user.oauth_provider:
            user.oauth_provider = provider
            user.oauth_id = oauth_id
            db.commit()
            db.refresh(user)
        return user

    user = User(email=email, oauth_provider=provider, oauth_id=oauth_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
