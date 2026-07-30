from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from core.config import settings

if not settings.DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy backend/.env.example to backend/.env "
        "and fill in DATABASE_URL with your Supabase Postgres connection "
        "string, e.g.\n"
        "  DATABASE_URL=postgresql+psycopg2://postgres.xxxx:PASSWORD@"
        "aws-0-<region>.pooler.supabase.com:6543/postgres\n"
        "(Get the base URI from Supabase > Project Settings > Database > "
        "Connection string, then add '+psycopg2' after 'postgresql'.)"
    )

# SQLAlchemy engine talking directly to Supabase's underlying Postgres
# instance (via DATABASE_URL), replacing the old supabase-py table client.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
