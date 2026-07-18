"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Menu } from "lucide-react";

export default function HostNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const currentTab = searchParams.get("tab") || "calendar";

  return (
    <header className="flex items-center justify-between px-10 py-5 border-b border-gray-150 relative select-none bg-white w-full z-45">
      {/* Logo */}
      <Link href="/" className="text-[#FF385C] font-bold text-2xl flex items-center gap-2 flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.644-.651-.645.651-.256.26c-2.153 2.128-4.485 3.386-6.709 3.386-3.48 0-6.357-2.416-6.357-6.478l.001-.228.011-.415c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.312-.001.18c0 2.775 1.519 4.222 3.943 4.222 1.488 0 3.267-.84 5.253-2.617l.783-.733 1.522-1.464 1.522 1.464.783.733c1.986 1.777 3.765 2.617 5.253 2.617 2.424 0 3.943-1.447 3.943-4.222l-.001-.18-.009-.312c-.032-.585-.178-1.169-.605-2.24l-.345-.836c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.239 3 16 3z" />
        </svg>
        <span className="hidden sm:inline">airbnb</span>
      </Link>

      {/* Center Navigation Links */}
      <div className="flex items-center gap-6 text-[14px] font-semibold text-gray-800">
        <Link 
          href="/host/homes" 
          className={`pb-0.5 transition ${
            pathname === "/host/homes" 
              ? "border-b-2 border-black text-black" 
              : "text-gray-500 hover:text-black"
          }`}
        >
          Today
        </Link>
        <Link 
          href="/host/dashboard?tab=calendar" 
          className={`pb-0.5 transition ${
            pathname === "/host/dashboard" && currentTab === "calendar"
              ? "border-b-2 border-black text-black" 
              : "text-gray-500 hover:text-black"
          }`}
        >
          Calendar
        </Link>
        <Link 
          href="/host/dashboard?tab=listings" 
          className={`pb-0.5 transition ${
            pathname === "/host/dashboard" && currentTab === "listings"
              ? "border-b-2 border-black text-black" 
              : "text-gray-500 hover:text-black"
          }`}
        >
          Listings
        </Link>
        <Link 
          href="/messages" 
          className="text-gray-500 hover:text-black transition"
        >
          Messages
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-[12px] font-bold text-gray-800 hover:bg-gray-50 px-4 py-2.5 rounded-full transition">
          Switch to travelling
        </Link>

        {/* Profile Circle Avatar */}
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E3F2FD] text-[#1E88E5] font-bold text-sm cursor-pointer hover:shadow-md transition border border-gray-200 overflow-hidden flex-shrink-0"
        >
          {currentUser?.avatar_url ? (
            <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : currentUser?.name ? (
            currentUser.name.charAt(0).toUpperCase()
          ) : (
            "P"
          )}
        </Link>

        {/* Menu Dropdown Trigger */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F3F4F6] text-gray-800 hover:shadow-md transition cursor-pointer border border-gray-200 flex-shrink-0"
        >
          <Menu className="w-4.5 h-4.5 text-gray-700" />
        </button>

        {showDropdown && (
          <div className="absolute right-10 top-[76px] w-[220px] bg-white border border-gray-200 rounded-[12px] shadow-2xl py-2 z-50 text-[14px]">
            <Link href="/profile" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-[#222222] font-semibold transition">
              Profile
            </Link>
            <Link href="/host/dashboard" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-[#222222] font-semibold transition">
              Host Dashboard
            </Link>
            <div className="h-[1px] w-full bg-gray-250 my-1"></div>
            <button 
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-[#222222] font-normal transition cursor-pointer"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
