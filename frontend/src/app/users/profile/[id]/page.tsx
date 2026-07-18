"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Star, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

interface ReviewMock {
  name: string;
  time: string;
  rating: number;
  comment: string;
  avatar: string;
}

const MOCK_REVIEWS: ReviewMock[] = [
  {
    name: "Ayushi",
    time: "Today",
    rating: 5,
    comment: "My stay here was absolutely wonderful. Room and Amenities: The space was spotlessly clean, modernly decorated, and equipped with everything a traveller could need...",
    avatar: "👩"
  },
  {
    name: "Rakesh Kumar",
    time: "2 weeks ago",
    rating: 5,
    comment: "We had a wonderful stay. The property was clean, comfortable, and exactly as described. The check-in was seamless and the host was very helpful.",
    avatar: "👨"
  },
  {
    name: "Shivam",
    time: "3 weeks ago",
    rating: 5,
    comment: "A wonderful home away from home! The space was perfectly set up for our group, well-maintained, and very comfortable.",
    avatar: "👨"
  },
  {
    name: "Pooja",
    time: "May 2026",
    rating: 5,
    comment: "Had a wonderful stay! The place was exactly as described — clean, comfortable, beautifully maintained, and had a very warm vibe. The location was great.",
    avatar: "👩"
  }
];

export default function HostProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { allUsers } = useAuth();
  
  const userId = params.id;
  
  // Find host user in system
  const hostUser = allUsers?.find(u => 
    String(u.id) === String(userId) || 
    u.name.toLowerCase() === String(userId).toLowerCase()
  );
  
  const hostName = hostUser?.name || (typeof userId === "string" ? userId.charAt(0).toUpperCase() + userId.slice(1) : "Sophia");
  const isSuperhost = hostUser ? hostUser.is_superhost : true;

  // Deterministic stats
  const seed = hostUser ? hostUser.id : 3;
  const reviewsCount = 15 + (seed * 8) % 80;
  const ratingVal = (4.7 + (seed * 0.05) % 0.3).toFixed(2);
  const tenureMonths = 4 + (seed * 3) % 24;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans select-none pb-20">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stay</span>
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        
        {/* Left Column Profile Card */}
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-[24px] p-6 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#E3F2FD] text-[#1E88E5] font-bold text-xl flex items-center justify-center relative shadow-sm border border-gray-100">
            {hostUser?.avatar_url ? (
              <img src={hostUser.avatar_url} alt={hostName} className="w-full h-full object-cover" />
            ) : (
              "👨‍💻"
            )}
            <div className="absolute bottom-0 right-0 bg-[#FF385C] text-white p-0.5 rounded-full border border-white text-[10px] font-bold">
              ✓
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-black text-gray-900">{hostName}</h1>
            {isSuperhost && (
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">★ Superhost</p>
            )}
          </div>

          <div className="w-full grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 my-2 text-center text-gray-800">
            <div>
              <span className="font-extrabold text-base block">{reviewsCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">Reviews</span>
            </div>
            <div>
              <span className="font-extrabold text-base block">{ratingVal}★</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">Rating</span>
            </div>
            <div>
              <span className="font-extrabold text-base block">{tenureMonths}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">Months</span>
            </div>
          </div>

          <div className="w-full text-left space-y-3 pt-2 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
              <span>Identity Verified</span>
            </div>
            {isSuperhost && (
              <div className="flex items-center gap-2.5">
                <span>🌟</span>
                <span>Superhost Status Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column Profile Details */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-[28px] font-black text-gray-900 tracking-tight">About {hostName}</h2>
            
            {/* Host attributes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-3">
                <span>🎓</span>
                <span>Where I went to school: Frank Anthony</span>
              </div>
              <div className="flex items-center gap-3">
                <span>🎂</span>
                <span>Born in the 90s</span>
              </div>
              <div className="flex items-center gap-3">
                <span>💡</span>
                <span>Fun fact: I host with heart, not just keys</span>
              </div>
              <div className="flex items-center gap-3">
                <span>🎵</span>
                <span>Favourite song in school: Can&apos;t Help Falling In Love</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-800" />
                <span className="underline">Identity verified</span>
              </div>
            </div>

            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-150 rounded-xl text-xs font-bold text-gray-800 transition active:scale-95">
              Show all
            </button>
          </div>

          {/* Intro description */}
          <div className="border-t border-gray-155 pt-6">
            <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-light">
              Hi, I&apos;m {hostName}. I genuinely enjoy hosting and making guests feel comfortable, relaxed, and at home. I pay attention to the little details that make a stay smooth and stress-free, and I&apos;m always happy to help with local tips or anything you might need. My goal is simple: you leave with great memories and a smile.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Section - Host Reviews List */}
      <div className="border-t border-gray-255 mt-16 pt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-8">{hostName}&apos;s reviews</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {MOCK_REVIEWS.map((review, idx) => (
            <div key={idx} className="space-y-3 p-5 border border-gray-200 rounded-2xl bg-white shadow-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{review.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{review.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[#FF385C]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                {review.comment}
              </p>
              <button className="text-xs font-bold text-gray-800 underline block pt-1">
                Show more
              </button>
            </div>
          ))}
        </div>

        <button className="px-5 py-3 border border-gray-450 hover:border-black rounded-xl text-xs font-bold text-gray-800 transition active:scale-98">
          Show all {reviewsCount} reviews
        </button>
      </div>

    </div>
  );
}
