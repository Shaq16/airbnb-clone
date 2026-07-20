"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListingRow from "../components/listings/ListingRow";
import { api } from "../lib/api";
import { Listing } from "../types";
import { Map as MapIcon } from "lucide-react";

interface CustomCard {
  id: number;
  title: string;
  priceText: string;
  rating: string;
  timeText?: string;
  image: string;
}

interface CustomRowProps {
  title: string;
  items: CustomCard[];
}

const BANGALORE_TODAY_EXPERIENCES = [
  {
    id: 1,
    title: "Experience the Offbeat Bangalore with a Local",
    priceText: "From ₹1,450 / guest",
    rating: "5.0",
    timeText: "9:15 am",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Explore Halasuru's cultural sites",
    priceText: "From ₹4,250 / guest",
    rating: "4.99",
    timeText: "10:30 am",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Play with clay: Fun weekend pottery workshop",
    priceText: "From ₹2,000 / guest",
    rating: "5.0",
    timeText: "11 am",
    image: "/images/pottery_workshop.jpg"
  },
  {
    id: 4,
    title: "Street Food Tour near a Local Market",
    priceText: "From ₹3,333 / guest",
    rating: "4.98",
    timeText: "7 pm",
    image: "/images/street_food_tour.jpg"
  },
  {
    id: 5,
    title: "Experience Satsang & Art of Living",
    priceText: "From ₹1,899 / guest",
    rating: "4.95",
    timeText: "4 pm",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "City history & architecture walk",
    priceText: "From ₹3,950 / guest",
    rating: "4.98",
    timeText: "10 am",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    title: "Beyond Nandi Hills & Adiyogi",
    priceText: "From ₹3,420 / guest",
    rating: "5.0",
    timeText: "1:30 pm",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  }
];

const BANGALORE_TOMORROW_EXPERIENCES = [
  {
    id: 11,
    title: "Walk in Lalbagh Botanical Garden",
    priceText: "From ₹1,750 / guest",
    rating: "5.0",
    timeText: "7:30 am",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    title: "Beyond Nandi Hills & Adiyogi",
    priceText: "From ₹3,420 / guest",
    rating: "5.0",
    timeText: "1:30 pm",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    title: "Hidden Flavours of Bangalore: Food Tour",
    priceText: "From ₹1,899 / guest",
    rating: "5.0",
    timeText: "4:45 pm",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    title: "See exotic trees in the Lalbagh",
    priceText: "From ₹1,000 / guest",
    rating: "5.0",
    timeText: "10 am",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    title: "Explore Iconic Sights of Bangalore in 6 hours",
    priceText: "From ₹7,900 / guest",
    rating: "5.0",
    timeText: "11 am",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    title: "Guided Trek To Nijagal Betta near Bangalore",
    priceText: "From ₹2,400 / guest",
    rating: "5.0",
    timeText: "6 am",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    title: "Old Bengaluru Heritage Walk: Culture & Coffee",
    priceText: "From ₹1,599 / guest",
    rating: "4.25",
    timeText: "9 am",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
  }
];

const BANGALORE_SERVICES = [
  {
    id: 21,
    title: "Creative Candid Photography by Abinash",
    priceText: "From ₹4,999 / group",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 22,
    title: "Concert and event images by Pradipta",
    priceText: "From ₹3,999 / group",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 23,
    title: "Intimate, raw, honest photos by Bhagyashree",
    priceText: "From ₹10,000 / group",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 24,
    title: "Bridal and party looks by Sandya",
    priceText: "From ₹4,000 / guest",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 25,
    title: "Luxury Photography, Video & Drone by Emeka",
    priceText: "From ₹16,000 / guest",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 26,
    title: "Creative photography by Shank",
    priceText: "From ₹10,000 / guest",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 27,
    title: "Yoga therapy by suman",
    priceText: "From ₹700 / guest",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
  }
];

