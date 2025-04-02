from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    entries = relationship("Entry", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"


class Producer(Base):
    __tablename__ = "producers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    untappd_brewery_id = Column(Integer, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    beverages = relationship("Beverage", back_populates="producer_obj")

    def __repr__(self):
        return f"<Producer {self.name}>"


class BeverageType(Base):
    __tablename__ = "beverage_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    beverages = relationship("Beverage", back_populates="type_obj")

    def __repr__(self):
        return f"<BeverageType {self.name}>"


class Beverage(Base):
    __tablename__ = "beverages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type_id = Column(
        UUID(as_uuid=True), ForeignKey("beverage_types.id"), nullable=False
    )
    style = Column(String(100))
    producer_id = Column(UUID(as_uuid=True), ForeignKey("producers.id"), nullable=True)
    abv = Column(Float)
    year = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Untappd specific data
    untappd_beer_id = Column(Integer, unique=True, nullable=True)
    image_url = Column(String(512))

    type_obj = relationship("BeverageType", back_populates="beverages")
    producer_obj = relationship("Producer", back_populates="beverages")
    entries = relationship("Entry", back_populates="beverage")

    def __repr__(self):
        return f"<Beverage {self.name}>"


class Entry(Base):
    __tablename__ = "entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    beverage_id = Column(UUID(as_uuid=True), ForeignKey("beverages.id"), nullable=False)
    liked = Column(Boolean, nullable=False)  # True for liked, False for disliked
    notes = Column(String, nullable=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="entries")
    beverage = relationship("Beverage", back_populates="entries")

    def __repr__(self):
        return f"<Entry {self.id} for Beverage {self.beverage_id}>"
