import { User, Listing, Booking, Review, Wishlist } from "../types";

const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = "API Request failed";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // --- AUTH ---
  auth: {
    me: () => request<User>("/auth/me"),
    users: () => request<User[]>("/auth/users"),
    switch: (userId: number) =>
      request<User>(`/auth/switch/${userId}`, { method: "POST" }),
    checkEmail: (email: string) =>
      request<{ exists: boolean; name: string | null }>("/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    login: (data: { email: string; password: string }) =>
      request<User>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: { name: string; email: string; password: string; date_of_birth?: string }) =>
      request<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    sendOtp: (email: string) =>
      request<{ status: string; message: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    verifyOtp: (data: { email: string; otp: string }) =>
      request<User>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => request<{status: string}>("/auth/logout", { method: "POST" }),
  },

  // --- LISTINGS ---
  listings: {
    list: (filters?: {
      location?: string;
      guests?: number;
      min_price?: number;
      max_price?: number;
      property_type?: string;
      amenities?: string[];
    }) => {
      const params = new URLSearchParams();
      if (filters?.location) params.append("location", filters.location);
      if (filters?.guests) params.append("guests", String(filters.guests));
      if (filters?.min_price !== undefined)
        params.append("min_price", String(filters.min_price));
      if (filters?.max_price !== undefined)
        params.append("max_price", String(filters.max_price));
      if (filters?.property_type)
        params.append("property_type", filters.property_type);
      if (filters?.amenities && filters.amenities.length > 0) {
        filters.amenities.forEach((a) => params.append("amenities", a));
      }

      const queryString = params.toString();
      return request<Listing[]>(`/listings${queryString ? `?${queryString}` : ""}`);
    },
    get: (id: number) => request<Listing>(`/listings/${id}`),
    create: (data: Omit<Listing, "id" | "rating" | "reviews_count">) =>
      request<Listing>("/listings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Listing>) =>
      request<Listing>(`/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/listings/${id}`, { method: "DELETE" }),
    addReview: (listingId: number, data: { rating: number; comment: string }) =>
      request<Review>(`/listings/${listingId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // --- BOOKINGS ---
  bookings: {
    create: (data: {
      listing_id?: number;
      check_in: string;
      check_out?: string;
      guest_count: number;
      booking_type: "stay" | "experience" | "service";
      title?: string;
      category?: string;
      image?: string;
      package_title?: string;
      total_price?: number;
    }) =>
      request<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    myTrips: () => request<Booking[]>("/bookings/my-trips"),
    dashboard: () => request<Booking[]>("/bookings/dashboard"),
    cancel: (id: number) =>
      request<void>(`/bookings/${id}`, { method: "DELETE" }),
  },

  // --- WISHLISTS ---
  wishlists: {
    list: () => request<Wishlist[]>("/wishlists"),
    add: (listingId: number) =>
      request<Wishlist>(`/wishlists/${listingId}`, { method: "POST" }),
    remove: (listingId: number) =>
      request<void>(`/wishlists/${listingId}`, { method: "DELETE" }),
  },
};
