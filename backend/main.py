from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi import HTTPException
from database import supabase

app = FastAPI()
@app.get("/test-db")
def test_db():
    response = supabase.table("reviews").select("*").execute()
    return response.data

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



class Review(BaseModel):
    guest_name: str
    review: str
    sentiment: str
    theme: str

@app.get("/api/reviews", status_code=200)
def get_reviews():
    response = supabase.table("reviews").select("*").execute()
    return response.data

@app.get("/api/reviews/search", status_code=200)
def search_reviews(q: str):
    response = (
        supabase
        .table("reviews")
        .select("*")
        .ilike("review", f"%{q}%")
        .execute()
    )

    return response.data

@app.get("/api/reviews/{review_id}", status_code=200)
def get_review(review_id: int):
    response = (
        supabase
        .table("reviews")
        .select("*")
        .eq("id", review_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return response.data[0]

@app.post("/api/reviews", status_code=201)
def create_review(review: Review):
    response = (
        supabase
        .table("reviews")
        .insert({
            "guest_name": review.guest_name,
            "review": review.review,
            "sentiment": review.sentiment,
            "theme": review.theme,
        })
        .execute()
    )

    return response.data[0]

@app.put("/api/reviews/{review_id}", status_code=200)
def update_review(review_id: int, updated_review: Review):
    response = (
        supabase
        .table("reviews")
        .update({
            "guest_name": updated_review.guest_name,
            "review": updated_review.review,
            "sentiment": updated_review.sentiment,
            "theme": updated_review.theme,
        })
        .eq("id", review_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return response.data[0]

@app.delete("/api/reviews/{review_id}", status_code=204)
def delete_review(review_id: int):
    response = (
        supabase
        .table("reviews")
        .delete()
        .eq("id", review_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return

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