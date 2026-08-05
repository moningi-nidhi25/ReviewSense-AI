import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware

from core.config import settings
from core.database import Base, engine
from core.limiter import limiter

# Import models so they're registered on Base.metadata before create_all runs.
from models import review as _review_model  # noqa: F401
from models import user as _user_model  # noqa: F401

from routers import auth, dashboard, reviews

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates the `users` table if it doesn't exist yet. `reviews_table`
    # already exists in Supabase, so this is a no-op for it (checkfirst=True).
    Base.metadata.create_all(bind=engine, checkfirst=True)
    yield


app = FastAPI(title="ReviewSense AI", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Required by Authlib to store OAuth state/nonce between the redirect and callback.
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(reviews.router)
app.include_router(dashboard.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"message": "Validation Error", "details": exc.errors()},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )
