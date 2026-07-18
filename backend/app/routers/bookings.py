import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking, Listing, User
from ..schemas import BookingCreate, BookingResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if booking_in.booking_type == "stay":
        # 1. Fetch Listing
        if not booking_in.listing_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="listing_id is required for stays"
            )
        listing = db.query(Listing).filter(Listing.id == booking_in.listing_id).first()
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property listing not found"
            )

        # 2. Date Validations
        today = datetime.date.today()
        if booking_in.check_in < today:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-in date cannot be in the past"
            )
        if not booking_in.check_out:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="check_out date is required for stays"
            )
        if booking_in.check_out <= booking_in.check_in:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-out date must be after check-in date"
            )

        # 3. Check for Overlapping Bookings (stays only)
        overlapping_booking = db.query(Booking).filter(
            Booking.listing_id == booking_in.listing_id,
            Booking.status == "confirmed",
            Booking.booking_type == "stay",
            Booking.check_in < booking_in.check_out,
            Booking.check_out > booking_in.check_in
        ).first()

        if overlapping_booking:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The property is already booked during these dates."
            )

        # 4. Guest Capacity Check
        if booking_in.guest_count > listing.max_guests:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This property accommodates a maximum of {listing.max_guests} guests."
            )

        # 5. Calculate Total Price
        nights = (booking_in.check_out - booking_in.check_in).days
        room_charge = nights * listing.price_per_night
        total_price = room_charge + listing.cleaning_fee + listing.service_fee
    else:
        # Experience or Service
        today = datetime.date.today()
        if booking_in.check_in < today:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-in date cannot be in the past"
            )
        total_price = booking_in.total_price or 0.0

    # 6. Create booking
    db_booking = Booking(
        listing_id=booking_in.listing_id,
        guest_id=current_user.id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guest_count=booking_in.guest_count,
        total_price=round(total_price, 2),
        status="confirmed",
        booking_type=booking_in.booking_type,
        title=booking_in.title,
        category=booking_in.category,
        image=booking_in.image,
        package_title=booking_in.package_title
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/my-trips", response_model=List[BookingResponse])
def get_my_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve bookings made by the active guest (i.e. 'My Trips')"""
    return db.query(Booking).filter(
        Booking.guest_id == current_user.id
    ).order_by(Booking.check_in.asc()).all()


@router.get("/dashboard", response_model=List[BookingResponse])
def get_host_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve reservations made on properties owned by the active host"""
    return db.query(Booking).join(Listing).filter(
        Listing.host_id == current_user.id
    ).order_by(Booking.check_in.asc()).all()


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Authorized if current user is the guest who booked or the host of the listing
    is_authorized = False
    if booking.guest_id == current_user.id:
        is_authorized = True
    elif booking.listing_id:
        listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
        if listing and listing.host_id == current_user.id:
            is_authorized = True

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking"
        )

    booking.status = "cancelled"
    db.add(booking)
    db.commit()
    return
