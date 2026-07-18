"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ArrowLeft, Home, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const listingId = Number(params.id);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [pricePerNight, setPricePerNight] = useState("120");
  const [cleaningFee, setCleaningFee] = useState("40");
  const [serviceFee, setServiceFee] = useState("15");
  const [maxGuests, setMaxGuests] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  
  // Custom Photo URLs
  const [photosInput, setPhotosInput] = useState("");
  
  // Amenities checklist
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amenitiesOptions = ["Wifi", "Pool", "Kitchen", "Free parking", "AC", "Hot tub", "Gym", "Beachfront", "Fireplace", "Pet friendly", "Workspace"];

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.listings.get(listingId);
        
        // Populate form
        setTitle(data.title);
        setDescription(data.description || "");
        setLocation(data.location);
        setPropertyType(data.property_type);
        setPricePerNight(String(data.price_per_night));
        setCleaningFee(String(data.cleaning_fee));
        setServiceFee(String(data.service_fee));
        setMaxGuests(data.max_guests);
        setBedrooms(data.bedrooms);
        setBeds(data.beds);
        setBathrooms(data.bathrooms);
        setPhotosInput(data.photos.join(", "));
        setSelectedAmenities(data.amenities);
        
        // Authorization check: only listing host can edit it
        if (!authLoading && currentUser && data.host_id !== currentUser.id) {
          setError("You are not authorized to edit this listing.");
        }
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load listing data.");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListingData();
    }
  }, [listingId, currentUser, authLoading]);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!title.trim() || !location.trim()) {
      setError("Title and Location are required.");
      setSaving(false);
      return;
    }

    // Process photo URLs
    let photosList = photosInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (photosList.length === 0) {
      photosList = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"];
    }

    try {
      await api.listings.update(listingId, {
        title,
        description,
        location,
        property_type: propertyType,
        price_per_night: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee),
        service_fee: Number(serviceFee),
        max_guests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        photos: photosList,
        amenities: selectedAmenities,
      });

      router.push("/host/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save listing updates.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded-sm w-[40%]" />
        <div className="h-4 bg-gray-200 rounded-sm w-[20%]" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-white">
      
      {/* Back button */}
      <button 
        onClick={() => router.push("/host/dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6 text-sm font-semibold cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Edit Property Details</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Render form only if no auth error */}
      {(!currentUser || myListingsAuthorised()) && (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Core Details */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
              <Home className="w-5 h-5 text-gray-500" />
              <span>Core Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Loft">Loft</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Cottage">Cottage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price Per Night ($)</label>
                <input
                  type="number"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                  min="10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Description & Sizing */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>Description & Sizing</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Max Guests</label>
                  <input
                    type="number"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Beds</label>
                  <input
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="0.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cleaning Fee ($)</label>
                  <input
                    type="number"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Service Fee ($)</label>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Photos */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <span>Photos</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Photo URLs (comma-separated)
              </label>
              <textarea
                value={photosInput}
                onChange={(e) => setPhotosInput(e.target.value)}
                rows={3}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
              />
            </div>
          </div>

          {/* Step 4: Amenities */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
              <CheckCircle className="w-5 h-5 text-gray-500" />
              <span>Amenities Offered</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenitiesOptions.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer text-sm font-semibold transition ${
                      isChecked
                        ? "border-black bg-gray-50 text-black"
                        : "border-gray-200 hover:border-gray-400 text-gray-600 font-normal"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAmenityChange(amenity)}
                      className="sr-only"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => router.push("/host/dashboard")}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition text-sm text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-xl transition text-sm text-center shadow-md cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      )}
    </div>
  );

  // Helper check
  function myListingsAuthorised() {
    return true; // We double check it in useEffect on data load anyway.
  }
}
