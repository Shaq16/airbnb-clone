"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { 
  Search, 
  Globe, 
  Menu, 
  User as UserIcon, 
  HelpCircle,
  Navigation,
  MapPin
} from "lucide-react";
import LoginModal from "../modals/LoginModal";
import PromoModal from "../modals/PromoModal";

const LANGUAGES = [
  { lang: "English", region: "United States" },
  { lang: "English", region: "United Kingdom" },
  { lang: "हिन्दी", region: "भारत" },
  { lang: "ಕನ್ನಡ", region: "ಭಾರತ" },
  { lang: "मराठी", region: "भारत" },
  { lang: "English", region: "India" },
  { lang: "Azərbaycan dili", region: "Azərbaycan" },
  { lang: "Bahasa Indonesia", region: "Indonesia" },
  { lang: "Bosanski", region: "Bosna i Hercegovina" },
  { lang: "Català", region: "Espanya" },
  { lang: "Čeština", region: "Česká republika" },
  { lang: "Crnogorski", region: "Crna Gora" },
  { lang: "Dansk", region: "Danmark" },
  { lang: "Deutsch", region: "Deutschland" },
  { lang: "Deutsch", region: "Österreich" },
  { lang: "Deutsch", region: "Schweiz" },
  { lang: "Deutsch", region: "Luxemburg" },
  { lang: "Eesti", region: "Eesti" },
  { lang: "English", region: "Australia" },
  { lang: "English", region: "Canada" },
  { lang: "English", region: "Guyana" },
  { lang: "English", region: "Ireland" },
  { lang: "English", region: "New Zealand" },
  { lang: "English", region: "Singapore" },
  { lang: "English", region: "United Arab Emirates" },
  { lang: "Español", region: "Argentina" },
  { lang: "Español", region: "Belice" },
  { lang: "Español", region: "Bolivia" },
  { lang: "Español", region: "Chile" },
  { lang: "Español", region: "Colombia" },
  { lang: "Español", region: "Costa Rica" },
  { lang: "Español", region: "Ecuador" },
  { lang: "Español", region: "El Salvador" },
  { lang: "Español", region: "España" },
  { lang: "Español", region: "Estados Unidos" }
];

