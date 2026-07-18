"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { 
  Home, 
  DoorOpen, 
  Users, 
  MapPin, 
  Plus, 
  Minus, 
  Wifi, 
  Tv, 
  Utensils, 
  Wrench, 
  Car, 
  CircleDollarSign, 
  Wind, 
  Briefcase, 
  Camera, 
  X,
  UploadCloud,
  ChevronLeft
} from "lucide-react";

// Types for Wizard State
type CategoryType = "House" | "Flat/apartment" | "Barn" | "Bed & breakfast" | "Boat" | "Cabin" | "Campervan/motorhome" | "Casa particular" | "Castle" | "Cave" | "Container" | "Cycladic home";
type PlaceType = "entire" | "room" | "shared";

interface WizardData {
  category: CategoryType | "";
  placeType: PlaceType | "";
  location: string;
  guestsCount: number;
  bedroomsCount: number;
  bedsCount: number;
  bathroomsCount: number;
  amenities: string[];
  photos: string[];
  title: string;
  description: string;
  price: number;
  cleaningFee: number;
  serviceFee: number;
}

const CATEGORIES: { label: CategoryType; icon: string }[] = [
  { label: "House", icon: "🏠" },
  { label: "Flat/apartment", icon: "🏢" },
  { label: "Barn", icon: "🛖" },
  { label: "Bed & breakfast", icon: "🍳" },
  { label: "Boat", icon: "⛵" },
  { label: "Cabin", icon: "🪵" },
  { label: "Campervan/motorhome", icon: "🚐" },
  { label: "Casa particular", icon: "🏡" },
  { label: "Castle", icon: "🏰" },
  { label: "Cave", icon: "⛰️" },
  { label: "Container", icon: "📦" },
  { label: "Cycladic home", icon: "🏛️" }
];

const AMENITIES_OPTIONS = [
  { label: "Wifi", icon: Wifi },
  { label: "TV", icon: Tv },
  { label: "Kitchen", icon: Utensils },
  { label: "Washing machine", icon: Wrench },
  { label: "Free parking on premises", icon: Car },
  { label: "Paid parking on premises", icon: CircleDollarSign },
  { label: "Air conditioning", icon: Wind },
  { label: "Dedicated workspace", icon: Briefcase }
];

