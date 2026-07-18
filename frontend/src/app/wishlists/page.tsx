"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Listing } from "../../types";
import ListingCard from "../../components/listings/ListingCard";

export default function WishlistsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoadingListings(true);
      if (currentUser) {
        const dbWishlist = await api.wishlists.list();
        const listings = dbWishlist.map((w) => w.listing);
        setFavoriteListings(listings);
        
        // Sync local storage
        const favIds = dbWishlist.map((w) => w.listing_id);
        localStorage.setItem("airbnb_favorites", JSON.stringify(favIds));
      } else {
        const allListings = await api.listings.list();
        const favorites = JSON.parse(localStorage.getItem("airbnb_favorites") || "[]");
        const filtered = allListings.filter((l) => favorites.includes(l.id));
        setFavoriteListings(filtered);
      }
    } catch (err) {
      console.error("Failed to load wishlist details:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace("/login?redirect_url=%2Fwishlists");
      } else {
        fetchFavorites();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, loading]);

  if (loading || loadingListings) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-[#FF385C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition inline-flex">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <Link href="/" className="text-[#FF385C] font-bold text-xl flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.644-.651-.645.651-.256.26c-2.153 2.128-4.485 3.386-6.709 3.386-3.48 0-6.357-2.416-6.357-6.478l.001-.228.011-.415c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.312-.001.18c0 2.775 1.519 4.222 3.943 4.222 1.488 0 3.267-.84 5.253-2.617l.783-.733 1.522-1.464 1.522 1.464.783.733c1.986 1.777 3.765 2.617 5.253 2.617 2.424 0 3.943-1.447 3.943-4.222l-.001-.18-.009-.312c-.032-.585-.178-1.169-.605-2.24l-.345-.836c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.239 3 16 3z" />
          </svg>
        </Link>
        <div className="w-9" /> {/* Spacer to center the logo */}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wishlists</h1>
        
        {favoriteListings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl py-20 px-4 text-center max-w-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-1.5">No wishlists created... yet!</h3>
            <p className="text-sm text-gray-500 font-light mb-6">
              As you search, click the heart icon on your favorite places to save them here.
            </p>
            <Link
              href="/"
              className="border border-black bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-neutral-850"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
