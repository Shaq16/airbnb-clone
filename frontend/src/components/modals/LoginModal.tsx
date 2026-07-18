"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

type ModalStep = "email" | "password" | "signup" | "welcome_back" | "otp";

export default function LoginModal({ isOpen, onClose, onContinue }: LoginModalProps) {
  const { 
    rememberedUser, 
    clearRememberedUser, 
    checkEmail, 
    login, 
    register, 
    sendOtp, 
    verifyOtp 
  } = useAuth();
  
  const [step, setStep] = useState<ModalStep>("email");
  const [email, setEmail] = useState("");
  const [existingUserName, setExistingUserName] = useState("");
  
  // Password step
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup step
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [optOut, setOptOut] = useState(false);

  // OTP step
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "Weak (must be at least 6 characters)";
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    if ((hasLetters && !hasNumbers && !hasSpecial) || (hasNumbers && !hasLetters && !hasSpecial)) {
      return "Weak (mix letters and numbers for a stronger password)";
    }
    return "Strong password";
  };

  useEffect(() => {
    if (isOpen) {
      if (rememberedUser) {
        setStep("welcome_back");
        setEmail(rememberedUser.email);
        setExistingUserName(rememberedUser.name);
      } else {
        setStep("email");
        setEmail("");
      }
      setPassword("");
      setFirstName("");
      setLastName("");
      setDob("");
      setSignupPassword("");
      setConfirmPassword("");
      setOtp("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen, rememberedUser]);

  if (!isOpen) return null;

  const resetForm = () => {
    if (rememberedUser) {
      setStep("welcome_back");
    } else {
      setStep("email");
      setEmail("");
    }
    setPassword("");
    setFirstName("");
    setLastName("");
    setDob("");
    setSignupPassword("");
    setConfirmPassword("");
    setOtp("");
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async () => {
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

  const handlePasswordSubmit = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      resetForm();
      onClose();
      onContinue();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    if (!firstName || !signupPassword) return;
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const strength = getPasswordStrength(signupPassword);
    if (strength.startsWith("Weak")) {
      setError("Please create a stronger password (mix letters and numbers).");
      return;
    }
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear < 1900 || birthYear > currentYear) {
        setError("Please enter a valid date of birth.");
        return;
      }
    }
    setLoading(true);
    setError(null);
    try {
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      await register(fullName, email, signupPassword, dob || undefined);
      resetForm();
      onClose();
      onContinue();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  const handleWelcomeBackLogin = async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await sendOtp(email);
      setStep("otp");
      if (res && res.code) {
        setTimeout(() => {
          setOtp(res.code);
        }, 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleNotYou = () => {
    clearRememberedUser();
    setEmail("");
    setStep("email");
  };

  const handleOtpSubmit = async () => {
    if (!otp) return;
    setError(null);
    try {
      setLoading(true);
      await verifyOtp(email, otp);
      resetForm();
      onClose();
      onContinue();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setError(null);
    if (step === "password" || step === "signup") {
      setStep("email");
      setPassword("");
      setSignupPassword("");
      setConfirmPassword("");
    }
    if (step === "otp") {
      setStep("welcome_back");
    }
  };

  const modalTitle = 
    step === "email" ? "Log in or sign up" : 
    step === "password" ? "Log in" : 
    step === "signup" ? "Finish signing up" : 
    step === "welcome_back" ? "Log in or sign up" : "Enter code";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={handleClose} />
      
      <div className="relative bg-white w-full max-w-[568px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 m-4">
        
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 min-h-[64px]">
          <button 
            onClick={step === "email" || step === "welcome_back" ? handleClose : handleGoBack} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition text-gray-700 absolute"
          >
            {step === "email" || step === "welcome_back" ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <div className="flex-grow text-center font-bold text-gray-800 text-[15px]">{modalTitle}</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-[480px] mx-auto flex flex-col">
            
            {error && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* ============ STEP 1: EMAIL ============ */}
            {step === "email" && (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', height: '40px', width: '40px', fill: '#FF385C'}}><path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path></svg>
                </div>
                <h2 className="text-[26px] font-bold text-gray-800 tracking-tight leading-tight mb-6">Welcome to Airbnb</h2>

                <div className="w-full flex flex-col gap-4">
                  <div className="relative border border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                    <input 
                      type="email" 
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
                      className="w-full py-4 px-3 text-[15px] text-gray-800 outline-none bg-transparent placeholder-gray-500 disabled:opacity-50"
                    />
                  </div>

                  <button 
                    onClick={handleEmailSubmit}
                    disabled={loading || !email.trim()}
                    className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <div className="flex items-center gap-4 my-2">
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                    <span className="text-xs text-gray-500 font-medium">or</span>
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button className="w-full h-[52px] border border-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
                      <span className="font-semibold text-gray-800 text-[15px]">Continue with Google</span>
                    </button>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button className="w-full h-[52px] border border-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <svg viewBox="0 0 384 512" width="20" height="20" className="mr-3"><path fill="#000000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                      <span className="font-semibold text-gray-800 text-[15px]">Continue with Apple</span>
                    </button>
                  </div>

                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-500">
                      Don&apos;t have an account?{" "}
                      <button onClick={() => setStep("signup")} className="text-[#E61E4D] font-semibold hover:underline">Sign up</button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============ STEP 2a: PASSWORD ============ */}
            {step === "password" && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#E3F2FD] text-[#1E88E5] font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {existingUserName ? existingUserName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Welcome back, {existingUserName ? existingUserName.split(" ")[0] : email.split("@")[0]}!
                </h2>
                <p className="text-sm text-gray-500 mb-6">{email}</p>

                <div className="w-full flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSubmit(); }}
                      className="w-full border border-gray-400 rounded-xl py-4 px-3 pr-12 text-[15px] text-gray-800 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-gray-500 disabled:opacity-50"
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
                    onClick={handlePasswordSubmit}
                    disabled={loading || !password}
                    className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
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
                </div>
              </div>
            )}

            {/* ============ STEP 2b: SIGN UP ============ */}
            {step === "signup" && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <h2 className="text-[26px] font-bold text-gray-800 tracking-tight leading-tight mb-1">
                    Let&apos;s create your account
                  </h2>
                  <p className="text-[14px] text-gray-500">This information is required to book or host.</p>
                </div>

                {/* Legal Name */}
                <div>
                  <label className="block text-gray-800 font-bold mb-2 text-[14px]">Legal name</label>
                  <div className="border border-gray-400 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                    <div className="relative border-b border-gray-400">
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent" />
                      <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">First name</span>
                    </div>
                    <div className="relative">
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent" />
                      <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">Last name</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Make sure it matches the name on your government ID.
                  </p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-800 font-bold mb-2 text-[14px]">Date of birth</label>
                  <input 
                    type="date" 
                    value={dob} 
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setDob("");
                        return;
                      }
                      const parts = val.split("-");
                      if (parts[0] && parts[0].length > 4) {
                        parts[0] = parts[0].slice(0, 4);
                        setDob(parts.join("-"));
                      } else {
                        setDob(val);
                      }
                    }}
                    className="w-full border border-gray-400 rounded-xl py-3.5 px-3 text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" 
                  />
                </div>

                {/* Email (pre-filled) */}
                <div>
                  <label className="block text-gray-800 font-bold mb-2 text-[14px]">Email</label>
                  <div className="relative border border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pt-6 pb-2 px-3 text-[15px] text-gray-800 outline-none bg-transparent" />
                    <span className="absolute left-3 top-2 text-xs text-gray-500 pointer-events-none">Email</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">We&apos;ll email you trip confirmations and receipts.</p>
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
                      className="w-full border border-gray-400 rounded-xl px-3 py-3.5 pr-12 text-[15px] text-gray-800 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-gray-500"
                    />
                    <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupPassword && (
                    <p className={`text-[11px] font-bold mt-1.5 ${
                      getPasswordStrength(signupPassword).startsWith("Strong") ? "text-green-600" : "text-amber-600"
                    }`}>
                      {getPasswordStrength(signupPassword)}
                    </p>
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
                    className="w-full border border-gray-400 rounded-xl px-3 py-3.5 text-[15px] text-gray-800 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-gray-500"
                  />
                </div>

                {/* Promotions Opt-out */}
                <div className="bg-[#F7F7F7] p-5 rounded-2xl flex gap-4">
                  <p className="text-[13px] text-gray-800 leading-snug flex-grow font-medium">
                    Airbnb will send you promotions. You can opt out at any time.
                    <span className="block mt-3 font-bold text-[14px]">I don&apos;t want to receive Airbnb promotions.</span>
                  </p>
                  <div className="pt-1">
                    <input type="checkbox" checked={optOut} onChange={(e) => setOptOut(e.target.checked)} className="w-7 h-7 rounded-lg border-gray-400 text-black focus:ring-black accent-black cursor-pointer bg-white" />
                  </div>
                </div>

                {/* Terms */}
                <div className="text-[11px] text-gray-800 font-medium leading-relaxed">
                  By selecting <span className="font-extrabold">Agree and continue</span>, I agree to Airbnb&apos;s <span className="text-blue-600 underline cursor-pointer font-bold">Terms of Service</span>, <span className="text-blue-600 underline cursor-pointer font-bold">Payments Terms of Service</span> and <span className="text-blue-600 underline cursor-pointer font-bold">Nondiscrimination Policy</span>, and acknowledge the <span className="text-blue-600 underline cursor-pointer font-bold">Privacy Policy</span>.
                </div>
              </div>
            )}

            {/* ============ WELCOME BACK VIEW (OTP Flow) ============ */}
            {step === "welcome_back" && rememberedUser && (
              <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-sm">
                  {rememberedUser.avatar_url ? (
                    <img src={rememberedUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    rememberedUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome back, {rememberedUser.name.split(" ")[0]}
                </h2>
                <div className="flex items-center text-gray-800 font-medium mb-10 text-[15px]">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {rememberedUser.email}
                </div>
                <p className="text-[13px] text-gray-500 mb-6">
                  We may email or text you a code to log you in.
                </p>
                <button 
                  onClick={handleWelcomeBackLogin}
                  disabled={loading}
                  className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md mb-4"
                >
                  {loading ? 'Sending code...' : 'Log in'}
                </button>
                <button 
                  onClick={handleNotYou}
                  className="w-full text-gray-800 font-bold text-[15px] py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Not you?
                </button>
              </div>
            )}

            {/* ============ OTP INPUT VIEW ============ */}
            {step === "otp" && (
              <div className="flex flex-col gap-6 pt-2">
                <p className="text-[15px] text-gray-500 mb-2">
                  Enter the 6-digit code we sent to <span className="font-bold text-gray-800">{email}</span>.
                </p>
                <div className="relative border border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter code"
                    maxLength={6}
                    onKeyDown={(e) => { if (e.key === "Enter") handleOtpSubmit(); }}
                    className="w-full py-4 px-3 text-[15px] text-gray-800 outline-none bg-transparent placeholder-gray-500 tracking-widest text-center font-bold"
                  />
                </div>
                <button 
                  onClick={handleOtpSubmit}
                  disabled={loading || otp.length < 6}
                  className={`w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md ${loading || otp.length < 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Verifying...' : 'Log in'}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Footer (only for signup step) */}
        {step === "signup" && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button 
              onClick={handleSignupSubmit}
              disabled={loading || !firstName || !signupPassword || !confirmPassword}
              className="w-full bg-[#222222] hover:bg-black text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Agree and continue"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
