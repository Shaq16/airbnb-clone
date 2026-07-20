"use client";
/* eslint-disable @next/next/no-img-element */
import {
  SERVICES_DATA,
  DEFAULT_SERVICE,
  getServiceTitle,
} from "@/lib/serviceData";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Share, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Globe, 
  Check, 
  MessageSquare,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

interface ExperienceDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  locationName: string;
  address: string;
  duration: string;
  languages: string;
  price: number;
  hostName: string;
  hostTitle: string;
  hostBio: string;
  hostAvatar: string;
  photos: string[];
  whatYouDo: { title: string; desc: string; img: string }[];
  reviews: { name: string; avatar: string; location: string; rating: number; date: string; text: string }[];
}

interface ServiceSubPackage {
  title: string;
  desc: string;
  price: number;
  duration: string;
  img: string;
}

interface ServiceDetails {
  id: number;
  title: string;
  tagline: string;
  category: string;
  locationName: string;
  price: number;
  hostName: string;
  hostAvatar: string;
  mainImage: string;
  subPackages: ServiceSubPackage[];
  thingsToKnow: { title: string; desc: string }[];
  vettingBadgeTitle: string;
  vettingBadgeDesc: string;
  rating?: number;
  reviewsCount?: number;
}

// MOCK EXPERIENCE DATA
const EXPERIENCES_DATA: Record<number, ExperienceDetails> = {
  3: {
    id: 3,
    title: "Play with clay : Fun weekend pottery workshop",
    description: "Step into a cozy clay studio this weekend and learn the basics of wheel throwing. No experience needed just bring your curiosity and create your own handmade ceramic piece.",
    category: "Art workshops",
    locationName: "Bengaluru, Karnataka",
    address: "Bengaluru, Karnataka, 560068",
    duration: "Around 1 hr 30 min",
    languages: "Hosted in English, Hindi",
    price: 2000,
    hostName: "Yash",
    hostTitle: "Weekend pottery workshop",
    hostBio: "we are Ceramic Artist with 9 years experience in hand building and wheel thrown pottery making. We regularly run workshops and classes at our studio allowing participants to make and glaze final pieces.",
    hostAvatar: "🧑‍🎨",
    photos: [
      "https://images.unsplash.com/photo-1565192647048-f997ee879ab8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565192647384-cb6e09adadbc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80"
    ],
    whatYouDo: [
      {
        title: "Introduction to ceramic world",
        desc: "A general introduction to various clays and ceramic products",
        img: "https://images.unsplash.com/photo-1565192647048-f997ee879ab8?auto=format&fit=crop&w=200&q=80"
      },
      {
        title: "make your piece",
        desc: "Hands on clay, create your first piece",
        img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=200&q=80"
      },
      {
        title: "Choose your glaze",
        desc: "Given a choice of glazes and finishes, you can pick how you would like your cups finished",
        img: "https://images.unsplash.com/photo-1565192647384-cb6e09adadbc?auto=format&fit=crop&w=200&q=80"
      }
    ],
    reviews: [
      {
        name: "Vineet",
        avatar: "👦",
        location: "Bengaluru, India",
        rating: 5,
        date: "3 weeks ago",
        text: "Puja was helpful. Me and my son created couple of pieces each. It was fun!"
      },
      {
        name: "Navya",
        avatar: "N",
        location: "Singapore",
        rating: 5,
        date: "May 2026",
        text: "My friends and I had a lot of fun. It was our first pottery class and we really liked it."
      }
    ]
  }
};

const DEFAULT_EXPERIENCE = (id: number): ExperienceDetails => ({
  id,
  title: "Experience the Offbeat City with a Local",
  description: "Join us for a unique city tour filled with local hidden gems, culinary delights, and off-the-beaten-path locations unknown to most tourists.",
  category: "Culture tours",
  locationName: "Bengaluru, Karnataka",
  address: "Bengaluru, Karnataka, 560001",
  duration: "Around 2 hours",
  languages: "Hosted in English",
  price: 1500,
  hostName: "Yash",
  hostTitle: "Local Explorer Guide",
  hostBio: "We are local historians and culinary experts who love sharing our passion for the city's hidden culture with visitors from around the world.",
  hostAvatar: "🧑‍🌾",
  photos: [
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80"
  ],
  whatYouDo: [
    {
      title: "Meetup & Briefing",
      desc: "Gather at the iconic city square and brief over a hot cup of local tea",
      img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&q=80"
    },
    {
      title: "Exploration Walk",
      desc: "Stroll down historic lanes, visiting local artisans and century-old temples",
      img: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=200&q=80"
    },
    {
      title: "Tasting Session",
      desc: "Finish the stroll with a guided tasting of the best street snacks in the city",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80"
    }
  ],
  reviews: [
    {
      name: "Rohit",
      avatar: "R",
      location: "Mumbai, India",
      rating: 5,
      date: "1 week ago",
      text: "Outstanding tour! I learned so much about the city's heritage and loved the hidden food stalls."
    },
    {
      name: "Claire",
      avatar: "👩",
      location: "London, UK",
      rating: 5,
      date: "2 weeks ago",
      text: "Highly recommended for anyone looking to get beyond the typical tourist spots."
    }
  ]
});


