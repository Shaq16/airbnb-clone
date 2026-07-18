export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  is_superhost: boolean;
}

export interface Review {
  id: number;
  listing_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface Listing {
  id: number;
  host_id: number;
  title: string;
  description?: string;
  location: string;
  property_type: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  amenities: string[];
  photos: string[];
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviews_count: number;
  host?: User;
  reviews?: Review[];
  bookings?: Booking[];
  is_guest_favourite?: boolean;
}

export interface Booking {
  id: number;
  listing_id?: number;
  guest_id: number;
  check_in: string;
  check_out?: string;
  guest_count: number;
  total_price: number;
  status: string;
  booking_type?: "stay" | "experience" | "service";
  title?: string;
  category?: string;
  image?: string;
  package_title?: string;
  listing?: Listing;
  guest?: User;
}

export interface Wishlist {
  id: number;
  user_id: number;
  listing_id: number;
  listing: Listing;
}

