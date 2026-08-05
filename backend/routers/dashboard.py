from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from services import dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", status_code=200)
def summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Aggregated, real-time review analytics — scoped to the logged-in user."""
    return dashboard_service.get_summary(db, current_user)
