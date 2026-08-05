from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from schemas.review import ReviewCreate, ReviewUpdate
from services import review_service

# Every route below requires a valid JWT (Authorization: Bearer <token>),
# and every query is scoped to the logged-in user's own reviews.
router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("", status_code=200)
def get_reviews(
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return review_service.list_reviews(db, current_user, limit=limit, offset=offset)


@router.get("/search", status_code=200)
def search_reviews(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return review_service.search_reviews(db, current_user, q)


@router.get("/{review_id}", status_code=200)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = review_service.get_review(db, current_user, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.post("", status_code=201)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return review_service.create_review(db, current_user, review)


@router.put("/{review_id}", status_code=200)
def update_review(
    review_id: int,
    updated_review: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = review_service.update_review(db, current_user, review_id, updated_review)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


from schemas.review import RegenerateResponseRequest, ReviewCreate, ReviewUpdate


@router.post("/{review_id}/regenerate-response", status_code=200)
def regenerate_ai_response(
    review_id: int,
    payload: RegenerateResponseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = review_service.regenerate_ai_response(db, current_user, review_id, tone=payload.tone)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = review_service.delete_review(db, current_user, review_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Review not found")
    return
