from pydantic import BaseModel


class ReviewCreate(BaseModel):
    guest_name: str
    reviews: str
    tone: str | None = "Warm"


class ReviewUpdate(BaseModel):
    guest_name: str
    reviews: str
    tone: str | None = "Warm"


class RegenerateResponseRequest(BaseModel):
    tone: str = "Warm"


class ReviewOut(BaseModel):
    id: int
    guest_name: str
    reviews: str
    sentiments: str | None = None
    theme: str | None = None
    ai_response: str | None = None
