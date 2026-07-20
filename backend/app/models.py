import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="guest")  # "guest", "host", or "both"
    avatar_url = Column(String, nullable=True)
    is_superhost = Column(Boolean, default=False)
    password_hash = Column(String, nullable=True)
    otp_code = Column(String, nullable=True)

    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=False)
    property_type = Column(String, nullable=False)  # "house", "apartment", "cabin", etc.
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    amenities = Column(String, default="[]")  # JSON string
    photos = Column(String, default="[]")  # JSON string
    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Float, default=1.0)
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    is_guest_favourite = Column(Boolean, default=False)

    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="listing", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=True)
    guest_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=True)
    guest_count = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="confirmed")  # "pending", "confirmed", "cancelled"

    # Fields for Experiences / Services
    booking_type = Column(String, default="stay")  # "stay", "experience", "service"
    title = Column(String, nullable=True)
    category = Column(String, nullable=True)
    image = Column(String, nullable=True)
    package_title = Column(String, nullable=True)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing = relationship("Listing", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    languages = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    host_name = Column(String, nullable=False)
    host_title = Column(String, nullable=False)
    host_bio = Column(Text, nullable=False)
    host_avatar = Column(String, nullable=False)
    photos = Column(String, default="[]")  # JSON string
    what_you_do = Column(String, default="[]")  # JSON string
    reviews = Column(String, default="[]")  # JSON string
