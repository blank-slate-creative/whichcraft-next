from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import get_db
from ..models import User, Beverage, BeverageType, Producer, Entry
from ..schemas import EntryCreate, EntryResponse, EntryUpdate
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/beverages", tags=["beverages"])


@router.get("", response_model=List[EntryResponse])
async def get_beverages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    type: Optional[str] = None,
    liked: Optional[bool] = None,
    sort_by: Optional[str] = Query("created_at", description="Sort by field"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc or desc)"),
):
    """
    Get all beverages for the current user.
    """
    query = db.query(Entry).join(Beverage).filter(Entry.user_id == current_user.id)

    # Apply type filter if provided
    if type:
        type_query = db.query(BeverageType).filter(BeverageType.name == type).first()
        if type_query:
            query = query.filter(Beverage.type_id == type_query.id)

    # Apply liked filter if provided
    if liked is not None:
        query = query.filter(Entry.liked == liked)

    # Apply sorting
    if sort_by == "type" and sort_order.lower() == "asc":
        query = query.join(BeverageType, Beverage.type_id == BeverageType.id).order_by(
            BeverageType.name.asc()
        )
    elif sort_by == "type" and sort_order.lower() != "asc":
        query = query.join(BeverageType, Beverage.type_id == BeverageType.id).order_by(
            BeverageType.name.desc()
        )
    elif sort_by == "producer" and sort_order.lower() == "asc":
        query = query.join(Producer, Beverage.producer_id == Producer.id).order_by(
            Producer.name.asc()
        )
    elif sort_by == "producer" and sort_order.lower() != "asc":
        query = query.join(Producer, Beverage.producer_id == Producer.id).order_by(
            Producer.name.desc()
        )
    else:
        # Apply standard sorting
        valid_sort_fields = {
            "name": Beverage.name,
            "created_at": Entry.created_at,
        }
        sort_field = valid_sort_fields.get(sort_by, Entry.created_at)
        if sort_order.lower() == "asc":
            query = query.order_by(sort_field.asc())
        else:
            query = query.order_by(sort_field.desc())

    entries = query.all()

    # Transform entries to include required fields from the related Beverage
    response_entries = []
    for entry in entries:
        beverage = entry.beverage
        response_entry = {
            "id": entry.id,
            "user_id": entry.user_id,
            "beverage_id": entry.beverage_id,
            "name": beverage.name,  # Include the name from beverage
            "type": beverage.type_obj.name if beverage.type_obj else None,
            "style": beverage.style,
            "producer": beverage.producer_obj.name if beverage.producer_obj else None,
            "abv": beverage.abv,
            "year": beverage.year,
            "liked": entry.liked,
            "notes": entry.notes,
            "location": entry.location,
            "created_at": entry.created_at,
            "untappd_beer_id": beverage.untappd_beer_id,
            "image_url": beverage.image_url,
            "beverage": beverage,
        }
        response_entries.append(response_entry)

    return response_entries


