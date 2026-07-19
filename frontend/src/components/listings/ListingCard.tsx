"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "../../types";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load wishlist from localStorage on mount
useEffect(() => {
  if (!currentUser) {
    setIsFavorite(false);
    return;
  }

  const favorites = JSON.parse(
    localStorage.getItem("airbnb_favorites") || "[]"
  ) as number[];

  setIsFavorite(favorites.includes(listing.id));
}, [listing.id, currentUser]);

const toggleFavorite = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  // Redirect guests to login
  if (!currentUser) {
    router.push("/login");
    return;
  }

  const favorites = JSON.parse(
    localStorage.getItem("airbnb_favorites") || "[]"
  ) as number[];

  if (isFavorite) {
    const updated = favorites.filter((id) => id !== listing.id);

    setIsFavorite(false);
    localStorage.setItem("airbnb_favorites", JSON.stringify(updated));

    try {
      await api.wishlists.remove(listing.id);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);

      // Rollback UI
      setIsFavorite(true);
      localStorage.setItem(
        "airbnb_favorites",
        JSON.stringify([...updated, listing.id])
      );
    }
  } else {
    const updated = [...favorites, listing.id];

    setIsFavorite(true);
    localStorage.setItem("airbnb_favorites", JSON.stringify(updated));

    try {
      await api.wishlists.add(listing.id);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);

      // Rollback UI
      setIsFavorite(false);
      localStorage.setItem(
        "airbnb_favorites",
        JSON.stringify(favorites)
      );
    }
  }
};

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === listing.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="group flex flex-col gap-2.5 relative cursor-pointer">
      
      {/* Photo Carousel Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs">
        <Link href={`/listings/${listing.id}`}>
          <img
            src={listing.photos[currentImageIndex] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"}
            alt={listing.title}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Guest Favourite Badge (Screenshot 1) */}
        {listing.is_guest_favourite && (
          <div className="absolute left-3 top-3 z-10 px-3 py-1 bg-white/95 border border-gray-150 text-[11px] font-bold text-gray-800 rounded-full shadow-xs">
            Guest favourite
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          className="absolute right-3 top-3 p-1 rounded-full bg-transparent border-none cursor-pointer focus:outline-none transition active:scale-90 z-20"
        >
          <Heart
            className={`w-5.5 h-5.5 transition ${
              isFavorite 
                ? "fill-[#FF385C] stroke-[#FF385C]" 
                : "fill-black/25 stroke-white stroke-[2px]"
            }`}
          />
        </button>

        {/* Carousel Slider Arrows (only visible on group hover) */}
        {listing.photos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-sm border border-gray-150 opacity-0 group-hover:opacity-100 transition hover:bg-white hover:scale-105 z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-sm border border-gray-150 opacity-0 group-hover:opacity-100 transition hover:bg-white hover:scale-105 z-10"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
            </button>
          </>
        )}

        {/* Carousel Slide Indicators */}
        {listing.photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {listing.photos.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-white scale-110" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Listing Meta Info (Goa style match) */}
      <Link href={`/listings/${listing.id}`} className="flex flex-col gap-0.5 text-[14px]">
        <span className="font-semibold text-gray-800">
          {listing.property_type} in {listing.location.split(',')[0]}
        </span>
        
        <div className="flex items-center gap-1.5 text-gray-500 font-light mt-0.5">
          {listing.location.toLowerCase().includes("mysore") || listing.location.toLowerCase().includes("basavanahalli") ? (
            <span>₹{Math.round(listing.price_per_night).toLocaleString('en-IN')} for 1 night</span>
          ) : (
            <span>₹{Math.round(listing.price_per_night * 2).toLocaleString('en-IN')} for 2 nights</span>
          )}
          <span>·</span>
          <span className="flex items-center gap-0.5 text-gray-700 font-medium">
            <Star className="w-3 h-3 fill-current stroke-current" />
            <span>{listing.rating.toFixed(2)}</span>
          </span>
        </div>
      </Link>

    </div>
  );
}
