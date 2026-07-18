"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";

export default function BecomeHostLandingPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");
  const [hasListings, setHasListings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHostProperties() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const listings = await api.listings.list();
        const userListings = listings.filter((l: any) => l.host_id === currentUser.id);
        setHasListings(userListings.length > 0);
      } catch (err) {
        console.error("Failed to load host properties", err);
      } finally {
        setLoading(false);
      }
    }
    checkHostProperties();
  }, [currentUser]);

  return (
    <div className="bg-white flex flex-col font-sans pb-10">
      {/* Today / Upcoming Toggle */}
      <div className="flex justify-center mt-10 select-none">
        <div className="flex bg-[#F3F4F6] p-1 rounded-full border border-gray-200">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition duration-200 ${
              activeTab === "today" ? "bg-[#222222] text-white shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition duration-200 ${
              activeTab === "upcoming" ? "bg-[#222222] text-white shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Main content matching Image 1 & dynamic check */}
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : (
          <div className="max-w-md text-center flex flex-col items-center gap-6 select-none animate-in fade-in duration-300">
            {/* Notebook illustration */}
            <div className="w-48 h-48 flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gray-400">
                {/* Cover */}
                <path d="M25 15 L75 25 L75 85 L25 75 Z" fill="#EBEBEB" stroke="#D3D3D3" strokeWidth="2" />
                {/* Pages stack */}
                <path d="M22 17 L72 27 L72 87 L22 77 Z" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="1.5" />
                <path d="M20 19 L70 29 L70 89 L20 79 Z" fill="#FFFFFF" stroke="#222222" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Grid lines inside notebook */}
                <line x1="30" y1="35" x2="62" y2="41" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="30" y1="45" x2="62" y2="51" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="30" y1="55" x2="62" y2="61" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="30" y1="65" x2="62" y2="71" stroke="#E2E8F0" strokeWidth="1" />
                {/* Spiral rings */}
                <path d="M19 23 Q 22 25 24 23" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M19 33 Q 22 35 24 33" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M19 43 Q 22 45 24 43" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M19 53 Q 22 55 24 53" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M19 63 Q 22 65 24 63" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M19 73 Q 22 75 24 73" fill="none" stroke="#A0AEC0" strokeWidth="2" />
                {/* Bookmark Ribbon */}
                <path d="M48 24 L52 25 L45 55 L40 50 Z" fill="#FF385C" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#222222] tracking-tight">
                You don&apos;t have any reservations
              </h2>
              <p className="text-sm text-gray-500 font-light max-w-sm mx-auto leading-normal">
                {hasListings 
                  ? "Your property is online! You are all set to receive guest bookings."
                  : "To get booked, you'll need to complete and publish your listing."
                }
              </p>
            </div>

            <div className="pt-2">
              {hasListings ? (
                <button
                  onClick={() => router.push("/host/dashboard")}
                  className="px-6 py-3 border border-gray-400 hover:border-black bg-white hover:bg-gray-50 text-gray-800 text-[14px] font-bold rounded-xl transition duration-200 shadow-xs cursor-pointer active:scale-98"
                >
                  Go to Calendar
                </button>
              ) : (
                <button
                  onClick={() => router.push("/host/setup")}
                  className="px-6 py-3 border border-gray-400 hover:border-black bg-white hover:bg-gray-50 text-gray-800 text-[14px] font-bold rounded-xl transition duration-200 shadow-xs cursor-pointer active:scale-98"
                >
                  Complete your listing
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
