import sys
from app.database import SessionLocal
from app.models import User, Listing, Booking, Wishlist

# Reconfigure stdout to use UTF-8 to prevent UnicodeEncodeErrors with currency symbols on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def inspect_users(db):
    users = db.query(User).all()
    print(f"\n=== USERS IN DATABASE: {len(users)} ===")
    print(f"{'ID':<4} | {'Name':<20} | {'Email':<25} | {'Role':<10}")
    print("-" * 70)
    for u in users:
        print(f"{u.id:<4} | {u.name:<20} | {u.email:<25} | {u.role:<10}")
    print("-" * 70)

def inspect_listings(db):
    listings = db.query(Listing).all()
    print(f"\n=== LISTINGS IN DATABASE: {len(listings)} ===")
    print(f"{'ID':<4} | {'Host ID':<8} | {'Title':<30} | {'Location':<25} | {'Price/Night':<12}")
    print("-" * 90)
    for l in listings:
        title = l.title or "N/A"
        if len(title) > 28:
            title = title[:25] + "..."
        location = l.location or "N/A"
        if len(location) > 23:
            location = location[:20] + "..."
        print(f"{l.id:<4} | {l.host_id:<8} | {title:<30} | {location:<25} | ₹{l.price_per_night:<12}")
    print("-" * 90)

def inspect_bookings(db):
    bookings = db.query(Booking).all()
    print(f"\n=== BOOKINGS IN DATABASE: {len(bookings)} ===")
    print(f"{'ID':<4} | {'Guest ID':<8} | {'Type':<12} | {'Title/Listing':<30} | {'Status':<10} | {'Total Price':<12}")
    print("-" * 90)
    for b in bookings:
        title = b.title
        if not title and b.listing_id:
            # Try to get the listing title
            listing = db.query(Listing).filter(Listing.id == b.listing_id).first()
            title = listing.title if listing else f"Listing #{b.listing_id}"
        title = title or "N/A"
        if len(title) > 28:
            title = title[:25] + "..."
        print(f"{b.id:<4} | {b.guest_id:<8} | {b.booking_type:<12} | {title:<30} | {b.status:<10} | ₹{b.total_price:<12}")
    print("-" * 90)


def inspect_wishlists(db):
    wishlists = db.query(Wishlist).all()
    print(f"\n=== WISHLISTS IN DATABASE: {len(wishlists)} ===")
    print(f"{'ID':<4} | {'User ID':<8} | {'User Name':<20} | {'Listing ID':<10} | {'Listing Title':<30}")
    print("-" * 80)
    for w in wishlists:
        user = db.query(User).filter(User.id == w.user_id).first()
        listing = db.query(Listing).filter(Listing.id == w.listing_id).first()
        user_name = user.name if user else "N/A"
        listing_title = listing.title if listing else "N/A"
        if len(listing_title) > 28:
            listing_title = listing_title[:25] + "..."
        print(f"{w.id:<4} | {w.user_id:<8} | {user_name:<20} | {w.listing_id:<10} | {listing_title:<30}")
    print("-" * 80)

def main():
    db = SessionLocal()
    try:
        if len(sys.argv) > 1:
            arg = sys.argv[1].lower()
            if arg in ["--users", "-u"]:
                inspect_users(db)
            elif arg in ["--listings", "-l"]:
                inspect_listings(db)
            elif arg in ["--bookings", "-b"]:
                inspect_bookings(db)
            elif arg in ["--wishlists", "-w"]:
                inspect_wishlists(db)
            else:
                # Show everything
                inspect_users(db)
                inspect_listings(db)
                inspect_bookings(db)
                inspect_wishlists(db)
        else:
            # Show everything by default
            inspect_users(db)
            inspect_listings(db)
            inspect_bookings(db)
            inspect_wishlists(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()

