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
export const SERVICES_DATA: Record<number, ServiceDetails> = {
  23: {
    id: 23,
    title: "Intimate, raw, honest photos by Bhagyashree",
    tagline: "13 years of experience in documenting couples and their intimacy",
    category: "Photographer in Bangalore",
    locationName: "Provided at your home",
    price: 10000,
    hostName: "Bhagyashree",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    mainImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    subPackages: [
      {
        title: "Motherhood",
        desc: "Mini maternity session indoor or outdoor",
        price: 10000,
        duration: "2 hrs",
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Aesthetic coupleshoot with Bugzy",
        desc: "A mini photoshoot which is aesthetically pleasing and intimate.",
        price: 15000,
        duration: "4 hrs",
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Family photoshoot",
        desc: "Portrait session of family for keepsake Professional photos to look back to, put up on wall",
        price: 15000,
        duration: "2 hrs",
        img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Intimate events",
        desc: "For aesthetic photos at intimate events",
        price: 25000,
        duration: "5 hrs",
        img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=150&q=80"
      }
    ],
    thingsToKnow: [
      { title: "Guest requirements", desc: "Guests aged 18 and up can attend." },
      { title: "Accessibility", desc: "Message host for details." },
      { title: "Cancellation policy", desc: "Cancel at least 1 day before the start time for a full refund." }
    ],
    vettingBadgeTitle: "Photographers on Airbnb are vetted for quality",
    vettingBadgeDesc: "Photographers are evaluated for their professional experience, portfolio of strong work and reputation for excellence."
  }
};

export const DEFAULT_SERVICE = (id: number, titleVal: string): ServiceDetails => {
  const isYoga = titleVal.toLowerCase().includes("yoga") || titleVal.toLowerCase().includes("therapy");
  const isCooking = titleVal.toLowerCase().includes("cook") || titleVal.toLowerCase().includes("class");
  const isSailing = titleVal.toLowerCase().includes("sail") || titleVal.toLowerCase().includes("sunset");

  let cat = "Expert Service";
  let tag = "Years of professional local experience and service delivery.";
  let badgeTitle = "Service providers on Airbnb are vetted for quality";
  let badgeDesc = "Providers are evaluated for their certifications, reviews history, and overall excellence.";
  let packs: ServiceSubPackage[] = [];
  let mainImg = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80";

  if (isYoga) {
    cat = "Yoga Instructor in Bangalore";
    tag = "Certified mindfulness and restorative yoga therapist";
    badgeTitle = "Yoga instructors on Airbnb are vetted for certification";
    badgeDesc = "Instructors are evaluated for credentials, alignment knowledge, and training background.";
    mainImg = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80";
    packs = [
      {
        title: "Group Meditation & Flow",
        desc: "Restorative breathing techniques and basic flows",
        price: 700,
        duration: "1 hr",
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Private Custom Therapy",
        desc: "One-on-one session customized for back posture or flexibility alignment",
        price: 1500,
        duration: "1.5 hrs",
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80"
      }
    ];
  } else if (isCooking) {
    cat = "Local Chef in South Goa";
    tag = "Learn the authentic Goan curry techniques from a local host";
    badgeTitle = "Culinary hosts on Airbnb are vetted for food safety and flavor";
    badgeDesc = "Chefs are evaluated for recipe authenticity, kitchen cleanliness, and guest hospitality.";
    mainImg = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80";
    packs = [
      {
        title: "Seafood Curry Masterclass",
        desc: "Master classical Goan spices and ground coconut masala curry",
        price: 2500,
        duration: "3 hrs",
        img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Traditional Goan Desserts",
        desc: "Create bebinca and dodol from scratch using fresh firewood ovens",
        price: 1800,
        duration: "2 hrs",
        img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=150&q=80"
      }
    ];
  } else if (isSailing) {
    cat = "Sailing Skipper in Goa";
    tag = "Premium catamaran cruising and sunset photography across the Arabian sea";
    badgeTitle = "Captains on Airbnb are vetted for safety certifications";
    badgeDesc = "Skippers are evaluated for commercial marine licenses, boat maintenance records, and safety protocols.";
    mainImg = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80";
    packs = [
      {
        title: "Sunset Sailing Tour",
        desc: "Private sailing for couples or groups during golden hour",
        price: 8000,
        duration: "2 hrs",
        img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=150&q=80"
      }
    ];
  } else {
    // Default Photography fallback for other photography IDs
    cat = "Photographer in local area";
    tag = "Professional portrait and group shoot specialist";
    badgeTitle = "Photographers on Airbnb are vetted for quality";
    badgeDesc = "Photographers are evaluated for their professional portfolio and reputation for excellence.";
    mainImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
    packs = [
      {
        title: "Couple Portrait Session",
        desc: "Premium portraits in highly photogenic street locations",
        price: 4999,
        duration: "1.5 hrs",
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80"
      },
      {
        title: "Event Candid Coverage",
        desc: "Candid reportage style images for your private event",
        price: 10000,
        duration: "3 hrs",
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80"
      }
    ];
  }

  return {
    id,
    title: titleVal,
    tagline: tag,
    category: cat,
    locationName: "Provided at your location",
    price: packs[0]?.price || 5000,
    hostName: titleVal.split("by ").pop() || "Local Provider",
    hostAvatar: "",
    mainImage: mainImg,
    subPackages: packs,
    thingsToKnow: [
      { title: "Guest requirements", desc: "Guests aged 18 and up can attend." },
      { title: "Accessibility", desc: "Message host for details." },
      { title: "Cancellation policy", desc: "Cancel at least 1 day before the start time for a full refund." }
    ],
    vettingBadgeTitle: badgeTitle,
    vettingBadgeDesc: badgeDesc
  };
};



export const getServiceTitle = (id: number): string => {
  const list = [
    { id: 21, title: "Creative Candid Photography by Abinash" },
    { id: 22, title: "Concert and event images by Pradipta" },
    { id: 23, title: "Intimate, raw, honest photos by Bhagyashree" },
    { id: 24, title: "Bridal and party looks by Sandya" },
    { id: 25, title: "Luxury Photography, Video & Drone by Emeka" },
    { id: 26, title: "Creative photography by Shank" },
    { id: 27, title: "Yoga therapy by suman" },
    { id: 31, title: "Beach Couple Shoot by Sunny" },
    { id: 32, title: "Yoga and Meditation Session on Beach" },
    { id: 33, title: "Goan Cooking Masterclass with Local Chef" },
    { id: 34, title: "Sunset Sailing & Photography Experience" },
    { id: 35, title: "Goa Villa Private Poolside Event Video Shoot" }
  ];
  return list.find(x => x.id === id)?.title || "Premium Local Service";
};
