import os
from dotenv import load_dotenv

# Load .env once, here, at the very start of the app's life.
# No other module should call load_dotenv() again.
load_dotenv()


class Settings:
    # --- Supabase Postgres (used via SQLAlchemy) ---
    # Use the "Connection string" (URI) from Supabase > Project Settings > Database.
    # Prefer the pooled connection (port 6543) for serverless/production, e.g.:
    # postgresql+psycopg2://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", "").strip().strip('"').strip("'")

    # Kept for any legacy/optional use of the Supabase client (storage, etc.)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # --- CORS ---
    # .env.example defines CORS_ORIGINS (plural) — this was the bug before.
    # Support a comma-separated list so you can add prod domains later
    # without touching code, e.g.:
    # CORS_ORIGINS=http://localhost:5173,https://reviewsense.app
    _raw_origins = os.getenv("CORS_ORIGINS", "")
    CORS_ORIGINS: list[str] = [
        origin.strip() for origin in _raw_origins.split(",") if origin.strip()
    ] or [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    ENV: str = os.getenv("ENV", "development")  # "development" | "production"

    # --- Frontend (for OAuth redirects) ---
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # --- Auth / JWT ---
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-insecure-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_DAYS: int = int(os.getenv("JWT_EXPIRY_DAYS", "7"))
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", "12"))

    # Secret used by Starlette's SessionMiddleware (required by Authlib for OAuth state)
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", "dev-insecure-session-secret")

    # --- Rate limiting (slowapi / limits string syntax) ---
    RATE_LIMIT_LOGIN: str = os.getenv("RATE_LIMIT_LOGIN", "5/15minute")
    RATE_LIMIT_REGISTER: str = os.getenv("RATE_LIMIT_REGISTER", "5/15minute")

    # --- OAuth: Google ---
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")


settings = Settings()
