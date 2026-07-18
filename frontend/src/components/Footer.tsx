import React from "react";
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F7F7F7] border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Inspiration for future getaways (Screenshot 3) */}
        <div className="border-b border-gray-200 pb-10 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inspiration for future getaways</h3>
          
          {/* Tab titles */}
          <div className="flex border-b border-gray-200 overflow-x-auto gap-6 text-sm font-semibold text-gray-500 pb-3.5 scrollbar-none mb-6">
            <span className="text-black border-b-2 border-black pb-3.5 whitespace-nowrap cursor-pointer">Popular</span>
            <span className="hover:text-black pb-3.5 whitespace-nowrap cursor-pointer">Arts & culture</span>
            <span className="hover:text-black pb-3.5 whitespace-nowrap cursor-pointer">Beach</span>
            <span className="hover:text-black pb-3.5 whitespace-nowrap cursor-pointer">Mountains</span>
            <span className="hover:text-black pb-3.5 whitespace-nowrap cursor-pointer">Outdoors</span>
            <span className="hover:text-black pb-3.5 whitespace-nowrap cursor-pointer">Things to do</span>
          </div>

          {/* Destinations grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-5 text-xs text-gray-800">
            <div>
              <h4 className="font-bold">Cleveland</h4>
              <p className="text-gray-400 font-normal mt-0.5">Monthly Rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Portland</h4>
              <p className="text-gray-400 font-normal mt-0.5">Monthly Rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Minneapolis</h4>
              <p className="text-gray-400 font-normal mt-0.5">Monthly Rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Branson</h4>
              <p className="text-gray-400 font-normal mt-0.5">Holiday rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Tokyo</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Brooklyn</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Chicago</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Wilmington</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Key West</h4>
              <p className="text-gray-400 font-normal mt-0.5">Holiday rentals</p>
            </div>
            <div>
              <h4 className="font-bold">San Juan</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Pocono Mountains</h4>
              <p className="text-gray-400 font-normal mt-0.5">Villa rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Miramar Beach</h4>
              <p className="text-gray-400 font-normal mt-0.5">Apartment rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Florida Keys</h4>
              <p className="text-gray-400 font-normal mt-0.5">Apartment rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Destin</h4>
              <p className="text-gray-400 font-normal mt-0.5">Holiday rentals</p>
            </div>
            <div>
              <h4 className="font-bold">North Myrtle Beach</h4>
              <p className="text-gray-400 font-normal mt-0.5">Villa rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Portland</h4>
              <p className="text-gray-400 font-normal mt-0.5">Cabin rentals</p>
            </div>
            <div>
              <h4 className="font-bold">Nice</h4>
              <p className="text-gray-400 font-normal mt-0.5">House rentals</p>
            </div>
            <div className="flex items-center font-bold text-gray-900 cursor-pointer hover:underline">
              <span>Show more</span>
              <span className="text-[10px] ml-1">∨</span>
            </div>
          </div>
        </div>

        {/* Mock Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><span className="hover:underline cursor-pointer">Help Centre</span></li>
              <li><span className="hover:underline cursor-pointer">AirCover</span></li>
              <li><span className="hover:underline cursor-pointer">Anti-discrimination</span></li>
              <li><span className="hover:underline cursor-pointer">Disability support</span></li>
              <li><span className="hover:underline cursor-pointer">Cancellation options</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Hosting</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><span className="hover:underline cursor-pointer">Airbnb your home</span></li>
              <li><span className="hover:underline cursor-pointer">AirCover for Hosts</span></li>
              <li><span className="hover:underline cursor-pointer">Hosting resources</span></li>
              <li><span className="hover:underline cursor-pointer">Community forum</span></li>
              <li><span className="hover:underline cursor-pointer">Hosting responsibly</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Airbnb</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><span className="hover:underline cursor-pointer">Newsroom</span></li>
              <li><span className="hover:underline cursor-pointer">New features</span></li>
              <li><span className="hover:underline cursor-pointer">Careers</span></li>
              <li><span className="hover:underline cursor-pointer">Investors</span></li>
              <li><span className="hover:underline cursor-pointer">Gift cards</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright & Info Footer Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:underline">
              <Globe className="w-4.5 h-4.5" />
              <span>English (IN)</span>
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <span className="text-sm font-semibold h-4 flex items-center">₹</span>
              <span>INR</span>
            </button>
            <div className="hidden sm:flex items-center gap-4">
              {/* Facebook */}
              <span className="hover:text-gray-900 cursor-pointer">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </span>
              {/* Twitter/X */}
              <span className="hover:text-gray-900 cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              {/* Instagram */}
              <span className="hover:text-gray-900 cursor-pointer">
                <svg className="w-4.5 h-4.5 stroke-current fill-none stroke-[2px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
