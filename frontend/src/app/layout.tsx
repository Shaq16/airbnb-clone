import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Airbnb | Holiday Rentals, Cabins, Beach Houses & Unique Homes",
  description: "Clone of Airbnb. Explore unique stays, rent beautiful homes, and manage bookings as a host.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-gray-900 font-sans"
      >
        <AuthProvider>
          <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
