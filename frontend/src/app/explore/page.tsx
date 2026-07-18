"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  SlidersHorizontal, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ArrowLeft
} from "lucide-react";
import { api } from "../../lib/api";
import { Listing } from "../../types";
import ListingCard from "../../components/listings/ListingCard";

// Dynamically import Leaflet Map to prevent SSR build failure
const ExploreMap = dynamic(() => import("../../components/map/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-l border-gray-150">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-2" />
      <span className="text-xs text-gray-500 font-bold">Loading interactive map...</span>
    </div>
  ),
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationParam = searchParams.get("location") || "All Locations";
  const guestParam = searchParams.get("guests") || "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  
  // Map zoom level
  const [zoom, setZoom] = useState(12);

  // Active custom filter pills (in-memory filtering)
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const filterOptions = [
    "Wifi", "Pool", "Kitchen", "Free parking", "AC", "TV", "Washing machine", "Allows pets"
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // Fetch all listings for this location
    api.listings.list({
      location: locationParam !== "All Locations" ? locationParam : undefined,
      guests: guestParam ? Number(guestParam) : undefined
    })
    .then((data) => {
      setListings(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [locationParam, guestParam]);

  const toggleFilter = (filterName: string) => {
    setActiveFilters((prev) => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName) 
        : [...prev, filterName]
    );
  };

  // Filter listings based on active filter pills
  const displayedListings = listings.filter((listing) => {
    if (activeFilters.length === 0) return true;
    const amenities = listing.amenities || [];
    const amenitiesLower = amenities.map(a => a.toLowerCase());
    return activeFilters.every(f => amenitiesLower.includes(f.toLowerCase()));
  });



  const handleCardHover = (id: number | null) => {
    setHoveredListingId(id);
  };

  const handleMarkerClick = (listingId: number) => {
    setSelectedListingId(listingId);
    // Scroll corresponding listing card into view
    const element = document.getElementById(`listing-card-${listingId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Navigation Bar */}
      <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-full hover:bg-gray-100 border border-gray-200 transition active:scale-95 cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-800" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-gray-800 capitalize leading-tight">
              Stays in {locationParam}
            </h1>
            <p className="text-[11px] text-gray-500">
              {displayedListings.length} homes available
            </p>
          </div>
        </div>

        {/* Home link */}
        <Link 
          href="/" 
          className="text-xs font-bold text-gray-700 hover:text-black transition border border-gray-200 px-4 py-2 rounded-xl hover:border-black bg-white select-none"
        >
          Back to Home
        </Link>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col md:flex-row flex-grow w-full">
        
        {/* Left Side: Stays List */}
        <div className="w-full md:w-3/5 lg:w-[58%] h-[calc(100vh-76px)] overflow-y-auto px-6 py-6 scrollbar-none flex flex-col">
          
          {/* Breadcrumbs */}
          <div className="text-[11px] text-gray-400 font-semibold mb-1 flex items-center gap-1">
            <span>India</span>
            <span>·</span>
            <span>Stays</span>
            <span>·</span>
            <span className="text-gray-600">{locationParam}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-4 select-none">
            Stays in {locationParam}
          </h2>

          {/* Prices include fees info pill */}
          <div className="flex mb-5">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full py-2.5 px-5 bg-white text-xs font-bold text-gray-700 shadow-xs">
              <svg className="w-3.5 h-3.5 fill-[#E61E4D]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75z" />
              </svg>
              <span>Prices include all fees and service charges</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-4 border-b border-gray-100 flex-shrink-0 select-none">
            <button className="flex items-center gap-1.5 border border-gray-250 hover:border-black rounded-full px-4 py-2 text-xs font-bold text-gray-800 transition cursor-pointer bg-white">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            {filterOptions.map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`border rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                    active 
                      ? "border-black bg-gray-900 text-white hover:bg-black" 
                      : "border-gray-200 hover:border-black text-gray-600 bg-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Listings List grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12 animate-pulse">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="aspect-square bg-gray-100 rounded-3xl w-full" />
                  <div className="h-4 bg-gray-100 rounded-sm w-[70%]" />
                  <div className="h-3 bg-gray-100 rounded-sm w-[50%]" />
                </div>
              ))}
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-grow">
              <p className="text-sm font-semibold text-gray-500 mb-2">No homes match your active filters.</p>
              <button 
                onClick={() => setActiveFilters([])} 
                className="text-xs font-bold text-[#FF385C] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
              {displayedListings.map((listing) => {
                const isHovered = hoveredListingId === listing.id;
                const isSelected = selectedListingId === listing.id;
                
                return (
                  <div
                    key={listing.id}
                    id={`listing-card-${listing.id}`}
                    onMouseEnter={() => handleCardHover(listing.id)}
                    onMouseLeave={() => handleCardHover(null)}
                    className={`transition-all duration-300 rounded-3xl p-1.5 border-2 ${
                      isSelected 
                        ? "border-[#FF385C] bg-[#FF385C]/5 scale-[1.01]" 
                        : isHovered 
                          ? "border-gray-300 shadow-sm" 
                          : "border-transparent"
                    }`}
                  >
                    <ListingCard listing={listing} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Leaflet Interactive Map Component */}
        <div className="w-full md:w-2/5 lg:w-[42%] h-[calc(100vh-76px)] sticky top-[76px] bg-gray-50 border-l border-gray-150 relative overflow-hidden select-none">
          <ExploreMap
            listings={displayedListings}
            centerLocation={locationParam}
            hoveredListingId={hoveredListingId}
            selectedListingId={selectedListingId}
            onMarkerClick={handleMarkerClick}
            zoomLevel={zoom}
          />

          {/* Map Zoom Controls overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
            <button 
              onClick={() => setZoom(prev => Math.min(18, prev + 1))}
              className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-md flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(5, prev - 1))}
              className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-md flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Fullscreen control */}
          <div className="absolute top-28 right-4 z-30">
            <button 
              className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-md flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Expand Map"
            >
              <Maximize2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Attribution Watermark */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] text-gray-500 font-semibold flex items-center gap-1 z-30 border border-gray-200/50 shadow-xs">
            <MapPin className="w-3 h-3 text-[#FF385C]" />
            <span>Interactive Leaflet Map</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading explore view...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
