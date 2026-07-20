import datetime
import json
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator, Field


# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "guest"  # "guest", "host", or "both"
    avatar_url: Optional[str] = None
    is_superhost: bool = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- REVIEW SCHEMAS ---
class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    listing_id: int
    user_id: int
    created_at: datetime.datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


# --- LISTING SCHEMAS ---
class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    property_type: str
    price_per_night: float
    cleaning_fee: float = 0.0
    service_fee: float = 0.0
    amenities: List[str] = []
    photos: List[str] = []
    max_guests: int = 2
    bedrooms: int = 1
    beds: int = 1
    bathrooms: float = 1.0
    is_guest_favourite: bool = False

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    amenities: Optional[List[str]] = None
    photos: Optional[List[str]] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[float] = None
    is_guest_favourite: Optional[bool] = None

class ListingResponse(BaseModel):
    id: int
    host_id: int
    title: str
    description: Optional[str] = None
    location: str
    property_type: str
    price_per_night: float
    cleaning_fee: float
    service_fee: float
    amenities: List[str]
    photos: List[str]
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    rating: float
    reviews_count: int
    is_guest_favourite: bool
    host: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator('amenities', 'photos', mode='before')
    @classmethod
    def parse_json_string(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v


class BookingPeriod(BaseModel):
    check_in: datetime.date
    check_out: datetime.date
    model_config = ConfigDict(from_attributes=True)


class ListingDetailResponse(ListingResponse):
    reviews: List[ReviewResponse] = []
    bookings: List[BookingPeriod] = []
    # No extra validators needed since it inherits from ListingResponse


# --- BOOKING SCHEMAS ---
class BookingBase(BaseModel):
    listing_id: Optional[int] = None
    check_in: datetime.date
    check_out: Optional[datetime.date] = None
    guest_count: int = 1
    booking_type: str = "stay"  # "stay", "experience", "service"
    title: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    package_title: Optional[str] = None

class BookingCreate(BookingBase):
    total_price: Optional[float] = None

class BookingResponse(BaseModel):
    id: int
    listing_id: Optional[int] = None
    guest_id: int
    check_in: datetime.date
    check_out: Optional[datetime.date] = None
    guest_count: int
    total_price: float
    status: str
    booking_type: str
    title: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    package_title: Optional[str] = None
    listing: Optional[ListingResponse] = None
    guest: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


# --- WISHLIST SCHEMAS ---
class WishlistResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int
    listing: ListingResponse

    model_config = ConfigDict(from_attributes=True)


# --- EXPERIENCE SCHEMAS ---
class ExperienceResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location_name: str
    address: str
    duration: str
    languages: str
    price: float
    host_name: str
    host_title: str
    host_bio: str
    host_avatar: str
    photos: List[str]
    what_you_do: List[dict]
    reviews: List[dict]

    model_config = ConfigDict(from_attributes=True)

    @field_validator('photos', 'what_you_do', 'reviews', mode='before')
    @classmethod
    def parse_json_string(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v
