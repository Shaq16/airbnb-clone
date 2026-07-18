from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Wishlist, Listing, User
from ..schemas import WishlistResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/wishlists", tags=["Wishlists"])

@router.get("", response_model=List[WishlistResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all wishlist items for the logged-in user"""
    return db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()


@router.post("/{listing_id}", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a property listing to the user's wishlist"""
    # Check if listing exists
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found"
        )
    
    # Check if already in wishlist
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.listing_id == listing_id
    ).first()
    if existing:
        return existing
        
    db_wishlist = Wishlist(user_id=current_user.id, listing_id=listing_id)
    db.add(db_wishlist)
    db.commit()
    db.refresh(db_wishlist)
    return db_wishlist


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a property listing from the user's wishlist"""
    db_wishlist = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.listing_id == listing_id
    ).first()
    
    if not db_wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found in wishlist"
        )
        
    db.delete(db_wishlist)
    db.commit()
    return
