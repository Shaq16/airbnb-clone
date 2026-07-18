import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Listing, User, Review
from ..schemas import ListingCreate, ListingUpdate, ListingResponse, ListingDetailResponse, ReviewCreate, ReviewResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/listings", tags=["Listings"])

@router.get("", response_model=List[ListingResponse])
def read_listings(
    location: Optional[str] = None,
    guests: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    amenities: Optional[List[str]] = Query(None),
    page: int = 1,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Listing)

    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))
    
    if guests is not None:
        query = query.filter(Listing.max_guests >= guests)
        if guests >= 5:
            query = query.filter(Listing.max_guests <= guests + 1)
        
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
        
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)
        
    if property_type:
        query = query.filter(Listing.property_type.ilike(property_type))

    # Fetch all matching first, then do advanced list filtering if amenities exist
    listings = query.all()

    if amenities:
        filtered_listings = []
        for listing in listings:
            try:
                listing_amenities = json.loads(listing.amenities)
            except Exception:
                listing_amenities = []
            
            # Check if all requested amenities are in listing's amenities (case-insensitive)
            listing_amenities_lower = [a.lower() for a in listing_amenities]
            if all(amenity.lower() in listing_amenities_lower for amenity in amenities):
                filtered_listings.append(listing)
        listings = filtered_listings

    # Apply pagination manually in memory for simplicity (or database-side if no memory filter)
    start = (page - 1) * limit
    end = start + limit
    return listings[start:end]


@router.get("/{listing_id}", response_model=ListingDetailResponse)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_in: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure current user role is updated to host/both if they create a listing
    if current_user.role == "guest":
        current_user.role = "both"
        db.add(current_user)

    db_listing = Listing(
        host_id=current_user.id,
        title=listing_in.title,
        description=listing_in.description,
        location=listing_in.location,
        property_type=listing_in.property_type,
        price_per_night=listing_in.price_per_night,
        cleaning_fee=listing_in.cleaning_fee,
        service_fee=listing_in.service_fee,
        amenities=json.dumps(listing_in.amenities),
        photos=json.dumps(listing_in.photos),
        max_guests=listing_in.max_guests,
        bedrooms=listing_in.bedrooms,
        beds=listing_in.beds,
        bathrooms=listing_in.bathrooms,
        rating=5.0,
        reviews_count=0,
        is_guest_favourite=listing_in.is_guest_favourite
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_in: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    
    if listing.host_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit this listing"
        )
    
    update_data = listing_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field in ['amenities', 'photos']:
            setattr(listing, field, json.dumps(value))
        else:
            setattr(listing, field, value)
            
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        
    if listing.host_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this listing"
        )
        
    db.delete(listing)
    db.commit()
    return


# --- BONUS: REVIEWS ---
@router.post("/{listing_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    listing_id: int,
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        
    db_review = Review(
        listing_id=listing_id,
        user_id=current_user.id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Recalculate average rating & review count for the listing
    all_reviews = db.query(Review).filter(Review.listing_id == listing_id).all()
    listing.reviews_count = len(all_reviews)
    listing.rating = round(sum(r.rating for r in all_reviews) / len(all_reviews), 2)
    db.add(listing)
    db.commit()
    
    # Refresh to load user relation
    db.refresh(db_review)
    return db_review