export default function HostSetupWizard() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Wizard state machine index
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 12; // 0 to 11

  // Data State
  const [formData, setFormData] = useState<WizardData>({
    category: "",
    placeType: "",
    location: "123, 4th Cross Rd, A D Halli, 2nd Stage, KHB Colony, Basaveshwar Nagar, Bengaluru, Karnataka 560079, India",
    guestsCount: 4,
    bedroomsCount: 1,
    bedsCount: 1,
    bathroomsCount: 1.0,
    amenities: ["Wifi"],
    photos: [],
    title: "",
    description: "",
    price: 120,
    cleaningFee: 40,
    serviceFee: 15
  });

  // Modal State for Photo Upload
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load incomplete setup from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("airbnb_incomplete_listing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.data);
        setCurrentStep(parsed.step);
      } catch (err) {
        console.error("Failed to parse saved state", err);
      }
    }
  }, []);

  // Save progress
  const saveProgress = () => {
    localStorage.setItem(
      "airbnb_incomplete_listing", 
      JSON.stringify({ data: formData, step: currentStep })
    );
    router.push("/host/homes");
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePublish = async () => {
    setError(null);
    setLoading(true);
    
    // Process photos - ensure we have the minimum or add high quality default assets
    let finalPhotos = [...formData.photos];
    if (finalPhotos.length < 5) {
      const defaults = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
      ];
      while (finalPhotos.length < 5) {
        finalPhotos.push(defaults[finalPhotos.length]);
      }
    }

    try {
      await api.listings.create({
        title: formData.title || `Lovely ${formData.category} in Bengaluru`,
        description: formData.description || "Beautiful property listed via setup wizard.",
        location: formData.location,
        property_type: formData.category || "House",
        price_per_night: formData.price,
        cleaning_fee: formData.cleaningFee,
        service_fee: formData.serviceFee,
        max_guests: formData.guestsCount,
        bedrooms: formData.bedroomsCount,
        beds: formData.bedsCount,
        bathrooms: formData.bathroomsCount,
        photos: finalPhotos,
        amenities: formData.amenities,
        host_id: currentUser?.id || 1,
        is_guest_favourite: Math.random() > 0.5
      });

      // Clear draft on successful creation
      localStorage.removeItem("airbnb_incomplete_listing");
      router.push("/host/dashboard");
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
      setLoading(false);
    }
  };

  const toggleAmenity = (label: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(label)
        ? prev.amenities.filter(a => a !== label)
        : [...prev.amenities, label]
    }));
  };

  const addPhoto = () => {
    if (photoUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrlInput.trim()]
      }));
      setPhotoUrlInput("");
      setShowPhotoModal(false);
    }
  };

  const removePhoto = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  // Helper validation for Next button
  const isNextDisabled = () => {
    if (currentStep === 1 && !formData.category) return true;
    if (currentStep === 2 && !formData.placeType) return true;
    if (currentStep === 7 && formData.photos.length < 5) return true;
    if (currentStep === 8 && !formData.title.trim()) return true;
    if (currentStep === 9 && !formData.description.trim()) return true;
    return false;
  };

  // Calculate overall Progress Width
  const progressPercent = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans text-gray-900 select-none">
      
      {/* Wizard Header - Image 2 style */}
      <header className="flex items-center justify-between px-10 py-6">
        <Link href="/" className="text-black flex items-center justify-center">
          {/* Black monochrome Airbnb logo */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.644-.651-.645.651-.256.26c-2.153 2.128-4.485 3.386-6.709 3.386-3.48 0-6.357-2.416-6.357-6.478l.001-.228.011-.415c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.312-.001.18c0 2.775 1.519 4.222 3.943 4.222 1.488 0 3.267-.84 5.253-2.617l.783-.733 1.522-1.464 1.522 1.464.783.733c1.986 1.777 3.765 2.617 5.253 2.617 2.424 0 3.943-1.447 3.943-4.222l-.001-.18-.009-.312c-.032-.585-.178-1.169-.605-2.24l-.345-.836c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.239 3 16 3z" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-[12px] font-bold border border-gray-300 bg-white hover:border-black rounded-full transition cursor-pointer">
            Questions?
          </button>
          <button 
            onClick={saveProgress}
            className="px-4 py-2 text-[12px] font-bold border border-gray-300 bg-white hover:border-black rounded-full transition cursor-pointer"
          >
            Save & exit
          </button>
        </div>
      </header>

      {/* Main Form Body */}
      <div className="flex-grow flex items-center justify-center px-10 py-4 max-w-7xl mx-auto w-full">
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold max-w-md z-50">
            ⚠️ {error}
          </div>
        )}

        {/* Step 0: Welcome / Step 1 Intro */}
        {currentStep === 0 && (
          <div className="flex flex-col md:flex-row items-center gap-16 w-full animate-in fade-in duration-300">
            <div className="flex-1 space-y-4">
              <span className="text-[14px] font-bold text-gray-500">Step 1</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight leading-tight">
                Tell us about your place
              </h1>
              <p className="text-sm text-gray-500 font-light max-w-md leading-relaxed">
                In this step, we&apos;ll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
              </p>
            </div>
            {/* Isometric architectural line SVG */}
            <div className="flex-1 w-full max-w-md">
              <svg viewBox="0 0 100 100" className="w-full h-auto text-gray-800">
                {/* Outer Box */}
                <path d="M50 15 L85 32 L85 72 L50 90 L15 72 L15 32 Z" fill="none" stroke="#222222" strokeWidth="1" />
                {/* Floors */}
                <path d="M50 52 L85 32 L50 15 L15 32 Z" fill="#F8FAFC" stroke="#CCCCCC" strokeWidth="0.5" />
                <path d="M50 90 L85 72 L50 52 L15 72 Z" fill="#F1F5F9" stroke="#CCCCCC" strokeWidth="0.5" />
                {/* Loft Staircase */}
                <path d="M68 62 L74 65 L74 48 L68 45 Z" fill="none" stroke="#222222" strokeWidth="1" />
                <line x1="68" y1="45" x2="74" y2="48" stroke="#222222" strokeWidth="1" />
                <line x1="68" y1="49" x2="74" y2="52" stroke="#222222" strokeWidth="1" />
                <line x1="68" y1="53" x2="74" y2="56" stroke="#222222" strokeWidth="1" />
                <line x1="68" y1="57" x2="74" y2="60" stroke="#222222" strokeWidth="1" />
                <line x1="68" y1="61" x2="74" y2="64" stroke="#222222" strokeWidth="1" />
                {/* Bed upper floor */}
                <path d="M30 25 L45 20 L50 22 L35 27 Z" fill="none" stroke="#222222" strokeWidth="1" />
                <path d="M35 27 L50 22 L50 26 L35 31 Z" fill="none" stroke="#222222" strokeWidth="1" />
                {/* Sofa lower floor */}
                <path d="M32 68 L48 62 L48 66 L32 72 Z" fill="none" stroke="#222222" strokeWidth="1" />
                {/* Dining table */}
                <ellipse cx="65" cy="74" rx="8" ry="4" fill="none" stroke="#222222" strokeWidth="1" />
                <line x1="65" y1="76" x2="65" y2="82" stroke="#222222" strokeWidth="1" />
              </svg>
            </div>
          </div>
        )}

        {/* Step 1: Category Grid */}
        {currentStep === 1 && (
          <div className="w-full text-center space-y-8 animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
              Which of these best describes your place?
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto max-h-[50vh] overflow-y-auto pr-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                  className={`p-4 rounded-xl border flex flex-col items-start gap-4 transition duration-200 cursor-pointer ${
                    formData.category === cat.label
                      ? "border-black border-[2px] bg-gray-50/50"
                      : "border-gray-200 hover:border-black"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[13px] font-bold text-gray-800">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Place Type Selection */}
        {currentStep === 2 && (
          <div className="w-full text-center space-y-8 max-w-xl mx-auto animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
              What type of place will guests have?
            </h1>
            <div className="space-y-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, placeType: "entire" }))}
                className={`w-full p-6 border rounded-xl flex items-center justify-between text-left transition duration-200 cursor-pointer ${
                  formData.placeType === "entire" ? "border-black border-[2px] bg-gray-50/50" : "border-gray-200 hover:border-black"
                }`}
              >
                <div>
                  <h3 className="font-extrabold text-[15px] text-gray-800">An entire place</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Guests have the whole place to themselves.</p>
                </div>
                <Home className="w-6 h-6 text-gray-500" />
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, placeType: "room" }))}
                className={`w-full p-6 border rounded-xl flex items-center justify-between text-left transition duration-200 cursor-pointer ${
                  formData.placeType === "room" ? "border-black border-[2px] bg-gray-50/50" : "border-gray-200 hover:border-black"
                }`}
              >
                <div>
                  <h3 className="font-extrabold text-[15px] text-gray-800">A room</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Guests have their own room in a home, plus access to shared spaces.</p>
                </div>
                <DoorOpen className="w-6 h-6 text-gray-500" />
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, placeType: "shared" }))}
                className={`w-full p-6 border rounded-xl flex items-center justify-between text-left transition duration-200 cursor-pointer ${
                  formData.placeType === "shared" ? "border-black border-[2px] bg-gray-50/50" : "border-gray-200 hover:border-black"
                }`}
              >
                <div>
                  <h3 className="font-extrabold text-[15px] text-gray-800">A shared room in a hostel</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.</p>
                </div>
                <Users className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location Map Pin */}
        {currentStep === 3 && (
          <div className="w-full text-center space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Is the pin in the right spot?
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                Your address is only shared with guests after they&apos;ve made a reservation.
              </p>
            </div>
            
            {/* Map Simulation matching Screen 5 */}
            <div className="w-full h-80 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3887.9263456384!2d77.538!3d12.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                className="w-full h-full grayscale-[10%]"
              />

              {/* Float Address bubble overlay */}
              <div className="absolute top-6 left-6 right-6 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl text-left flex items-start gap-3 z-10 max-w-md mx-auto">
                <MapPin className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-gray-700 leading-normal">
                  {formData.location}
                </span>
              </div>

              {/* Pin indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white border-2 border-white shadow-xl">
                  🏠
                </div>
                <div className="bg-black/80 backdrop-blur-xs text-[9px] font-bold text-white px-2 py-1 rounded-md shadow-sm">
                  Drag the map to reposition the pin
                </div>
              </div>
            </div>

            {/* Custom address input to prevent hardcoded address */}
            <div className="max-w-2xl mx-auto text-left space-y-2 mt-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Confirm your property address
              </label>
              <input
                type="text"
                placeholder="Enter address manually..."
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white font-medium text-gray-800 shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Step 4: Share Basics Counters */}
        {currentStep === 4 && (
          <div className="w-full max-w-xl mx-auto space-y-10 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Share some basics about your place
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                You&apos;ll add more details later, such as bed types.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-100">
              {/* Guests */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-semibold text-base text-gray-800">Guests</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, guestsCount: Math.max(1, prev.guestsCount - 1) }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-base w-6 text-center">{formData.guestsCount}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, guestsCount: prev.guestsCount + 1 }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-semibold text-base text-gray-800">Bedrooms</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bedroomsCount: Math.max(1, prev.bedroomsCount - 1) }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-base w-6 text-center">{formData.bedroomsCount}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bedroomsCount: prev.bedroomsCount + 1 }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Beds */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-semibold text-base text-gray-800">Beds</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bedsCount: Math.max(1, prev.bedsCount - 1) }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-base w-6 text-center">{formData.bedsCount}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bedsCount: prev.bedsCount + 1 }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bathrooms */}
              <div className="flex items-center justify-between pb-6">
                <span className="font-semibold text-base text-gray-800">Bathrooms</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bathroomsCount: Math.max(0.5, prev.bathroomsCount - 0.5) }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-base w-6 text-center">{formData.bathroomsCount}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bathroomsCount: prev.bathroomsCount + 0.5 }))}
                    className="w-9 h-9 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Step 2 Intro */}
        {currentStep === 5 && (
          <div className="flex flex-col md:flex-row items-center gap-16 w-full animate-in fade-in duration-300">
            <div className="flex-1 space-y-4">
              <span className="text-[14px] font-bold text-gray-500">Step 2</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight leading-tight">
                Make your place stand out
              </h1>
              <p className="text-sm text-gray-500 font-light max-w-md leading-relaxed">
                In this step, you&apos;ll add some of the amenities your place offers, plus 5 or more photos. Then you&apos;ll create a title and description.
              </p>
            </div>
            {/* Isometric house 2 SVG */}
            <div className="flex-grow w-full max-w-md">
              <svg viewBox="0 0 100 100" className="w-full h-auto text-gray-800">
                <path d="M50 15 L85 32 L85 72 L50 90 L15 72 L15 32 Z" fill="none" stroke="#222222" strokeWidth="1" />
                <path d="M50 52 L85 32 L50 15 L15 32 Z" fill="#F8FAFC" stroke="#CCCCCC" strokeWidth="0.5" />
                <path d="M50 90 L85 72 L50 52 L15 72 Z" fill="#F1F5F9" stroke="#CCCCCC" strokeWidth="0.5" />
                {/* Upstairs Bathtub on Balcony */}
                <ellipse cx="32" cy="28" rx="6" ry="3" fill="none" stroke="#222222" strokeWidth="1" />
                <line x1="32" y1="30" x2="32" y2="33" stroke="#222222" strokeWidth="1" />
                {/* Downstairs plants/tv */}
                <rect x="25" y="60" width="10" height="8" fill="none" stroke="#222222" strokeWidth="1" />
              </svg>
            </div>
          </div>
        )}

        {/* Step 6: Amenities Selector */}
        {currentStep === 6 && (
          <div className="w-full text-center space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Tell guests what your place has to offer
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                You can add more amenities after you publish your listing.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {AMENITIES_OPTIONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = formData.amenities.includes(item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleAmenity(item.label)}
                    className={`p-5 rounded-xl border flex flex-col items-start gap-4 text-left transition duration-200 cursor-pointer ${
                      isSelected ? "border-black border-[2px] bg-gray-50/50" : "border-gray-200 hover:border-black"
                    }`}
                  >
                    <IconComp className={`w-6 h-6 ${isSelected ? "text-black" : "text-gray-500"}`} />
                    <span className="text-[13px] font-bold text-gray-800">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 7: Photos Upload Box */}
        {currentStep === 7 && (
          <div className="w-full text-center space-y-8 max-w-2xl mx-auto animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Add some photos of your house
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                You&apos;ll need 5 photos to get started. You can add more or make changes later.
              </p>
            </div>

            {formData.photos.length === 0 ? (
              /* Dotted Box - Image 9 */
              <div 
                onClick={() => setShowPhotoModal(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-3xl py-20 bg-gray-50/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-sm">
                  <Camera className="w-7 h-7 text-gray-500" />
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white border border-gray-300 hover:border-black rounded-lg text-sm font-bold text-gray-800 transition"
                >
                  Add photos
                </button>
              </div>
            ) : (
              /* Image List view */
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.photos.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group border border-gray-200">
                      <img src={url} alt={`Listing Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition cursor-pointer bg-white"
                  >
                    <Plus className="w-6 h-6 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-600">Add More</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  {formData.photos.length} photo(s) added. Minimum 5 photos recommended.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 8: Listing Title */}
        {currentStep === 8 && (
          <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Now, let&apos;s give your house a title
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                Short titles work best. You can always change it later.
              </p>
            </div>

            <div>
              <textarea
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.slice(0, 50) }))}
                placeholder="e.g. Modernist Loft with Skyline Views"
                rows={3}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-base font-medium bg-white"
                required
              />
              <div className="text-right text-[11px] text-gray-400 font-bold mt-1">
                {formData.title.length}/50 characters
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Listing Description */}
        {currentStep === 9 && (
          <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Create your description
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                Share what makes your place special.
              </p>
            </div>

            <div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                placeholder="Write a warm overview of your home, its design details, and the neighborhood vibe..."
                rows={6}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white leading-relaxed"
                required
              />
              <div className="text-right text-[11px] text-gray-400 font-bold mt-1">
                {formData.description.length}/500 characters
              </div>
            </div>
          </div>
        )}

        {/* Step 10: Pricing Setup */}
        {currentStep === 10 && (
          <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Now, set your price
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                You can change it at any time.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Price per night ($)</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-28 p-2.5 border border-gray-200 rounded-xl text-center font-bold focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                  min="10"
                />
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Cleaning fee ($)</span>
                <input
                  type="number"
                  value={formData.cleaningFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                  className="w-28 p-2.5 border border-gray-200 rounded-xl text-center font-bold focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                  min="0"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 text-sm">Airbnb service fee ($)</span>
                <input
                  type="number"
                  value={formData.serviceFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceFee: Number(e.target.value) }))}
                  className="w-28 p-2.5 border border-gray-200 rounded-xl text-center font-bold focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 11: Review & Publish */}
        {currentStep === 11 && (
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Review your listing
              </h1>
              <p className="text-[13px] text-gray-500 font-light mt-1">
                Here&apos;s what we&apos;ll show guests. Make sure everything looks good.
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{formData.title || "Untitled Property"}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formData.location}</p>
                </div>
                <div className="text-xs text-gray-600 font-light leading-relaxed whitespace-pre-line border-t border-gray-150 pt-4">
                  {formData.description || "No description provided."}
                </div>
                <div className="text-xs text-gray-700 font-semibold pt-2">
                  Capacity: {formData.guestsCount} guests · {formData.bedroomsCount} bedrooms · {formData.bedsCount} beds
                </div>
              </div>

              <div className="w-full md:w-64 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 flex-shrink-0">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative">
                  {formData.photos.length > 0 ? (
                    <img src={formData.photos[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-gray-50">
                      Default Photo
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-lg font-bold">${formData.price}</span>
                    <span className="text-xs text-gray-500 font-light"> / night</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                    {formData.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress & Navigation Footer */}
      <footer className="border-t border-gray-150 py-4 px-10 flex flex-col gap-3">
        {/* Step progress bar */}
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden select-none">
          <div 
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-5 py-2.5 text-sm font-extrabold text-gray-700 hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5 border-none bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-8 py-3 bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-gray-300 text-white text-sm font-extrabold rounded-xl transition cursor-pointer active:scale-98 shadow-md"
            >
              {loading ? "Publishing..." : "Publish listing"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="px-8 py-3 bg-black hover:bg-neutral-850 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-extrabold rounded-xl transition cursor-pointer active:scale-98"
            >
              Next
            </button>
          )}
        </div>
      </footer>

      {/* Upload Photos Modal Overlay - Image 10 */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 select-none">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative border border-gray-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between relative">
              <button 
                onClick={() => { setShowPhotoModal(false); setPhotoUrlInput(""); }}
                className="p-1 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-extrabold text-base text-gray-900 absolute left-1/2 -translate-x-1/2">
                Upload photos
              </h3>
              <div className="w-6" /> {/* Spacer */}
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Drag and drop mock box */}
              <div className="border border-dashed border-gray-300 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                <UploadCloud className="w-12 h-12 text-gray-400" />
                <h4 className="font-extrabold text-base text-gray-800">Drag and drop</h4>
                <p className="text-xs text-gray-400 font-light">or browse for photos</p>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 hover:border-black bg-white rounded-xl text-xs font-bold text-gray-800 transition active:scale-95 cursor-pointer mt-1"
                >
                  Browse
                </button>
              </div>

              {/* URL input field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Or Paste Photo Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs bg-white"
                  />
                  <button
                    onClick={addPhoto}
                    disabled={!photoUrlInput.trim()}
                    className="px-4 py-3 bg-black hover:bg-neutral-850 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <button 
                onClick={() => { setShowPhotoModal(false); setPhotoUrlInput(""); }}
                className="text-xs font-bold text-gray-500 hover:text-black transition cursor-pointer border-none bg-transparent"
              >
                Done
              </button>
              <button
                disabled={true}
                className="px-5 py-2.5 bg-gray-200 text-gray-400 text-xs font-bold rounded-xl cursor-default"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
