"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ListingCard from "./ListingCard";
import { Listing } from "../../types";

interface ListingRowProps {
  title: string;
  items: Listing[];
  loading?: boolean;
  locationName?: string;
}

export default function ListingRow({ title, items, loading = false, locationName }: ListingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide navigation arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Allow minor subpixel discrepancy
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items, loading]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by 80% of the visible container width
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!loading && items.length === 0) return null;

  return (
    <div className="relative group/carousel mb-10">
      {/* Header with Title and Scroll Arrows */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 select-none">
          <span>{title}</span>
          {locationName && (
            <Link 
              href={`/explore?location=${encodeURIComponent(locationName)}`}
              className="w-7 h-7 rounded-full bg-gray-50 border border-gray-150 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition shadow-xs cursor-pointer inline-flex align-middle"
              title={`Explore stays in ${locationName}`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </h2>

        {/* Navigation Arrow Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition bg-white shadow-xs cursor-pointer active:scale-90 ${
              !canScrollLeft
                ? "opacity-40 cursor-not-allowed"
                : "hover:border-black hover:text-black"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition bg-white shadow-xs cursor-pointer active:scale-90 ${
              !canScrollRight
                ? "opacity-40 cursor-not-allowed"
                : "hover:border-black hover:text-black"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth"
      >
        {loading ? (
          // Nice small skeleton loader card placeholder row matching requested loading animations
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="w-[200px] sm:w-[210px] md:w-[220px] lg:w-[200px] xl:w-[190px] flex-shrink-0 animate-pulse flex flex-col gap-2.5"
            >
              <div className="aspect-square w-full bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 rounded-sm w-[70%]" />
              <div className="h-3 bg-gray-100 rounded-sm w-[50%]" />
            </div>
          ))
        ) : (
          items.map((listing) => (
            <div
              key={listing.id}
              className="w-[200px] sm:w-[210px] md:w-[220px] lg:w-[200px] xl:w-[190px] flex-shrink-0 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <ListingCard listing={listing} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
