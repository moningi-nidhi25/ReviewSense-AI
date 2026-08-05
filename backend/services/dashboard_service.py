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

    all_reviews = base.all()
    theme_counts = {}
    for r in all_reviews:
        if r.theme:
            t_list = [t.strip() for t in r.theme.split(",") if t.strip()]
            for t in t_list:
                theme_counts[t] = theme_counts.get(t, 0) + 1
        else:
            theme_counts["Unclassified"] = theme_counts.get("Unclassified", 0) + 1

    sorted_themes = sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    top_themes = [{"theme": t, "count": cnt} for t, cnt in sorted_themes]

    recent = base.order_by(Review.id.desc()).limit(5).all()
    recent_reviews = [
        {
            "id": r.id,
            "guest_name": r.guest_name,
            "reviews": r.reviews,
            "sentiments": r.sentiments,
            "theme": r.theme,
            "ai_response": r.ai_response,
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
