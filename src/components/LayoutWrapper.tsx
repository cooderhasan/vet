"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import DemoBanner from "@/components/DemoBanner";

export default function LayoutWrapper({ 
  children, 
  settings 
}: { 
  children: React.ReactNode; 
  settings: any; 
}) {
  const pathname = usePathname();
  // Hide site headers and footers on back-office paths: admin and doktor portals
  const isBackOffice = pathname?.startsWith("/admin") || pathname?.startsWith("/doktor");

  return (
    <>
      {!isBackOffice && <DemoBanner />}
      {!isBackOffice && <Header settings={settings} />}
      <main className="flex-grow">{children}</main>
      {!isBackOffice && <Footer settings={settings} />}
      {!isBackOffice && <ChatbotWidget />}
    </>
  );
}
