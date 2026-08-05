import logging

from sqlalchemy import or_
from sqlalchemy.orm import Session

from fastapi import HTTPException
from models.review import Review
from models.user import User
from schemas.review import ReviewCreate, ReviewUpdate

logger = logging.getLogger(__name__)


def _serialize(review: Review) -> dict:
    return {
        "id": review.id,
        "guest_name": review.guest_name,
        "reviews": review.reviews,
        "sentiments": review.sentiments,
        "theme": review.theme,
    }


def list_reviews(db: Session, owner: User, limit: int = 50, offset: int = 0):
    reviews = (
        db.query(Review)
        .filter(Review.owner_id == owner.id)
        .order_by(Review.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [_serialize(r) for r in reviews]


def search_reviews(db: Session, owner: User, q: str):
    like = f"%{q}%"
    reviews = (
        db.query(Review)
        .filter(
            Review.owner_id == owner.id,
            or_(Review.guest_name.ilike(like), Review.reviews.ilike(like)),
        )
        .order_by(Review.id.desc())
        .all()
    )
    return [_serialize(r) for r in reviews]


def get_review(db: Session, owner: User, review_id: int):
    review = (
        db.query(Review)
        .filter(Review.id == review_id, Review.owner_id == owner.id)
        .first()
    )
    return _serialize(review) if review else None


def create_review(db: Session, owner: User, review: ReviewCreate):
    # Later AI will generate these
    sentiment = "Neutral"
    theme = "General"

    db_review = Review(
        guest_name=review.guest_name,
        reviews=review.reviews,
        sentiments=sentiment,
        theme=theme,
        owner_id=owner.id,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    logger.info("Created review for guest_name=%s owner=%s", review.guest_name, owner.id)
    return _serialize(db_review)


def _get_owned_or_403(db: Session, owner: User, review_id: int) -> Review:
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        return None
    if db_review.owner_id != owner.id:
        # Exists, but belongs to someone else — don't leak that it exists.
        raise HTTPException(status_code=404, detail="Review not found")
    return db_review


def update_review(db: Session, owner: User, review_id: int, updated_review: ReviewUpdate):
    db_review = _get_owned_or_403(db, owner, review_id)
    if not db_review:
        return None

    db_review.guest_name = updated_review.guest_name
    db_review.reviews = updated_review.reviews
    db.commit()
    db.refresh(db_review)
    return _serialize(db_review)


def delete_review(db: Session, owner: User, review_id: int) -> bool:
    db_review = _get_owned_or_403(db, owner, review_id)
    if not db_review:
        return False

    db.delete(db_review)
    db.commit()
    return True
