"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Listing } from "../../types";

import {
  getServiceTitle,
  DEFAULT_SERVICE,
  SERVICES_DATA,
} from "@/lib/serviceData";

// MOCK DATA for lookup
const EXPERIENCES_DATA: Record<number, any> = {
  3: {
    id: 3,
    title: "Play with clay : Fun weekend pottery workshop",
    category: "Art workshops",
    price: 2000,
    rating: 5.0,
    reviewsCount: 2,
    image: "https://images.unsplash.com/photo-1565192647048-f997ee879ab8?auto=format&fit=crop&w=400&q=80"
  }
};

function BookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAuth();

  const type = searchParams.get("type") || "stay";
  const idVal = Number(searchParams.get("id"));
  const checkIn = searchParams.get("checkIn") || "2026-07-24";
  const checkOut = searchParams.get("checkOut") || "2026-07-26";
  const packageIndex = Number(searchParams.get("packageIndex") || "0");

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(type === "stay");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(Number(searchParams.get("guests") || "1"));
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // Fetch listing details if booking a stay
  useEffect(() => {
    if (type === "stay" && idVal) {
      setLoading(true);
      api.listings.get(idVal)
        .then((data) => {
          setListing(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setBookingError("Failed to load property details.");
          setLoading(false);
        });
    }
  }, [type, idVal]);

  // Compute stay details
  const diffDays = React.useMemo(() => {
    if (!checkIn || !checkOut) return 2;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 2;
  }, [checkIn, checkOut]);

  // Calculations for Stays
  const pricePerNight = listing ? listing.price_per_night : 4336;
  const rawBase = pricePerNight * diffDays;
  const taxes = Math.round(rawBase * 0.05);
  const totalStay = rawBase + taxes;

  // Resolve experience or service details
  const experienceItem = EXPERIENCES_DATA[idVal] || {
    id: idVal,
    title: "Experience the Offbeat City with a Local",
    category: "Culture tours",
    price: 1500,
    rating: 5.0,
    reviewsCount: 12,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80"
  };

  const serviceItem = SERVICES_DATA[idVal] || DEFAULT_SERVICE(idVal, getServiceTitle(idVal));

  const selectedPackage = serviceItem.subPackages?.[packageIndex] || { title: "Standard Package", price: 5000 };

  const handlePaymentConfirm = async () => {
    setBookingError(null);
    setBookingSuccess(false);

    // Guard: user must be logged in to book
    if (!currentUser) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect_url=${encodeURIComponent(currentPath)}`);
      return;
    }

    try {
      if (type === "stay" && idVal) {
        // Create actual database booking for stays
        await api.bookings.create({
          listing_id: idVal,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: guestCount,
          booking_type: "stay"
        });
      } else {
        // Create database booking for experiences / services
        await api.bookings.create({
          booking_type: type as "experience" | "service",
          title: type === "experience" ? experienceItem.title : serviceItem.title,
          category: type === "experience" ? experienceItem.category : serviceItem.category,
          total_price: type === "experience" ? (experienceItem.price * guestCount) : selectedPackage.price,
          check_in: checkIn,
          guest_count: guestCount,
          image: type === "experience" ? experienceItem.image : (serviceItem.mainImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80"),
          package_title: type === "service" ? selectedPackage.title : undefined
        });
      }

      // Show success anim
      setBookingSuccess(true);
      setTimeout(() => {
        router.push("/my-trips");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setBookingError(err.message || "Failed to process booking. Please try again.");
    }
  };

  // Helper date formatter
  const formatDateRange = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleString("default", { month: "short" })} ${s.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FF385C] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Preparing checkout...</p>
      </div>
    );
  }

  // Determine metadata depending on checkout type
  const title = type === "stay" ? (listing?.title || "Laxmi Studios") : type === "experience" ? experienceItem.title : serviceItem.title;
  const ratingVal = type === "stay" ? (listing?.rating || 4.9) : type === "experience" ? experienceItem.rating : (serviceItem.rating || 5.0);
  const reviewsCountVal = type === "stay" ? (listing?.reviews_count || 14) : type === "experience" ? experienceItem.reviewsCount : (serviceItem.reviewsCount || 8);
  const categoryLabel = type === "stay" ? "Guest favourite" : type === "experience" ? experienceItem.category : serviceItem.category;
  const imgUrl = type === "stay" ? (listing?.photos?.[0] || "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400") : type === "experience" ? experienceItem.image : (serviceItem.mainImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80");

  // Price calculation values
  const priceDetails = type === "stay" ? {
    sub: `${diffDays} night${diffDays > 1 ? "s" : ""} x ₹${pricePerNight.toLocaleString("en-IN")}`,
    subCost: rawBase,
    tax: taxes,
    total: totalStay
  } : type === "experience" ? {
    sub: `${guestCount} guest${guestCount > 1 ? "s" : ""} x ₹${experienceItem.price.toLocaleString("en-IN")}`,
    subCost: experienceItem.price * guestCount,
    tax: 0,
    total: experienceItem.price * guestCount
  } : {
    sub: selectedPackage.title,
    subCost: selectedPackage.price,
    tax: 0,
    total: selectedPackage.price
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans pb-24 select-none">
      
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-full hover:bg-gray-150 transition border border-gray-250 cursor-pointer flex items-center justify-center bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 text-gray-800" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Confirm and pay</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Razorpay details & trigger */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900">Proceed to payment</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              You&apos;ll be directed to Razorpay to complete payment securely using UPI, Card, Netbanking, or Wallets.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-[11px] text-gray-500 font-light mb-4">
              By selecting the button below, I agree to the <span className="underline cursor-pointer font-bold">booking terms</span> and cancellation policy.
            </p>

            {bookingSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl mb-4 text-center animate-bounce">
                🎉 Payment Confirmed! Your reservation is complete. Redirecting to Trips...
              </div>
            )}

            {bookingError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl mb-4">
                ⚠️ {bookingError}
              </div>
            )}

            <button
              onClick={handlePaymentConfirm}
              disabled={bookingSuccess}
              className="w-full sm:w-auto px-12 py-3.5 bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-gray-300 text-white font-extrabold rounded-xl transition text-center shadow-md active:scale-98 cursor-pointer text-sm"
            >
              Confirm and pay
            </button>
          </div>

        </div>

        {/* Right Column: Reservation Detail Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-xl space-y-5">
            
            {/* Listing Header block */}
            <div className="flex gap-4 pb-5 border-b border-gray-150">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex flex-col justify-between py-1">
                <h4 className="font-extrabold text-sm text-gray-800 line-clamp-2 leading-tight">
                  {title}
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800">
                    <Star className="w-3 h-3 fill-black stroke-black" />
                    <span>{ratingVal.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({reviewsCountVal})</span>
                    <span className="text-gray-400 font-normal">·</span>
                    <span className="text-gray-500 font-bold">{categoryLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 font-light">
              This reservation is non-refundable. <span className="underline font-bold cursor-pointer">Full policy</span>
            </p>

            {/* Inputs displays */}
            <div className="space-y-4 pt-3 border-t border-gray-150">
              {type === "stay" && (
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase font-bold">Dates</span>
                    <span>{formatDateRange(checkIn, checkOut)}</span>
                  </div>
                  <button onClick={() => router.back()} className="px-3 py-1.5 border border-gray-250 rounded-lg text-[10px] hover:border-black transition cursor-pointer">
                    Change
                  </button>
                </div>
              )}

              <div className="text-xs font-bold text-gray-800 pt-1 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase font-bold">Guests</span>
                    <span>{guestCount} guest{guestCount > 1 ? "s" : ""}</span>
                  </div>
                  <button 
                    onClick={() => setShowGuestPicker(!showGuestPicker)} 
                    className="px-3 py-1.5 border border-gray-250 rounded-lg text-[10px] hover:border-black transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                {showGuestPicker && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-150 animate-in fade-in duration-200">
                    <span className="text-xs font-bold text-gray-700">Number of guests</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        disabled={guestCount <= 1}
                        className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-xs font-extrabold text-gray-900 w-5 text-center">{guestCount}</span>
                      <button 
                        type="button"
                        onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                        disabled={guestCount >= 10}
                        className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price breakdown details */}
            <div className="pt-5 border-t border-gray-150 space-y-3.5 text-xs text-gray-650">
              <h4 className="font-extrabold text-sm text-gray-800 pb-1">Price details</h4>
              
              <div className="flex justify-between items-center">
                <span className="underline">{priceDetails.sub}</span>
                <span className="text-gray-900 font-bold">₹{priceDetails.subCost.toLocaleString("en-IN")}</span>
              </div>

              {priceDetails.tax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="underline">Taxes</span>
                  <span className="text-gray-900 font-bold">₹{priceDetails.tax.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between items-center font-black text-gray-900 text-sm pt-4 border-t border-gray-150">
                <span>Total INR</span>
                <span>₹{priceDetails.total.toLocaleString("en-IN")}</span>
              </div>

              <span className="text-[10px] text-gray-400 underline block cursor-pointer text-center pt-2">
                Price breakdown
              </span>
            </div>

          </div>

          {/* Average status green badge */}
          <div className="bg-[#E8F5E9] border border-green-150 rounded-2xl p-4 flex gap-3 items-center text-xs text-green-800 font-semibold select-none">
            <span className="text-base">🏷️</span>
            <span>Your price is below the 60-day average</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FF385C] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading payment gateway...</p>
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}
