"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Grid, 
  Home, 
  Tent, 
  Building, 
  Sparkles, 
  Flame, 
  TreePine 
} from "lucide-react";

interface Category {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: Category[] = [
  { label: "All properties", value: "", icon: Grid },
  { label: "Villas", value: "Villa", icon: Home },
  { label: "Cabins", value: "Cabin", icon: Tent },
  { label: "Lofts", value: "Loft", icon: Building },
  { label: "Penthouses", value: "Penthouse", icon: Sparkles },
  { label: "Forest stays", value: "Forest", icon: TreePine },
  { label: "Trending", value: "Trending", icon: Flame },
];

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("property_type") || "";

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("property_type", value);
    } else {
      params.delete("property_type");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-3 sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-8 overflow-x-auto scrollbar-none">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory.toLowerCase() === category.value.toLowerCase();
          
          return (
            <button
              key={category.label}
              onClick={() => handleCategoryClick(category.value)}
              className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap group min-w-[70px] ${
                isActive 
                  ? "border-black text-black" 
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform group-hover:scale-105 ${
                isActive ? "text-black" : "text-gray-500 group-hover:text-black"
              }`} />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