const SOUTH_GOA_SERVICES = [
  {
    id: 31,
    title: "Beach Couple Shoot by Sunny",
    priceText: "From ₹5,500 / group",
    rating: "4.98",
    image: "/images/beach_couple_shoot.jpg"
  },
  {
    id: 32,
    title: "Yoga and Meditation Session on Beach",
    priceText: "From ₹1,200 / guest",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 33,
    title: "Goan Cooking Masterclass with Local Chef",
    priceText: "From ₹2,500 / guest",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 34,
    title: "Sunset Sailing & Photography Experience",
    priceText: "From ₹8,000 / group",
    rating: "4.95",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 35,
    title: "Goa Villa Private Poolside Event Video Shoot",
    priceText: "From ₹12,000 / day",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80"
  }
];

function CustomCarouselRow({ title, items }: CustomRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel mb-10 select-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          {title}
        </h2>
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => handleScroll("left")}
            className="w-7 h-7 rounded-full border border-gray-200 hover:border-black flex items-center justify-center bg-white transition cursor-pointer active:scale-90"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={() => handleScroll("right")}
            className="w-7 h-7 rounded-full border border-gray-200 hover:border-black flex items-center justify-center bg-white transition cursor-pointer active:scale-90"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-none pb-4"
      >
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={`/experiences/${item.id}`}
            className="flex-shrink-0 w-48 md:w-52 flex flex-col gap-2 group cursor-pointer text-current no-underline"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden relative bg-gray-100 shadow-xs border border-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
              />
              {item.timeText && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-bold text-gray-800 shadow-sm uppercase tracking-wide">
                  {item.timeText}
                </div>
              )}
              {/* Heart icon */}
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition active:scale-90 z-10 border-none cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white/80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="font-extrabold text-[13px] text-gray-800 line-clamp-1 leading-tight group-hover:underline">{item.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-semibold">
                <span className="text-gray-900 font-extrabold">{item.priceText}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-gray-800">
                  <span>★</span>
                  <span>{item.rating}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const observerRef = React.useRef<HTMLDivElement>(null);
  const [showFeesToast, setShowFeesToast] = useState(false);
  const [experiences, setExperiences] = useState<CustomCard[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  // Fetch experiences from backend on mount
  useEffect(() => {
    fetch("/api/experiences")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch experiences");
        return res.json();
      })
      .then(data => {
        const cards = data.map((exp: any) => {
          let photos = [];
          try {
            photos = typeof exp.photos === "string" ? JSON.parse(exp.photos) : (exp.photos || []);
          } catch {
            photos = exp.photos || [];
          }
          return {
            id: exp.id,
            title: exp.title,
            priceText: `From ₹${exp.price.toLocaleString("en-IN")} / guest`,
            rating: "5.0",
            timeText: exp.duration,
            image: photos[0] || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
          };
        });
        setExperiences(cards);
        setLoadingExperiences(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingExperiences(false);
      });
  }, []);


  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: Record<string, string | number | undefined> = {
        location: searchParams.get("location") || undefined,
        guests: searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined,
        property_type: searchParams.get("property_type") || undefined,
      };
      const data = await api.listings.list(filters);
      setListings(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch listings. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when URL search params change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  // Reset pagination when search params or active tab change
  useEffect(() => {
    setCurrentPage(1);
    setLoadingNextPage(false);
  }, [searchParams]);

  // Observer to load more items when user scrolls to bottom
  useEffect(() => {
    if (currentPage >= 3 || loading || loadingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingNextPage(true);
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setLoadingNextPage(false);
          }, 800); // 800ms natural delay for pagination load animation
        }
      },
      { threshold: 0.1 }
    );

    const target = observerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [currentPage, loading, loadingNextPage]);

  // Bottom Floating auto-dismissing Fees Toast
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setShowFeesToast(true);
    }, 500);

    const endTimer = setTimeout(() => {
      setShowFeesToast(false);
    }, 5500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // Categorization filtering
  const northGoaListings = listings.filter(l => 
    l.location.toLowerCase().includes("north goa") || 
    l.location.toLowerCase().includes("anjuna") || 
    l.location.toLowerCase().includes("calangute") || 
    l.location.toLowerCase().includes("nerul") || 
    l.location.toLowerCase().includes("candolim") || 
    l.location.toLowerCase().includes("ribandar")
  );

  const southGoaListings = listings.filter(l => 
    l.location.toLowerCase().includes("south goa") || 
    l.location.toLowerCase().includes("fatrade") || 
    l.location.toLowerCase().includes("varca") || 
    l.location.toLowerCase().includes("navelim") || 
    l.location.toLowerCase().includes("chauri") || 
    l.location.toLowerCase().includes("canacona") || 
    l.location.toLowerCase().includes("colva")
  );

  // Pad South Goa to match exactly 7 listings as in the 4th image (adding the Anjuna flat as the 7th item)
  const southGoaDisplay = [...southGoaListings];
  if (southGoaDisplay.length > 0 && southGoaDisplay.length < 7) {
    const anjuna = listings.find(l => l.location.toLowerCase().includes("anjuna"));
    if (anjuna && !southGoaDisplay.some(l => l.id === anjuna.id)) {
      southGoaDisplay.push(anjuna);
    }
  }

  const puducherryListings = listings.filter(l => 
    l.location.toLowerCase().includes("puducherry") || 
    l.location.toLowerCase().includes("periyamudaliyar")
  );

  const mumbaiListings = listings.filter(l => 
    l.location.toLowerCase().includes("mumbai") || 
    l.location.toLowerCase().includes("kurla") || 
    l.location.toLowerCase().includes("bandra") || 
    l.location.toLowerCase().includes("andheri") || 
    l.location.toLowerCase().includes("santacruz")
  );

  const varanasiListings = listings.filter(l => 
    l.location.toLowerCase().includes("varanasi") || 
    l.location.toLowerCase().includes("bhelupura")
  );

  const hyderabadListings = listings.filter(l => 
    l.location.toLowerCase().includes("hyderabad") || 
    l.location.toLowerCase().includes("somajiguda") || 
    l.location.toLowerCase().includes("madhapur") || 
    l.location.toLowerCase().includes("tolichowki") || 
    l.location.toLowerCase().includes("kukatpally") || 
    l.location.toLowerCase().includes("jubilee")
  );

  const mysoreListings = listings.filter(l => 
    l.location.toLowerCase().includes("mysore") || 
    l.location.toLowerCase().includes("basavanahalli")
  );

  const madikeriListings = listings.filter(l => 
    l.location.toLowerCase().includes("madikeri")
  );

  // Safety fallback for any properties that don't match the main location categories
  const otherListings = listings.filter(l => 
    !northGoaListings.some(x => x.id === l.id) &&
    !southGoaListings.some(x => x.id === l.id) &&
    !puducherryListings.some(x => x.id === l.id) &&
    !mumbaiListings.some(x => x.id === l.id) &&
    !varanasiListings.some(x => x.id === l.id) &&
    !hyderabadListings.some(x => x.id === l.id) &&
    !mysoreListings.some(x => x.id === l.id) &&
    !madikeriListings.some(x => x.id === l.id)
  );

  const activeTab = (searchParams.get("tab") || "homes").toLowerCase();

  if (activeTab === "experiences") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 select-none font-semibold">
            <span>Experiences</span>
            <span>·</span>
            <span>Popular in India</span>
          </div>

          {loadingExperiences ? (
            <div className="p-8 text-center text-gray-500 font-bold mt-10 animate-pulse">
              Loading dynamic experiences from database...
            </div>
          ) : experiences.length === 0 ? (
            <div className="p-8 text-center text-red-500 font-bold mt-10">
              No experiences found in database. Make sure backend is running and seeded.
            </div>
          ) : (
            <>
              <CustomCarouselRow 
                title="Top Experiences in India" 
                items={experiences.slice(0, 10)} 
              />

              <CustomCarouselRow 
                title="Popular Heritage & Local Adventures" 
                items={experiences.slice(10, 20)} 
              />
            </>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "services") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 select-none font-semibold">
            <span>Services</span>
            <span>·</span>
            <span>Bengaluru & South Goa</span>
          </div>

          <CustomCarouselRow 
            title="More services in Bengaluru" 
            items={BANGALORE_SERVICES} 
          />

          <div className="my-10 select-none">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Discover services on Airbnb</h2>
            <p className="text-xs text-gray-400 font-normal">Connect with local experts, guides, photographers, and wellness instructors.</p>
          </div>

          <CustomCarouselRow 
            title="Services in South Goa" 
            items={SOUTH_GOA_SERVICES} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        
        {/* Loading / Error States */}
        {loading ? (
          <div className="space-y-12">
            <ListingRow title="Popular homes in North Goa" items={[]} loading={true} />
            <ListingRow title="Available in South Goa this weekend" items={[]} loading={true} />
            <ListingRow title="Stay in Puducherry" items={[]} loading={true} />
            <ListingRow title="Available next month in Mumbai" items={[]} loading={true} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-50 text-red-700 rounded-full mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Backend Connection Error</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">{error}</p>
            <button
              onClick={fetchListings}
              className="bg-gray-800 hover:bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Try changing your search parameters or clearing your search.
            </p>
          </div>
        ) : (
          /* Grouped Listings rows */
          <div className="space-y-10">
            {/* ============ BATCH 1 (Always Visible) ============ */}
            {/* North Goa Row */}
            {northGoaListings.length > 0 && (
              <ListingRow 
                title="Popular homes in North Goa" 
                items={northGoaListings} 
                locationName="North Goa"
              />
            )}

            {/* South Goa Row */}
            {southGoaDisplay.length > 0 && (
              <ListingRow 
                title="Available in South Goa this weekend" 
                items={southGoaDisplay} 
                locationName="South Goa"
              />
            )}

            {/* Puducherry Row */}
            {puducherryListings.length > 0 && (
              <ListingRow 
                title="Stay in Puducherry" 
                items={puducherryListings} 
                locationName="Puducherry"
              />
            )}

            {/* ============ BATCH 2 (Visible on Page 2+) ============ */}
            {currentPage >= 2 && (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* Mumbai Row */}
                {mumbaiListings.length > 0 && (
                  <ListingRow 
                    title="Available next month in Mumbai" 
                    items={mumbaiListings} 
                    locationName="Mumbai"
                  />
                )}

                {/* Varanasi Row */}
                {varanasiListings.length > 0 && (
                  <ListingRow 
                    title="Check out homes in Varanasi" 
                    items={varanasiListings} 
                    locationName="Varanasi"
                  />
                )}

                {/* Hyderabad Row */}
                {hyderabadListings.length > 0 && (
                  <ListingRow 
                    title="Popular homes in Hyderabad" 
                    items={hyderabadListings} 
                    locationName="Hyderabad"
                  />
                )}
              </div>
            )}

            {/* ============ BATCH 3 (Visible on Page 3) ============ */}
            {currentPage >= 3 && (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* Mysore Row */}
                {mysoreListings.length > 0 && (
                  <ListingRow 
                    title="Available in Mysore this weekend" 
                    items={mysoreListings} 
                    locationName="Mysore"
                  />
                )}

                {/* Madikeri Row */}
                {madikeriListings.length > 0 && (
                  <ListingRow 
                    title="Places to stay in Madikeri" 
                    items={madikeriListings} 
                    locationName="Madikeri"
                  />
                )}

                {/* Other Stays Row */}
                {otherListings.length > 0 && (
                  <ListingRow 
                    title="Other Stays" 
                    items={otherListings} 
                  />
                )}
              </div>
            )}

            {/* Skeleton Loaders while fetching next batch */}
            {loadingNextPage && (
              <div className="space-y-10">
                <ListingRow title="Loading next stays..." items={[]} loading={true} />
              </div>
            )}

            {/* Intersection Observer Target */}
            {currentPage < 3 && (
              <div ref={observerRef} className="h-10 w-full" />
            )}
          </div>
        )}

      </div>

      {/* Floating auto-dismissing Fees Toast */}
      <div 
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out transform ${
          showFeesToast 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-10 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2.5 border border-gray-250 shadow-xl rounded-full py-3.5 px-6 bg-white text-xs font-extrabold text-gray-800 select-none">
          {/* Pink Tag icon */}
          <svg className="w-4 h-4 fill-[#E61E4D]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75z" />
          </svg>
          <span>Prices include all fees</span>
        </div>

      </div>


    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading exploration view...</div>}>
      <HomeContent />
    </Suspense>
  );
}
