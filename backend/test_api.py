import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models import User, Listing, Booking, Review

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("[PASS] Health check endpoint works.")

def test_auth_endpoints():
    # 1. Check /me (returns default active user - Sophia, host, ID=1)
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["name"] == "Sophia Chen"
    assert user_data["role"] == "host"
    print("[PASS] Auth check (/me) returns correct default host profile.")

    # 2. Get list of users
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 4
    print(f"[PASS] Seeded users count: {len(users)}.")

    # 3. Switch user to Liam (guest, ID=3)
    response = client.post("/api/auth/switch/3")
    assert response.status_code == 200
    assert response.json()["name"] == "Liam Gallagher"
    assert response.json()["role"] == "guest"
    print("[PASS] Switch user endpoint works.")

    # 4. Check that /me is now updated
    response = client.get("/api/auth/me")
    assert response.json()["name"] == "Liam Gallagher"
    print("[PASS] /me state persisted active user change.")

def test_listings_endpoints():
    # 1. Fetch listings
    response = client.get("/api/listings")
    assert response.status_code == 200
    listings = response.json()
    assert len(listings) >= 4
    print(f"[PASS] Listings count: {len(listings)}.")

    # 2. Filter by location
    response = client.get("/api/listings?location=Malibu")
    assert response.status_code == 200
    filtered = response.json()
    assert len(filtered) == 1
    assert "Malibu" in filtered[0]["location"]
    print("[PASS] Filtering by location works.")

    # 3. Filter by guests
    response = client.get("/api/listings?guests=5")
    assert response.status_code == 200
    filtered = response.json()
    # Ensure at least one listing is returned, and all returned listings accommodate at least 5 guests
    assert len(filtered) >= 1
    for item in filtered:
        assert item["max_guests"] >= 5
    print("[PASS] Filtering by capacity (guests) works.")

    # 4. Get specific listing details (with host and reviews)
    villa_id = listings[0]["id"]
    response = client.get(f"/api/listings/{villa_id}")
    assert response.status_code == 200
    detail = response.json()
    assert "reviews" in detail
    assert "host" in detail
    assert detail["host"]["name"] == "Sophia Chen"
    print("[PASS] Get listing details (including reviews and host) works.")

