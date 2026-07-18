"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import HostNavbar from "../../components/navbar/HostNavbar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSetupRoute = pathname === "/host/setup";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isSetupRoute && (
        <Suspense fallback={<div className="h-20 bg-white border-b border-gray-150 animate-pulse" />}>
          <HostNavbar />
        </Suspense>
      )}
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