@router.post("", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def create_beverage(
    entry: EntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new beverage entry.
    """
    # Validate required fields
    if not entry.beverage_id and (not entry.name or not entry.type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and type are required when not providing beverage_id",
        )

    beverage_id = entry.beverage_id

    if not beverage_id:
        # Process beverage type
        beverage_type = None
        type_name = entry.type
        beverage_type = (
            db.query(BeverageType).filter(BeverageType.name == type_name).first()
        )
        if not beverage_type:
            # Create new beverage type
            beverage_type = BeverageType(name=type_name)
            db.add(beverage_type)
            db.flush()  # Get the ID without committing

        # Process producer
        producer = None
        producer_name = entry.producer
        if producer_name:
            producer = db.query(Producer).filter(Producer.name == producer_name).first()
            if not producer:
                producer = Producer(
                    name=producer_name,
                    untappd_brewery_id=entry.untappd_brewery_id,
                )
                db.add(producer)
                db.flush()  # Get the ID without committing

        # Check if the beverage already exists
        untappd_beer_id = entry.untappd_beer_id
        existing_beverage = None

        if untappd_beer_id:
            existing_beverage = (
                db.query(Beverage)
                .filter(Beverage.untappd_beer_id == untappd_beer_id)
                .first()
            )

        if not existing_beverage:
            # Create new beverage
            new_beverage = Beverage(
                name=entry.name,
                type_id=beverage_type.id,
                style=entry.style,
                producer_id=producer.id if producer else None,
                abv=entry.abv if entry.abv else None,
                year=entry.year,
                untappd_beer_id=untappd_beer_id,
                image_url=entry.image_url,
            )
            db.add(new_beverage)
            db.flush()  # Get the ID without committing
            beverage_id = new_beverage.id
        else:
            beverage_id = existing_beverage.id

    # Create new entry
    new_entry = Entry(
        user_id=current_user.id,
        beverage_id=beverage_id,
        liked=entry.liked,
        notes=entry.notes,
        location=entry.location,
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # Transform entry to include required fields from the related Beverage
    beverage = new_entry.beverage
    response_entry = {
        "id": new_entry.id,
        "user_id": new_entry.user_id,
        "beverage_id": new_entry.beverage_id,
        "name": beverage.name,  # Include the name from beverage
        "type": beverage.type_obj.name if beverage.type_obj else None,
        "style": beverage.style,
        "producer": beverage.producer_obj.name if beverage.producer_obj else None,
        "abv": beverage.abv,
        "year": beverage.year,
        "liked": new_entry.liked,
        "notes": new_entry.notes,
        "location": new_entry.location,
        "created_at": new_entry.created_at,
        "untappd_beer_id": beverage.untappd_beer_id,
        "image_url": beverage.image_url,
        "beverage": beverage,
    }

    return response_entry


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_beverage(
    entry_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific beverage entry.
    """
    entry = (
        db.query(Entry)
        .filter(Entry.id == entry_id, Entry.user_id == current_user.id)
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found"
        )

    # Transform entry to include required fields from the related Beverage
    beverage = entry.beverage
    response_entry = {
        "id": entry.id,
        "user_id": entry.user_id,
        "beverage_id": entry.beverage_id,
        "name": beverage.name,  # Include the name from beverage
        "type": beverage.type_obj.name if beverage.type_obj else None,
        "style": beverage.style,
        "producer": beverage.producer_obj.name if beverage.producer_obj else None,
        "abv": beverage.abv,
        "year": beverage.year,
        "liked": entry.liked,
        "notes": entry.notes,
        "location": entry.location,
        "created_at": entry.created_at,
        "untappd_beer_id": beverage.untappd_beer_id,
        "image_url": beverage.image_url,
        "beverage": beverage,
    }

    return response_entry


@router.put("/{entry_id}", response_model=EntryResponse)
async def update_beverage(
    entry_id: uuid.UUID,
    entry_update: EntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a beverage entry.
    """
    entry = (
        db.query(Entry)
        .filter(Entry.id == entry_id, Entry.user_id == current_user.id)
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found"
        )

    beverage = entry.beverage

    # Handle beverage updates
    if (
        entry_update.name is not None
        or entry_update.type is not None
        or entry_update.style is not None
        or entry_update.producer is not None
        or entry_update.abv is not None
        or entry_update.year is not None
        or entry_update.untappd_beer_id is not None
        or entry_update.image_url is not None
    ):
        # Check if we need to update the type
        if entry_update.type:
            type_name = entry_update.type
            beverage_type = (
                db.query(BeverageType).filter(BeverageType.name == type_name).first()
            )
            if not beverage_type:
                beverage_type = BeverageType(name=type_name)
                db.add(beverage_type)
                db.flush()
            beverage.type_id = beverage_type.id

        # Check if we need to update the producer
        if entry_update.producer:
            producer_name = entry_update.producer
            producer = db.query(Producer).filter(Producer.name == producer_name).first()
            if not producer:
                producer = Producer(
                    name=producer_name,
                    untappd_brewery_id=entry_update.untappd_brewery_id,
                )
                db.add(producer)
                db.flush()
            beverage.producer_id = producer.id

        # Update other beverage fields
        if entry_update.name is not None:
            beverage.name = entry_update.name
        if entry_update.style is not None:
            beverage.style = entry_update.style
        if entry_update.abv is not None:
            beverage.abv = entry_update.abv
        if entry_update.year is not None:
            beverage.year = entry_update.year
        if entry_update.untappd_beer_id is not None:
            beverage.untappd_beer_id = entry_update.untappd_beer_id
        if entry_update.image_url is not None:
            beverage.image_url = entry_update.image_url

    # Update entry fields
    if entry_update.liked is not None:
        entry.liked = entry_update.liked
    if entry_update.notes is not None:
        entry.notes = entry_update.notes
    if entry_update.location is not None:
        entry.location = entry_update.location

    db.commit()
    db.refresh(entry)

    # Transform entry to include required fields from the related Beverage
    beverage = entry.beverage
    response_entry = {
        "id": entry.id,
        "user_id": entry.user_id,
        "beverage_id": entry.beverage_id,
        "name": beverage.name,  # Include the name from beverage
        "type": beverage.type_obj.name if beverage.type_obj else None,
        "style": beverage.style,
        "producer": beverage.producer_obj.name if beverage.producer_obj else None,
        "abv": beverage.abv,
        "year": beverage.year,
        "liked": entry.liked,
        "notes": entry.notes,
        "location": entry.location,
        "created_at": entry.created_at,
        "untappd_beer_id": beverage.untappd_beer_id,
        "image_url": beverage.image_url,
        "beverage": beverage,
    }

    return response_entry


@router.delete("/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_beverage(
    entry_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a beverage entry.
    """
    entry = (
        db.query(Entry)
        .filter(Entry.id == entry_id, Entry.user_id == current_user.id)
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found"
        )

    db.delete(entry)
    db.commit()

    return {"message": "Entry deleted"}
