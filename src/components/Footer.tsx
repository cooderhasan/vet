"use client";

import React from "react";
import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin, Clock, ArrowUpRight, Heart } from "lucide-react";
import { ClinicSettings } from "@/lib/settings";

interface FooterProps {
  settings: ClinicSettings;
}

export default function Footer({ settings }: FooterProps) {
  const handleOpenAppointment = () => {
    const event = new CustomEvent("open-chatbot-booking");
    window.dispatchEvent(event);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F2928] text-white overflow-hidden mt-auto">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* CTA Banner */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold">
                Can Dostunuz İçin <span className="text-accent">Randevu</span> Oluşturun
              </h3>
              <p className="text-white/60 max-w-xl text-sm sm:text-base">
                AI asistanımızla konuşarak veya hızlı randevu butonuyla birkaç saniyede randevunuzu planlayın.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenAppointment}
                className="btn-accent !rounded-2xl !px-8 !py-4 !text-base"
              >
                <PawPrint className="w-5 h-5" />
                Hemen Randevu Al
              </button>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/15 text-white font-semibold hover:bg-white/5 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Bizi Arayın
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-primary rounded-[12px] flex items-center justify-center text-white shadow-lg">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="font-sans font-bold text-lg text-white tracking-tight">
                {settings.clinicName}
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Dostlarınızın sağlığı ve mutluluğu bizim için her şeyden önemli. Uzman kadromuz ve modern teknolojilerimizle yanınızdayız.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-white/50 transition-all duration-300" aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-white/50 transition-all duration-300" aria-label="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-5">Hızlı Erişim</h4>
            <ul className="space-y-3">
              {[
                { name: "Ana Sayfa", href: "/" },
                { name: "Hizmetlerimiz", href: "/hizmetler" },
                { name: "Hakkımızda", href: "/hakkimizda" },
                { name: "Galeri", href: "/galeri" },
                { name: "Blog", href: "/blog" },
                { name: "Pet Karnesi", href: "/karne" },
                { name: "İletişim", href: "/iletisim" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-all duration-300"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-5">Çalışma Saatleri</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80 font-medium">{settings.workingHours}</p>
                  <p className="text-white/40 text-xs mt-1">Pazar günleri acil müdahaleler hariç kapalıyız.</p>
                </div>
              </div>
              <div className="mt-4 bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Acil Hat 7/24</p>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white font-bold text-sm hover:text-accent transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-5">İletişim</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-white/60 leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white/60 hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-white/60 hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {currentYear} {settings.clinicName}. Tüm Hakları Saklıdır.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            <Heart className="w-3 h-3 text-accent/50" /> ile tasarlandı
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
}
