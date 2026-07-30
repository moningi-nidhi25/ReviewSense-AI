import uuid

from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from core.database import Base


class Review(Base):
    __tablename__ = "reviews_table"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    guest_name = Column(String, nullable=False)
    reviews = Column(String, nullable=False)
    sentiments = Column(String, nullable=True)
    theme = Column(String, nullable=True)

    # Which account this review belongs to. Nullable so pre-existing rows
    # (created before auth existed) don't break — they just won't show up
    # for any user until backfilled/reassigned.
    owner_id = Column(UUID(as_uuid=True), nullable=True, index=True)
