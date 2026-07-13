"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // If the user dismissed it previously in this session, keep it hidden
  useEffect(() => {
    const dismissed = sessionStorage.getItem("demo-banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("demo-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-accent text-white py-2.5 px-4 relative flex items-center justify-between text-sm sm:text-base font-medium shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 mx-auto pr-6 text-center">
        <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
        <span>
          <strong>Bu bir tanıtım/demo sitesidir.</strong> Gerçek bir klinik hizmeti verilmemektedir.
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
        aria-label="Kapat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
