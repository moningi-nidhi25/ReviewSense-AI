from sqlalchemy import func
from sqlalchemy.orm import Session

from models.review import Review
from models.user import User


def _percentage(part: int, whole: int) -> float:
    return round((part / whole) * 100, 1) if whole else 0.0


def get_summary(db: Session, owner: User) -> dict:
    base = db.query(Review).filter(Review.owner_id == owner.id)

    total = base.count()

    sentiment_rows = (
        db.query(Review.sentiments, func.count(Review.id))
        .filter(Review.owner_id == owner.id)
        .group_by(Review.sentiments)
        .all()
    )
    sentiment_breakdown = [
        {
            "sentiment": name or "Unclassified",
            "count": count,
            "percentage": _percentage(count, total),
        }
        for name, count in sentiment_rows
    ]
    sentiment_breakdown.sort(key=lambda row: row["count"], reverse=True)

    theme_rows = (
        db.query(Review.theme, func.count(Review.id).label("count"))
        .filter(Review.owner_id == owner.id)
        .group_by(Review.theme)
        .order_by(func.count(Review.id).desc())
        .limit(6)
        .all()
    )
    top_themes = [
        {"theme": theme or "Unclassified", "count": count} for theme, count in theme_rows
    ]

    recent = base.order_by(Review.id.desc()).limit(5).all()
    recent_reviews = [
        {
            "id": r.id,
            "guest_name": r.guest_name,
            "reviews": r.reviews,
            "sentiments": r.sentiments,
            "theme": r.theme,
        }
        for r in recent
    ]

    positive = next((row["count"] for row in sentiment_breakdown if row["sentiment"].lower() == "positive"), 0)
    negative = next((row["count"] for row in sentiment_breakdown if row["sentiment"].lower() == "negative"), 0)
    neutral = next((row["count"] for row in sentiment_breakdown if row["sentiment"].lower() == "neutral"), 0)

    return {
        "total_reviews": total,
        "sentiment_breakdown": sentiment_breakdown,
        "top_themes": top_themes,
        "recent_reviews": recent_reviews,
        "quick_stats": {
            "positive": positive,
            "neutral": neutral,
            "negative": negative,
            "positive_pct": _percentage(positive, total),
            "neutral_pct": _percentage(neutral, total),
            "negative_pct": _percentage(negative, total),
        },
    }
