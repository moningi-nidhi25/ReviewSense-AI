from fastapi import APIRouter, HTTPException, Query
from schemas.review import ReviewCreate, ReviewUpdate
from services import review_service

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("", status_code=200)
def get_reviews(limit: int = Query(50, le=200), offset: int = Query(0, ge=0)):
    return review_service.list_reviews(limit=limit, offset=offset)


@router.get("/search", status_code=200)
def search_reviews(q: str):
    return review_service.search_reviews(q)


@router.get("/{review_id}", status_code=200)
def get_review(review_id: int):
    review = review_service.get_review(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.post("", status_code=201)
def create_review(review: ReviewCreate):
    return review_service.create_review(review)


@router.put("/{review_id}", status_code=200)
def update_review(review_id: int, updated_review: ReviewUpdate):
    review = review_service.update_review(review_id, updated_review)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int):
    deleted = review_service.delete_review(review_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Review not found")
    return
