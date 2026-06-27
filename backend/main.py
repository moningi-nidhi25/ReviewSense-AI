from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi import HTTPException

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data
reviews = [
    {
        "id": 1,
        "guest_name": "John Doe",
        "review": "The stay was amazing and the staff were very helpful.",
        "sentiment": "Positive",
        "theme": "Staff Service",
    },
    {
        "id": 2,
        "guest_name": "Sarah Smith",
        "review": "Rooms were clean but food quality could be better.",
        "sentiment": "Neutral",
        "theme": "Food",
    },
]

class Review(BaseModel):
    guest_name: str
    review: str
    sentiment: str
    theme: str

@app.get("/api/reviews", status_code=200)
def get_reviews():
    return reviews

@app.get("/api/reviews/search", status_code=200)
def search_reviews(q: str):
    results = []

    for review in reviews:
        if (
            q.lower() in review["guest_name"].lower()
            or q.lower() in review["review"].lower()
        ):
            results.append(review)

    return results

@app.get("/api/reviews/{review_id}", status_code=200)
def get_review(review_id: int):
    for review in reviews:
        if review["id"] == review_id:
            return review

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )

@app.post("/api/reviews", status_code=201)
def create_review(review: Review):
    new_review = {
        "id": len(reviews) + 1,
        "guest_name": review.guest_name,
        "review": review.review,
        "sentiment": review.sentiment,
        "theme": review.theme,
    }

    reviews.append(new_review)

    return new_review

@app.put("/api/reviews/{review_id}", status_code=200)
def update_review(review_id: int, updated_review: Review):
    for review in reviews:
        if review["id"] == review_id:
            review["guest_name"] = updated_review.guest_name
            review["review"] = updated_review.review
            review["sentiment"] = updated_review.sentiment
            review["theme"] = updated_review.theme

            return review

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )

@app.delete("/api/reviews/{review_id}", status_code=204)
def delete_review(review_id: int):
    for index, review in enumerate(reviews):
        if review["id"] == review_id:
            reviews.pop(index)
            return

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "message": "Validation Error",
            "details": exc.errors(),
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal Server Error"
        },
    )