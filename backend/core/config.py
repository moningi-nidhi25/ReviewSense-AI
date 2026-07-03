import os
from dotenv import load_dotenv

# Load .env once, here, at the very start of the app's life.
# No other module should call load_dotenv() again.
load_dotenv()


class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

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


settings = Settings()
