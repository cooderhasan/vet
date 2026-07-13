"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Stethoscope, 
  ShieldCheck, 
  Heart, 
  Home as HomeIcon, 
  Apple, 
  Activity, 
  ArrowRight,
  HelpCircle,
  Scissors,
  Syringe,
  ChevronRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ClinicSettings, ServiceItem } from "@/lib/settings";

export default function ServicesPage() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Hizmet ayarları yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleOpenAppointment = () => {
    const event = new CustomEvent("open-chatbot-booking");
    window.dispatchEvent(event);
  };

  // Helper to map icons to service categories dynamically
  const serviceIcons: Record<string, React.ElementType> = {
    muayene: Stethoscope,
    asi: Syringe,
    cerrahi: Scissors,
    otel: HomeIcon,
    diyet: Apple,
    default: Activity
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="badge badge-accent inline-flex mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Tedavi & Bakım Kataloğu
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-sans text-primary">
            Hizmetlerimiz ve <span className="text-accent">Şeffaf Ücret</span> Politikamız
          </h1>
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            {settings.clinicName}'nde tüm tanı ve tedavi işlemleri, şeffaf fiyat politikası ve en yüksek tıbbi standartlarla gerçekleştirilir. Hizmetlerimizin detaylarını aşağıda görebilirsiniz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {settings.services.map((service: ServiceItem, idx) => {
            const Icon = serviceIcons[service.id] || serviceIcons.default;
            return (
              <div 
                key={service.id} 
                className="card-premium flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Service Header Image */}
                  {service.image ? (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary-light" />
                  )}
                  
                  <div className="p-8 sm:p-10 space-y-6">
                    {/* Title & Icon */}
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-primary leading-tight">{service.title}</h2>
                        <span className="text-xs text-accent font-semibold tracking-wide uppercase">PROFESYONEL HİZMET</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted text-sm leading-relaxed">{service.description}</p>
                    
                    {/* Detailed points */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Hizmet İçeriği ve Detaylar:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="text-xs text-muted flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="px-8 pb-8 pt-6 sm:px-10 sm:pb-10 border-t border-card-border bg-[#FAF6F0]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-0.5">Ortalama Fiyat Aralığı</span>
                    <span className="text-lg font-bold text-primary font-mono">{service.price}</span>
                  </div>
                  <button 
                    onClick={handleOpenAppointment}
                    className="btn-primary !py-3.5 !px-6 !text-sm !rounded-xl"
                  >
                    <span>Randevu Al</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informative Disclaimer section */}
        <div className="mt-20 max-w-4xl mx-auto bg-white border border-card-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 text-left">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary">Fiyatlar ve Tedavi Süreçleri Hakkında Bilgilendirme</h3>
            <p className="text-muted text-sm leading-relaxed">
              Yukarıda belirtilen fiyatlar yaklaşık aralıklar olup, her can dostumuzun ırkı, kilosu, genel sağlık durumu ve uygulanacak ek laboratuvar tahlillerine bağlı olarak değişiklik gösterebilir. Muayene sonrası veteriner hekimimiz size özel detaylı bir tedavi planı ve net fiyat teklifi sunacaktır.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
