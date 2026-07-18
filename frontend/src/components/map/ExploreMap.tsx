"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Listing } from "../../types";

interface ExploreMapProps {
  listings: Listing[];
  centerLocation: string;
  hoveredListingId: number | null;
  selectedListingId: number | null;
  onMarkerClick: (listingId: number) => void;
  zoomLevel: number;
}

export default function ExploreMap({
  listings,
  centerLocation,
  hoveredListingId,
  selectedListingId,
  onMarkerClick,
  zoomLevel,
}: ExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: number]: L.Marker }>({});

  const getCoordinatesForCity = (city: string) => {
    const loc = city.toLowerCase();
    if (loc.includes("goa")) return [15.4989, 73.8278]; // Panaji
    if (loc.includes("mumbai")) return [19.0760, 72.8777];
    if (loc.includes("puducherry") || loc.includes("pondicherry")) return [11.9416, 79.8083];
    if (loc.includes("varanasi")) return [25.3176, 82.9739];
    if (loc.includes("mysore")) return [12.2958, 76.6394];
    if (loc.includes("madikeri") || loc.includes("coorg")) return [12.4244, 75.7390];
    if (loc.includes("hyderabad")) return [17.3850, 78.4867];
    return [20.5937, 78.9629]; // Default center of India
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet instance
    const coords = getCoordinatesForCity(centerLocation);
    const initialZoom = centerLocation.toLowerCase() === "all locations" ? 5 : 12;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(coords as L.LatLngExpression, initialZoom);

    // Beautiful minimalist light-themed tiles (CartoDB Light)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [centerLocation]);

  // Update center when location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const coords = getCoordinatesForCity(centerLocation);
    const zoom = centerLocation.toLowerCase() === "all locations" ? 5 : 12;
    map.setView(coords as L.LatLngExpression, zoom);
  }, [centerLocation]);

  // Sync external zoom control
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(zoomLevel);
    }
  }, [zoomLevel]);

  // Render & Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    listings.forEach((listing, index) => {
      const center = getCoordinatesForCity(centerLocation);
      
      // Deterministically offset listing locations around center city to display multiple markers properly
      const offsetSeed = (listing.id * 17 + index * 3) % 100;
      const latOffset = -0.03 + ((offsetSeed * 13) % 100) * 0.0006;
      const lngOffset = -0.03 + ((offsetSeed * 31) % 100) * 0.0006;
      const lat = center[0] + latOffset;
      const lng = center[1] + lngOffset;

      const formattedPrice = `₹${Math.round(listing.price_per_night).toLocaleString("en-IN")}`;
      const isActive = hoveredListingId === listing.id || selectedListingId === listing.id;

      const icon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="price-marker-pill ${isActive ? "active" : ""}" style="
            background-color: ${isActive ? "black" : "white"};
            color: ${isActive ? "white" : "#1f2937"};
            border: 1px solid ${isActive ? "black" : "#e5e7eb"};
            border-radius: 9999px;
            padding: 5px 10px;
            font-weight: 800;
            font-size: 11px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            white-space: nowrap;
            display: inline-block;
          ">${formattedPrice}</div>
        `,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      marker.on("click", () => {
        onMarkerClick(listing.id);
      });

      if (isActive) {
        marker.setZIndexOffset(1000);
      }

      markersRef.current[listing.id] = marker;
    });
  }, [listings, centerLocation, hoveredListingId, selectedListingId, onMarkerClick]);

  // Sync active states (hovered/selected) class styling on markers
  useEffect(() => {
    listings.forEach((listing) => {
      const marker = markersRef.current[listing.id];
      if (marker) {
        const isActive = hoveredListingId === listing.id || selectedListingId === listing.id;
        const formattedPrice = `₹${Math.round(listing.price_per_night).toLocaleString("en-IN")}`;

        const icon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="price-marker-pill ${isActive ? "active" : ""}" style="
              background-color: ${isActive ? "black" : "white"};
              color: ${isActive ? "white" : "#1f2937"};
              border: 1px solid ${isActive ? "black" : "#e5e7eb"};
              border-radius: 9999px;
              padding: 5px 10px;
              font-weight: 800;
              font-size: 11px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              text-align: center;
              transition: all 0.2s ease-in-out;
              cursor: pointer;
              white-space: nowrap;
              display: inline-block;
            ">${formattedPrice}</div>
          `,
          iconSize: [60, 28],
          iconAnchor: [30, 14],
        });

        marker.setIcon(icon);
        if (isActive) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });
  }, [hoveredListingId, selectedListingId, listings]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />;
}
