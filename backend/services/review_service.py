import logging
from core.database import supabase
from schemas.review import ReviewCreate, ReviewUpdate

logger = logging.getLogger(__name__)

TABLE = "reviews_table"


def list_reviews(limit: int = 50, offset: int = 0):
    response = (
        supabase.table(TABLE)
        .select("*")
        .range(offset, offset + limit - 1)
        .execute()
    )
    return response.data


def search_reviews(q: str):
    # NOTE: still string-built for Supabase's .or_() filter syntax.
    # Supabase-py escapes this internally, but keep queries short-form
    # (no raw SQL) and avoid passing q into anything that isn't this
    # PostgREST filter builder.
    response = (
        supabase.table(TABLE)
        .select("*")
        .or_(f"guest_name.ilike.%{q}%,reviews.ilike.%{q}%")
        .execute()
    )
    return response.data


def get_review(review_id: int):
    response = supabase.table(TABLE).select("*").eq("id", review_id).execute()
    return response.data[0] if response.data else None


def create_review(review: ReviewCreate):
    # Later AI will generate these
    sentiment = "Neutral"
    theme = "General"

    response = (
        supabase.table(TABLE)
        .insert(
            {
                "guest_name": review.guest_name,
                "reviews": review.reviews,
                "sentiments": sentiment,
                "theme": theme,
            }
        )
        .execute()
    )
    logger.info("Created review for guest_name=%s", review.guest_name)
    return response.data[0]


def update_review(review_id: int, updated_review: ReviewUpdate):
    response = (
        supabase.table(TABLE)
        .update(
            {
                "guest_name": updated_review.guest_name,
                "reviews": updated_review.reviews,
            }
        )
        .eq("id", review_id)
        .execute()
    )
    return response.data[0] if response.data else None


def delete_review(review_id: int) -> bool:
    response = supabase.table(TABLE).delete().eq("id", review_id).execute()
    return bool(response.data)
