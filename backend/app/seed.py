import json
import hashlib
import datetime
from .database import engine, SessionLocal, Base
from .models import User, Listing, Booking, Review, Wishlist

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def seed_db():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Users...")
        # Create acting users that match the assignment test expectations
        users = [
            User(
                name="Sophia Chen",
                email="sophia.host@example.com",
                role="host",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
                is_superhost=True,
                password_hash=_hash_password("password123")
            ),
            User(
                name="Ananya Iyer",
                email="ananya.host@example.com",
                role="host",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
                is_superhost=False,
                password_hash=_hash_password("password123")
            ),
            User(
                name="Liam Gallagher",
                email="liam.guest@example.com",
                role="guest",
                avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                is_superhost=False,
                password_hash=_hash_password("password123")
            ),
            User(
                name="Emma Watson",
                email="emma.guest@example.com",
                role="guest",
                avatar_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
                is_superhost=False,
                password_hash=_hash_password("password123")
            )
        ]
        for user in users:
            db.add(user)
        db.commit()

        for user in users:
            db.refresh(user)

        host_aarav = users[0]
        host_ananya = users[1]
        guest_liam = users[2]

        print("Seeding listings and bookings...")
        listings = [
            Listing(
                host_id=host_aarav.id,
                title="Malibu Villa",
                description="A classic Malibu villa with ocean views and a private pool.",
                location="Malibu, California",
                property_type="Villa",
                price_per_night=450.0,
                cleaning_fee=120.0,
                service_fee=60.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Pool", "Beachfront"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=6,
                bedrooms=3,
                beds=4,
                bathrooms=3.0,
                rating=4.95,
                reviews_count=12,
                is_guest_favourite=True
            ),
            # ================= NORTH GOA =================
            Listing(
                host_id=host_aarav.id,
                title="Sleek Beachfront Studio with Balcony",
                location="Anjuna, North Goa",
                property_type="Flat",
                price_per_night=4274.5,  # 8,549 for 2 nights
                cleaning_fee=400.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Free parking", "AC", "Beachfront"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.97,
                reviews_count=18,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Charming Flat steps from Calangute Beach",
                location="Calangute, North Goa",
                property_type="Flat",
                price_per_night=5300.0,  # 10,600 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=2,
                bathrooms=1.0,
                rating=4.88,
                reviews_count=42,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Sunlit Apartment in North Goa",
                location="North Goa, Goa",
                property_type="Apartment",
                price_per_night=4336.5,  # 8,673 for 2 nights
                cleaning_fee=350.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Pool", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.90,
                reviews_count=35,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Portuguese Heritage Villa",
                location="Ribandar, North Goa",
                property_type="Villa",
                price_per_night=5297.5,  # 10,595 for 2 nights
                cleaning_fee=800.0,
                service_fee=400.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Hot tub"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=4,
                bathrooms=3.5,
                rating=4.95,
                reviews_count=12,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Luxury Forest View Flat in Nerul",
                location="Nerul, North Goa",
                property_type="Flat",
                price_per_night=6505.0,  # 13,010 for 2 nights
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Pool", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=8,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Bespoke Artistic Flat in North Goa",
                location="North Goa, Goa",
                property_type="Flat",
                price_per_night=4999.0,  # 9,998 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.95,
                reviews_count=18,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Cozy Poolside Oasis in Candolim",
                location="Candolim, North Goa",
                property_type="Flat",
                price_per_night=3275.5,  # 6,551 for 2 nights
                cleaning_fee=400.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Pool", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=1.5,
                rating=4.98,
                reviews_count=29,
                is_guest_favourite=True
            ),

            # ================= SOUTH GOA =================
            Listing(
                host_id=host_aarav.id,
                title="Premium Heritage Home in Fatrade",
                location="Fatrade, South Goa",
                property_type="Home",
                price_per_night=8074.0,  # 16,148 for 2 nights
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Free parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=4,
                bathrooms=3.0,
                rating=4.93,
                reviews_count=16,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Serene Escape Flat in Varca",
                location="Varca, South Goa",
                property_type="Flat",
                price_per_night=3750.0,  # 7,500 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.89,
                reviews_count=24,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Modern Apartment in Navelim",
                location="Navelim, South Goa",
                property_type="Apartment",
                price_per_night=1450.0,  # 2,900 for 2 nights
                cleaning_fee=200.0,
                service_fee=100.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.91,
                reviews_count=14,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Cozy Nest Flat in Chauri",
                location="Chauri, South Goa",
                property_type="Flat",
                price_per_night=3098.0,  # 6,196 for 2 nights
                cleaning_fee=300.0,
                service_fee=120.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.90,
                reviews_count=22,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Green Valley Apartment in Canacona",
                location="Canacona, South Goa",
                property_type="Apartment",
                price_per_night=1888.5,  # 3,777 for 2 nights
                cleaning_fee=250.0,
                service_fee=110.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=1.5,
                rating=4.78,
                reviews_count=19,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Scenic Valley Apartment in Colva",
                location="Colva, South Goa",
                property_type="Apartment",
                price_per_night=3069.5,  # 6,139 for 2 nights
                cleaning_fee=350.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.96,
                reviews_count=32,
                is_guest_favourite=True
            ),

            # ================= PUDUCHERRY =================
            Listing(
                host_id=host_aarav.id,
                title="French Quarter Heritage Home",
                location="Puducherry, Puducherry",
                property_type="Home",
                price_per_night=4999.0,  # 9,998 for 2 nights
                cleaning_fee=400.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Free parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=3,
                bathrooms=3.0,
                rating=5.00,
                reviews_count=18,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Charming Penthouse Flat",
                location="Puducherry, Puducherry",
                property_type="Flat",
                price_per_night=7589.5,  # 15,179 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=5.00,
                reviews_count=12,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Minimalist Green Flat",
                location="Puducherry, Puducherry",
                property_type="Flat",
                price_per_night=3115.0,  # 6,230 for 2 nights
                cleaning_fee=300.0,
                service_fee=120.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.85,
                reviews_count=21,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Sunset View Flat in Puducherry",
                location="Puducherry, Puducherry",
                property_type="Flat",
                price_per_night=3777.0,  # 7,554 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.87,
                reviews_count=15,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Luxury Seaside Flat",
                location="Puducherry, Puducherry",
                property_type="Flat",
                price_per_night=11898.5,  # 23,797 for 2 nights
                cleaning_fee=800.0,
                service_fee=450.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=5.00,
                reviews_count=35,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Spacious Guest Room in Puducherry",
                location="Puducherry, Puducherry",
                property_type="Room",
                price_per_night=5350.0,  # 10,700 for 2 nights
                cleaning_fee=300.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.89,
                reviews_count=27,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Rustic Seaside Place to Stay",
                location="Periyamudaliyar Chavadi, Puducherry",
                property_type="Place to stay",
                price_per_night=1378.0,  # 2,756 for 2 nights
                cleaning_fee=200.0,
                service_fee=80.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=9,
                is_guest_favourite=False
            ),

            # ================= MUMBAI =================
            Listing(
                host_id=host_aarav.id,
                title="Modernist Flat in Kurla West",
                location="Kurla West, Mumbai",
                property_type="Flat",
                price_per_night=4927.5,  # 9,855 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=19,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Bespoke Studio in Bandra West",
                location="Bandra West, Mumbai",
                property_type="Flat",
                price_per_night=8265.0,  # 16,530 for 2 nights
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Workspace"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.85,
                reviews_count=36,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Spacious Flat in Andheri East",
                location="Andheri East, Mumbai",
                property_type="Flat",
                price_per_night=4104.0,  # 8,208 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=5.00,
                reviews_count=15,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Sunlit flat in Santacruz East",
                location="Santacruz East, Mumbai",
                property_type="Flat",
                price_per_night=8558.0,  # 17,116 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.91,
                reviews_count=21,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Cozy Nest in Santacruz East",
                location="Santacruz East, Mumbai",
                property_type="Flat",
                price_per_night=8558.0,  # 17,116 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=14,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Minimalist Studio Flat",
                location="Santacruz East, Mumbai",
                property_type="Flat",
                price_per_night=8078.5,  # 16,157 for 2 nights
                cleaning_fee=550.0,
                service_fee=220.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.93,
                reviews_count=28,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Premium Apartment in Santacruz East",
                location="Santacruz East, Mumbai",
                property_type="Home",
                price_per_night=15405.0,  # 30,810 for 2 nights
                cleaning_fee=900.0,
                service_fee=500.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=3,
                bathrooms=3.0,
                rating=5.00,
                reviews_count=48,
                is_guest_favourite=True
            ),
            # ================= VARANASI =================
            Listing(
                host_id=host_aarav.id,
                title="Cozy Bhelupura Flat near Ghats",
                location="Bhelupura, Varanasi",
                property_type="Flat",
                price_per_night=6512.0,  # 13,024 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=14,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Heritage Bungalow in Varanasi",
                location="Varanasi, Uttar Pradesh",
                property_type="Bungalow",
                price_per_night=4066.5,  # 8,133 for 2 nights
                cleaning_fee=500.0,
                service_fee=220.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Free parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=3,
                bathrooms=2.5,
                rating=4.81,
                reviews_count=29,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Charming Flat with Balcony",
                location="Bhelupura, Varanasi",
                property_type="Flat",
                price_per_night=3860.0,  # 7,720 for 2 nights
                cleaning_fee=350.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.93,
                reviews_count=22,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Premium Varanasi Stay",
                location="Varanasi, Uttar Pradesh",
                property_type="Flat",
                price_per_night=4913.0,  # 9,826 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=2,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=10,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Comfortable Studio in Bhelupura",
                location="Bhelupura, Varanasi",
                property_type="Flat",
                price_per_night=3254.5,  # 6,509 for 2 nights
                cleaning_fee=300.0,
                service_fee=120.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=18,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Deluxe Family Flat in Bhelupura",
                location="Bhelupura, Varanasi",
                property_type="Flat",
                price_per_night=3674.0,  # 7,348 for 2 nights
                cleaning_fee=350.0,
                service_fee=160.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=5.00,
                reviews_count=25,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Budget Studio near Temple",
                location="Bhelupura, Varanasi",
                property_type="Flat",
                price_per_night=2793.5,  # 5,587 for 2 nights
                cleaning_fee=250.0,
                service_fee=110.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.81,
                reviews_count=31,
                is_guest_favourite=False
            ),

            # ================= HYDERABAD =================
            Listing(
                host_id=host_aarav.id,
                title="Modern Flat in Center of City",
                location="Hyderabad, Telangana",
                property_type="Flat",
                price_per_night=7850.0,  # 15,700 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=5.00,
                reviews_count=36,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Elegant Apartment in Somajiguda",
                location="Somajiguda, Hyderabad",
                property_type="Apartment",
                price_per_night=6391.0,  # 12,782 for 2 nights
                cleaning_fee=450.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.90,
                reviews_count=18,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Luxury Madhapur Flat near Hitec City",
                location="Madhapur, Hyderabad",
                property_type="Flat",
                price_per_night=9015.5,  # 18,031 for 2 nights
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.84,
                reviews_count=42,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Comfortable Transit Flat",
                location="Hyderabad, Telangana",
                property_type="Flat",
                price_per_night=3237.5,  # 6,475 for 2 nights
                cleaning_fee=300.0,
                service_fee=130.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.85,
                reviews_count=15,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Quiet Retreat in Tolichowki South",
                location="Tolichowki South, Hyderabad",
                property_type="Flat",
                price_per_night=2969.5,  # 5,939 for 2 nights
                cleaning_fee=300.0,
                service_fee=120.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.92,
                reviews_count=20,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Spacious Flat in Kukatpally",
                location="Kukatpally, Hyderabad",
                property_type="Flat",
                price_per_night=4221.5,  # 8,443 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.90,
                reviews_count=27,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Premium Heritage Villa in Jubilee Hills",
                location="Jubilee Hills, Hyderabad",
                property_type="Villa",
                price_per_night=7805.5,  # 15,611 for 2 nights
                cleaning_fee=700.0,
                service_fee=350.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=4,
                bathrooms=3.5,
                rating=4.87,
                reviews_count=33,
                is_guest_favourite=False
            ),

            # ================= MYSORE =================
            Listing(
                host_id=host_aarav.id,
                title="Elegant Boutique Hotel Mysore",
                location="Mysore, Karnataka",
                property_type="Hotel",
                price_per_night=2400.0,  # 2,400 for 1 night
                cleaning_fee=300.0,
                service_fee=120.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.83,
                reviews_count=45,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Modern Flat in Mysore",
                location="Mysore, Karnataka",
                property_type="Flat",
                price_per_night=2016.0,  # 2,016 for 1 night
                cleaning_fee=250.0,
                service_fee=100.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.95,
                reviews_count=24,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Cozy Guest Room in Mysore",
                location="Mysore, Karnataka",
                property_type="Room",
                price_per_night=1378.0,  # 1,378 for 1 night
                cleaning_fee=150.0,
                service_fee=60.0,
                amenities=json.dumps(["Wifi", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.96,
                reviews_count=12,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Portuguese Heritage Home in Mysore",
                location="Mysore, Karnataka",
                property_type="Home",
                price_per_night=3424.0,  # 3,424 for 1 night
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Free parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                ]),
                max_guests=5,
                bedrooms=2,
                beds=3,
                bathrooms=2.0,
                rating=5.00,
                reviews_count=8,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Sunlit Flat near Palace",
                location="Mysore, Karnataka",
                property_type="Flat",
                price_per_night=3500.0,  # 3,500 for 1 night
                cleaning_fee=300.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=2,
                bathrooms=1.0,
                rating=4.82,
                reviews_count=19,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Comfortable Place to Stay Mysore",
                location="Mysore, Karnataka",
                property_type="Place to stay",
                price_per_night=2100.0,  # 2,100 for 1 night
                cleaning_fee=200.0,
                service_fee=90.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.97,
                reviews_count=31,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Bespoke Flat in Basavanahalli",
                location="Basavanahalli, Mysore",
                property_type="Flat",
                price_per_night=5999.0,  # 5,999 for 1 night
                cleaning_fee=400.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=1.5,
                rating=4.96,
                reviews_count=15,
                is_guest_favourite=False
            ),

            # ================= MADIKERI =================
            Listing(
                host_id=host_aarav.id,
                title="Scenic Townhouse in Madikeri Hills",
                location="Madikeri, Karnataka",
                property_type="Townhouse",
                price_per_night=4019.0,  # 8,038 for 2 nights
                cleaning_fee=400.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.94,
                reviews_count=21,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Tranquil Home in Madikeri",
                location="Madikeri, Karnataka",
                property_type="Home",
                price_per_night=5683.0,  # 11,366 for 2 nights
                cleaning_fee=450.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Free parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.86,
                reviews_count=14,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Cozy Green Home",
                location="Madikeri, Karnataka",
                property_type="Home",
                price_per_night=2168.5,  # 4,337 for 2 nights
                cleaning_fee=250.0,
                service_fee=100.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.76,
                reviews_count=18,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Spacious Hilltop Villa",
                location="Madikeri, Karnataka",
                property_type="Home",
                price_per_night=13694.5,  # 27,389 for 2 nights
                cleaning_fee=800.0,
                service_fee=400.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                ]),
                max_guests=8,
                bedrooms=4,
                beds=5,
                bathrooms=4.0,
                rating=4.92,
                reviews_count=29,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="Portuguese Heritage Home in Madikeri",
                location="Madikeri, Karnataka",
                property_type="Home",
                price_per_night=3184.0,  # 6,368 for 2 nights
                cleaning_fee=350.0,
                service_fee=150.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.82,
                reviews_count=11,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Luxury Portuguese Villa",
                location="Madikeri, Karnataka",
                property_type="Villa",
                price_per_night=14065.0,  # 28,130 for 2 nights
                cleaning_fee=900.0,
                service_fee=450.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                ]),
                max_guests=4,
                bedrooms=3,
                beds=4,
                bathrooms=3.0,
                rating=4.94,
                reviews_count=35,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Comfortable Family Home",
                location="Madikeri, Karnataka",
                property_type="Home",
                price_per_night=7350.0,  # 14,700 for 2 nights
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.96,
                reviews_count=22,
                is_guest_favourite=False
            ),
            # ================= BENGALURU =================
            Listing(
                host_id=host_aarav.id,
                title="Luxury Penthouse with Rooftop Garden",
                location="Indiranagar, Bengaluru",
                property_type="Penthouse",
                price_per_night=8500.0,
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Rooftop Garden", "Gym"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.95,
                reviews_count=45,
                is_guest_favourite=True
            ),
            # ================= CHENNAI =================
            Listing(
                host_id=host_ananya.id,
                title="Traditional Heritage Villa near Mylapore",
                location="Mylapore, Chennai",
                property_type="Heritage Villa",
                price_per_night=5500.0,
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Courtyard", "Parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=5,
                bedrooms=3,
                beds=3,
                bathrooms=2.0,
                rating=4.88,
                reviews_count=18,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_aarav.id,
                title="ECR Beach House with Private Deck",
                location="East Coast Road, Chennai",
                property_type="Beach House",
                price_per_night=9800.0,
                cleaning_fee=800.0,
                service_fee=400.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Pool", "Beachfront"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=6,
                bedrooms=3,
                beds=4,
                bathrooms=3.0,
                rating=4.92,
                reviews_count=33,
                is_guest_favourite=True
            ),
            # ================= MUMBAI =================
            Listing(
                host_id=host_aarav.id,
                title="Sea-Facing Studio near Juhu Beach",
                location="Juhu, Mumbai",
                property_type="Studio",
                price_per_night=6200.0,
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Ocean View"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ]),
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1.0,
                rating=4.82,
                reviews_count=76,
                is_guest_favourite=False
            ),
            # ================= DELHI =================
            Listing(
                host_id=host_ananya.id,
                title="Chic Apartment in Hauz Khas Village",
                location="Hauz Khas, Delhi",
                property_type="Apartment",
                price_per_night=4800.0,
                cleaning_fee=400.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Balcony"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=2,
                bathrooms=1.5,
                rating=4.91,
                reviews_count=52,
                is_guest_favourite=True
            ),
            # ================= KOLKATA =================
            Listing(
                host_id=host_aarav.id,
                title="Colonial Mansion Suite in Ballygunge",
                location="Ballygunge, Kolkata",
                property_type="Mansion Suite",
                price_per_night=4200.0,
                cleaning_fee=350.0,
                service_fee=180.0,
                amenities=json.dumps(["Wifi", "Kitchen", "AC", "Library", "Vintage Decor"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
                ]),
                max_guests=3,
                bedrooms=1,
                beds=2,
                bathrooms=1.0,
                rating=4.94,
                reviews_count=29,
                is_guest_favourite=True
            ),
            # ================= HILL STATIONS =================
            Listing(
                host_id=host_ananya.id,
                title="Solang Valley Pine Wood Cottage",
                location="Manali, Himachal Pradesh",
                property_type="Cottage",
                price_per_night=6800.0,
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Fireplace", "Mountain View"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.96,
                reviews_count=41,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Mall Road View Mountain Cabin",
                location="Shimla, Himachal Pradesh",
                property_type="Cabin",
                price_per_night=5900.0,
                cleaning_fee=400.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Heating", "Scenic View"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=1.5,
                rating=4.87,
                reviews_count=26,
                is_guest_favourite=False
            ),
            Listing(
                host_id=host_ananya.id,
                title="Heritage Villa surrounded by Tea Gardens",
                location="Ooty, Tamil Nadu",
                property_type="Heritage Villa",
                price_per_night=7200.0,
                cleaning_fee=600.0,
                service_fee=300.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Fireplace", "Garden", "Parking"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                ]),
                max_guests=6,
                bedrooms=3,
                beds=4,
                bathrooms=3.0,
                rating=4.93,
                reviews_count=37,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_aarav.id,
                title="Misty Hills Tea Retreat",
                location="Munnar, Kerala",
                property_type="Cottage",
                price_per_night=6400.0,
                cleaning_fee=500.0,
                service_fee=250.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Balcony", "Tea Plantation Tour"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.95,
                reviews_count=48,
                is_guest_favourite=True
            ),
            Listing(
                host_id=host_ananya.id,
                title="Kanchenjunga Panoramic View Lodge",
                location="Darjeeling, West Bengal",
                property_type="Mountain Lodge",
                price_per_night=5200.0,
                cleaning_fee=400.0,
                service_fee=200.0,
                amenities=json.dumps(["Wifi", "Kitchen", "Heating", "Mountain View"]),
                photos=json.dumps([
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                ]),
                max_guests=4,
                bedrooms=2,
                beds=2,
                bathrooms=2.0,
                rating=4.90,
                reviews_count=31,
                is_guest_favourite=False
            )
        ]
        for listing in listings:
            db.add(listing)
        db.commit()

        # Refresh listings to get their generated IDs
        for listing in listings:
            db.refresh(listing)

        # Seed a confirmed booking for the Malibu villa so overlap validation has a real conflict
        seeded_booking = Booking(
            listing_id=listings[0].id,
            guest_id=guest_liam.id,
            check_in=datetime.date.today() + datetime.timedelta(days=2),
            check_out=datetime.date.today() + datetime.timedelta(days=7),
            guest_count=2,
            total_price=2430.0,
            status="confirmed"
        )
        db.add(seeded_booking)
        db.commit()

        # Seed wishlist items for guest Liam (ID=3) to listings 1 (Malibu Villa) and 2 (Goa Studio)
        wishlist_item_1 = Wishlist(
            user_id=guest_liam.id,
            listing_id=listings[0].id
        )
        wishlist_item_2 = Wishlist(
            user_id=guest_liam.id,
            listing_id=listings[1].id
        )
        db.add(wishlist_item_1)
        db.add(wishlist_item_2)
        db.commit()

        print("Database successfully seeded with listings, bookings, and wishlists.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
