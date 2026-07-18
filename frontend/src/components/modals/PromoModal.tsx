"use client";

import React from "react";
import { X } from "lucide-react";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoModal({ isOpen, onClose }: PromoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 m-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm text-gray-800"
        >
          <X className="w-4 h-4 font-bold" />
        </button>

        {/* Hero Image */}
        <div className="w-full h-[260px] relative">
          <img 
            src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80" 
            alt="Beautiful villa with pool" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center flex flex-col items-center">
          <h2 className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-3">
            Get 10% off your next stay
          </h2>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed mb-8 max-w-[320px]">
            Book within 7 days and save up to ₹2,000 on your next stay. <span className="underline cursor-pointer font-bold text-gray-600">Terms apply</span>
          </p>
          
          <button 
            onClick={onClose}
            className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-md"
          >
            Claim now
          </button>
        </div>

      </div>
    </div>
  );
}
