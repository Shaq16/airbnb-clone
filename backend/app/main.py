import os
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, listings, bookings, wishlists
from .seed import seed_db
from starlette.requests import Request
from starlette.responses import Response

# Automatically create tables on startup
Base.metadata.create_all(bind=engine)

# Seed the database once on startup if the expected assignment fixtures are missing.
try:
    from .database import SessionLocal
    from .models import User, Listing, Booking

    db = SessionLocal()
    try:
        expected_check_in = datetime.date.today() + datetime.timedelta(days=2)
        expected_check_out = datetime.date.today() + datetime.timedelta(days=7)
        has_users = db.query(User).first() is not None
        has_malibu_listing = db.query(Listing).filter(Listing.location.ilike("%Malibu%")) .first() is not None
        has_seeded_booking = db.query(Booking).filter(
            Booking.listing_id == 1,
            Booking.check_in == expected_check_in,
            Booking.check_out == expected_check_out,
            Booking.status == "confirmed"
        ).first() is not None
        if not has_users or not has_malibu_listing or not has_seeded_booking:
            seed_db()
    finally:
        db.close()
except Exception:
    # Keep startup resilient even if seeding fails for any reason.
    pass

app = FastAPI(
    title="Airbnb Clone API",
    description="Backend services for the Airbnb clone assignment (FastAPI + SQLite)",
    version="1.0.0"
)

# Enable CORS for frontend requests (typically localhost:3000)
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(wishlists.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "Welcome to the Airbnb Clone API. Refer to /docs for interactive Swagger documentation."
    }
