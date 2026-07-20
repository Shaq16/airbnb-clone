"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { Booking } from "../../types";
import { Calendar, User, Trash2 } from "lucide-react";

export default function MyTripsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.bookings.myTrips();
      setBookings(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to retrieve your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/login?redirect_url=%2Fmy-trips");
      } else {
        fetchTrips();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  const handleCancelTrip = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
      return;
    }

    try {
      await api.bookings.cancel(bookingId);
      // Re-fetch bookings
      fetchTrips();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not cancel booking.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded-sm w-[40%]" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 border border-gray-200 p-4 rounded-2xl h-36 bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const stays = bookings.filter((b) => b.booking_type === "stay" || !b.booking_type);
  const experiences = bookings.filter((b) => b.booking_type === "experience");
  const services = bookings.filter((b) => b.booking_type === "service");

  // If there are no bookings, render the exact design of Image 1!
  if (stays.length === 0 && experiences.length === 0 && services.length === 0) {
    return (
      <div className="w-full flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Side Info */}
        <div className="w-full md:w-[40%] flex flex-col justify-between p-10 bg-white overflow-y-auto">
          <div>
            <h1 className="text-[32px] font-bold text-[#222222] mb-12">Trips</h1>
            
            {/* Illustration of Rolled Map, House, Hot Air Balloon */}
            <div className="flex justify-center mb-8">
              <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="150" width="180" height="15" rx="7.5" fill="#E5E7EB" />
                <path d="M40 165C40 155 60 155 60 165" stroke="#D1D5DB" strokeWidth="3" />
                
                {/* Scroll Map effect */}
                <path d="M40 150 C40 100, 200 100, 200 150" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="4" />
                <path d="M40 150 C40 120, 200 120, 200 150" fill="#ECFDF5" />
                
                {/* Path line */}
                <path d="M70 145 Q 110 120, 150 140 T 180 135" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                
                {/* House */}
                <rect x="140" y="115" width="30" height="22" rx="2" fill="#FCA5A5" />
                <polygon points="135,115 155,100 175,115" fill="#EF4444" />
                <rect x="150" y="125" width="10" height="12" fill="#FFF" />
                
                {/* Tree */}
                <path d="M185 110 L185 137" stroke="#78350F" strokeWidth="3" />
                <circle cx="185" cy="107" r="12" fill="#10B981" />
                <circle cx="192" cy="113" r="8" fill="#059669" />
                
                {/* Dessert/Cake standing */}
                <circle cx="95" cy="138" r="8" fill="#F472B6" />
                <rect x="94" y="138" width="2" height="7" fill="#FFF" />
                
                {/* Hot Air Balloon */}
                <g transform="translate(10, -10)">
                  <path d="M60 50 C40 50, 30 70, 45 90 C50 97, 70 97, 75 90 C90 70, 80 50, 60 50 Z" fill="#F43F5E" />
                  <path d="M60 50 C50 50, 48 70, 52 90 C54 94, 66 94, 68 90 C72 70, 70 50, 60 50 Z" fill="#FBBF24" />
                  <rect x="57" y="99" width="6" height="6" fill="#D97706" />
                  <line x1="53" y1="94" x2="57" y2="99" stroke="#374151" strokeWidth="1" />
                  <line x1="67" y1="94" x2="63" y2="99" stroke="#374151" strokeWidth="1" />
                </g>
              </svg>
            </div>

            <div className="max-w-[340px] mx-auto text-center md:text-left">
              <h2 className="text-[20px] font-bold text-[#222222] mb-3">Map out your next trip</h2>
              <p className="text-[14px] text-gray-500 font-light leading-relaxed mb-8">
                After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.
              </p>
              
              <button 
                onClick={() => router.push("/")}
                className="bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition-all shadow-md w-full md:w-auto"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Map */}
        <div className="flex-grow h-full bg-gray-100 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d198005352.56587717!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  // Active bookings list
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Trips</h1>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl max-w-lg mb-6">
          {error}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: Stays */}
          {stays.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-2xl">🏠</span>
                <span>Stays</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stays.map((booking) => {
                  const isCancelled = booking.status === "cancelled";
                  
                  return (
                    <div 
                      key={booking.id}
                      className={`border rounded-2xl overflow-hidden flex gap-4 p-4 transition hover:shadow-md ${
                        isCancelled ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Trip image */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-150 flex-shrink-0">
                        <img
                          src={booking.listing?.photos?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"}
                          alt={booking.listing?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Booking details */}
                      <div className="flex-grow flex flex-col justify-between text-sm">
                        <div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                            isCancelled 
                              ? "bg-red-50 text-red-700" 
                              : "bg-green-50 text-green-700"
                          }`}>
                            {booking.status}
                          </span>
                          
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                            {booking.listing?.location || "Property Location"}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {booking.listing?.title || "Property Details"}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.check_in} to {booking.check_out}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.guest_count} guest{booking.guest_count > 1 ? "s" : ""}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="font-bold text-gray-900 text-sm">
                            Total: ${booking.total_price}
                          </span>

                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelTrip(booking.id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Experiences */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-2xl">🎈</span>
                <span>Experiences</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map((booking) => {
                  const isCancelled = booking.status === "cancelled";
                  return (
                    <div 
                      key={booking.id}
                      className={`border rounded-2xl overflow-hidden flex gap-4 p-4 transition hover:shadow-md ${
                        isCancelled ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-150 flex-shrink-0">
                        <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between text-sm">
                        <div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                            isCancelled ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                          }`}>
                            {booking.status}
                          </span>
                          <h3 className="font-bold text-gray-900 line-clamp-1">{booking.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{booking.category}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Date: {booking.check_in} {booking.package_title ? `(${booking.package_title})` : ""}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.guest_count} guest{booking.guest_count > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="font-bold text-gray-900 text-sm">Total: ₹{booking.total_price.toLocaleString("en-IN")}</span>
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelTrip(booking.id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Services */}
          {services.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-2xl">🛎️</span>
                <span>Services</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((booking) => {
                  const isCancelled = booking.status === "cancelled";
                  return (
                    <div 
                      key={booking.id}
                      className={`border rounded-2xl overflow-hidden flex gap-4 p-4 transition hover:shadow-md ${
                        isCancelled ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-150 flex-shrink-0">
                        <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between text-sm">
                        <div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                            isCancelled ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                          }`}>
                            {booking.status}
                          </span>
                          <h3 className="font-bold text-gray-900 line-clamp-1">{booking.title}</h3>
                          <p className="text-xs font-bold text-gray-700 mt-0.5">Package: {booking.package_title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{booking.category}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Date: {booking.check_in}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.guest_count} guest{booking.guest_count > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="font-bold text-gray-900 text-sm">Total: ₹{booking.total_price.toLocaleString("en-IN")}</span>
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelTrip(booking.id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
