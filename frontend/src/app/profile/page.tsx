"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Camera, 
  GraduationCap, 
  Clock, 
  Heart, 
  PawPrint, 
  Languages, 
  Lightbulb, 
  Compass, 
  Globe, 
  Wand2, 
  BookOpen, 
  Sun, 
  Plane,
  ArrowLeft
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Active tab state: 'about' | 'trips' | 'connections'
  const [activeTab, setActiveTab] = useState<"about" | "trips" | "connections">("about");
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState<"details" | "bio">("details");

  // Local state for profile details
  const [profileData, setProfileData] = useState({
    school: "",
    work: "",
    decade: "",
    skill: "",
    song: "",
    bioTitle: "",
    liveLocation: "",
    travelDestination: "",
    pets: "",
    timeSink: "",
    funFact: "",
    languagesSpeak: "",
    obsession: "",
    bioText: "",
    showStamps: true,
    stamps: ["", "", "", ""]
  });

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login?redirect_url=%2Fprofile");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-[#FF385C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Redirecting...
  }

  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "P";

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render Image 1: Trips view (Split layout: 40% text/illustration + 60% map)
  if (activeTab === "trips") {
    return (
      <div className="w-full flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Side Info */}
        <div className="w-full md:w-[40%] flex flex-col justify-between p-10 bg-white overflow-y-auto">
          <div>
            <h1 className="text-[32px] font-bold text-[#222222] mb-12">Trips</h1>
            
            {/* Illustration of Rolled Map, House, Hot Air Balloon */}
            <div className="flex justify-center mb-8">
              <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ground scroll base */}
                <rect x="30" y="150" width="180" height="15" rx="7.5" fill="#E5E7EB" />
                <path d="M40 165C40 155 60 155 60 165" stroke="#D1D5DB" strokeWidth="3" />
                
                {/* Scroll Map effect */}
                <path d="M40 150 C40 100, 200 100, 200 150" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="4" />
                <path d="M40 150 C40 120, 200 120, 200 150" fill="#ECFDF5" />
                
                {/* Path line */}
                <path d="M70 145 Q 110 120, 150 140 T 180 135" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                
                {/* Miniature House */}
                <rect x="140" y="115" width="30" height="22" rx="2" fill="#FCA5A5" />
                <polygon points="135,115 155,100 175,115" fill="#EF4444" />
                <rect x="150" y="125" width="10" height="12" fill="#FFF" />
                
                {/* Tree */}
                <path d="M185 110 L185 137" stroke="#78350F" strokeWidth="3" />
                <circle cx="185" cy="107" r="12" fill="#10B981" />
                <circle cx="192" cy="113" r="8" fill="#059669" />
                
                {/* Dessert/Cake standing */}
                <circle cx="95" cy="138" r="8" fill="#F472B6" />
                <rect x="94" y="138" width="2" height="7" fill="#FFF" />
                
                {/* Hot Air Balloon */}
                <g transform="translate(10, -10)">
                  <path d="M60 50 C40 50, 30 70, 45 90 C50 97, 70 97, 75 90 C90 70, 80 50, 60 50 Z" fill="#F43F5E" />
                  <path d="M60 50 C50 50, 48 70, 52 90 C54 94, 66 94, 68 90 C72 70, 70 50, 60 50 Z" fill="#FBBF24" />
                  <rect x="57" y="99" width="6" height="6" fill="#D97706" />
                  <line x1="53" y1="94" x2="57" y2="99" stroke="#374151" strokeWidth="1" />
                  <line x1="67" y1="94" x2="63" y2="99" stroke="#374151" strokeWidth="1" />
                </g>
              </svg>
            </div>

            <div className="max-w-[340px] mx-auto text-center md:text-left">
              <h2 className="text-[20px] font-bold text-[#222222] mb-3">Map out your next trip</h2>
              <p className="text-[14px] text-gray-500 font-light leading-relaxed mb-8">
                After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.
              </p>
              
              <button 
                onClick={() => router.push("/")}
                className="bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition-all shadow-md w-full md:w-auto"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Map */}
        <div className="flex-grow h-full bg-gray-100 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d198005352.56587717!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  // Render Image 2: Connections tab active
  return (
    <div className="max-w-[1080px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-10 md:gap-20 min-h-[calc(100vh-160px)]">
      {/* Left Sidebar Navigation */}
      <div className="w-full md:w-[280px] flex-shrink-0">
        <h1 className="text-[32px] font-bold text-[#222222] mb-8">Profile</h1>
        
        <div className="flex flex-col gap-2">
          {/* About Me tab */}
          <div 
            onClick={() => {
              setActiveTab("about");
              setIsEditing(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition ${
              activeTab === "about" && !isEditing ? "bg-gray-100 font-semibold" : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#E3F2FD] text-[#1E88E5] font-bold text-sm flex items-center justify-center">
              {initial}
            </div>
            <span className="text-[15px] font-semibold text-[#222222]">About me</span>
          </div>

          {/* Past trips tab */}
          <div 
            onClick={() => setActiveTab("trips")}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition text-gray-700"
          >
            <Briefcase className="w-6 h-6 text-gray-500" />
            <span className="text-[15px] font-semibold text-[#222222]">Past trips</span>
          </div>

          {/* Connections tab */}
          <div 
            onClick={() => {
              setActiveTab("connections");
              setIsEditing(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition ${
              activeTab === "connections" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Users className="w-6 h-6 text-gray-500" />
            <span className="text-[15px] font-semibold text-[#222222]">Connections</span>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-grow pt-2 md:border-l md:border-gray-200 md:pl-20">
        
        {/* EDITING STATE (Images 4 & 5) */}
        {isEditing ? (
          <div>
            {/* Top Editing Tabs to switch between Image 4 and Image 5 */}
            <div className="flex gap-6 border-b border-gray-200 pb-4 mb-8">
              <button 
                onClick={() => setEditTab("details")}
                className={`pb-2 text-[16px] font-semibold transition ${
                  editTab === "details" ? "border-b-2 border-black text-[#222222]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                My Profile Details
              </button>
              <button 
                onClick={() => setEditTab("bio")}
                className={`pb-2 text-[16px] font-semibold transition ${
                  editTab === "bio" ? "border-b-2 border-black text-[#222222]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                About Me Bio & Stamps
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Left Profile Avatar (large circle + camera "Add" icon) */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-[#EDE9FE] text-[#6B21A8] font-bold text-7xl flex items-center justify-center border border-purple-100 shadow-inner">
                    {initial}
                  </div>
                  {/* Camera icon Add overlay button */}
                  <button className="absolute -bottom-2 bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-full py-2 px-4 text-xs font-bold text-[#222222] flex items-center gap-1.5 transition left-1/2 -translate-x-1/2 cursor-pointer">
                    <Camera className="w-4 h-4 text-gray-700" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Right Edit Details Content */}
              <div className="flex-grow">
                {editTab === "details" ? (
                  /* IMAGE 4: My Profile Fields */
                  <div>
                    <h2 className="text-[26px] font-bold text-[#222222] mb-1">My profile</h2>
                    <p className="text-[14px] text-gray-500 font-light leading-relaxed mb-8">
                      Hosts and guests can see your profile and it may appear across Airbnb to help us build trust in our community. <span className="underline cursor-pointer">Learn more</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      
                      {/* School */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Where I went to school</label>
                          <input 
                            type="text" 
                            placeholder="Add school name"
                            value={profileData.school}
                            onChange={(e) => handleInputChange("school", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Work */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">My work</label>
                          <input 
                            type="text" 
                            placeholder="Add your work/job"
                            value={profileData.work}
                            onChange={(e) => handleInputChange("work", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Decade */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Decade I was born</label>
                          <input 
                            type="text" 
                            placeholder="Add decade (e.g. 90s)"
                            value={profileData.decade}
                            onChange={(e) => handleInputChange("decade", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Skill */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Wand2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">My most useless skill</label>
                          <input 
                            type="text" 
                            placeholder="Add useless skill"
                            value={profileData.skill}
                            onChange={(e) => handleInputChange("skill", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Song */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">My biography title would be</label>
                          <input 
                            type="text" 
                            placeholder="Add biography title"
                            value={profileData.bioTitle}
                            onChange={(e) => handleInputChange("bioTitle", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Where I live</label>
                          <input 
                            type="text" 
                            placeholder="Add location (city/country)"
                            value={profileData.liveLocation}
                            onChange={(e) => handleInputChange("liveLocation", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Travel Destination */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Compass className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Where I&apos;ve always wanted to go</label>
                          <input 
                            type="text" 
                            placeholder="Add dream destination"
                            value={profileData.travelDestination}
                            onChange={(e) => handleInputChange("travelDestination", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Pets */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <PawPrint className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Pets</label>
                          <input 
                            type="text" 
                            placeholder="Add pets"
                            value={profileData.pets}
                            onChange={(e) => handleInputChange("pets", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Time Sink */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">I spend too much time</label>
                          <input 
                            type="text" 
                            placeholder="Add what you spend time on"
                            value={profileData.timeSink}
                            onChange={(e) => handleInputChange("timeSink", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Fun Fact */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Lightbulb className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">My fun fact</label>
                          <input 
                            type="text" 
                            placeholder="Add fun fact"
                            value={profileData.funFact}
                            onChange={(e) => handleInputChange("funFact", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Languages className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">Languages I speak</label>
                          <input 
                            type="text" 
                            placeholder="Add languages"
                            value={profileData.languagesSpeak}
                            onChange={(e) => handleInputChange("languagesSpeak", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Obsession */}
                      <div className="flex items-center gap-3 border-b border-gray-150 py-2">
                        <Heart className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow">
                          <label className="block text-[11px] text-gray-400 uppercase font-bold">I&apos;m obsessed with</label>
                          <input 
                            type="text" 
                            placeholder="Add obsessions"
                            value={profileData.obsession}
                            onChange={(e) => handleInputChange("obsession", e.target.value)}
                            className="w-full text-[14px] text-[#222222] placeholder-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* IMAGE 5: About Me Details */
                  <div>
                    <h2 className="text-[26px] font-bold text-[#222222] mb-6">About me</h2>
                    
                    {/* Intro box */}
                    <div className="border border-dashed border-gray-300 rounded-2xl p-6 mb-8">
                      <textarea
                        rows={4}
                        placeholder="Write something fun and punchy."
                        value={profileData.bioText}
                        onChange={(e) => handleInputChange("bioText", e.target.value)}
                        className="w-full text-[15px] placeholder-gray-400 focus:outline-none bg-transparent resize-none leading-relaxed"
                      />
                      <span className="text-[14px] font-bold underline cursor-pointer mt-2 block text-[#222222]">Add intro</span>
                    </div>

                    {/* Stamps section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-[18px] font-bold text-[#222222]">Where I&apos;ve been</h3>
                          <p className="text-[13px] text-gray-500 font-light">Pick the stamps you want other people to see on your profile.</p>
                        </div>
                        {/* Toggle switch */}
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, showStamps: !prev.showStamps }))}
                          className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                            profileData.showStamps ? "bg-[#222222]" : "bg-gray-200"
                          }`}
                        >
                          <span className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-transform ${
                            profileData.showStamps ? "right-[2px]" : "left-[2px]"
                          }`} />
                        </button>
                      </div>

                      {/* Display stamps */}
                      {profileData.showStamps && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          {/* Stamp 1 */}
                          <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[4/3] bg-white hover:border-black transition">
                            <Globe className="w-8 h-8 text-gray-400" />
                            <span className="text-[12px] font-semibold text-[#222222]">Next destination</span>
                          </div>
                          {/* Stamp 2 */}
                          <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[4/3] bg-white hover:border-black transition">
                            <Sun className="w-8 h-8 text-gray-400" />
                            <span className="text-[12px] font-semibold text-[#222222]">Next destination</span>
                          </div>
                          {/* Stamp 3 */}
                          <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[4/3] bg-white hover:border-black transition">
                            <Plane className="w-8 h-8 text-gray-400" />
                            <span className="text-[12px] font-semibold text-[#222222]">Next destination</span>
                          </div>
                          {/* Stamp 4 */}
                          <div className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[4/3] bg-white hover:border-black transition">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                            <span className="text-[12px] font-semibold text-[#222222]">Next destination</span>
                          </div>
                        </div>
                      )}

                      <button className="mt-6 border border-gray-200 hover:border-black text-[#222222] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition cursor-pointer bg-white">
                        Edit travel stamps
                      </button>
                    </div>

                  </div>
                )}

                {/* Bottom Done Action */}
                <div className="flex justify-end mt-12 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-[#222222] hover:bg-black text-white font-bold text-[15px] px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* VIEWING STATES */
          <>
            {activeTab === "about" && (
              /* TAB: About Me (Default View) */
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[32px] font-bold text-[#222222]">About me</h2>
                  <button 
                    onClick={() => {
                      setIsEditing(true);
                      setEditTab("details");
                    }}
                    className="px-4 py-1.5 border border-black rounded-full text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  {/* Profile Card */}
                  <div className="w-full lg:w-[340px] bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-gray-100 p-10 flex flex-col items-center justify-center text-center flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-[#E3F2FD] text-[#1E88E5] font-bold text-4xl flex items-center justify-center mb-4">
                      {initial}
                    </div>
                    <h3 className="text-[26px] font-bold text-[#222222] mb-1">{currentUser.name || "User"}</h3>
                    <p className="text-gray-500 font-medium">Guest</p>
                  </div>

                  {/* Complete Profile Section */}
                  <div className="max-w-[320px]">
                    <h4 className="text-[22px] font-bold text-[#222222] mb-2">Complete your profile</h4>
                    <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                      Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
                    </p>
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setEditTab("details");
                      }}
                      className="bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Get started
                    </button>
                  </div>
                </div>

                {/* Show populated profile details if any */}
                {(profileData.school || profileData.work || profileData.liveLocation || profileData.bioText) && (
                  <div className="mt-12 p-6 bg-gray-50 rounded-2xl max-w-[680px]">
                    <h4 className="font-bold text-[16px] mb-4 text-[#222222]">My details</h4>
                    <div className="space-y-3 text-[14px] text-gray-700">
                      {profileData.school && <p>🏫 Went to <strong>{profileData.school}</strong></p>}
                      {profileData.work && <p>💼 Works as <strong>{profileData.work}</strong></p>}
                      {profileData.liveLocation && <p>📍 Lives in <strong>{profileData.liveLocation}</strong></p>}
                      {profileData.bioText && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <p className="italic text-gray-500">&ldquo;{profileData.bioText}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="h-[1px] w-full bg-gray-200 mt-12 mb-8"></div>

                <div className="flex items-center gap-4 text-[#222222] hover:bg-gray-50 p-4 -ml-4 rounded-xl cursor-pointer w-fit transition">
                  <MessageSquare className="w-6 h-6 text-gray-500" />
                  <span className="font-semibold text-[15px] underline">Show reviews I&apos;ve written</span>
                </div>
              </div>
            )}

            {activeTab === "connections" && (
              /* IMAGE 2: TAB: Connections active */
              <div className="flex flex-col items-center justify-center text-center py-10">
                
                {/* Vector Illustration of Diverse group of people */}
                <div className="mb-8">
                  <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Character 1 (Green Shirt) */}
                    <g transform="translate(15, 20)">
                      <circle cx="20" cy="20" r="12" fill="#E5E7EB" />
                      <circle cx="20" cy="18" r="10" fill="#FCA5A5" />
                      <rect x="10" y="32" width="20" height="40" rx="6" fill="#10B981" />
                    </g>
                    {/* Character 2 (Red top) */}
                    <g transform="translate(45, 15)">
                      <circle cx="20" cy="20" r="12" fill="#E5E7EB" />
                      <circle cx="20" cy="18" r="10" fill="#FCD34D" />
                      <rect x="12" y="32" width="16" height="42" rx="4" fill="#EF4444" />
                    </g>
                    {/* Character 3 (Grey shirt, Glasses) */}
                    <g transform="translate(75, 10)">
                      <circle cx="20" cy="20" r="12" fill="#E5E7EB" />
                      <circle cx="20" cy="18" r="10" fill="#93C5FD" />
                      <rect x="8" y="32" width="24" height="45" rx="5" fill="#4B5563" />
                    </g>
                    {/* Character 4 (Blue coat) */}
                    <g transform="translate(110, 18)">
                      <circle cx="20" cy="20" r="12" fill="#E5E7EB" />
                      <circle cx="20" cy="18" r="10" fill="#F9A8D4" />
                      <rect x="11" y="32" width="18" height="40" rx="5" fill="#3B82F6" />
                    </g>
                    {/* Character 5 (Yellow dress) */}
                    <g transform="translate(140, 12)">
                      <circle cx="20" cy="20" r="12" fill="#E5E7EB" />
                      <circle cx="20" cy="18" r="10" fill="#C4B5FD" />
                      <path d="M10 32 L30 32 L35 72 L5 72 Z" fill="#F59E0B" />
                    </g>
                  </svg>
                </div>

                <div className="max-w-[400px]">
                  <p className="text-[14px] text-gray-700 leading-relaxed mb-6 font-medium">
                    When you join an experience or invite someone on a trip, you&apos;ll find the profiles of other guests here. <span className="underline cursor-pointer font-bold">Learn more</span>
                  </p>
                  
                  <button 
                    onClick={() => router.push("/")}
                    className="bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[14px] px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Book a trip
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
