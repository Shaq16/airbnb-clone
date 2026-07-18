"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import { Listing, Review } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { 
  Star, 
  MapPin, 
  Share, 
  Heart, 
  DoorOpen,
  Award,
  Calendar,
  Wifi,
  Utensils,
  Wind,
  Car,
  Briefcase,
  Users,
  Compass,
  Key,
  Shield,
  CircleAlert,
  Flame,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function ListingDetailPage() {
  const { currentUser } = useAuth();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Wishlist state
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listings.get(listingId);
      setListing(data);

      // Check favorites
      const favorites = JSON.parse(localStorage.getItem("airbnb_favorites") || "[]");
      setIsFavorite(favorites.includes(data.id));
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load property details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchListingDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const toggleFavorite = async () => {
    if (!listing) return;
    const favorites = JSON.parse(localStorage.getItem("airbnb_favorites") || "[]");
    let updated;
    if (isFavorite) {
      updated = favorites.filter((id: number) => id !== listing.id);
      setIsFavorite(false);
      localStorage.setItem("airbnb_favorites", JSON.stringify(updated));
      if (currentUser) {
        try {
          await api.wishlists.remove(listing.id);
        } catch (err) {
          console.error("Failed to remove from database wishlist:", err);
          setIsFavorite(true);
          localStorage.setItem("airbnb_favorites", JSON.stringify([...updated, listing.id]));
        }
      }
    } else {
      updated = [...favorites, listing.id];
      setIsFavorite(true);
      localStorage.setItem("airbnb_favorites", JSON.stringify(updated));
      if (currentUser) {
        try {
          await api.wishlists.add(listing.id);
        } catch (err) {
          console.error("Failed to add to database wishlist:", err);
          setIsFavorite(false);
          localStorage.setItem("airbnb_favorites", JSON.stringify(favorites));
        }
      }
    }
  };

  // Date calculation helpers
  const getNightsCount = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDateSelected = (day: number, isAugust: boolean) => {
    if (!checkIn || !checkOut) return false;
    const current = new Date(2026, isAugust ? 7 : 6, day);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return current >= start && current <= end;
  };

  const isDateStart = (day: number, isAugust: boolean) => {
    if (!checkIn) return false;
    const current = new Date(2026, isAugust ? 7 : 6, day);
    const start = new Date(checkIn);
    return current.getFullYear() === start.getFullYear() && current.getMonth() === start.getMonth() && current.getDate() === start.getDate();
  };

  const isDateEnd = (day: number, isAugust: boolean) => {
    if (!checkOut) return false;
    const current = new Date(2026, isAugust ? 7 : 6, day);
    const end = new Date(checkOut);
    return current.getFullYear() === end.getFullYear() && current.getMonth() === end.getMonth() && current.getDate() === end.getDate();
  };

  const handleCalendarDayClick = (day: number, isAugust: boolean) => {
    const clickedDate = new Date(2026, isAugust ? 7 : 6, day);
    const clickedStr = clickedDate.toISOString().split("T")[0];
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(clickedStr);
      setCheckOut("");
    } else {
      if (new Date(clickedStr) < new Date(checkIn)) {
        setCheckIn(clickedStr);
      } else {
        setCheckOut(clickedStr);
      }
    }
  };

  const nights = getNightsCount();
  const baseTotal = listing ? listing.price_per_night * nights : 0;
  const cleanFee = listing ? listing.cleaning_fee : 0;
  const svcFee = listing ? listing.service_fee : 0;
  const grandTotal = baseTotal + cleanFee + svcFee;

  const checkOverlap = (inStr: string, outStr: string) => {
    if (!listing || !listing.bookings) return false;
    const inDate = new Date(inStr);
    const outDate = new Date(outStr);

    return listing.bookings.some((b) => {
      if (!b.check_in || !b.check_out) return false;
      const bIn = new Date(b.check_in);
      const bOut = new Date(b.check_out);
      return bIn < outDate && bOut > inDate;
    });
  };

  const handleReserveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!listing) return;

    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    if (checkOverlap(checkIn, checkOut)) {
      setBookingError("These dates are already booked. Please choose different dates.");
      return;
    }

    router.push(`/book?type=stay&id=${listing.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}`);
  };

  const handleConfirmBooking = async () => {
    if (!listing) return;
    try {
      await api.bookings.create({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestCount,
        booking_type: "stay"
      });
      setBookingSuccess(true);
      setShowCheckoutModal(false);
      setTimeout(() => {
        router.push("/my-trips");
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message || "Failed to complete reservation.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (!reviewComment.trim()) {
      setReviewError("Please write a comment for your review.");
      return;
    }

    try {
      await api.listings.addReview(listingId, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setReviewComment("");
      setReviewRating(5);
      fetchListingDetails();
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-sm w-[60%]" />
        <div className="h-4 bg-gray-200 rounded-sm w-[30%]" />
        <div className="grid grid-cols-4 gap-2 h-96">
          <div className="col-span-2 bg-gray-200 rounded-l-2xl h-full" />
          <div className="bg-gray-200 h-full" />
          <div className="bg-gray-200 rounded-r-2xl h-full" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay not found</h2>
        <p className="text-gray-500 mb-6">{error || "The property you are looking for does not exist."}</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand/90 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Pad photos to always have 5 for the grid view
  const displayPhotos = [...listing.photos];
  const defaults = [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
  ];
  while (displayPhotos.length < 5) {
    displayPhotos.push(defaults[displayPhotos.length % defaults.length]);
  }

  // Dynamic host info generator based on listing ID/details
  const seed = listing.id;
  const hostNames = ["Sophia", "Ami", "Rohit", "Vikram", "Chavi", "Sneha", "Karan"];
  const hostName = listing.host?.name || hostNames[seed % hostNames.length];
  const isSuperhost = listing.host ? listing.host.is_superhost : (listing.rating >= 4.8);
  const tenureMonths = 4 + (seed * 3) % 24;
  const hostReviewsCount = 15 + (seed * 8) % 80;
  
  const hostSchool = (seed % 2 === 0) ? "Frank Anthony" : "Delhi Public School";
  const hostBorn = 1980 + (seed % 20);
  const hostFunFact = (seed % 2 === 0) ? "I host with heart, not just keys" : "I love hiking and local history";
  const hostSong = (seed % 2 === 0) ? "Can't Help Falling in Love" : "Imagine by John Lennon";
  const hostAvatar = (seed % 3 === 0) ? "👩‍💻" : (seed % 3 === 1) ? "👨‍💻" : "🧑‍💻";

  // Dynamic rating values
  const ratingCleanliness = Math.min(5.0, Number((listing.rating * 1.01).toFixed(2))).toFixed(1);
  const ratingAccuracy = Math.min(5.0, Number((listing.rating * 0.99).toFixed(2))).toFixed(1);
  const ratingCheckin = Math.min(5.0, Number((listing.rating * 1.02).toFixed(2))).toFixed(1);
  const ratingCommunication = Math.min(5.0, Number((listing.rating * 1.00).toFixed(2))).toFixed(1);
  const ratingLocation = Math.min(5.0, Number((listing.rating * 0.98).toFixed(2))).toFixed(1);
  const ratingValue = Math.min(5.0, Number((listing.rating * 0.99).toFixed(2))).toFixed(1);

  // Dynamic review category pills
  const pillCleanliness = Math.round(listing.reviews_count * 0.6);
  const pillAccuracy = Math.round(listing.reviews_count * 0.5);
  const pillBeach = Math.max(1, Math.round(listing.reviews_count * 0.1));
  const pillHospitality = Math.round(listing.reviews_count * 0.7);
  const pillComfort = Math.round(listing.reviews_count * 0.4);
  const pillLocation = Math.round(listing.reviews_count * 0.3);
  const pillCondition = Math.max(1, Math.round(listing.reviews_count * 0.15));
  const pillCheckin = Math.max(1, Math.round(listing.reviews_count * 0.25));

  // Currency logic
  const currencySymbol = "₹";
  const displayPrice = listing.price_per_night;
  const previousPrice = Math.round(displayPrice * 1.25);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* 1. Header Row - Laxmi Studios title style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          {listing.title}
        </h1>
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-800 self-start sm:self-center">
          <button className="flex items-center gap-2 hover:bg-gray-150 px-3 py-2 rounded-xl transition text-[13px]">
            <Share className="w-4 h-4 text-gray-800" />
            <span className="underline">Share</span>
          </button>
          <button 
            onClick={toggleFavorite}
            className="flex items-center gap-2 hover:bg-gray-150 px-3 py-2 rounded-xl transition text-[13px]"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF385C] stroke-[#FF385C]" : "text-gray-800"}`} />
            <span className="underline">{isFavorite ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* 2. Photo Grid - Rounded corner grid matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] bg-gray-150 relative">
        <div className="md:col-span-2 h-full overflow-hidden">
          <img 
            src={displayPhotos[0]} 
            alt="Main Photo" 
            className="w-full h-full object-cover hover:scale-[1.01] hover:brightness-95 transition duration-300"
          />
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="h-1/2 overflow-hidden">
            <img src={displayPhotos[1]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-[1.01] hover:brightness-95 transition duration-300" />
          </div>
          <div className="h-1/2 overflow-hidden">
            <img src={displayPhotos[2]} alt="Gallery 3" className="w-full h-full object-cover hover:scale-[1.01] hover:brightness-95 transition duration-300" />
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="h-1/2 overflow-hidden">
            <img src={displayPhotos[3]} alt="Gallery 4" className="w-full h-full object-cover hover:scale-[1.01] hover:brightness-95 transition duration-300" />
          </div>
          <div className="h-1/2 overflow-hidden">
            <img src={displayPhotos[4]} alt="Gallery 5" className="w-full h-full object-cover hover:scale-[1.01] hover:brightness-95 transition duration-300" />
          </div>
        </div>

        {/* Gallery button */}
        <button className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-98 transition">
          <span>Show all photos</span>
        </button>
      </div>

      {/* 3. Detailed Split content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Base Info Summary Card */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Entire {listing.property_type.toLowerCase()} in {listing.location.split(",")[0]}, India
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-light mt-1">
              {listing.max_guests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""} · {listing.beds} bed{listing.beds > 1 ? "s" : ""} · {listing.bathrooms} bathroom{listing.bathrooms > 1 ? "s" : ""}
            </p>
          </div>

          {/* Guest Favorite Badge Wreath Card - Image 1 & 2 */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Laurel wreath SVG */}
              <div className="text-black flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 3c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm-6 2c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm12 0c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm-15 4c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm18 0c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zM4 15c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm24 0c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zM6 21c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm20 0c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zM10 25c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm12 0c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-[15px] text-gray-900">Guest favourite</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">One of the most loved homes on Airbnb, according to guests</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="font-black text-lg block text-gray-800">{listing.rating.toFixed(1)}</span>
                <span className="text-[9px] text-[#FF385C] block">★★★★★</span>
              </div>
              <div className="h-8 w-[1px] bg-gray-200"></div>
              <div className="text-center pr-2">
                <span className="font-black text-lg block text-gray-800">{listing.reviews_count}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Reviews</span>
              </div>
            </div>
          </div>

          {/* Host Card - Image 2 */}
          <div className="border-b border-gray-200 pb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E3F2FD] text-[#1E88E5] font-bold text-sm cursor-pointer flex items-center justify-center flex-shrink-0">
              {hostAvatar}
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-gray-800">Hosted by {hostName}</h4>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                {isSuperhost ? "Superhost" : "Host"} · {tenureMonths} months hosting
              </p>
            </div>
          </div>

          {/* Details checklist items - Image 2 */}
          <div className="border-b border-gray-200 pb-6 space-y-5 text-sm text-gray-800">
            <div className="flex items-start gap-4">
              <Award className="w-6 h-6 text-gray-800 mt-0.5" />
              <div>
                <h4 className="font-bold text-[14px]">Dive right in</h4>
                <p className="text-gray-500 font-light text-[13px] mt-0.5">This is one of the few places in the area with a pool.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Wind className="w-6 h-6 text-gray-800 mt-0.5" />
              <div>
                <h4 className="font-bold text-[14px]">Designed for staying cool</h4>
                <p className="text-gray-500 font-light text-[13px] mt-0.5">Beat the heat with the A/C and ceiling fan.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <DoorOpen className="w-6 h-6 text-gray-800 mt-0.5" />
              <div>
                <h4 className="font-bold text-[14px]">Self check-in</h4>
                <p className="text-gray-500 font-light text-[13px] mt-0.5">Check yourself in with the lockbox.</p>
              </div>
            </div>
          </div>

          {/* Description - Image 2 */}
          <div className="border-b border-gray-200 pb-6">
            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line text-sm leading-normal">
              {listing.description || "Welcome to Laxmi Studios by Ami — a modern, thoughtfully designed studio apartment in the heart of North Goa, perfect for couples, solo travellers, or a small family looking for comfort, convenience, and calm.\n\nLocated in Arpora, just 1-2 km from Baga, Calangute & Tito's Lane, this studio gives you the best of both worlds — close to the action, yet peaceful enough to truly relax.\n\n📍 Prime Location..."}
            </p>
            <button className="text-xs font-bold text-gray-800 underline mt-4 flex items-center gap-1">
              <span>Show more</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Amenities Grid - Image 3 */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-[17px] font-bold text-gray-900 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-semibold text-gray-700 mb-6">
              <div className="flex items-center gap-3 font-normal">
                <Compass className="w-5 h-5 text-gray-500" />
                <span>Beach access</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Utensils className="w-5 h-5 text-gray-500" />
                <span>Kitchen</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Wifi className="w-5 h-5 text-gray-500" />
                <span>Wifi</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span>Dedicated workspace</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Car className="w-5 h-5 text-gray-500" />
                <span>Free parking on premises</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Award className="w-5 h-5 text-gray-500" />
                <span>Pool</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Users className="w-5 h-5 text-gray-500" />
                <span>Pets allowed</span>
              </div>
              <div className="flex items-center gap-3 font-normal">
                <Shield className="w-5 h-5 text-gray-500" />
                <span>Exterior security cameras on property</span>
              </div>
            </div>
            <button className="px-5 py-3 border border-gray-400 hover:border-black bg-white rounded-xl text-xs font-bold text-gray-800 transition">
              Show all 44 amenities
            </button>
          </div>

          {/* Two-Month Calendar View - Image 3 & 4 */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-[17px] font-bold text-gray-900">2 nights in {listing.location.split(",")[0]}</h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">24 Jul 2026 - 26 Jul 2026</p>
            
            <div className="flex flex-col md:flex-row gap-8 mt-6">
              {/* July 2026 */}
              <div className="flex-1">
                <h4 className="font-extrabold text-sm text-center text-gray-700 mb-4">July 2026</h4>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-400">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  {/* Empty cells July */}
                  <span className="py-2"></span><span className="py-2"></span><span className="py-2"></span>
                  <span className="py-2 text-gray-800">1</span>
                  <span className="py-2 text-gray-800">2</span>
                  <span className="py-2 text-gray-800">3</span>
                  <span className="py-2 text-gray-800">4</span>
                  
                  {[...Array(31)].map((_, i) => {
                    const day = i + 5;
                    const isSelected = isDateSelected(day, false);
                    const isStart = isDateStart(day, false);
                    const isEnd = isDateEnd(day, false);

                    return (
                      <span 
                        key={day} 
                        onClick={() => handleCalendarDayClick(day, false)}
                        className={`py-2 text-xs cursor-pointer select-none relative ${
                          isSelected 
                            ? isStart 
                              ? "bg-black text-white rounded-full font-bold z-10" 
                              : isEnd 
                                ? "bg-black text-white rounded-full font-bold z-10" 
                                : "bg-gray-100 text-gray-850 font-bold" 
                            : "text-gray-800 hover:bg-gray-100 rounded-full"
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* August 2026 */}
              <div className="flex-1">
                <h4 className="font-extrabold text-sm text-center text-gray-700 mb-4">August 2026</h4>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-400">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  {/* Empty cells Aug */}
                  <span className="py-2"></span><span className="py-2"></span><span className="py-2"></span><span className="py-2"></span><span className="py-2"></span><span className="py-2"></span>
                  <span className="py-2 text-gray-800">1</span>

                  {[...Array(31)].map((_, i) => {
                    const day = i + 2;
                    const isSelected = isDateSelected(day, true);
                    const isStart = isDateStart(day, true);
                    const isEnd = isDateEnd(day, true);

                    return (
                      <span 
                        key={day} 
                        onClick={() => handleCalendarDayClick(day, true)}
                        className={`py-2 text-xs cursor-pointer select-none relative ${
                          isSelected 
                            ? isStart 
                              ? "bg-black text-white rounded-full font-bold z-10" 
                              : isEnd 
                                ? "bg-black text-white rounded-full font-bold z-10" 
                                : "bg-gray-100 text-gray-850 font-bold" 
                            : "text-gray-800 hover:bg-gray-100 rounded-full"
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                ⌨️
              </button>
              <button 
                onClick={() => { setCheckIn(""); setCheckOut(""); }}
                className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
              >
                Clear dates
              </button>
            </div>
          </div>

          {/* Where you'll be section - Image 2 */}
          <div className="border-b border-gray-200 pb-8 space-y-4">
            <div>
              <h3 className="text-[17px] font-bold text-gray-900">Where you&apos;ll be</h3>
              <p className="text-[13px] text-gray-500 font-light mt-1">{listing.location}</p>
            </div>
            <div className="w-full h-72 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                className="w-full h-full grayscale-[10%]"
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white px-3 py-1.5 rounded-lg shadow-sm">
                You can switch between default and satellite view.
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">Exact location will be provided after booking.</p>
          </div>

          {/* Meet your host section - Image 3 */}
          <div className="pb-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Meet your host</h3>
            
            <div className="flex flex-col md:flex-row gap-8 bg-gray-50/30 border border-gray-155 rounded-3xl p-6">
              {/* Left card */}
              <div className="flex-1 space-y-4">
                <Link 
                  href={`/users/profile/${hostName.toLowerCase()}`}
                  className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm block text-center space-y-3 hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-18 h-18 rounded-full overflow-hidden bg-[#E3F2FD] text-[#1E88E5] font-bold text-sm mx-auto flex items-center justify-center relative">
                    {hostAvatar}
                    <div className="absolute bottom-0 right-0 bg-[#FF385C] text-white p-0.5 rounded-full border border-white text-[8px] font-bold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-gray-900">{hostName}</h4>
                    {isSuperhost && (
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">★ Superhost</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center text-gray-800">
                    <div>
                      <span className="font-extrabold text-[13px] block">{hostReviewsCount}</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase block">Reviews</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[13px] block">{listing.rating.toFixed(2)}★</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase block">Rating</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[13px] block">{tenureMonths}</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase block">Months</span>
                    </div>
                  </div>
                </Link>

                <div className="text-xs text-gray-700 font-medium space-y-2.5 pt-2">
                  <div className="flex items-center gap-2">
                    <span>🎂</span>
                    <span>Born in the {hostBorn}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎓</span>
                    <span>Where I went to school: {hostSchool}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-light mt-4">
                  Hi, I&apos;m {hostName}. I genuinely enjoy hosting and making guests feel comfortable, relaxed, and at home. I pay attention to the little details that make a stay smooth and stress-free. My goal is simple: you leave with great memories and a smile.
                </p>
              </div>

              {/* Right details */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-gray-800">{hostName} is a {isSuperhost ? "Superhost" : "Host"}</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                  </p>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="font-extrabold text-sm text-gray-800">Co-Hosts</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">C</div>
                    <span>Chavi</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="font-extrabold text-sm text-gray-800">Host details</h4>
                  <div className="text-xs text-gray-500 font-medium space-y-1">
                    <p>Response rate: 98%</p>
                    <p>Responds within an hour</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => router.push("/messages")}
                    className="px-6 py-3 bg-[#F7F7F7] hover:bg-gray-100 text-gray-850 text-xs font-bold rounded-xl transition border border-gray-300 w-full md:w-auto active:scale-98 cursor-pointer"
                  >
                    Message host
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-4 flex gap-2 items-start">
                  <span className="text-gray-400 mt-0.5">🛡️</span>
                  <p className="text-[10px] text-gray-400 font-medium leading-normal">
                    To help protect your payment, always use Airbnb to send money and communicate with hosts.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Sticky Reservation Box - Image 1 & 2 */}
        <div className="relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            
            {/* Header Badge */}
            <div className="flex items-center gap-2 bg-[#F7F7F7] border border-gray-150 p-3 rounded-xl text-xs font-semibold text-gray-750">
              <span className="text-red-500">🏷️</span>
              <span>Prices include all fees</span>
            </div>

            {/* Price Header cost */}
            <div className="pb-2 border-b border-gray-100">
              <span className="text-[13px] text-gray-400 font-bold line-through mr-2">
                {currencySymbol}{previousPrice}
              </span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {currencySymbol}{displayPrice}
              </span>
              <span className="text-xs text-gray-500 font-light"> / night</span>
            </div>

            {/* Booking Form Inputs */}
            <form onSubmit={handleReserveClick} className="space-y-4">
              
              <div className="border border-gray-300 rounded-xl overflow-hidden text-[10px] font-bold text-gray-700 bg-white">
                {/* Date Inputs */}
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">
                    <label className="block uppercase tracking-wider mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs text-gray-800 bg-transparent border-none focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block uppercase tracking-wider mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs text-gray-800 bg-transparent border-none focus:outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Guest Selection */}
                <div className="p-3 relative">
                  <label className="block uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs text-gray-800 bg-transparent border-none focus:outline-none mt-1 cursor-pointer appearance-none"
                  >
                    {[...Array(listing.max_guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booking Success Banner */}
              {bookingSuccess && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center text-sm font-semibold animate-bounce">
                  🎉 Booking Confirmed! Redirecting to Trips...
                </div>
              )}

              {/* Booking Error Banner */}
              {bookingError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Hot pink Reserve button */}
              <button
                type="submit"
                disabled={bookingSuccess}
                className="w-full bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-gray-300 text-white font-extrabold py-3.5 px-4 rounded-xl transition text-center shadow-md active:scale-98 cursor-pointer text-sm"
              >
                Reserve
              </button>

            </form>

            <p className="text-center text-xs text-gray-500 font-light">
              You won&apos;t be charged yet
            </p>

            {/* Price Calculations */}
            {nights > 0 && (
              <div className="space-y-3.5 pt-4 border-t border-gray-200 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="underline">{currencySymbol}{displayPrice} x {nights} nights</span>
                  <span>{currencySymbol}{displayPrice * nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>{currencySymbol}{cleanFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>{currencySymbol}{svcFee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-sm pt-3 border-t border-gray-200">
                  <span>Total before taxes</span>
                  <span>{currencySymbol}{grandTotal}</span>
                </div>
              </div>
            )}

            <button className="text-xs font-bold text-gray-500 hover:text-black underline mt-2 block mx-auto">
              🚩 Report this listing
            </button>

          </div>
        </div>

      </div>

      {/* 4. Giant Guest Favourite Rating Section - Image 5 */}
      <div className="border-t border-gray-200 mt-12 pt-10">
        
        {/* Rating title header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-10">
          {/* Laurel wreath SVG */}
          <div className="flex items-center gap-1">
            <svg width="30" height="30" viewBox="0 0 32 32" className="text-black transform scale-x-[-1]">
              <path d="M16 3c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" fill="currentColor" />
            </svg>
            <h2 className="text-[52px] font-black text-gray-900 tracking-tighter leading-none">{listing.rating.toFixed(1)}</h2>
            <svg width="30" height="30" viewBox="0 0 32 32" className="text-black">
              <path d="M16 3c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" fill="currentColor" />
            </svg>
          </div>
          <h3 className="font-extrabold text-[15px] text-gray-800">Guest favourite</h3>
          <p className="text-[13px] text-gray-500 font-light max-w-sm leading-normal">
            This home is a guest favourite based on ratings, reviews and reliability
          </p>
          <button className="text-xs font-bold text-gray-400 hover:text-black underline pt-1">
            How reviews work
          </button>
        </div>

        {/* Progress Category Sliders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 border-b border-gray-200 pb-10 mb-8 select-none">
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Cleanliness</span>
            <span className="block text-base font-black text-gray-800">{ratingCleanliness}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">🧹</div>
          </div>
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Accuracy</span>
            <span className="block text-base font-black text-gray-800">{ratingAccuracy}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">☑️</div>
          </div>
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Check-in</span>
            <span className="block text-base font-black text-gray-800">{ratingCheckin}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">🔑</div>
          </div>
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Communication</span>
            <span className="block text-base font-black text-gray-800">{ratingCommunication}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">💬</div>
          </div>
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Location</span>
            <span className="block text-base font-black text-gray-800">{ratingLocation}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">🗺️</div>
          </div>
          <div className="space-y-2 text-left">
            <span className="block text-[11px] font-bold text-gray-500">Value</span>
            <span className="block text-base font-black text-gray-800">{ratingValue}</span>
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-xl">🏷️</div>
          </div>
        </div>

        {/* Category Pills Slider - Image 5 */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-8 text-[11px] font-bold text-gray-600 scrollbar-none select-none">
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            🧹 Cleanliness {pillCleanliness}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            ☑️ Accuracy {pillAccuracy}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            🏖️ Beach {pillBeach}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            🎁 Hospitality {pillHospitality}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            🛋️ Comfort {pillComfort}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            📍 Location {pillLocation}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            📦 Condition {pillCondition}
          </span>
          <span className="px-4 py-2 border border-gray-200 bg-white rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-xs">
            🔑 Check-in {pillCheckin}
          </span>
        </div>

        {/* Guest Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {listing.reviews && listing.reviews.length > 0 ? (
            listing.reviews.map((review: Review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                    {review.user?.avatar_url ? (
                      <img src={review.user.avatar_url} alt={review.user.name} className="w-full h-full object-cover" />
                    ) : (
                      review.user?.name ? review.user.name.charAt(0) : "G"
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{review.user?.name || "Guest"}</h4>
                    <p className="text-xs text-gray-400 font-light">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#FF385C] scale-90 origin-left">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${
                        i < review.rating ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-normal">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            // Default mock reviews matching Image 5
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-150 flex items-center justify-center font-bold text-gray-600 text-xs">
                    👩
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Ayushi</h4>
                    <p className="text-xs text-gray-400 font-light">July 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-black">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-normal">
                  Ami is a fantastic host! Extremely clean, right next to Baga and Arpora market. Loved the rooftop pool!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-150 flex items-center justify-center font-bold text-gray-600 text-xs">
                    👨
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Rakesh Kumar</h4>
                    <p className="text-xs text-gray-400 font-light">June 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-black">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-normal">
                  Quiet, cozy studio exactly as shown in the images. Ami made sure our check-in was seamless. Definitely visiting again!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Write a Review Form */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-150 max-w-xl">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Write a review</h4>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setReviewRating(stars)}
                    className="focus:outline-none transition active:scale-90"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        stars <= reviewRating 
                          ? "fill-[#FF385C] text-[#FF385C]" 
                          : "text-gray-300 hover:text-brand"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share details of your experience here..."
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
              />
            </div>

            {reviewError && (
              <p className="text-xs font-semibold text-red-600">{reviewError}</p>
            )}

            <button
              type="submit"
              className="bg-gray-850 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl transition text-sm"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* --- CONFIRMATION CHECKOUT MODAL OVERLAY --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-4 select-none">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Confirm Your Stay</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <img 
                  src={listing.photos[0]} 
                  alt={listing.title} 
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{listing.title}</h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">{listing.location}</p>
                  <p className="text-xs text-gray-700 font-semibold mt-1">
                    {checkIn} to {checkOut} · {guestCount} guest{guestCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-gray-100 py-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Nightly Rate</span>
                  <span>{currencySymbol}{displayPrice} x {nights} nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning Fee</span>
                  <span>{currencySymbol}{cleanFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{currencySymbol}{svcFee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span>{currencySymbol}{grandTotal}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Payment details</h4>
                <div className="p-3.5 bg-gray-50 border border-gray-250 rounded-xl flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>💳 Visa ending in 4242 (Mocked)</span>
                  <span className="text-[10px] text-gray-400 font-normal uppercase">Active</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold py-3 rounded-xl transition text-sm text-center"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
