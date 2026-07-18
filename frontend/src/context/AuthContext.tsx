"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api } from "../lib/api";

interface RememberedUser {
  name: string;
  email: string;
  avatar_url: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  loading: boolean;
  error: string | null;
  rememberedUser: RememberedUser | null;
  clearRememberedUser: () => void;
  checkEmail: (email: string) => Promise<{ exists: boolean; name: string | null }>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, dateOfBirth?: string) => Promise<void>;
  sendOtp: (email: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  switchUser: (userId: number) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rememberedUser, setRememberedUser] = useState<RememberedUser | null>(null);

  const fetchAuthData = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await api.auth.users();
      setAllUsers(usersList);

      try {
        const me = await api.auth.me();
        setCurrentUser(me);
        // If they are logged in, remove remembered user since they are active
        localStorage.removeItem("airbnb_remembered_user");
        setRememberedUser(null);
        
        try {
          const dbWishlist = await api.wishlists.list();
          const favIds = dbWishlist.map((w) => w.listing_id);
          localStorage.setItem("airbnb_favorites", JSON.stringify(favIds));
        } catch (e) {
          console.error("Failed to sync wishlist on load:", e);
        }
      } catch {
        setCurrentUser(null);
      }
    } catch (err: unknown) {
      console.error("Auth initialization failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load authentication state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load remembered user from localStorage
    const saved = localStorage.getItem("airbnb_remembered_user");
    if (saved) {
      try {
        setRememberedUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("airbnb_remembered_user");
      }
    }

    fetchAuthData();
  }, []);

  const clearRememberedUser = () => {
    localStorage.removeItem("airbnb_remembered_user");
    setRememberedUser(null);
  };

  const checkEmail = async (email: string) => {
    return await api.auth.checkEmail(email);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await api.auth.login({ email, password });
      setCurrentUser(user);
      clearRememberedUser();
      
      try {
        const dbWishlist = await api.wishlists.list();
        const favIds = dbWishlist.map((w) => w.listing_id);
        localStorage.setItem("airbnb_favorites", JSON.stringify(favIds));
      } catch (e) {
        console.error("Failed to sync wishlist on login:", e);
      }
      
      setLoading(false);
    } catch (err: unknown) {
      console.error("Failed to login:", err);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, dateOfBirth?: string) => {
    try {
      setLoading(true);
      const newUser = await api.auth.register({ name, email, password, date_of_birth: dateOfBirth });
      setCurrentUser(newUser);
      clearRememberedUser();
      localStorage.setItem("airbnb_favorites", JSON.stringify([]));
      setLoading(false);
    } catch (err: unknown) {
      console.error("Failed to register user:", err);
      setError(err instanceof Error ? err.message : "Could not register user.");
      setLoading(false);
      throw err;
    }
  };

  const sendOtp = async (email: string) => {
    return await api.auth.sendOtp(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const user = await api.auth.verifyOtp({ email, otp });
      setCurrentUser(user);
      clearRememberedUser();
      
      try {
        const dbWishlist = await api.wishlists.list();
        const favIds = dbWishlist.map((w) => w.listing_id);
        localStorage.setItem("airbnb_favorites", JSON.stringify(favIds));
      } catch (e) {
        console.error("Failed to sync wishlist on OTP verify:", e);
      }
      
      setLoading(false);
    } catch (err: unknown) {
      console.error("Failed to verify OTP:", err);
      setLoading(false);
      throw err;
    }
  };

  const switchUser = async (userId: number) => {
    try {
      setLoading(true);
      const switchedUser = await api.auth.switch(userId);
      setCurrentUser(switchedUser);
      clearRememberedUser();
      
      try {
        const dbWishlist = await api.wishlists.list();
        const favIds = dbWishlist.map((w) => w.listing_id);
        localStorage.setItem("airbnb_favorites", JSON.stringify(favIds));
      } catch (e) {
        console.error("Failed to sync wishlist on user switch:", e);
      }
      
      setLoading(false);
    } catch (err: unknown) {
      console.error("Failed to switch user:", err);
      setError(err instanceof Error ? err.message : "Could not switch profiles.");
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.auth.me();
      setCurrentUser(me);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const logout = async () => {
    try {
      // Before logging out, save current user to rememberedUser
      if (currentUser) {
        const remUser: RememberedUser = {
          name: currentUser.name,
          email: currentUser.email,
          avatar_url: currentUser.avatar_url || null,
        };
        localStorage.setItem("airbnb_remembered_user", JSON.stringify(remUser));
        setRememberedUser(remUser);
      }

      await api.auth.logout();
      setCurrentUser(null);
      localStorage.removeItem("airbnb_favorites");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        loading,
        error,
        rememberedUser,
        clearRememberedUser,
        checkEmail,
        login,
        register,
        sendOtp,
        verifyOtp,
        switchUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
