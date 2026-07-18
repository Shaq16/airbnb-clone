"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Star, Heart, ChevronRight, MapPin, Globe } from "lucide-react";
import { api } from "../../lib/api";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-emerald-50 animate-pulse rounded-3xl" />
});

const MOCK_HOMES = [
  { id: 1, title: "Beachfront Villa with Pool", location: "North Goa, Goa", price: 8500, rating: 4.97, reviews: 312, superhost: true, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", nights: 5, tag: "Guest favourite" },
  { id: 2, title: "Cozy Mountain Cottage", location: "Manali, Himachal Pradesh", price: 4200, rating: 4.85, reviews: 189, superhost: false, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", nights: 3 },
  { id: 3, title: "Heritage Haveli Suite", location: "Jaipur, Rajasthan", price: 6800, rating: 4.93, reviews: 421, superhost: true, img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", nights: 4, tag: "Rare find" },
  { id: 4, title: "Modern Studio in Bandra", location: "Mumbai, Maharashtra", price: 3500, rating: 4.72, reviews: 98, superhost: false, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", nights: 2 },
  { id: 5, title: "Treehouse Eco Retreat", location: "Wayanad, Kerala", price: 7200, rating: 4.99, reviews: 540, superhost: true, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", nights: 3, tag: "Guest favourite" },
  { id: 6, title: "Lakeside Houseboat", location: "Alleppey, Kerala", price: 9500, rating: 4.88, reviews: 275, superhost: true, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", nights: 2 },
];

const MAP_LOCATIONS = [
  { id: 1, lat: 28.6139, lng: 77.2090, price: 8500 },
  { id: 2, lat: 28.6239, lng: 77.2190, price: 4200 },
  { id: 3, lat: 28.6039, lng: 77.1990, price: 6800 },
  { id: 4, lat: 28.5939, lng: 77.2290, price: 3500 },
  { id: 5, lat: 28.6339, lng: 77.1890, price: 7200 },
  { id: 6, lat: 28.6100, lng: 77.2300, price: 9500 },
];

const HOME_FILTERS = [
  { label: "Filters", icon: "<SlidersHorizontal>" },
  { label: "Washing machine" },
  { label: "Wifi" },
  { label: "Free parking" },
  { label: "TV" },
  { label: "Air conditioning" },
  { label: "Instant Book" },
];

const EXP_CATEGORIES = [
  {
    title: "Local culture and history",
    items: [
      { id: "e1", name: "Heritage Walk in Old Delhi", host: "Rahul Kumar", price: 1200, rating: 4.96, img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", duration: "3h", tag: "Original" },
      { id: "e2", name: "Jaipur Artisan Workshop", host: "Priya Sharma", price: 950, rating: 4.91, img: "https://images.unsplash.com/photo-1524230507669-5ff97f5b27a5?w=400&q=80", duration: "2.5h" },
      { id: "e3", name: "Mumbai Cinema Tour", host: "Arjun Mehta", price: 1500, rating: 4.88, img: "https://images.unsplash.com/photo-1585813020939-9bca7e3ca5a7?w=400&q=80", duration: "4h" },
      { id: "e4", name: "Kolkata Street Art Trail", host: "Meena Das", price: 800, rating: 4.94, img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80", duration: "2h", tag: "Original" },
    ],
  },
  {
    title: "The best in local flavours",
    items: [
      { id: "e5", name: "Mumbai Street Food Tour", host: "Vikram Shah", price: 1800, rating: 4.98, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", duration: "3h", tag: "Original" },
      { id: "e6", name: "Spice Market and Cooking Class", host: "Anita Roy", price: 2200, rating: 4.93, img: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80", duration: "4h" },
      { id: "e7", name: "Kerala Backwater Fish Fry", host: "Thomas Varghese", price: 1400, rating: 4.89, img: "https://images.unsplash.com/photo-1607013407627-6352b8ec4135?w=400&q=80", duration: "3.5h" },
      { id: "e8", name: "Rajasthani Thali Making", host: "Geeta Verma", price: 1100, rating: 4.95, img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", duration: "2h" },
    ],
  },
];

const SERVICE_CATS = [
  { icon: "📸", title: "Photography", subtitle: "Portrait, wedding, events", color: "from-rose-50 to-pink-50", border: "border-rose-100" },
  { icon: "🧘", title: "Yoga & Wellness", subtitle: "Morning sessions, classes", color: "from-green-50 to-emerald-50", border: "border-green-100" },
  { icon: "🌍", title: "Local Tours", subtitle: "City guides, day trips", color: "from-blue-50 to-indigo-50", border: "border-blue-100" },
  { icon: "🍽️", title: "Chef Services", subtitle: "In-home dining, catering", color: "from-amber-50 to-orange-50", border: "border-amber-100" },
  { icon: "💄", title: "Bridal & Makeup", subtitle: "Beauty services at home", color: "from-purple-50 to-violet-50", border: "border-purple-100" },
  { icon: "💆", title: "Home Massage", subtitle: "Relaxation & therapy", color: "from-red-50 to-rose-50", border: "border-red-100" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Searching...</p>
        </div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "homes";
  const location = searchParams.get("location") || "";
  const guests = searchParams.get("guests") || "";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Compact pill + breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <CompactPill tab={tab} location={location} guests={guests} />
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize text-gray-600 font-semibold">{tab}</span>
            {location && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-semibold">{location}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === "homes" && <HomesResults location={location} guests={guests} />}
        {tab === "experiences" && <ExperiencesResults location={location} />}
        {tab === "services" && <ServicesResults location={location} />}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16 py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap gap-4">
            <span>© 2026 Airbnb, Inc.</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>English (IN)</span>
            <span>· ₹ INR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CompactPill({ tab, location, guests }: { tab: string; location: string; guests: string }) {
  const router = useRouter();
  const tabEmoji: Record<string, string> = { homes: "🏡", experiences: "🌍", services: "✨" };
  const tabLabel: Record<string, string> = { homes: "Homes", experiences: "Experiences", services: "Services" };
  return (
    <button
      type="button"
      onClick={() => router.push(`/?tab=${tab}`)}
      className="inline-flex items-center gap-2.5 border border-gray-200 hover:shadow-md transition bg-white rounded-full py-1.5 pl-2.5 pr-1.5 shadow-sm text-xs font-bold text-gray-800 cursor-pointer"
    >
      <div className="flex items-center gap-1.5 pl-0.5">
        <span className="relative w-8 h-8 flex items-center justify-center -mr-1.5">
          {tab === "homes" && (
            <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240" preload="auto" autoPlay loop muted>
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov" type='video/mp4; codecs="hvc1"' />
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm" type="video/webm" />
            </video>
          )}
          {tab === "experiences" && (
            <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240" preload="auto" autoPlay loop muted>
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/balloon-selected.webm" type="video/webm" />
            </video>
          )}
          {tab === "services" && (
            <video className="w-full h-full object-contain scale-[1.2]" playsInline tabIndex={-1} poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240" preload="auto" autoPlay loop muted>
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-selected.mov#t=0.001" type='video/mp4; codecs="hvc1"' />
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/consierge-selected.webm" type="video/webm" />
            </video>
          )}
        </span>
        <span className="text-gray-900 font-extrabold">{location || (tabLabel[tab] + " nearby")}</span>
      </div>
      <span className="text-gray-300 font-light">|</span>
      <span className="text-gray-700">Any week</span>
      <span className="text-gray-300 font-light">|</span>
      <span className="text-gray-400 font-normal">{guests ? `${guests} guest${parseInt(guests) > 1 ? "s" : ""}` : "Add guests"}</span>
      <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm ml-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </div>
    </button>
  );
}

function FilterBar({ labels }: { labels: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {labels.map((label, i) => (
        <button
          key={label}
          id={`filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => setActive(active === label ? null : label)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-semibold transition cursor-pointer select-none ${
            i === 0 || active === label
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          {i === 0 && <SlidersHorizontal className="w-3.5 h-3.5" />}
          {label}
        </button>
      ))}
    </div>
  );
}

function HomeCard({ listing }: { listing: typeof MOCK_HOMES[0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-3 bg-gray-100">
        <img src={listing.img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {listing.tag && (
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">{listing.tag}</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-[#FF385C] text-[#FF385C]" : "text-white"}`} />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-900 text-sm truncate">{listing.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />{listing.location}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{listing.nights} nights</p>
          <p className="text-sm font-bold text-gray-900 mt-1.5">
            <span className="text-[#FF385C]">₹{listing.price.toLocaleString()}</span>
            <span className="font-normal text-gray-500 text-xs"> / night</span>
          </p>
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
          <span className="text-xs font-bold text-gray-900">{listing.rating}</span>
        </div>
      </div>
      {listing.superhost && (
        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-[#FF385C] bg-[#FF385C]/10 px-2 py-0.5 rounded-full">
          ⭐ Superhost
        </span>
      )}
    </div>
  );
}

const CITY_COORDS: Record<string, [number, number]> = {
  goa: [15.4989, 73.8278],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  mysore: [12.2958, 76.6394],
  mysuru: [12.2958, 76.6394],
  manali: [32.2396, 77.1887],
  jaipur: [26.9124, 75.7873],
  mumbai: [19.0760, 72.8777],
  wayanad: [11.6854, 76.1320],
  alleppey: [9.4981, 76.3388],
  delhi: [28.6139, 77.2090],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  shimla: [31.1048, 77.1734],
  ooty: [11.4102, 76.6950],
  munnar: [10.0889, 77.0595],
  darjeeling: [27.0410, 88.2627],
};

const getMapCenter = (locName: string): [number, number] => {
  if (!locName) return [12.9716, 77.5946];
  const key = Object.keys(CITY_COORDS).find(k => locName.toLowerCase().includes(k));
  return key ? CITY_COORDS[key] : [12.9716, 77.5946];
};

function MapPanel({ locations, center }: { locations: any[]; center: [number, number] }) {
  return (
    <div className="sticky top-24 h-[calc(100vh-7rem)] relative z-0">
      <Map locations={locations} center={center} zoom={12} />
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <button type="button" className="bg-white shadow-lg border border-gray-200 rounded-full px-5 py-2.5 text-xs font-extrabold text-gray-900 flex items-center gap-2 hover:shadow-xl transition cursor-pointer hover:scale-105">
          <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
          Search this area
        </button>
      </div>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 text-[10px] font-bold text-gray-600 shadow-sm border border-gray-200 z-[1000] pointer-events-none">
        🗺 Map active
      </div>
    </div>
  );
}

function HomesResults({ location, guests }: { location: string; guests: string }) {
  const [dbListings, setDbListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await api.listings.list();
        setDbListings(data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const formattedDb = dbListings.map(l => {
    let photosArr = [];
    try {
      photosArr = JSON.parse(l.photos);
    } catch (e) {
      photosArr = [l.photos];
    }
    return {
      id: Number(l.id),
      title: String(l.title),
      location: String(l.location),
      price: Number(l.price_per_night),
      rating: Number(l.rating || 5.0),
      reviews: Number(l.reviews_count || 12),
      superhost: Boolean(l.price_per_night > 4000),
      img: String(photosArr[0] || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80"),
      nights: 3,
      tag: l.is_guest_favourite ? "Guest favourite" : undefined
    };
  });

  const allHomes = [...formattedDb, ...MOCK_HOMES];

  const filteredListings = allHomes.filter(l => {
    if (!location) return true;
    return l.location.toLowerCase().includes(location.toLowerCase()) || 
           l.title.toLowerCase().includes(location.toLowerCase());
  });

  const center = getMapCenter(location);
  const mapLocations = filteredListings.map((home, idx) => {
    const homeCenter = getMapCenter(home.location);
    const latOffset = (idx % 3 - 1) * 0.012 + (Math.sin(idx) * 0.003);
    const lngOffset = (idx % 2 === 0 ? 1 : -1) * 0.012 + (Math.cos(idx) * 0.003);
    return {
      ...home,
      lat: homeCenter[0] + latOffset,
      lng: homeCenter[1] + lngOffset
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {filteredListings.length > 0 ? `Over ${filteredListings.length} homes` : "No homes"} {location ? `near ${location}` : "nearby"}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-[#FF385C]/10 text-[#FF385C] text-xs font-bold px-3 py-1 rounded-full">
              💰 Prices include all fees
            </span>
            {guests && (
              <span className="text-xs text-gray-500">For {guests} guest{parseInt(guests) > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <button type="button" className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-xs font-semibold hover:border-gray-400 transition cursor-pointer bg-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
          Display total price
        </button>
      </div>
      <FilterBar labels={["Filters", "Washing machine", "Wifi", "Free parking", "TV", "Air conditioning", "Instant Book"]} />
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 w-full bg-gray-200 animate-pulse rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredListings.map((listing, idx) => (
                <HomeCard key={`${listing.id}-${idx}`} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl">
              <p className="text-gray-500 font-extrabold text-lg">No properties found</p>
              <p className="text-gray-400 text-xs mt-1">Try expanding your search query or check spelling.</p>
            </div>
          )}
          <button type="button" className="mt-8 w-full py-4 border-2 border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:border-gray-400 transition cursor-pointer bg-white">
            Show more homes
          </button>
        </div>
        <div className="hidden lg:block w-[420px] xl:w-[500px] flex-shrink-0">
          <MapPanel locations={mapLocations} center={center} />
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ item }: { item: typeof EXP_CATEGORIES[0]["items"][0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group cursor-pointer flex-shrink-0 w-[210px]">
      <div className="relative rounded-2xl overflow-hidden mb-3 bg-gray-100" style={{ height: "280px" }}>
        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {item.tag && (
          <span className="absolute top-2 left-2 bg-white text-gray-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">{item.tag}</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-[#FF385C] text-[#FF385C]" : "text-white"}`} />
        </button>
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-semibold text-gray-700">{item.duration}</div>
      </div>
      <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">Hosted by {item.host}</p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
        <span className="text-xs font-bold text-gray-900">{item.rating}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 mt-1">
        <span className="text-[#FF385C]">₹{item.price.toLocaleString()}</span>
        <span className="font-normal text-gray-500 text-xs"> / person</span>
      </p>
    </div>
  );
}

function ExperiencesResults({ location }: { location: string }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Experiences {location ? `near ${location}` : "nearby"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Unique activities hosted by local experts</p>
      </div>
      <FilterBar labels={["Filters", "Originals", "Type", "Time of day", "Duration", "Language"]} />
      {EXP_CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">{cat.title}</h2>
            <button type="button" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:underline cursor-pointer">
              Show all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {cat.items.map((item) => (
              <ExperienceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesResults({ location }: { location: string }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Services {location ? `near ${location}` : "nearby"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Professional services by verified hosts</p>
      </div>
      <FilterBar labels={["Filters", "Photography", "Yoga & Wellness", "Chef Services", "Home Massage", "Tours"]} />
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SERVICE_CATS.map((cat) => (
            <button
              key={cat.title}
              type="button"
              className={`flex flex-col items-center p-5 rounded-2xl border bg-gradient-to-br ${cat.color} ${cat.border} hover:shadow-md transition cursor-pointer group`}
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition block">{cat.icon}</span>
              <p className="font-extrabold text-gray-800 text-xs text-center leading-tight">{cat.title}</p>
              <p className="text-[10px] text-gray-400 text-center mt-1 leading-tight">{cat.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Top-rated services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: "Professional Photography Session", host: "Arjun Studio", price: 3500, rating: 4.97, category: "Photography", duration: "2h", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
            { name: "Sunrise Yoga and Meditation", host: "Priya Wellness", price: 800, rating: 4.99, category: "Yoga", duration: "1h 30m", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80" },
            { name: "Private Chef Dinner Experience", host: "Chef Vikram", price: 6500, rating: 4.95, category: "Chef", duration: "3h", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
          ].map((svc) => (
            <div key={svc.name} className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-white text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">{svc.category}</span>
              </div>
              <div className="p-4">
                <p className="font-extrabold text-gray-900 text-sm leading-tight">{svc.name}</p>
                <p className="text-xs text-gray-500 mt-1">By {svc.host} · {svc.duration}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-bold">
                    <span className="text-[#FF385C]">₹{svc.price.toLocaleString()}</span>
                    <span className="font-normal text-gray-400 text-xs"> / session</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                    <span className="text-xs font-bold">{svc.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
