"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const CITY_CARDS = [
  { city: "Toronto", color: "#1a6b3c", bg: "https://images.unsplash.com/photo-1517090186835-e348b621c9ca?auto=format&fit=crop&w=400&q=80" },
  { city: "Paris", color: "#c9a83a", bg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
  { city: "Medellín", color: "#1a5c8a", bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" },
  { city: "Miami", color: "#c44a2b", bg: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=400&q=80" },
  { city: "Bali", color: "#8b5e2d", bg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" },
  { city: "Kyoto", color: "#b04060", bg: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80" },
  { city: "New York", color: "#2a3d6b", bg: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80" },
  { city: "Sydney", color: "#1d6b8a", bg: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80" },
  { city: "London", color: "#4a3060", bg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" },
  { city: "Bangkok", color: "#8b2a3d", bg: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" },
  { city: "Dubai", color: "#c8942a", bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" },
  { city: "Barcelona", color: "#c43a1a", bg: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80" },
  { city: "Goa", color: "#2a7a4a", bg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80" },
  { city: "Singapore", color: "#1a5a7a", bg: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80" },
  { city: "Rome", color: "#a05a2a", bg: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80" },
  { city: "Amsterdam", color: "#2a4a7a", bg: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=400&q=80" },
  { city: "Mumbai", color: "#8a4a1a", bg: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
  { city: "Cape Town", color: "#2a5a3a", bg: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=400&q=80" },
];

type AuthStep = "email" | "password" | "signup";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";
  const { currentUser, loading: authLoading, checkEmail, login, register } = useAuth();

  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [existingUserName, setExistingUserName] = useState("");
  
  // Password step
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup step
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [optOut, setOptOut] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (!authLoading && currentUser) {
      router.replace(redirectUrl);
    }
  }, [currentUser, authLoading, router, redirectUrl]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await checkEmail(email.trim());
      if (result.exists) {
        setExistingUserName(result.name || "");
        setStep("password");
      } else {
        setStep("signup");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to check email.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (pwd: string): { label: string; color: string; bg: string; width: string } | null => {
    if (!pwd) return null;
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    const isLong = pwd.length >= 8;
    if (pwd.length < 6) return { label: "Too short", color: "text-red-600", bg: "bg-red-500", width: "w-1/4" };
    if ((hasLetters && !hasNumbers && !hasSpecial) || (!hasLetters && hasNumbers && !hasSpecial))
      return { label: "Weak — mix letters, numbers & symbols", color: "text-red-500", bg: "bg-red-400", width: "w-1/3" };
    if (hasLetters && hasNumbers && !hasSpecial)
      return { label: "Medium — add a symbol to strengthen", color: "text-amber-600", bg: "bg-amber-400", width: "w-2/3" };
    if (hasLetters && hasNumbers && hasSpecial && isLong)
      return { label: "Strong password ✓", color: "text-green-600", bg: "bg-green-500", width: "w-full" };
    return { label: "Medium", color: "text-amber-600", bg: "bg-amber-400", width: "w-1/2" };
  };
  const passwordStrength = getPasswordStrength(signupPassword);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !signupPassword) return;

    if (!dobDay || !dobMonth || !dobYear) {
      setError("Please enter your complete date of birth.");
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(signupPassword);
    const hasNumbers = /[0-9]/.test(signupPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(signupPassword);
    if (!hasLetters || !hasNumbers || !hasSpecial) {
      setError("Password is weak. Use a mix of letters, numbers, and symbols.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      const dobFormatted = `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`;
      await register(fullName, email, signupPassword, dobFormatted || undefined);
      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  // Don't show login page if already authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-[#FF385C] rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser) {
    return null;
  }

  const modalTitle = step === "email" ? "Log in or sign up" : step === "password" ? "Log in" : "Finish signing up";

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background City Card Grid */}
      <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0">
        {CITY_CARDS.map((card, i) => (
          <div key={i} className="relative overflow-hidden">
            <img src={card.bg} alt={card.city} className="w-full h-full object-cover" style={{ minHeight: "160px" }} />
            <div className="absolute inset-0" style={{ backgroundColor: card.color + "55" }} />
            <div className="absolute top-3 left-3 opacity-70">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="white"><path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.644-.651-.645.651-.256.26c-2.153 2.128-4.485 3.386-6.709 3.386-3.48 0-6.357-2.416-6.357-6.478l.001-.228.011-.415c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.312-.001.18c0 2.775 1.519 4.222 3.943 4.222 1.488 0 3.267-.84 5.253-2.617l.783-.733 1.522-1.464 1.522 1.464.783.733c1.986 1.777 3.765 2.617 5.253 2.617 2.424 0 3.943-1.447 3.943-4.222l-.001-.18-.009-.312c-.032-.585-.178-1.169-.605-2.24l-.345-.836c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.239 3 16 3z" /></svg>
            </div>
            <div className="absolute bottom-4 left-3 right-3">
              <p className="text-white font-extrabold text-base uppercase tracking-wide drop-shadow-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>{card.city}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/20" />

      {/* Centered Modal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button
              onClick={() => {
                if (step === "password" || step === "signup") {
                  setStep("email");
                  setError(null);
                  setPassword("");
                  setSignupPassword("");
                  setConfirmPassword("");
                } else {
                  router.push("/");
                }
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-700"
            >
              {step === "email" ? (
                <span className="text-lg font-light">✕</span>
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            <span className="font-bold text-sm text-gray-900">{modalTitle}</span>
            <div className="w-8" />
          </div>

          {/* Modal Body */}
          <div className="px-8 py-8 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* ============ STEP 1: EMAIL ============ */}
            {step === "email" && (
              <>
                <div className="flex justify-center mb-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="#FF385C"><path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.644-.651-.645.651-.256.26c-2.153 2.128-4.485 3.386-6.709 3.386-3.48 0-6.357-2.416-6.357-6.478l.001-.228.011-.415c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.312-.001.18c0 2.775 1.519 4.222 3.943 4.222 1.488 0 3.267-.84 5.253-2.617l.783-.733 1.522-1.464 1.522 1.464.783.733c1.986 1.777 3.765 2.617 5.253 2.617 2.424 0 3.943-1.447 3.943-4.222l-.001-.18-.009-.312c-.032-.585-.178-1.169-.605-2.24l-.345-.836c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.239 3 16 3z" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome to Airbnb</h1>

                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    id="login-email-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full border border-gray-300 focus:border-black rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none transition placeholder-gray-400 disabled:opacity-50"
                  />

                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    We&apos;ll check if you have an account, or help you create one.{" "}
                    <Link href="#" className="underline font-medium text-gray-700">Privacy Policy</Link>
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-[#E61E4D] via-[#FF385C] to-[#FF5A5F] hover:opacity-90 text-white rounded-xl font-bold text-sm transition active:scale-98 shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="flex flex-col gap-3">
                  <button className="flex items-center gap-4 w-full border border-gray-300 hover:border-gray-500 rounded-xl px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 active:scale-98">
                    <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.7-4.3 7.3-10.7 7.3-17.3z"/>
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.1-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z"/>
                      <path fill="#FBBC05" d="M10.9 28.8c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.7C1 17.1 0 20.5 0 24s1 6.9 2.7 9.8l8.2-5z"/>
                      <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.5 30.4 0 24 0 14.8 0 6.7 5.2 2.7 13l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  <button className="flex items-center gap-4 w-full border border-gray-300 hover:border-gray-500 rounded-xl px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 active:scale-98">
                    <svg viewBox="0 0 814 1000" className="w-5 h-5 flex-shrink-0" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.6 0 281.2 0 161.3c0-69.7 24.2-128.4 67.9-171.2C115.1-6.1 178.3-28 246.3-28c65.4 0 120.9 28.1 157.3 61.6C439 66.1 498.5 28 577.5 28c66.3 0 131 20.7 178.8 60.2z"/></svg>
                    <span>Continue with Apple</span>
                  </button>
                  <button className="flex items-center gap-4 w-full border border-gray-300 hover:border-gray-500 rounded-xl px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 active:scale-98">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7 10-7" /></svg>
                    <span>Continue with email</span>
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link href="#" className="underline text-gray-600">Terms of Service</Link> and{" "}
                  <Link href="#" className="underline text-gray-600">Privacy Policy</Link>.
                </p>
              </>
            )}

            {/* ============ STEP 2a: PASSWORD (existing user) ============ */}
            {step === "password" && (
              <>
                <div className="text-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-[#E3F2FD] text-[#1E88E5] font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                    {existingUserName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Welcome back, {existingUserName.split(" ")[0]}!</h2>
                  <p className="text-sm text-gray-500 mt-1">{email}</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      autoFocus
                      className="w-full border border-gray-300 focus:border-black rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-900 focus:outline-none transition placeholder-gray-400 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full py-3.5 bg-gradient-to-r from-[#E61E4D] via-[#FF385C] to-[#FF5A5F] hover:opacity-90 text-white rounded-xl font-bold text-sm transition active:scale-98 shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Log in"
                    )}
                  </button>

                  <button type="button" className="text-sm text-[#E61E4D] font-semibold hover:underline text-center">
                    Forgot password?
                  </button>
                </form>
              </>
            )}

            {/* ============ STEP 2b: SIGN UP (new user) ============ */}
            {step === "signup" && (
              <>
                <div className="text-center">
                  <h2 className="text-[26px] font-bold text-gray-800 tracking-tight leading-tight mb-1">
                    Let&apos;s create your account
                  </h2>
                  <p className="text-[14px] text-gray-500">
                    This information is required to book or host.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
                  {/* Legal Name */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-2 text-[14px]">Legal name</label>
                    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                      <div className="relative border-b border-gray-300">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent"
                        />
                        <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">First name</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent"
                        />
                        <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">Last name</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Make sure it matches the name on your government ID. If you go by another name, you can <span className="underline cursor-pointer font-bold">add a preferred first name</span>.
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-2 text-[14px]">Date of birth</label>
                    <div className="flex gap-2">
                      {/* Day */}
                      <select
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl py-3 px-3 text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      {/* Month */}
                      <select
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                        className="flex-[1.6] border border-gray-300 rounded-xl py-3 px-3 text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                      >
                        <option value="">Month</option>
                        {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                          <option key={m} value={i + 1}>{m}</option>
                        ))}
                      </select>
                      {/* Year */}
                      <select
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                        className="flex-[1.2] border border-gray-300 rounded-xl py-3 px-3 text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      To sign up, you need to be at least 18 years old.
                    </p>
                  </div>

                  {/* Email (pre-filled) */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-2 text-[14px]">Email</label>
                    <div className="relative border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent"
                      />
                      <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">Email</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      We&apos;ll email you trip confirmations and receipts.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-2 text-[14px]">Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Create a password (min 6 characters)"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength bar */}
                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.bg} ${passwordStrength.width}`} />
                        </div>
                        <p className={`text-xs mt-1 font-medium ${passwordStrength.color}`}>{passwordStrength.label}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-2 text-[14px]">Confirm password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Confirm your password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-gray-400"
                    />
                  </div>

                  {/* Promotions Opt-out */}
                  <div className="bg-[#F7F7F7] p-5 rounded-2xl flex gap-4">
                    <p className="text-[13px] text-gray-800 leading-snug flex-grow font-medium">
                      Airbnb will send you promotions such as deals and marketing notifications. You can opt out at any time via account settings or within marketing emails.
                      <span className="block mt-3 font-bold text-[14px]">I don&apos;t want to receive Airbnb promotions.</span>
                    </p>
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={optOut}
                        onChange={(e) => setOptOut(e.target.checked)}
                        className="w-7 h-7 rounded-lg border-gray-400 text-black focus:ring-black accent-black cursor-pointer bg-white"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="text-[11px] text-gray-800 font-medium leading-relaxed">
                    By selecting <span className="font-extrabold">Agree and continue</span>, I agree to Airbnb&apos;s{" "}
                    <span className="text-blue-600 underline cursor-pointer font-bold">Terms of Service</span>,{" "}
                    <span className="text-blue-600 underline cursor-pointer font-bold">Payments Terms of Service</span> and{" "}
                    <span className="text-blue-600 underline cursor-pointer font-bold">Nondiscrimination Policy</span>, and acknowledge the{" "}
                    <span className="text-blue-600 underline cursor-pointer font-bold">Privacy Policy</span>.
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !firstName || !signupPassword || !confirmPassword}
                    className="w-full py-3.5 bg-[#222222] hover:bg-black text-white rounded-xl font-bold text-[15px] transition active:scale-98 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Agree and continue"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
