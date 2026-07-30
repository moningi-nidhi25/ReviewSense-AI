import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)

    # Null when the account was created purely via OAuth.
    hashed_password = Column(String, nullable=True)

    # Populated when the account was created/linked via OAuth.
    oauth_provider = Column(String, nullable=True)  # "google" | "github"
    oauth_id = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
