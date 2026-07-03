from pydantic import BaseModel


class ReviewCreate(BaseModel):
    guest_name: str
    reviews: str


class ReviewUpdate(BaseModel):
    guest_name: str
    reviews: str


class ReviewOut(BaseModel):
    id: int
    guest_name: str
    reviews: str
    sentiments: str | None = None
    theme: str | None = None
