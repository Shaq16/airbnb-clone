"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Heart, Star } from "lucide-react";

// Fix standard Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createPriceIcon(price: number, active: boolean) {
  return L.divIcon({
    html: `<div class="transition-all transform hover:scale-110 ${active ? 'bg-gray-900 text-white scale-110 z-[1000]' : 'bg-white text-gray-900 hover:z-[1000]'} px-3 py-1.5 rounded-full shadow-md font-extrabold text-[14px] border-2 border-white text-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]" style="white-space: nowrap;">₹${price.toLocaleString()}</div>`,
    className: 'custom-price-marker',
    iconSize: [70, 30],
    iconAnchor: [35, 15],
    popupAnchor: [0, -15],
  });
}

export default function Map({ locations, center, zoom }: any) {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner bg-gray-100">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        {/* Modern Map Tiles resembling Airbnb's custom map style */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {locations.map((loc: any) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={createPriceIcon(loc.price, false)}
          >
            <Popup className="custom-popup" closeButton={false} offset={[0, 0]}>
               <div className="w-[280px] bg-white rounded-xl overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.12)] p-0 flex flex-col gap-0 cursor-pointer">
                 <div className="relative h-[180px] w-full bg-gray-100">
                   <img src={loc.img} alt={loc.title} className="w-full h-full object-cover" />
                   <button className="absolute top-2.5 right-2.5 p-1.5 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full transition">
                     <Heart className="w-4 h-4 text-white hover:text-[#FF385C]" />
                   </button>
                   {/* Carousel dots mock */}
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100 shadow-sm"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
                     <div className="w-1 h-1.5 rounded-full bg-white opacity-40 shadow-sm mt-[0.5px]"></div>
                   </div>
                 </div>
                 <div className="p-3.5">
                   <div className="flex justify-between items-start mb-0.5">
                     <h3 className="font-extrabold text-gray-900 text-[15px] truncate max-w-[190px]">{loc.title}</h3>
                     <div className="flex items-center gap-1 mt-0.5">
                       <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                       <span className="font-bold text-gray-900 text-xs">{loc.rating}</span>
                     </div>
                   </div>
                   <p className="text-gray-500 text-sm truncate">{loc.location}</p>
                   <p className="text-gray-500 text-[13px] mt-1">24-26 Jul</p>
                   <div className="mt-1 text-sm">
                     <span className="font-extrabold text-gray-900 text-[15px]">₹{loc.price.toLocaleString()}</span>
                     <span className="text-gray-500 text-xs ml-1">for {loc.nights || 2} nights</span>
                   </div>
                 </div>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
