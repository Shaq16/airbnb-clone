"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { Listing, Booking } from "../../../types";
import { 
  Building, 
  DollarSign, 
  Plus, 
  Calendar, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Users 
} from "lucide-react";

function HostDashboardContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "calendar";

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHostData = async () => {
    try {
      // Fetch host's own bookings/reservations
      const resData = await api.bookings.dashboard();
      setReservations(resData);

      // Fetch all listings and filter by current user's host_id
      const allListings = await api.listings.list();
      const filtered = allListings.filter((l) => l.host_id === currentUser?.id);
      setMyListings(filtered);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load host dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/");
      } else {
        setTimeout(() => {
          fetchHostData();
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm("Are you sure you want to delete this listing? All bookings associated with it will be deleted.")) {
      return;
    }

    setLoading(true);
    try {
      await api.listings.delete(listingId);
      // Re-fetch listing data
      fetchHostData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not delete listing.");
      setLoading(false);
    }
  };

  // Calculate earnings
  const getHostStats = () => {
    const activeReservations = reservations.filter((r) => r.status === "confirmed");
    const earnings = activeReservations.reduce((sum, r) => sum + r.total_price, 0);
    return {
      earnings,
      bookingCount: activeReservations.length,
    };
  };

  const stats = getHostStats();

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-sm w-[40%]" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Welcome back, {currentUser?.name}. Manage listings and reservations.
          </p>
        </div>
        <Link
          href="/host/listings/new"
          className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>List a new property</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl max-w-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Earnings</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 block">${stats.earnings.toFixed(2)}</span>
          </div>
          <div className="p-3.5 bg-green-100 text-green-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Listings</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 block">{myListings.length}</span>
          </div>
          <div className="p-3.5 bg-blue-100 text-blue-700 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Reservations Booked</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 block">{stats.bookingCount}</span>
          </div>
          <div className="p-3.5 bg-purple-100 text-purple-700 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Tab Render - Calendar (Reservations) vs Listings */}
      <div className="w-full">
        {activeTab === "listings" ? (
          /* My Listings Section */
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">My Listings ({myListings.length})</h2>
            
            {myListings.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-2xl py-12 px-4 text-center">
                <p className="text-sm text-gray-500 font-light mb-4">You have not created any listings yet.</p>
                <Link href="/host/listings/new" className="text-sm font-bold text-brand hover:underline">
                  Create your first listing now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myListings.map((listing) => (
                  <div 
                    key={listing.id}
                    className="border border-gray-200 p-4 rounded-2xl flex gap-4 items-center justify-between hover:shadow-sm transition bg-white"
                  >
                    <div className="flex gap-4 items-center truncate">
                      <img 
                        src={listing.photos[0]} 
                        alt={listing.title} 
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="truncate">
                        <h3 className="font-bold text-gray-900 text-sm truncate max-w-[250px]">{listing.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{listing.location}</p>
                        <p className="text-xs font-semibold text-gray-800 mt-1">${listing.price_per_night} / night</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/host/listings/${listing.id}/edit`}
                        className="p-2 border border-gray-200 hover:bg-gray-50 hover:border-black rounded-lg text-gray-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-2 border border-gray-200 hover:bg-red-50 hover:border-red-300 rounded-lg text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Guest Reservations Section */
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Booked Reservations ({reservations.length})</h2>

            {reservations.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-2xl py-12 px-4 text-center">
                <p className="text-sm text-gray-500 font-light">No reservations booked on your properties yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((res) => {
                  const isCancelled = res.status === "cancelled";
                  
                  return (
                    <div 
                      key={res.id}
                      className={`border p-4 rounded-2xl space-y-3 ${
                        isCancelled ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          {res.guest?.avatar_url ? (
                            <img 
                              src={res.guest.avatar_url} 
                              alt={res.guest.name} 
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                              {res.guest?.name ? res.guest.name.charAt(0) : "G"}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-sm text-gray-800">{res.guest?.name || "Guest"}</h4>
                            <p className="text-[10px] text-gray-500">{res.guest?.email}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          isCancelled ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 text-gray-600 border border-gray-150">
                        <p className="font-semibold text-gray-800 text-sm line-clamp-1">{res.listing?.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>Dates: {res.check_in} to {res.check_out}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>Guests: {res.guest_count} guest{res.guest_count > 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-gray-500">Total Price Payout:</span>
                        <span className="font-bold text-gray-800 text-sm">${res.total_price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default function HostDashboardPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-sm w-[40%]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <HostDashboardContent />
    </Suspense>
  );
}
