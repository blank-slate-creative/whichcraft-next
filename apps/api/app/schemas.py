from pydantic import BaseModel, UUID4, Field, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
import uuid


# Base schemas
class UserBase(BaseModel):
    email: str


class ProducerBase(BaseModel):
    name: str
    untappd_brewery_id: Optional[int] = None


class BeverageTypeBase(BaseModel):
    name: str


class BeverageBase(BaseModel):
    name: str
    type: str
    style: Optional[str] = None
    producer: Optional[str] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    untappd_beer_id: Optional[int] = None
    image_url: Optional[str] = None
    untappd_brewery_id: Optional[int] = None


class EntryBase(BaseModel):
    beverage_id: Optional[UUID4] = None
    liked: bool
    notes: Optional[str] = None
    location: Optional[str] = None


# Create schemas (used for POST requests)
class UserCreate(UserBase):
    pass


class ProducerCreate(ProducerBase):
    pass


class BeverageTypeCreate(BeverageTypeBase):
    pass


class BeverageCreate(BeverageBase):
    pass


class EntryCreate(EntryBase):
    # These fields are required when creating a new entry with a new beverage
    name: Optional[str] = None
    type: Optional[str] = None
    style: Optional[str] = None
    producer: Optional[str] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    untappd_beer_id: Optional[int] = None
    untappd_brewery_id: Optional[int] = None
    image_url: Optional[str] = None


# Response schemas (used for GET responses)
class UserResponse(UserBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class ProducerResponse(ProducerBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class BeverageTypeResponse(BeverageTypeBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class BeverageResponse(BaseModel):
    id: UUID4
    name: str
    type: Optional[str] = None
    type_id: Optional[UUID4] = None
    style: Optional[str] = None
    producer: Optional[str] = None
    producer_id: Optional[UUID4] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    created_at: datetime
    untappd_beer_id: Optional[int] = None
    image_url: Optional[str] = None

    class Config:
        orm_mode = True


class EntryResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    beverage_id: UUID4
    name: str
    type: Optional[str] = None
    style: Optional[str] = None
    producer: Optional[str] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    liked: bool
    notes: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    untappd_beer_id: Optional[int] = None
    image_url: Optional[str] = None
    beverage: Optional[BeverageResponse] = None

    class Config:
        orm_mode = True


# Update schemas (used for PUT requests)
class UserUpdate(BaseModel):
    email: Optional[str] = None


class BeverageUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    style: Optional[str] = None
    producer: Optional[str] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    untappd_beer_id: Optional[int] = None
    image_url: Optional[str] = None
    untappd_brewery_id: Optional[int] = None


class EntryUpdate(BaseModel):
    liked: Optional[bool] = None
    notes: Optional[str] = None
    location: Optional[str] = None
    # Fields for updating the associated beverage
    name: Optional[str] = None
    type: Optional[str] = None
    style: Optional[str] = None
    producer: Optional[str] = None
    abv: Optional[float] = None
    year: Optional[str] = None
    untappd_beer_id: Optional[int] = None
    image_url: Optional[str] = None
    untappd_brewery_id: Optional[int] = None


# Search response schemas
class BeerSearchResult(BaseModel):
    id: int
    name: str
    type_name: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    image_url: Optional[str] = None
    abv: Optional[float] = None
    brewery_name: Optional[str] = None
    brewery_id: Optional[int] = None


class VenueSearchResult(BaseModel):
    id: str
    name: str
    primary_category: Optional[str] = None
    categories: Optional[List[str]] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None
    image_url: Optional[str] = None
    has_beer: Optional[bool] = None
    has_food: Optional[bool] = None
    has_wine: Optional[bool] = None
    has_spirits: Optional[bool] = None
