"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PawPrint, Menu, X, Phone, ChevronRight } from "lucide-react";
import { ClinicSettings } from "@/lib/settings";

interface HeaderProps {
  settings: ClinicSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetlerimiz", href: "/hizmetler" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Galeri", href: "/galeri" },
    { name: "Blog", href: "/blog" },
    { name: "İletişim", href: "/iletisim" },
  ];

  const handleOpenAppointment = () => {
    setIsOpen(false);
    const event = new CustomEvent("open-chatbot-booking");
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Top Bar — hidden on mobile */}
      <div className="hidden lg:block bg-primary text-white/90 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                {settings.phone}
              </a>
            </span>
            <span className="text-white/40">|</span>
            <span>{settings.workingHours}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">{settings.address}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-card-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-[12px] flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <PawPrint className="w-5 h-5" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-[17px] text-primary leading-tight tracking-tight">
                  {settings.clinicName}
                </span>
                <span className="text-[10px] text-muted font-medium tracking-wider uppercase hidden sm:block">
                  Veteriner Kliniği
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg font-medium text-[0.9375rem] transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary/5 font-semibold"
                        : "text-muted hover:text-primary hover:bg-primary/[0.03]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-primary text-sm font-medium hover:text-accent transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="hidden xl:inline">{settings.phone}</span>
              </a>
              <button
                onClick={handleOpenAppointment}
                className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl"
              >
                Randevu Al
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-primary rounded-xl hover:bg-primary/5 transition-colors"
              aria-label={isOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: '72px' }}
      >
        <div className="flex flex-col h-full px-6 pt-6 pb-8 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-foreground hover:bg-muted-light"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span>{link.name}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted/40'}`} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 space-y-4 border-t border-card-border">
            {/* Phone */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/5 text-accent font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>{settings.phone}</span>
            </a>

            {/* CTA */}
            <button
              onClick={handleOpenAppointment}
              className="w-full btn-primary !rounded-xl !py-4"
            >
              <PawPrint className="w-5 h-5" />
              Hemen Randevu Al
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