// MOCK SERVICES DATA (ID >= 21)

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idVal = Number(params.id);

  // Distinguish between Experience (id < 21) and Service (id >= 21)
  const isService = idVal >= 21;

  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState(!isService);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    if (!isService) {
      fetch(`/api/experiences/${idVal}`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(data => {
          // Map backend snake_case to frontend camelCase
          const photosArray = data.photos || [];
          const paddedPhotos = photosArray.length >= 4 
            ? photosArray 
            : [...photosArray, ...Array(4)].slice(0, 4).map(p => p || photosArray[0] || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80");

          const mappedData: ExperienceDetails = {
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            locationName: data.location_name || data.locationName || "",
            address: data.address,
            duration: data.duration,
            languages: data.languages,
            price: data.price,
            hostName: data.host_name || data.hostName || "",
            hostTitle: data.host_title || data.hostTitle || "",
            hostBio: data.host_bio || data.hostBio || "",
            hostAvatar: data.host_avatar || data.hostAvatar || "",
            photos: paddedPhotos,
            whatYouDo: data.what_you_do || data.whatYouDo || [],
            reviews: data.reviews || [],
          };
          setExperience(mappedData);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
    }
  }, [idVal, isService]);

  const service = isService ? (SERVICES_DATA[idVal] || DEFAULT_SERVICE(idVal, getServiceTitle(idVal))) : null;

  const [isFavorite, setIsFavorite] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // Dynamic date slots calculation relative to today
  const experienceSlots = React.useMemo(() => {
    const today = new Date();
    
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 1);
    
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 1);
    
    const d3 = new Date(today);
    const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
    d3.setDate(today.getDate() + daysUntilSat);
    
    const d4 = new Date(d3);

    const d5 = new Date(today);
    const daysUntilSun = (0 - today.getDay() + 7) % 7 || 7;
    d5.setDate(today.getDate() + daysUntilSun);

    const formatSlot = (d: Date, prefix?: string) => {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const formattedHeader = prefix ? `${prefix}, ${dayNum} ${monthName}` : `${dayName}, ${dayNum} ${monthName}`;
      const isoDate = d.toISOString().split("T")[0];
      return { formattedHeader, isoDate };
    };

    return [
      { id: 0, ...formatSlot(d1, "Tomorrow"), timeSlot: "11:00 am - 12:30 pm", spots: 4 },
      { id: 1, ...formatSlot(d2, "Tomorrow"), timeSlot: "3:00 pm - 4:30 pm", spots: 4 },
      { id: 2, ...formatSlot(d3), timeSlot: "11:00 am - 12:30 pm", spots: 4 },
      { id: 3, ...formatSlot(d4), timeSlot: "3:00 pm - 4:30 pm", spots: 4 },
      { id: 4, ...formatSlot(d5), timeSlot: "11:00 am - 12:30 pm", spots: 4 },
    ];
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookSpot = (packageIdx?: number) => {
    if (isService) {
      if (!serviceDate) {
        setShowDatePicker(true);
        window.scrollTo({ top: 300, behavior: "smooth" });
        alert("Please select a date before proceeding.");
        return;
      }
      router.push(`/book?type=service&id=${service?.id}&packageIndex=${packageIdx ?? 0}&guests=${guestCount}&checkIn=${serviceDate}`);
    } else {
      if (experience) {
        const activeSlot = experienceSlots[selectedSlotIndex] || experienceSlots[0];
        router.push(`/book?type=experience&id=${experience.id}&checkIn=${activeSlot.isoDate}&timeSlot=${encodeURIComponent(activeSlot.timeSlot)}&guests=${guestCount}`);
      }
    }
  };

  // --- RENDER SERVICE LAYOUT (Image 1, 2, 3) ---
  if (isService) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24 select-none">
        
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Dynamic Split Screen Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Sticky Profile Card - Image 1 */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-xl p-6 text-center space-y-5 relative">
              
              {/* Featured photo with avatar overlap */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <img 
                  src={service.mainImage} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlapping host badge avatar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white flex items-center justify-center font-bold text-gray-500 text-lg">
                  {service.hostAvatar ? (
                    <img src={service.hostAvatar} alt={service.hostName} className="w-full h-full object-cover" />
                  ) : (
                    "👩‍💻"
                  )}
                </div>
              </div>

              {/* Title & Tagline details */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {service.title}
                </h1>
                <p className="text-xs text-gray-500 font-light max-w-sm mx-auto leading-relaxed">
                  {service.tagline}
                </p>
              </div>

              {/* Ratings and credentials summary */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-800">
                <Star className="w-4 h-4 fill-black stroke-black" />
                <span>5.0</span>
                <span className="text-gray-400">·</span>
                <span>{service.category}</span>
              </div>
              
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {service.locationName}
              </p>

              {/* Share & Save button row */}
              <div className="flex justify-center gap-6 pt-2 text-xs font-bold text-gray-600 border-t border-gray-100">
                <button className="flex items-center gap-1.5 hover:text-black border-none bg-transparent cursor-pointer">
                  <Share className="w-4 h-4 text-gray-650" />
                  <span className="underline">Share</span>
                </button>
                <button 
                  onClick={toggleFavorite}
                  className="flex items-center gap-1.5 hover:text-black border-none bg-transparent cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF385C] stroke-[#FF385C]" : "text-gray-650"}`} />
                  <span className="underline">{isFavorite ? "Saved" : "Save"}</span>
                </button>
              </div>

            </div>

            {/* Bottom floating price reservation bar */}
            <div className="bg-white border border-gray-250 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-light">From</p>
                  <p className="text-sm font-black text-gray-900">
                    ₹{service.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-gray-500">/ group</span>
                  </p>
                  <span className="text-[9px] text-red-500 font-bold block">Free cancellation</span>
                </div>
                <button 
                  onClick={() => {
                    if (!showDatePicker) {
                      setShowDatePicker(true);
                    } else {
                      handleBookSpot();
                    }
                  }}
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold text-xs px-5 py-3 rounded-xl transition cursor-pointer active:scale-98"
                >
                  {serviceDate ? "Reserve" : "Show dates"}
                </button>
              </div>

              {/* Date Picker for Services */}
              {showDatePicker && (
                <div className="border-t border-gray-150 pt-3">
                  <label className="block text-[10px] font-bold text-gray-800 uppercase mb-1">Date</label>
                  <input 
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-black transition"
                  />
                </div>
              )}
              {/* Guest Picker for Services */}
              <div className="border-t border-gray-150 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{guestCount} guest{guestCount > 1 ? "s" : ""}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      disabled={guestCount <= 1}
                      className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-xs font-extrabold text-gray-900 w-4 text-center">{guestCount}</span>
                    <button 
                      type="button"
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                      disabled={guestCount >= 10}
                      className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Content - Sub-packages, coverage map, things to know - Image 1 & 2 */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Sub-packages list cards block */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900">Available Sub-packages</h3>
              <div className="space-y-4">
                {service.subPackages.map((pack, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleBookSpot(idx)}
                    className="flex gap-4 p-4 border border-gray-200 rounded-3xl hover:border-black transition cursor-pointer bg-white"
                  >
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gray-150 flex-shrink-0 border border-gray-100">
                      <img src={pack.img} alt={pack.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-gray-800 truncate">{pack.title}</h4>
                      <p className="text-[11px] text-gray-550 leading-relaxed font-light line-clamp-1">{pack.desc}</p>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
                        <span className="text-gray-950 font-black">₹{pack.price.toLocaleString("en-IN")} / group</span>
                        <span>·</span>
                        <span>{pack.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Map "I'll come to you" block - Image 2 */}
            <div className="border-t border-gray-150 pt-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">I&apos;ll come to you</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed mt-1">
                  I travel to guests in the area outlined on the map. To book in a different location, you can message me.
                </p>
              </div>
              <div className="w-full h-72 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12441.247291122606!2d77.59!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  className="w-full h-full grayscale-[10%]"
                />
              </div>
            </div>

            {/* Things to know block - Image 2 & 3 */}
            <div className="border-t border-gray-150 pt-8 space-y-6">
              <h3 className="text-lg font-black text-gray-900">Things to know</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-800">
                {service.thingsToKnow.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="block font-extrabold">{item.title}</span>
                    <span className="block text-gray-500 font-light leading-normal">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Airbnb Vetting Badge details - Image 3 */}
            <div className="bg-[#F7F7F7] border border-gray-150 rounded-[24px] p-6 flex gap-4 items-center">
              <div className="text-center flex-shrink-0 w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
                🏵️
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-gray-800">{service.vettingBadgeTitle}</h4>
                <p className="text-[11px] text-gray-500 font-light leading-normal leading-relaxed">
                  {service.vettingBadgeDesc} <span className="underline cursor-pointer font-bold">Learn more</span>
                </p>
              </div>
            </div>

          </div>


        </div>
      </div>
    );
  }

  // --- RENDER EXPERIENCE LAYOUT (Default, id < 21) ---
  if (loading) return <div className="p-8 text-center text-gray-500 font-bold mt-20">Loading experience...</div>;
  if (error || !experience) return <div className="p-8 text-center text-red-500 font-bold mt-20">Experience not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24 select-none">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
            {experience.title}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-2">
            {experience.locationName} · {experience.category}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-800 self-start sm:self-center">
          <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition text-[13px] border-none bg-transparent cursor-pointer">
            <Share className="w-4 h-4 text-gray-800" />
            <span className="underline">Share</span>
          </button>
          <button 
            onClick={toggleFavorite}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition text-[13px] border-none bg-transparent cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF385C] stroke-[#FF385C]" : "text-gray-800"}`} />
            <span className="underline">{isFavorite ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* 4-Photo Tile Layout - Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] bg-gray-100 mb-8 relative">
        <div className="md:col-span-2 h-full overflow-hidden">
          <img 
            src={experience.photos[0]} 
            alt="Experience Main" 
            className="w-full h-full object-cover hover:scale-[1.01] transition duration-300"
          />
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="h-1/2 overflow-hidden">
            <img src={experience.photos[1]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" />
          </div>
          <div className="h-1/2 overflow-hidden">
            <img src={experience.photos[2]} alt="Gallery 3" className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" />
          </div>
        </div>
        <div className="hidden md:flex overflow-hidden">
          <img src={experience.photos[3]} alt="Gallery 4" className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" />
        </div>
      </div>

      {/* Detailed split screen columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hosted by, location details row */}
          <div className="border-b border-gray-200 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-800">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-150">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-green-700 flex items-center justify-center font-bold text-sm">
                {experience.hostAvatar}
              </div>
              <div>
                <span className="block text-gray-400 text-[10px] font-bold uppercase">Host</span>
                <span className="text-[13px] text-gray-850 font-extrabold">Hosted by {experience.hostName}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-150">
              <MapPin className="w-5 h-5 text-gray-650" />
              <div>
                <span className="block text-gray-400 text-[10px] font-bold uppercase">Location</span>
                <span className="text-[13px] text-gray-850 font-extrabold">{experience.locationName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-155">
              <Clock className="w-5 h-5 text-gray-655" />
              <div>
                <span className="block text-gray-400 text-[10px] font-bold uppercase">Duration</span>
                <span className="text-[13px] text-gray-850 font-extrabold">{experience.duration}</span>
              </div>
            </div>
          </div>

          {/* Description paragraph */}
          <div className="border-b border-gray-200 pb-6 space-y-3">
            <h3 className="text-[17px] font-black text-gray-900">What you&apos;ll do</h3>
            <p className="text-gray-650 leading-relaxed font-light text-sm">
              {experience.description}
            </p>
          </div>

          {/* What you'll do segments checklist - Image 2 */}
          <div className="border-b border-gray-200 pb-6 space-y-6">
            {experience.whatYouDo.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-gray-850 capitalize">{item.title}</h4>
                  <p className="text-[11px] text-gray-550 leading-normal font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Block - Image 2 & 3 */}
          <div className="border-b border-gray-200 pb-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{experience.reviews.length} reviews</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">Average rating will appear after 3 reviews.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {experience.reviews.map((rev, idx) => (
                <div key={idx} className="space-y-2 p-5 border border-gray-150 rounded-2xl bg-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-550 text-xs">
                      {rev.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-800">{rev.name}</h4>
                      <p className="text-[9px] text-gray-400 font-bold">{rev.location} · {rev.date}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-black">★★★★★</div>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>

            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-150 text-xs font-bold text-gray-850 rounded-xl transition border-none cursor-pointer">
              Show all reviews
            </button>
            <p className="text-[9px] text-gray-400 font-medium">Some reviews have been automatically translated.</p>
          </div>

          {/* Where we'll meet Map details - Image 3 & 4 */}
          <div className="border-b border-gray-200 pb-6 space-y-4">
            <div>
              <h3 className="text-[17px] font-bold text-gray-900">Where we&apos;ll meet</h3>
              <p className="text-[13px] text-gray-500 font-light mt-1">{experience.address}</p>
            </div>
            <div className="w-full h-64 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15372.247291122606!2d73.765!3d15.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                className="w-full h-full grayscale-[10%]"
              />
            </div>
          </div>

          {/* About me host section - Image 4 & 5 */}
          <div className="border-b border-gray-200 pb-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">About me</h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50/50 border border-gray-155 p-6 rounded-3xl">
              <div className="w-32 bg-white border border-gray-200 rounded-3xl p-5 shadow-xs text-center space-y-2 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto">
                  {experience.hostAvatar}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800">{experience.hostName}</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-0.5">{experience.hostTitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-550 leading-relaxed font-light">
                  {experience.hostBio}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => router.push("/messages")}
                    className="px-5 py-2.5 bg-white border border-gray-300 hover:border-black rounded-xl text-xs font-bold text-gray-800 transition active:scale-[0.97] cursor-pointer"
                  >
                    Message {experience.hostName}
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-gray-400 leading-normal">
              To help protect your payment, always use Airbnb to send money and communicate with hosts.
            </p>
          </div>

          {/* Things to know block - Image 5 */}
          <div className="pb-6 space-y-6">
            <h3 className="text-[17px] font-bold text-gray-900">Things to know</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-gray-800">
              <div className="space-y-1">
                <span className="block font-extrabold">Guest requirements</span>
                <span className="block text-gray-500 font-light leading-normal">Guests aged 14 and up can attend.</span>
              </div>
              <div className="space-y-1">
                <span className="block font-extrabold">Activity level</span>
                <span className="block text-gray-500 font-light leading-normal">The activity level for this experience is light and the skill level is beginner.</span>
              </div>
              <div className="space-y-1">
                <span className="block font-extrabold">Accessibility</span>
                <span className="block text-gray-500 font-light leading-normal">Step-free bathroom available <span className="underline cursor-pointer font-bold">Learn more</span></span>
              </div>
              <div className="space-y-1">
                <span className="block font-extrabold">Cancellation policy</span>
                <span className="block text-gray-500 font-light leading-normal">Cancel at least 1 day before the start time for a full refund.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Sticky Slots Reservation Panel - Image 2 & 3 */}
        <div className="relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-gray-900">From ₹{experience.price.toLocaleString("en-IN")}</span>
                <span className="text-gray-500 text-xs font-light"> / guest</span>
              </div>
              <span className="text-[11px] text-green-600 font-bold block mt-1">Free cancellation</span>
            </div>

            {/* Guest Picker */}
            <div className="border border-gray-200 rounded-xl p-3 space-y-1">
              <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Guests</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">{guestCount} guest{guestCount > 1 ? "s" : ""}</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                    className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-xs font-extrabold text-gray-900 w-4 text-center">{guestCount}</span>
                  <button 
                    type="button"
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    disabled={guestCount >= 10}
                    className="w-7 h-7 rounded-full border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold bg-white transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Date list cards */}
            <div className="space-y-3">
              {experienceSlots.map((slot, idx) => {
                const isSelected = selectedSlotIndex === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedSlotIndex(idx)}
                    className={`p-3 border rounded-xl transition cursor-pointer flex justify-between items-center text-xs font-bold ${
                      isSelected 
                        ? "border-2 border-black bg-gray-50/70 shadow-xs" 
                        : "border-gray-200 hover:border-gray-400 text-gray-800"
                    }`}
                  >
                    <div>
                      <p className="text-gray-900 font-extrabold">{slot.formattedHeader}</p>
                      <p className="text-[10px] text-gray-500 font-normal mt-0.5">{slot.timeSlot}</p>
                    </div>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full font-bold">
                      {slot.spots} spots available
                    </span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => handleBookSpot()}
              className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold py-3.5 px-4 rounded-xl transition text-center shadow-md active:scale-98 cursor-pointer text-sm mt-2"
            >
              Show dates
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