const CURRENCIES = [
  { name: "Indian rupee", code: "INR", symbol: "₹" },
  { name: "Australian dollar", code: "AUD", symbol: "$" },
  { name: "Brazilian real", code: "BRL", symbol: "R$" },
  { name: "Bulgarian lev", code: "BGN", symbol: "лв." },
  { name: "Canadian dollar", code: "CAD", symbol: "$" },
  { name: "Chilean peso", code: "CLP", symbol: "$" },
  { name: "Chinese yuan", code: "CNY", symbol: "¥" },
  { name: "Colombian peso", code: "COP", symbol: "$" },
  { name: "Costa Rican colón", code: "CRC", symbol: "₡" },
  { name: "Czech koruna", code: "CZK", symbol: "Kč" },
  { name: "Danish krone", code: "DKK", symbol: "kr" },
  { name: "Egyptian pound", code: "EGP", symbol: "ج.م" },
  { name: "Emirati dirham", code: "AED", symbol: "د.إ" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "Ghanaian cedi", code: "GHS", symbol: "GH₵" },
  { name: "Hong Kong dollar", code: "HKD", symbol: "$" },
  { name: "Hungarian forint", code: "HUF", symbol: "Ft" },
  { name: "Indonesian rupiah", code: "IDR", region: "Rp" },
  { name: "Israeli new shekel", code: "ILS", symbol: "₪" },
  { name: "Japanese yen", code: "JPY", symbol: "¥" },
  { name: "Kazakhstani tenge", code: "KZT", symbol: "₸" },
  { name: "Kenyan shilling", code: "KES", symbol: "KSh" },
  { name: "Malaysian ringgit", code: "MYR", symbol: "RM" },
  { name: "Mexican peso", code: "MXN", symbol: "$" },
  { name: "Moroccan dirham", code: "MAD", symbol: "" },
  { name: "New Taiwan dollar", code: "TWD", symbol: "$" },
  { name: "New Zealand dollar", code: "NZD", symbol: "$" },
  { name: "Norwegian krone", code: "NOK", symbol: "kr" },
  { name: "Peruvian sol", code: "PEN", symbol: "S/" },
  { name: "Philippine peso", code: "PHP", symbol: "₱" },
  { name: "Polish zloty", code: "PLN", symbol: "zł" },
  { name: "Pound sterling", code: "GBP", symbol: "£" },
  { name: "Qatari riyal", code: "QAR", symbol: "ر.ق" },
  { name: "Romanian leu", code: "RON", symbol: "lei" },
  { name: "Saudi Arabian riyal", code: "SAR", symbol: "SR" },
  { name: "Singapore dollar", code: "SGD", symbol: "$" },
  { name: "South African rand", code: "ZAR", symbol: "R" },
  { name: "South Korean won", code: "KRW", symbol: "₩" },
  { name: "Swedish krona", code: "SEK", symbol: "kr" },
  { name: "Swiss franc", code: "CHF", symbol: "" },
  { name: "Thai baht", code: "THB", symbol: "฿" },
  { name: "Turkish lira", code: "TRY", symbol: "₺" },
  { name: "Ugandan shilling", code: "UGX", symbol: "USh" },
  { name: "Ukrainian hryvnia", code: "UAH", symbol: "₴" },
  { name: "United States dollar", code: "USD", symbol: "$" },
  { name: "Uruguayan peso", code: "UYU", symbol: "$U" },
  { name: "Vietnamese dong", code: "VND", symbol: "₫" }
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, allUsers, switchUser, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"language" | "currency">("language");
  const [selectedCurrency, setSelectedCurrency] = useState("INR - ₹");
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [serviceType, setServiceType] = useState("");
  const [whenHomeTab, setWhenHomeTab] = useState<"dates" | "flexible">("dates");
  const [calendarStart, setCalendarStart] = useState({ year: 2026, month: 6 });
  const [flexibleDuration, setFlexibleDuration] = useState<"weekend" | "week" | "month">("week");
  const [selectedFlexibleMonth, setSelectedFlexibleMonth] = useState<string>("July 2026");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsCollapsed(true);
      } else if (window.scrollY < 20) {
        setIsCollapsed(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [hasHostStatus, setHasHostStatus] = useState(false);

  useEffect(() => {
    async function checkHostStatus() {
      if (typeof window !== "undefined") {
        const draft = localStorage.getItem("airbnb_incomplete_listing");
        if (draft) {
          setHasHostStatus(true);
          return;
        }
      }
      if (currentUser) {
        try {
          const listings = await api.listings.list();
          const hostListings = listings.filter((l: any) => l.host_id === currentUser.id);
          if (hostListings.length > 0) {
            setHasHostStatus(true);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }
      setHasHostStatus(false);
    }
    checkHostStatus();
  }, [currentUser, pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  
  let defaultTab = "homes";
  if (pathname.startsWith("/experiences") || typeParam === "experience") {
    defaultTab = "experiences";
    // Distinguish service from experience using ID in the path
    const match = pathname.match(/\/experiences\/(\d+)/);
    if (match) {
      const idVal = parseInt(match[1], 10);
      if (idVal >= 21) {
        defaultTab = "services";
      }
    }
  } else if (pathname.startsWith("/services") || typeParam === "service") {
    defaultTab = "services";
  }

  const tabParam = searchParams.get("tab") || defaultTab;
  const activeTab = tabParam.toLowerCase();

  const handleTabClick = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`/?${params.toString()}`);
  };

  const initialCheckIn = searchParams.get("check_in") || "";
  const initialCheckOut = searchParams.get("check_out") || "";

  // Search form state
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  // Guest count state
  const initialGuests = Number(searchParams.get("guests") || "0");
  const [adultsCount, setAdultsCount] = useState(initialGuests > 0 ? initialGuests : 0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  const getGuestsLabel = () => {
    const totalGuests = adultsCount + childrenCount;
    if (totalGuests === 0 && infantsCount === 0) return "Add guests";

    const parts = [];
    if (totalGuests > 0) {
      parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`);
    }
    if (infantsCount > 0) {
      parts.push(`${infantsCount} infant${infantsCount > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
  };

  // Dropdown popover states
  const [activeDropdown, setActiveDropdown] = useState<"where" | "when" | "who" | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(initialCheckIn ? new Date(initialCheckIn) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialCheckOut ? new Date(initialCheckOut) : null);

  const searchFormRef = useRef<HTMLDivElement>(null);
  
  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      setCheckIn(formatDate(day));
      setCheckOut("");
    } else {
      if (day < startDate) {
        setStartDate(day);
        setCheckIn(formatDate(day));
      } else {
        setEndDate(day);
        setCheckOut(formatDate(day));
        setActiveDropdown(null);
      }
    }
  };

  const handleDestinationSelect = (val: string) => {
    setLocation(val);
    setActiveDropdown("when");
  };

  const renderCalendarMonth = (year: number, month: number, monthName: string) => {
    const days = getDaysInMonth(year, month);
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
      <div className="flex-1 min-w-[260px]">
        <h4 className="font-extrabold text-sm text-gray-800 text-center mb-3">{monthName}</h4>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {weekdays.map((wd, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-400 uppercase select-none h-6 flex items-center justify-center">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center animate-in fade-in duration-200">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-9 w-9" />;
            }

            const formatted = formatDate(day);
            const isStart = startDate && formatDate(startDate) === formatted;
            const isEnd = endDate && formatDate(endDate) === formatted;
            const isWithinRange = startDate && endDate && day > startDate && day < endDate;

            let bgClass = "hover:bg-gray-100 text-gray-800 hover:rounded-full";
            if (isStart || isEnd) {
              bgClass = "bg-[#FF385C] text-white font-bold rounded-full scale-90 shadow-xs";
            } else if (isWithinRange) {
              bgClass = "bg-[#FF385C]/10 text-gray-800 rounded-none scale-100";
            }

            return (
              <button
                key={formatted}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`h-9 w-9 text-xs rounded-full flex items-center justify-center transition cursor-pointer select-none ${bgClass}`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveDropdown(null);
    const query = new URLSearchParams();
    query.append("tab", activeTab);
    if (location) query.append("location", location);
    const totalGuests = adultsCount + childrenCount;
    if (totalGuests > 0) query.append("guests", String(totalGuests));

    let finalCheckIn = checkIn;
    let finalCheckOut = checkOut;

    if (activeTab === "homes" && whenHomeTab === "flexible" && selectedFlexibleMonth) {
      const [monthName, yearStr] = selectedFlexibleMonth.split(" ");
      const year = parseInt(yearStr, 10);
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const monthIdx = months.indexOf(monthName);

      if (monthIdx !== -1) {
        if (flexibleDuration === "weekend") {
          // Find first Friday of that month
          const date = new Date(year, monthIdx, 1);
          while (date.getDay() !== 5) { // 5 = Friday
            date.setDate(date.getDate() + 1);
          }
          const checkInDate = new Date(date);
          const checkOutDate = new Date(date);
          checkOutDate.setDate(checkOutDate.getDate() + 2); // Friday to Sunday (2 nights)

          finalCheckIn = checkInDate.toISOString().split("T")[0];
          finalCheckOut = checkOutDate.toISOString().split("T")[0];
        } else if (flexibleDuration === "week") {
          // First week of the month (1st to 8th)
          const checkInDate = new Date(year, monthIdx, 1);
          const checkOutDate = new Date(year, monthIdx, 8);

          finalCheckIn = checkInDate.toISOString().split("T")[0];
          finalCheckOut = checkOutDate.toISOString().split("T")[0];
        } else if (flexibleDuration === "month") {
          // Full month (1st to 1st of next month)
          const checkInDate = new Date(year, monthIdx, 1);
          const checkOutDate = new Date(year, monthIdx + 1, 1);

          finalCheckIn = checkInDate.toISOString().split("T")[0];
          finalCheckOut = checkOutDate.toISOString().split("T")[0];
        }
      }
    }

    if (finalCheckIn) query.append("check_in", finalCheckIn);
    if (finalCheckOut) query.append("check_out", finalCheckOut);
    router.push(`/search?${query.toString()}`);
  };

  const nextCalMonth = () => {
    setCalendarStart(prev => {
      const d = new Date(prev.year, prev.month + 1);
      if (d.getFullYear() > 2030 || (d.getFullYear() === 2030 && d.getMonth() > 10)) return prev;
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const prevCalMonth = () => {
    setCalendarStart(prev => {
      const today = new Date();
      const d = new Date(prev.year, prev.month - 1);
      if (d < new Date(today.getFullYear(), today.getMonth())) return prev;
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Hide the global traveler navbar on all host management and wizard setup screens
  if (pathname?.startsWith("/host")) {
    return null;
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-1.5 text-[#FF385C] flex-shrink-0">
          <img 
            src="/airbnb-logo-new.jpg" 
            alt="Airbnb Logo" 
            className="w-9 h-9 object-contain" 
            style={{ mixBlendMode: 'multiply' }} 
          />
          <span className="font-extrabold text-[22px] tracking-tight text-[#FF385C]">
            airbnb
          </span>
          </Link>
        </div>

        {/* Central Section with transition (Tabs <-> Compact Search Bar) */}
        <div className="flex-none relative w-[380px] h-12 select-none hidden md:block">
          {/* Expanded Navigation Tabs */}
          <div 
            className={`absolute inset-0 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 transform transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCollapsed 
                ? "opacity-0 pointer-events-none -translate-y-2.5 scale-95 duration-100" 
                : "opacity-100 scale-100 translate-y-0 duration-300 delay-100"
            }`}
          >
            {/* Homes Tab */}
            <button 
              onClick={() => handleTabClick("homes")}
              className={`flex items-center gap-2 px-3 py-1.5 border-b-2 transition cursor-pointer ${
                activeTab === "homes" ? "border-black text-gray-900 font-bold" : "border-transparent hover:text-black"
              }`}
            >
              <span className="relative w-11 h-11 flex items-center justify-center -ml-3 -mr-2">
                <video 
                  className="w-full h-full object-contain"
                  playsInline 
                  tabIndex={-1} 
                  poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240" 
                  preload="auto"
                  autoPlay
                  loop
                  muted
                >
                  <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov" type='video/mp4; codecs="hvc1"' />
                  <source src="https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm" type="video/webm" />
                </video>
              </span>
              <span>Homes</span>
            </button>

            {/* Experiences Tab */}
            <button 
              onClick={() => handleTabClick("experiences")}
              className={`flex items-center gap-2 px-3 py-1.5 border-b-2 transition cursor-pointer ${
                activeTab === "experiences" ? "border-black text-gray-900 font-bold" : "border-transparent hover:text-black"
              }`}
            >
              <span className="relative w-11 h-11 flex items-center justify-center -ml-3 -mr-2">
                <video 
                  className="w-full h-full object-contain"
                  playsInline 
                  tabIndex={-1} 
                  poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240" 
                  preload="auto"
                  autoPlay
                  loop
                  muted
                >
                  <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
                  <source src="https://a0.muscache.com/videos/search-bar-icons/webm/balloon-selected.webm" type="video/webm" />
                </video>
              </span>
              <span className="flex items-center gap-1">
                <span>Experiences</span>
                <span className="px-1 py-[1px] rounded-[4px] border border-[#5B0888] text-[#5B0888] text-[8px] font-extrabold leading-none">NEW</span>
              </span>
            </button>

            {/* Services Tab */}
            <button 
              onClick={() => handleTabClick("services")}
              className={`flex items-center gap-2 px-3 py-1.5 border-b-2 transition cursor-pointer ${
                activeTab === "services" ? "border-black text-gray-900 font-bold" : "border-transparent hover:text-black"
              }`}
            >
              <span className="relative w-11 h-11 flex items-center justify-center -ml-3 -mr-2">
                <video 
                  className="w-full h-full object-contain"
                  playsInline 
                  tabIndex={-1} 
                  poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240" 
                  preload="auto"
                  autoPlay
                  loop
                  muted
                >
                  <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
                  <source src="https://a0.muscache.com/videos/search-bar-icons/webm/consierge-selected.webm" type="video/webm" />
                </video>
              </span>
              <span className="flex items-center gap-1">
                <span>Services</span>
                <span className="px-1 py-[1px] rounded-[4px] border border-blue-600 text-blue-600 text-[8px] font-extrabold leading-none">NEW</span>
              </span>
            </button>
          </div>

          {/* Collapsed Search Bar (Screenshot 3) */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transform transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCollapsed 
                ? "opacity-100 scale-100 translate-y-0 duration-300 delay-100" 
                : "opacity-0 pointer-events-none translate-y-2.5 scale-95 duration-100"
            }`}
          >
            <div 
              className="flex items-center gap-2 border border-gray-200 hover:shadow-md transition bg-white rounded-full py-1.5 pl-3.5 pr-1.5 shadow-sm text-xs font-bold text-gray-800 w-full justify-between"
            >
              <button 
                type="button"
                onClick={() => { setActiveDropdown("where"); }}
                className="flex items-center gap-1.5 pl-1.5 cursor-pointer hover:opacity-70 transition flex-shrink-0"
              >
                <span className="relative w-8 h-8 flex items-center justify-center -mr-1">
                  {activeTab === "homes" && (
                    <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240" preload="auto" autoPlay loop muted>
                      <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov" type='video/mp4; codecs="hvc1"' />
                      <source src="https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm" type="video/webm" />
                    </video>
                  )}
                  {activeTab === "experiences" && (
                    <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240" preload="auto" autoPlay loop muted>
                      <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
                      <source src="https://a0.muscache.com/videos/search-bar-icons/webm/balloon-selected.webm" type="video/webm" />
                    </video>
                  )}
                  {activeTab === "services" && (
                    <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240" preload="auto" autoPlay loop muted>
                      <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
                      <source src="https://a0.muscache.com/videos/search-bar-icons/webm/consierge-selected.webm" type="video/webm" />
                    </video>
                  )}
                </span>
                <span className="text-gray-900 font-extrabold">{activeTab === "homes" ? "Anywhere" : activeTab === "experiences" ? "Experiences" : "Services"}</span>
              </button>
              
              <span className="text-gray-250 font-light px-1">|</span>
              
              <button 
                type="button"
                onClick={() => { setActiveDropdown("when"); }}
                className="text-gray-900 font-extrabold cursor-pointer hover:opacity-70 transition"
              >
                Anytime
              </button>
              
              <span className="text-gray-250 font-light px-1">|</span>
              
              <button 
                type="button"
                onClick={() => { setActiveDropdown("who"); }}
                className="text-gray-900 font-extrabold hover:text-black cursor-pointer transition flex items-center gap-2.5"
              >
                <span>Add guests</span>
                <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                  <Search className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section Menu */}
        <div className="flex-1 flex justify-end items-center gap-2">
          
          <Link 
            href={isMounted && currentUser ? "/host/homes" : "/login?redirect_url=%2Fhost%2Fhomes"} 
            className="hidden md:block text-sm font-semibold text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-full transition"
          >
            {isMounted && hasHostStatus ? "Switch to hosting" : "Become a host"}
          </Link>

          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="p-3 hover:bg-gray-50 rounded-full transition hidden sm:block cursor-pointer"
          >
            <Globe className="w-4.5 h-4.5 text-gray-700" />
          </button>

          {/* Profile Icon button */}
          <Link
            href="/profile"
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-md transition border border-gray-200 overflow-hidden flex-shrink-0 ${
              isMounted && currentUser ? "bg-[#E3F2FD] text-[#1E88E5]" : "bg-gray-100 text-gray-550"
            }`}
          >
            {isMounted && currentUser?.avatar_url ? (
              <img 
                src={currentUser.avatar_url} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
              />
            ) : isMounted && currentUser?.name ? (
              currentUser.name.charAt(0).toUpperCase()
            ) : (
              <UserIcon className="w-4.5 h-4.5" />
            )}
          </Link>

          {/* Three Lines Menu button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F3F4F6] text-gray-800 hover:shadow-md transition cursor-pointer border border-gray-200 flex-shrink-0"
          >
            <Menu className="w-4.5 h-4.5 text-gray-700" />
          </button>

          {/* --- Dropdown Menu matching Screenshot 2 --- */}
          {showDropdown && (
            <div className="absolute right-8 top-[72px] w-[260px] bg-white border border-gray-200/60 rounded-[16px] shadow-2xl py-2 z-50 text-[14px] animate-in fade-in duration-100">
              
              {!currentUser ? (
                <>
                  {/* Logged Out State */}
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-[#222222] font-semibold transition">
                    <HelpCircle className="w-[18px] h-[18px] text-[#222222]" />
                    <span>Help Centre</span>
                  </button>
                  
                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>

                  <Link 
                    href="/login?redirect_url=%2Fhost%2Fhomes"
                    onClick={() => setShowDropdown(false)} 
                    className="px-4 py-3 bg-white flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition block"
                  >
                    <div className="flex-grow">
                      <h4 className="font-semibold text-[#222222] text-[14px]">Become a host</h4>
                      <p className="text-[14px] text-gray-500 font-normal leading-snug mt-0.5">
                        It&apos;s easy to start hosting and earn extra income.
                      </p>
                    </div>
                    <div className="w-9 h-11 flex items-center justify-center text-2xl flex-shrink-0">
                      🧍‍♀️
                    </div>
                  </Link>

                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>

                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Refer a host
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Find a co-host
                  </button>
                  
                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>

                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLoginModal(true);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition cursor-pointer"
                  >
                    Log in or sign up
                  </button>
                </>
              ) : (
                <>
                  {/* Logged In State matching Image 4 */}
                  <Link href="/wishlists" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Wishlists
                  </Link>
                  <Link href="/my-trips" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Trips
                  </Link>
                  <Link href="/messages" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Messages
                  </Link>
                  <Link href="/profile" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-semibold transition">
                    Profile
                  </Link>
                  
                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>
                  
                  <Link href="/notifications" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Notifications
                  </Link>
                  <Link href="/account" onClick={() => setShowDropdown(false)} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Account settings
                  </Link>
                  <button onClick={() => { setShowDropdown(false); setIsLanguageModalOpen(true); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Languages & currency
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Help Centre
                  </button>

                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>
                  
                  <Link 
                    href="/host/homes"
                    onClick={() => setShowDropdown(false)} 
                    className="px-4 py-3 bg-white flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition block"
                  >
                    <div className="flex-grow">
                      <h4 className="font-semibold text-[#222222] text-[14px]">
                        {hasHostStatus ? "Switch to hosting" : "Become a host"}
                      </h4>
                      <p className="text-[14px] text-gray-500 font-normal leading-snug mt-0.5">
                        {hasHostStatus 
                          ? "Manage your listings, calendar, and host settings."
                          : "It's easy to start hosting and earn extra income."
                        }
                      </p>
                    </div>
                    <div className="w-9 h-11 flex items-center justify-center text-2xl flex-shrink-0">
                      🧍‍♀️
                    </div>
                  </Link>

                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>

                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Refer a host
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition">
                    Find a co-host
                  </button>

                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>
                  
                  <button 
                    onClick={async () => {
                      await logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#222222] font-normal transition cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Dark Backdrop when search is opened as an overlay */}
      {activeDropdown !== null && isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/25 z-30" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* --- BIG SEARCH PILL ROW (Segmented pill, Screenshot 1) --- */}
      <div 
        ref={searchFormRef}
        className={`max-w-4xl mx-auto px-4 transition-[height,opacity,padding] duration-350 ease-in-out will-change-[height,opacity] ${
          !isCollapsed 
            ? "h-[90px] opacity-100 pb-6 pt-1 overflow-visible relative z-40" 
            : activeDropdown !== null
              ? "absolute top-20 left-0 right-0 h-[90px] opacity-100 pb-6 pt-1 overflow-visible z-40"
              : "h-0 opacity-0 pointer-events-none py-0 overflow-hidden relative z-40"
        }`}
      >
        <form 
          onSubmit={handleSearchSubmit} 
          className={`flex flex-row items-center w-full border border-gray-200 rounded-full shadow-lg p-0 text-xs text-gray-800 relative h-[66px] transition-colors duration-200 ${
            activeDropdown !== null ? "bg-[#EBEBEB]" : "bg-white"
          }`}
        >
          {/* Where */}
          <div 
            onClick={() => setActiveDropdown("where")}
            className={`h-full flex-1 px-8 flex flex-col justify-center cursor-pointer transition rounded-full hover:bg-[#DDDDDD] ${
              activeDropdown === "where" ? "bg-white shadow-xl z-20 hover:bg-white" : ""
            }`}
          >
            <label className="block font-extrabold text-[10px] text-gray-800 uppercase tracking-wide">Where</label>
            <input
              type="text"
              placeholder={
                activeTab === "experiences" 
                  ? "Search by city or landmark" 
                  : "Search destinations"
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setActiveDropdown("where")}
              className="w-full text-xs text-gray-700 bg-transparent border-none focus:outline-none placeholder-gray-400 font-normal mt-0.5"
            />
          </div>

          {/* Divider 1 */}
          {activeDropdown !== "where" && activeDropdown !== "when" && (
            <div className="hidden md:block w-[1px] h-8 bg-gray-200 flex-shrink-0" />
          )}

          {/* When (Dates) */}
          <div 
            onClick={() => setActiveDropdown("when")}
            className={`h-full flex-1 px-8 flex flex-col justify-center cursor-pointer transition rounded-full hover:bg-[#DDDDDD] ${
              activeDropdown === "when" ? "bg-white shadow-xl z-20 hover:bg-white" : ""
            }`}
          >
            <div className="flex-grow flex flex-col justify-center">
              <label className="block font-extrabold text-[10px] text-gray-800 uppercase tracking-wide">When</label>
              <div className="text-xs text-gray-600 mt-1 font-normal truncate h-4 flex items-center">
                {activeTab === "homes" && whenHomeTab === "flexible" && selectedFlexibleMonth ? (
                  <span className="font-bold text-gray-900">
                    {flexibleDuration === "weekend" ? "Any weekend" : flexibleDuration === "week" ? "A week" : "A month"} in {selectedFlexibleMonth.split(" ")[0]}
                  </span>
                ) : startDate ? (
                  <span className="font-bold text-gray-900">
                    {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {endDate ? ` – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                  </span>
                ) : (
                  <span className="text-gray-400">Add dates</span>
                )}
              </div>
            </div>
          </div>

          {/* Divider 2 */}
          {activeDropdown !== "when" && activeDropdown !== "who" && (
            <div className="hidden md:block w-[1px] h-8 bg-gray-200 flex-shrink-0" />
          )}

          {/* Who / Service Type */}
          <div 
            onClick={() => setActiveDropdown("who")}
            className={`h-full flex-1 px-8 flex items-center justify-between cursor-pointer transition rounded-full hover:bg-[#DDDDDD] ${
              activeDropdown === "who" ? "bg-white shadow-xl z-20 hover:bg-white" : ""
            }`}
          >
            <div className="flex-grow flex flex-col justify-center">
              <label className="block font-extrabold text-[10px] text-gray-800 uppercase tracking-wide">
                {activeTab === "services" ? "Type of service" : "Who"}
              </label>
              <div className="text-xs text-gray-600 mt-1 font-normal truncate h-4 flex items-center select-none">
                {activeTab === "services" ? (
                  serviceType ? (
                    <span className="font-bold text-gray-900">{serviceType}</span>
                  ) : (
                    <span className="text-gray-400">Add service</span>
                  )
                ) : (
                  getGuestsLabel() === "Add guests" ? (
                    <span className="text-gray-400">Add guests</span>
                  ) : (
                    <span className="font-bold text-gray-900">{getGuestsLabel()}</span>
                  )
                )}
              </div>
            </div>
            
            {/* Search red pill button */}
            <button
              type="submit"
              className="py-3 px-5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-full transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 flex-shrink-0 font-bold text-xs select-none"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Popover Dropdown - Where */}
          {activeDropdown === "where" && (
            <div className="absolute top-full left-0 mt-3 w-full max-w-sm bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 z-50 text-sm animate-in fade-in zoom-in-95 duration-155">
              <h4 className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider mb-3 px-2">Suggested destinations</h4>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[320px] scrollbar-none">
                
                {/* Nearby */}
                <div 
                  onClick={() => handleDestinationSelect("Nearby")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 text-blue-500 fill-blue-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">Nearby</p>
                    <p className="text-[11px] text-gray-400 font-normal">Find what&apos;s around you</p>
                  </div>
                </div>

                {/* North Goa */}
                <div 
                  onClick={() => handleDestinationSelect("North Goa")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">North Goa, Goa</p>
                    <p className="text-[11px] text-gray-400 font-normal font-light">Because your wishlist has stays in North Goa</p>
                  </div>
                </div>

                {/* South Goa */}
                <div 
                  onClick={() => handleDestinationSelect("South Goa")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">South Goa, Goa</p>
                    <p className="text-[11px] text-gray-400 font-normal">Popular beach destination</p>
                  </div>
                </div>

                {/* Mumbai */}
                <div 
                  onClick={() => handleDestinationSelect("Mumbai")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">Mumbai, Maharashtra</p>
                    <p className="text-[11px] text-gray-400 font-normal">For sights like Gateway of India</p>
                  </div>
                </div>

                {/* Puducherry */}
                <div 
                  onClick={() => handleDestinationSelect("Puducherry")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">Puducherry, Puducherry</p>
                    <p className="text-[11px] text-gray-400 font-normal">For its seaside allure</p>
                  </div>
                </div>

                {/* Ooty */}
                <div 
                  onClick={() => handleDestinationSelect("Ooty")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">Ooty, Tamil Nadu</p>
                    <p className="text-[11px] text-gray-400 font-normal">Great for a weekend getaway</p>
                  </div>
                </div>

                {/* Mysore */}
                <div 
                  onClick={() => handleDestinationSelect("Mysore")}
                  className="flex items-center gap-3.5 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-[13px]">Mysore, Karnataka</p>
                    <p className="text-[11px] text-gray-400 font-normal">For its stunning architecture</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Popover Dropdown - When */}
          {activeDropdown === "when" && (
            <div className="absolute top-full left-0 right-0 md:left-auto md:right-1/2 md:translate-x-1/2 mt-3 w-full max-w-[680px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {activeTab === "homes" ? (
                /* Homes Tab - Dates / Flexible */
                <div className="flex flex-col gap-5">
                  {/* Tab selector */}
                  <div className="flex justify-center">
                    <div className="bg-gray-100 p-1 rounded-full flex gap-1 text-[11px] font-bold text-gray-500 select-none">
                      <button
                        type="button"
                        onClick={() => setWhenHomeTab("dates")}
                        className={`px-5 py-2 rounded-full transition cursor-pointer ${whenHomeTab === "dates" ? "bg-white shadow-xs text-gray-900 font-extrabold" : "hover:text-black"}`}
                      >
                        Dates
                      </button>
                      <button
                        type="button"
                        onClick={() => setWhenHomeTab("flexible")}
                        className={`px-5 py-2 rounded-full transition cursor-pointer ${whenHomeTab === "flexible" ? "bg-white shadow-xs text-gray-900 font-extrabold" : "hover:text-black"}`}
                      >
                        Flexible
                      </button>
                    </div>
                  </div>

                  {whenHomeTab === "dates" && (() => {
                    const month2Date = new Date(calendarStart.year, calendarStart.month + 1);
                    const month1Name = new Date(calendarStart.year, calendarStart.month).toLocaleString('default', { month: 'long', year: 'numeric' });
                    const month2Name = month2Date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    return (
                      <>
                        <div className="relative">
                          <button type="button" onClick={prevCalMonth} className="absolute left-0 top-0 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600 font-bold">←</button>
                          <button type="button" onClick={nextCalMonth} className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600 font-bold">→</button>
                          <div className="flex flex-col md:flex-row gap-8 justify-between border-b border-gray-100 pb-5">
                            {renderCalendarMonth(calendarStart.year, calendarStart.month, month1Name)}
                            {renderCalendarMonth(month2Date.getFullYear(), month2Date.getMonth(), month2Name)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1 select-none">
                          {["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days"].map((label, i) => (
                            <button key={label} type="button" className={`px-4 py-1.5 border rounded-full text-xs font-semibold transition cursor-pointer active:scale-95 ${i === 0 ? "border-2 border-black text-gray-900 font-bold" : "border-gray-200 hover:border-black text-gray-600"}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}

                  {whenHomeTab === "flexible" && (() => {
                    const flexMonths: string[] = [];
                    for (let y = 2026; y <= 2030; y++) {
                      for (let m = 0; m < 12; m++) {
                        if (y === 2026 && m < 6) continue;
                        flexMonths.push(new Date(y, m).toLocaleString('default', { month: 'long', year: 'numeric' }));
                      }
                    }
                    return (
                      <div className="text-center select-none">
                        <h3 className="font-extrabold text-xs text-gray-900 mb-4 uppercase tracking-wider">How long would you like to stay?</h3>
                        <div className="flex justify-center gap-3 mb-6">
                          {([
                            { key: "weekend", label: "Weekend" },
                            { key: "week", label: "Week" },
                            { key: "month", label: "Month" }
                          ] as const).map((item) => (
                            <button 
                              key={item.key} 
                              type="button" 
                              onClick={() => setFlexibleDuration(item.key)}
                              className={`px-6 py-2.5 border rounded-full font-bold text-xs transition cursor-pointer active:scale-95 ${
                                flexibleDuration === item.key 
                                  ? "border-2 border-black bg-black text-white" 
                                  : "border-gray-200 hover:border-black text-gray-700 bg-white"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <h3 className="font-extrabold text-xs text-gray-900 mb-4 uppercase tracking-wider">When do you want to go?</h3>
                        <div className="flex gap-3 justify-start overflow-x-auto pb-3 scrollbar-none">
                          {flexMonths.map((monthLabel) => {
                            const isSelected = monthLabel === selectedFlexibleMonth;
                            return (
                              <div 
                                key={monthLabel} 
                                onClick={() => setSelectedFlexibleMonth(monthLabel)}
                                className={`flex-shrink-0 w-28 h-24 border rounded-2xl flex flex-col items-center justify-center cursor-pointer transition active:scale-95 ${
                                  isSelected 
                                    ? "border-2 border-black bg-gray-50 shadow-md scale-102" 
                                    : "border-gray-200 hover:border-black bg-white text-gray-600"
                                }`}
                              >
                                <span className="text-lg mb-1">🗓️</span>
                                <span className="font-bold text-[11px] text-center px-1 leading-tight">{monthLabel}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Experiences / Services Tab - Image 4 style: quick options left + calendar right */
                <div className="flex gap-6">
                  {/* Left: Quick date options */}
                  <div className="flex flex-col gap-2 w-40 flex-shrink-0">
                    {[
                      { label: "Today", sublabel: "18 Jul" },
                      { label: "Tomorrow", sublabel: "19 Jul" },
                      { label: "This weekend", sublabel: "18–19 Jul" },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        className="w-full text-left p-4 border border-gray-200 hover:border-black rounded-2xl cursor-pointer transition active:scale-98 group"
                      >
                        <p className="font-bold text-gray-900 text-sm group-hover:underline">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.sublabel}</p>
                      </button>
                    ))}
                  </div>

                  {/* Right: Single calendar */}
                  <div className="flex-1 min-w-0 relative">
                    <button type="button" onClick={prevCalMonth} className="absolute left-0 top-0 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600 font-bold">←</button>
                    <button type="button" onClick={nextCalMonth} className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600 font-bold">→</button>
                    {renderCalendarMonth(calendarStart.year, calendarStart.month, new Date(calendarStart.year, calendarStart.month).toLocaleString('default', { month: 'long', year: 'numeric' }))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Popover Dropdown - Who */}
          {activeDropdown === "who" && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 z-50 text-sm flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
              
              {activeTab === "services" ? (
                <div>
                  <h4 className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider mb-3 select-none">Select a service type</h4>
                  <div className="flex flex-col gap-1.5">
                    {["Photography", "Yoga & Wellness", "Bridal & Makeup", "Local Tours", "Chef Services", "Pet Sitting", "Home Massage"].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          setServiceType(service);
                          setActiveDropdown(null);
                        }}
                        className={`text-left w-full py-2.5 px-4 rounded-xl font-bold transition select-none cursor-pointer text-xs ${
                          serviceType === service 
                            ? "bg-black text-white" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Adults Counter Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800 text-[14px]">Adults</p>
                      <p className="text-[11px] text-gray-400 font-normal">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setAdultsCount(Math.max(0, adultsCount - 1))}
                        disabled={adultsCount === 0}
                        className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 transition cursor-pointer select-none active:scale-95 ${
                          adultsCount === 0 ? "opacity-30 cursor-not-allowed" : "hover:border-black hover:text-black bg-white"
                        }`}
                      >
                        —
                      </button>
                      <span className="font-semibold text-sm w-4 text-center select-none">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-black flex items-center justify-center font-bold text-gray-600 hover:text-black transition cursor-pointer select-none active:scale-95 bg-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-100" />

                  {/* Children Counter Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800 text-[14px]">Children</p>
                      <p className="text-[11px] text-gray-400 font-normal">Ages 2–12</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        disabled={childrenCount === 0}
                        className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 transition cursor-pointer select-none active:scale-95 ${
                          childrenCount === 0 ? "opacity-30 cursor-not-allowed" : "hover:border-black hover:text-black bg-white"
                        }`}
                      >
                        —
                      </button>
                      <span className="font-semibold text-sm w-4 text-center select-none">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (adultsCount === 0) setAdultsCount(1);
                          setChildrenCount(childrenCount + 1);
                        }}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-black flex items-center justify-center font-bold text-gray-600 hover:text-black transition cursor-pointer select-none active:scale-95 bg-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-100" />

                  {/* Infants Counter Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800 text-[14px]">Infants</p>
                      <p className="text-[11px] text-gray-400 font-normal">Under 2</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                        disabled={infantsCount === 0}
                        className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 transition cursor-pointer select-none active:scale-95 ${
                          infantsCount === 0 ? "opacity-30 cursor-not-allowed" : "hover:border-black hover:text-black bg-white"
                        }`}
                      >
                        —
                      </button>
                      <span className="font-semibold text-sm w-4 text-center select-none">{infantsCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (adultsCount === 0) setAdultsCount(1);
                          setInfantsCount(infantsCount + 1);
                        }}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-black flex items-center justify-center font-bold text-gray-600 hover:text-black transition cursor-pointer select-none active:scale-95 bg-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

        </form>
      </div>

      {/* Language, Region and Currency Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black/55 z-[100] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
            
            {/* Close button X */}
            <button 
              onClick={() => setIsLanguageModalOpen(false)}
              className="absolute top-6 left-6 text-gray-500 hover:text-black cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition z-50 font-extrabold"
              title="Close modal"
            >
              ✕
            </button>

            {/* Modal Tabs Header */}
            <div className="flex gap-6 border-b border-gray-100 px-16 pt-6 pb-2 select-none">
              <button
                onClick={() => setActiveModalTab("language")}
                className={`pb-3 font-extrabold text-sm transition cursor-pointer relative ${
                  activeModalTab === "language" ? "text-black" : "text-gray-400 hover:text-gray-800"
                }`}
              >
                Language and region
                {activeModalTab === "language" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveModalTab("currency")}
                className={`pb-3 font-extrabold text-sm transition cursor-pointer relative ${
                  activeModalTab === "currency" ? "text-black" : "text-gray-400 hover:text-gray-800"
                }`}
              >
                Currency
                {activeModalTab === "currency" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full" />
                )}
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-grow overflow-y-auto px-16 py-6 scrollbar-none">
              {activeModalTab === "language" ? (
                <div>
                  {/* Translation Enable Option */}
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-2xl flex items-center justify-between mb-8 select-none">
                    <div>
                      <p className="font-extrabold text-gray-800 text-[14px]">Translation</p>
                      <p className="text-[11px] text-gray-400 font-normal mt-0.5">Automatically translate descriptions and reviews to English.</p>
                    </div>
                    {/* Toggle button check */}
                    <button
                      type="button"
                      onClick={() => setTranslationEnabled(!translationEnabled)}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 flex items-center ${
                        translationEnabled ? "bg-black" : "bg-gray-200"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[7px] font-bold ${
                        translationEnabled ? "translate-x-6 text-black" : "translate-x-0 text-transparent"
                      }`}>
                        ✓
                      </div>
                    </button>
                  </div>

                  {/* Suggested languages */}
                  <h3 className="font-extrabold text-base text-gray-800 mb-4 select-none">Suggested languages and regions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                    {LANGUAGES.slice(0, 5).map((l, i) => (
                      <div 
                        key={i} 
                        onClick={() => setIsLanguageModalOpen(false)}
                        className="p-3 border border-gray-100 hover:bg-gray-50 rounded-xl cursor-pointer transition flex flex-col justify-center min-h-[58px]"
                      >
                        <span className="font-extrabold text-gray-800 text-xs">{l.lang}</span>
                        <span className="text-[10px] text-gray-400 font-normal mt-0.5">{l.region}</span>
                      </div>
                    ))}
                  </div>

                  {/* Choose language */}
                  <h3 className="font-extrabold text-base text-gray-800 mb-4 select-none">Choose a language and region</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {LANGUAGES.map((l, i) => {
                      const isSelected = l.lang === "English" && l.region === "India";
                      return (
                        <div 
                          key={i} 
                          onClick={() => setIsLanguageModalOpen(false)}
                          className={`p-3 border rounded-xl cursor-pointer transition flex flex-col justify-center min-h-[58px] ${
                            isSelected ? "border-black bg-gray-50/50" : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className="font-extrabold text-gray-800 text-xs">{l.lang}</span>
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5">{l.region}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-4 select-none">Choose a currency</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {CURRENCIES.map((c, i) => {
                      const displayCode = `${c.code} - ${c.symbol || ""}`;
                      const isSelected = selectedCurrency === displayCode;
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedCurrency(displayCode);
                            setIsLanguageModalOpen(false);
                          }}
                          className={`p-3 border rounded-xl cursor-pointer transition flex flex-col justify-center min-h-[58px] ${
                            isSelected ? "border-black bg-gray-50/50" : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className="font-extrabold text-gray-800 text-xs">{c.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5">{displayCode}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onContinue={() => {
          setShowLoginModal(false);
          setShowPromoModal(true);
        }}
      />

      {/* Promo Modal (Discount popcard) */}
      <PromoModal 
        isOpen={showPromoModal} 
        onClose={() => setShowPromoModal(false)}
      />

    </header>
  );
}