def test_create_and_update_listing():
    # Switch to host Sophia (ID=1)
    client.post("/api/auth/switch/1")

    # Create listing
    new_listing_data = {
        "title": "Charming Lakefront Cottage",
        "description": "Lovely cottage right on the lake. Perfect for fishing and swimming.",
        "location": "Lake Tahoe, California",
        "property_type": "Cottage",
        "price_per_night": 220.0,
        "cleaning_fee": 50.0,
        "service_fee": 20.0,
        "amenities": ["Wifi", "Kitchen", "Lake Access"],
        "photos": ["https://example.com/cottage1.jpg"],
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 3,
        "bathrooms": 1.5
    }
    response = client.post("/api/listings", json=new_listing_data)
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == "Charming Lakefront Cottage"
    assert created["host_id"] == 1
    print("[PASS] Listing creation works.")

    # Update listing title
    listing_id = created["id"]
    update_data = {"title": "Stunning Lakefront Cottage"}
    response = client.put(f"/api/listings/{listing_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Stunning Lakefront Cottage"
    print("[PASS] Listing update works.")

    # Delete listing
    response = client.delete(f"/api/listings/{listing_id}")
    assert response.status_code == 204
    print("[PASS] Listing deletion works.")

def test_bookings_and_overlap_validation():
    # Switch to guest Liam (ID=3)
    client.post("/api/auth/switch/3")

    # Get listing 1 (Malibu Villa)
    listings_response = client.get("/api/listings")
    villa_id = listings_response.json()[0]["id"]

    # Try booking it for dates that overlap with seeded booking (Days 2 to 7 from today)
    today = datetime.date.today()
    check_in = today + datetime.timedelta(days=3)
    check_out = today + datetime.timedelta(days=5)

    booking_data = {
        "listing_id": villa_id,
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat(),
        "guest_count": 2
    }

    # Should fail due to overlap
    response = client.post("/api/bookings", json=booking_data)
    assert response.status_code == 400
    assert "already booked" in response.json()["detail"]
    print("[PASS] Booking overlap validation successfully blocks overlapping reservation.")

    # Book for available dates (Days 15 to 18 from today)
    ok_check_in = today + datetime.timedelta(days=15)
    ok_check_out = today + datetime.timedelta(days=18)
    ok_booking_data = {
        "listing_id": villa_id,
        "check_in": ok_check_in.isoformat(),
        "check_out": ok_check_out.isoformat(),
        "guest_count": 2
    }

    response = client.post("/api/bookings", json=ok_booking_data)
    assert response.status_code == 201
    booking = response.json()
    assert booking["status"] == "confirmed"
    
    # Calculate price validation
    # nights = 3
    # price = 3 * 450 + 120 + 60 = 1350 + 120 + 60 = 1530
    assert booking["total_price"] == 1530.0
    print("[PASS] Booking creation works, and total price calculation is correct.")

    # Check "My Trips"
    response = client.get("/api/bookings/my-trips")
    assert response.status_code == 200
    trips = response.json()
    # Should contain Liam's seeded trip (Seattle loft) and this new one
    assert len(trips) >= 2
    print("[PASS] 'My Trips' view lists correct bookings.")

    # Cancel booking
    booking_id = booking["id"]
    response = client.delete(f"/api/bookings/{booking_id}")
    assert response.status_code == 204
    print("[PASS] Booking cancellation works.")

def test_experience_service_bookings():
    # 1. Switch to guest Liam (ID=3)
    client.post("/api/auth/switch/3")

    # 2. Create Experience Booking
    today = datetime.date.today()
    exp_check_in = today + datetime.timedelta(days=10)
    exp_booking_data = {
        "booking_type": "experience",
        "title": "Pottery Workshop",
        "category": "Art workshops",
        "total_price": 4000.0,
        "check_in": exp_check_in.isoformat(),
        "guest_count": 2
    }
    response = client.post("/api/bookings", json=exp_booking_data)
    assert response.status_code == 201
    exp_booking = response.json()
    assert exp_booking["booking_type"] == "experience"
    assert exp_booking["title"] == "Pottery Workshop"
    assert exp_booking["category"] == "Art workshops"
    assert exp_booking["total_price"] == 4000.0
    assert exp_booking["guest_count"] == 2
    assert exp_booking["status"] == "confirmed"
    print("[PASS] Experience booking creation works.")

    # 3. Create Service Booking
    srv_check_in = today + datetime.timedelta(days=12)
    srv_booking_data = {
        "booking_type": "service",
        "title": "Home Chef Experience",
        "category": "Food & Drink",
        "total_price": 6000.0,
        "package_title": "Premium Package",
        "check_in": srv_check_in.isoformat(),
        "guest_count": 1
    }
    response = client.post("/api/bookings", json=srv_booking_data)
    assert response.status_code == 201
    srv_booking = response.json()
    assert srv_booking["booking_type"] == "service"
    assert srv_booking["title"] == "Home Chef Experience"
    assert srv_booking["package_title"] == "Premium Package"
    assert srv_booking["total_price"] == 6000.0
    assert srv_booking["guest_count"] == 1
    print("[PASS] Service booking creation works.")

    # 4. Check "My Trips" retrieves them
    response = client.get("/api/bookings/my-trips")
    assert response.status_code == 200
    trips = response.json()
    assert len(trips) >= 2
    types = [t["booking_type"] for t in trips]
    assert "experience" in types
    assert "service" in types
    print("[PASS] Retrieval of experiences/services in 'My Trips' works.")

    # 5. Cancel Experience booking
    exp_id = exp_booking["id"]
    response = client.delete(f"/api/bookings/{exp_id}")
    assert response.status_code == 204

    # Verify status changed to cancelled in DB
    response = client.get("/api/bookings/my-trips")
    trips = response.json()
    cancelled_trips = [t for t in trips if t["id"] == exp_id]
    assert len(cancelled_trips) == 1
    assert cancelled_trips[0]["status"] == "cancelled"
    print("[PASS] Experience/service booking cancellation works.")


def test_wishlist_endpoints():
    # 1. Switch to guest Liam (ID=3)
    client.post("/api/auth/switch/3")

    # 2. Get listing list
    listings_response = client.get("/api/listings")
    
    # Get initial count
    initial_response = client.get("/api/wishlists")
    initial_count = len(initial_response.json())

    # Add a listing that is NOT in the pre-seeded wishlist (e.g., Listing at index 2)
    new_listing_id = listings_response.json()[2]["id"]

    # 3. Add new listing to wishlist
    response = client.post(f"/api/wishlists/{new_listing_id}")
    assert response.status_code == 201
    assert response.json()["listing_id"] == new_listing_id
    assert response.json()["user_id"] == 3
    print("[PASS] Adding listing to wishlist works.")

    # 4. Get wishlists and check count increased by 1
    response = client.get("/api/wishlists")
    assert response.status_code == 200
    wishlists = response.json()
    assert len(wishlists) == initial_count + 1
    print("[PASS] Retrieving wishlist listings works.")

    # 5. Remove listing from wishlist
    response = client.delete(f"/api/wishlists/{new_listing_id}")
    assert response.status_code == 204
    print("[PASS] Removing listing from wishlist works.")

    # 6. Verify wishlist is back to initial count
    response = client.get("/api/wishlists")
    assert response.status_code == 200
    assert len(response.json()) == initial_count
    print("[PASS] Wishlist verification after deletion works.")

if __name__ == "__main__":
    print("Starting automated API verification tests...")
    test_health_check()
    test_auth_endpoints()
    test_listings_endpoints()
    test_create_and_update_listing()
    test_bookings_and_overlap_validation()
    test_experience_service_bookings()
    test_wishlist_endpoints()
    print("All backend API verification tests passed successfully!")
