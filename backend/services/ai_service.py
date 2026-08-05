import json
import logging
from core.config import settings

logger = logging.getLogger(__name__)


def analyze_review(guest_name: str, review_text: str, homestay_name: str | None = None) -> dict:
    """Analyzes a review using Gemini AI to extract sentiment, theme, and generate an AI management response.

    Returns:
        dict: {"sentiments": str, "theme": str, "ai_response": str}
    """
    homestay_label = homestay_name.strip() if homestay_name and homestay_name.strip() else "our homestay"

    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            prompt = f"""
You are an AI assistant representing management for {homestay_label}.
Analyze this guest review:
Guest Name: {guest_name}
Review: "{review_text}"

Respond strictly with a JSON object matching this schema:
{{
  "sentiments": "Positive" | "Neutral" | "Negative",
  "theme": "Hospitality" | "Cleanliness" | "Food" | "Location" | "Amenities" | "Service" | "Value",
  "ai_response": "A polite, personalized 2-sentence reply from {homestay_label} management addressing {guest_name}."
}}
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash" if hasattr(client.models, "gemini-2.5-flash") else "gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )

            if response and response.text:
                data = json.loads(response.text)
                return {
                    "sentiments": str(data.get("sentiments", "Neutral")).capitalize(),
                    "theme": str(data.get("theme", "General")).capitalize(),
                    "ai_response": str(data.get("ai_response", "")).strip(),
                }
        except Exception as e:
            logger.warning("Gemini AI generation failed, using intelligent fallback: %s", e)

    # Intelligent fallback when AI key is unavailable or fails
    text_lower = review_text.lower()
    pos_words = [
        "great", "awesome", "loved", "clean", "wonderful", "amazing",
        "delicious", "friendly", "best", "perfect", "good", "nice", "excellent"
    ]
    neg_words = [
        "bad", "dirty", "horrible", "terrible", "worst", "cold",
        "unfriendly", "noisy", "poor", "rude", "disappointed", "broken"
    ]

    pos_score = sum(1 for w in pos_words if w in text_lower)
    neg_score = sum(1 for w in neg_words if w in text_lower)

    if pos_score > neg_score:
        sentiment = "Positive"
    elif neg_score > pos_score:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    if any(w in text_lower for w in ["food", "breakfast", "dinner", "meal", "coffee", "tea", "cook"]):
        theme = "Food"
    elif any(w in text_lower for w in ["clean", "dirty", "towel", "bed", "bathroom", "room", "linen"]):
        theme = "Cleanliness"
    elif any(w in text_lower for w in ["host", "staff", "owner", "friendly", "warm", "helpful", "welcome"]):
        theme = "Hospitality"
    elif any(w in text_lower for w in ["view", "mountain", "location", "nature", "walk", "reach"]):
        theme = "Location"
    else:
        theme = "Service"

    if sentiment == "Positive":
        resp = f"Dear {guest_name}, thank you so much for your kind review! We are delighted that you had a wonderful stay at {homestay_label} and hope to welcome you back soon."
    elif sentiment == "Negative":
        resp = f"Dear {guest_name}, thank you for sharing your feedback. The team at {homestay_label} sincerely apologizes for the inconveniences during your stay and is taking immediate measures to improve."
    else:
        resp = f"Dear {guest_name}, thank you for reviewing your stay at {homestay_label}. We appreciate your feedback and look forward to offering you an even better experience next time!"

    return {
        "sentiments": sentiment,
        "theme": theme,
        "ai_response": resp,
    }
