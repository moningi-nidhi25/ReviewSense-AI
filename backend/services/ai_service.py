import json
import logging
from core.config import settings

logger = logging.getLogger(__name__)


def analyze_review(
    guest_name: str,
    review_text: str,
    homestay_name: str | None = None,
    tone: str = "Warm",
) -> dict:
    """Analyzes a review using Gemini AI to extract sentiment, multiple themes, and generate a customized management response.

    Returns:
        dict: {"sentiments": str, "theme": str, "ai_response": str}
    """
    homestay_label = homestay_name.strip() if homestay_name and homestay_name.strip() else "our homestay"
    tone_clean = tone.strip().capitalize() if tone else "Warm"

    if tone_clean == "Formal":
        tone_instruction = "Write a formal, professional, and courteous executive response."
    elif tone_clean == "Promotional":
        tone_instruction = "Write a warm response and include an invitation to return with a 10% discount promo on their next stay."
    else:
        tone_instruction = "Write a warm, friendly, and hospitable management response."

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

Requirements:
1. "sentiments": "Positive" | "Neutral" | "Negative"
2. "themes": Array of ALL matching categories present in the review from ["Hospitality", "Cleanliness", "Food", "Location", "Amenities", "Service", "Value"].
3. "ai_response": {tone_instruction} Address {guest_name} by name in 2-3 sentences.

Respond strictly with a JSON object:
{{
  "sentiments": "Positive",
  "themes": ["Hospitality", "Food"],
  "ai_response": "Dear {guest_name}..."
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
                raw_themes = data.get("themes") or [data.get("theme", "General")]
                if isinstance(raw_themes, str):
                    themes_str = raw_themes
                else:
                    themes_str = ", ".join([str(t).strip().capitalize() for t in raw_themes if t])

                return {
                    "sentiments": str(data.get("sentiments", "Neutral")).capitalize(),
                    "theme": themes_str or "General",
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

    detected_themes = []
    if any(w in text_lower for w in ["food", "breakfast", "dinner", "meal", "coffee", "tea", "cook"]):
        detected_themes.append("Food")
    if any(w in text_lower for w in ["clean", "dirty", "towel", "bed", "bathroom", "room", "linen"]):
        detected_themes.append("Cleanliness")
    if any(w in text_lower for w in ["host", "staff", "owner", "friendly", "warm", "helpful", "welcome"]):
        detected_themes.append("Hospitality")
    if any(w in text_lower for w in ["view", "mountain", "location", "nature", "walk", "reach"]):
        detected_themes.append("Location")

    if not detected_themes:
        detected_themes.append("Service")

    themes_str = ", ".join(detected_themes)

    if tone_clean == "Formal":
        if sentiment == "Positive":
            resp = f"Dear {guest_name}, thank you for reviewing {homestay_label}. We appreciate your positive feedback and look forward to welcoming you again."
        elif sentiment == "Negative":
            resp = f"Dear {guest_name}, thank you for contacting {homestay_label}. We take your comments seriously and are investigating these issues to improve our operational standards."
        else:
            resp = f"Dear {guest_name}, thank you for your review. We have noted your observations and will continue striving to enhance our service."
    elif tone_clean == "Promotional":
        resp = f"Dear {guest_name}, thank you so much for staying at {homestay_label}! As a token of our appreciation, please use promo code RETURN10 for 10% off your next booking with us."
    else: # Warm
        if sentiment == "Positive":
            resp = f"Dear {guest_name}, thank you so much for your lovely review! We are thrilled you had a wonderful time at {homestay_label} and hope to welcome you back soon."
        elif sentiment == "Negative":
            resp = f"Dear {guest_name}, thank you for sharing your feedback. The team at {homestay_label} sincerely apologizes for the inconveniences during your stay."
        else:
            resp = f"Dear {guest_name}, thank you for reviewing your stay at {homestay_label}. We appreciate your feedback and look forward to offering you an even better experience next time!"

    return {
        "sentiments": sentiment,
        "theme": themes_str,
        "ai_response": resp,
    }
