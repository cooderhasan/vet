"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, ShieldCheck, Clock, Award, Stethoscope, Calendar, ArrowRight,
  Sparkles, Phone, Star, Activity, Syringe, Scissors,
  ChevronRight, Play, CheckCircle, PawPrint, Microscope, ClipboardList,
  ChevronLeft, ArrowUpRight, MessageCircle, MapPin, Home as HomeIcon
} from "lucide-react";
import { ClinicSettings, FeaturedServiceItem, ServiceItem, WhyUsItem } from "@/lib/settings";

export default function Home() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) setSettings(await res.json());
      } catch (err) { console.error("Ayarlar yüklenemedi:", err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleOpenAppointment = () => {
    const event = new CustomEvent("open-chatbot-booking");
    window.dispatchEvent(event);
  };

  const scrollServices = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "acil": return Activity;
      case "koruyucu": return Stethoscope;
      case "ic-hastaliklari": return ClipboardList;
      case "cerrahi": return Scissors;
      case "agiz-dis": return Sparkles;
      case "goruntuleme": return Microscope;
      case "otel": return HomeIcon;
      case "kardiyoloji": return Heart;
      case "dogum": return Heart;
      case "endokrinoloji": return Activity;
      case "uroloji": return Activity;
      case "ortopedi": return Activity;
      case "goz": return Sparkles;
      case "dermatoloji": return Syringe;
      case "ftr": return Activity;
      case "konaklama": return Heart;
      case "egzotik": return PawPrint;
      default: return PawPrint;
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center animate-pulse">
            <PawPrint className="w-8 h-8 text-accent" />
          </div>
          <span className="text-sm text-primary font-medium tracking-widest uppercase">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-background">

      {/* ═══════════ ULTRA-PREMIUM HERO ═══════════ */}
      <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Gradient & Effects */}
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-light/20 via-primary-light to-transparent" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/30 via-primary to-transparent" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 text-xs font-semibold tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Havzan, Meram / Konya
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight">
                  {settings.heroTitle}
                </h1>
                <p className="font-signature text-4xl sm:text-5xl lg:text-6xl text-accent -rotate-2 origin-left tracking-wider pl-2 text-shadow-glow">
                  Sağlığın Güvencesiyiz
                </p>
              </div>

              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-accent to-transparent mx-auto lg:mx-0 my-8" />

              <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {settings.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="btn-primary !rounded-2xl !px-8 !py-4 w-full sm:w-auto !bg-gradient-to-r !from-accent !to-accent-hover !text-primary !font-bold !shadow-glow">
                  <Phone className="w-5 h-5" />
                  Hemen Ara
                </a>
                <button onClick={handleOpenAppointment} className="btn-secondary-outline !bg-white/5 !text-white !border-white/20 hover:!bg-white/10 hover:!border-white/40 !rounded-2xl !px-8 !py-4 w-full sm:w-auto backdrop-blur-md">
                  <Calendar className="w-5 h-5" />
                  Online Randevu
                </button>
              </div>
              
              <p className="text-white/50 text-sm flex items-center justify-center lg:justify-start gap-2 pt-2">
                <Clock className="w-4 h-4 text-accent/80" /> Acil durumlarda gelmeden önce arayınız.
              </p>
            </div>

            {/* Hero Right — Premium Floating Brand Card */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative animate-slide-in-right">
              <div className="relative w-full max-w-[400px]">
                {/* Orbit rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)] -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5 -z-10 animate-spin-slow" style={{ animationDuration: '40s' }} />
                
                <div className="glass-dark rounded-[2rem] p-10 shadow-2xl border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/30 transition-all duration-700" />
                  
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-white to-white/90 rounded-[2rem] p-1 shadow-[0_20px_40px_rgba(0,0,0,0.3)] mb-8 -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full rounded-[1.8rem] border border-card-border/50 bg-white flex items-center justify-center relative overflow-hidden">
                      <PawPrint className="w-16 h-16 text-primary absolute opacity-20" />
                      <Heart className="w-10 h-10 text-accent z-10" />
                    </div>
                  </div>

                  <div className="text-center space-y-2 mb-8">
                    <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">Güvenli Veterinerlik</p>
                    <h3 className="text-white text-2xl font-bold">194+ Google Değerlendirmesi</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Microscope, text: "Klinik İçi Laboratuvar" },
                      { icon: ShieldCheck, text: "Operasyon Sonrası Takip" },
                      { icon: Award, text: "Planlı Tedavi & Yönlendirme" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED SERVICES (6 Cards) ═══════════ */}
      <section className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-tight mb-6">
              Profesyonel <span className="text-accent font-signature font-normal tracking-wide text-5xl lg:text-[4rem] relative top-2">Sağlık</span> Hizmetlerimiz
            </h2>
            <p className="text-muted mt-4 leading-relaxed max-w-2xl mx-auto text-lg">
              Can dostlarınız için koruyucu sağlık, tanısal değerlendirme, kısırlaştırma ve cerrahi süreçlerini düzenli takip anlayışıyla yürütüyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {settings.featuredServices?.map((service: FeaturedServiceItem, idx) => {
              const Icon = getServiceIcon(service.id);
              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-3xl p-8 border border-card-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up flex flex-col h-full overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6 shadow-md group-hover:shadow-glow transition-all duration-500">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-8">
                      {service.details?.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto relative z-10">
                    <Link href={`/hizmetler#${service.id}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors">
                      Detaylı İncele <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ OTHER SERVICES (Horizontal Scroll) ═══════════ */}
      <section className="py-20 relative bg-gradient-to-b from-white to-background border-y border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary">Diğer Hizmetlerimiz</h3>
            <p className="text-muted mt-2">Daha spesifik ihtiyaçlar için kapsamlı çözümler</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scrollServices('left')} className="w-12 h-12 rounded-full border border-card-border bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollServices('right')} className="w-12 h-12 rounded-full border border-card-border bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-[100vw] overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory hide-scrollbar max-w-7xl mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {settings.services?.map((service: ServiceItem, idx) => {
              const Icon = getServiceIcon(service.id);
              return (
                <div key={service.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] group">
                  <div className="bg-white border border-card-border rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-3">{service.title}</h4>
                    <p className="text-sm text-muted mb-6 flex-grow">{service.description}</p>
                    <Link href={`/hizmetler#${service.id}`} className="mt-auto flex items-center justify-between border-t border-card-border pt-4 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                      Bilgi Al <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY ELÇİ (4 Principles) ═══════════ */}
      <section className="section-padding relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-16 animate-fade-in-up">
            <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Klinik Yaklaşımımız</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Neden Biz?
            </h2>
            <p className="text-white/70 mt-6 text-lg max-w-2xl">
              Hasta sahiplerinin süreci anlayabilmesini, seçenekleri bilmesini ve kontrol planını güvenle takip edebilmesini önemsiyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.whyUs?.map((item: WhyUsItem, idx) => (
              <div 
                key={item.id} 
                className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-accent/40 transition-all duration-500 group animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-700 ease-out" />
                
                <span className="absolute top-6 right-6 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500 pointer-events-none">
                  0{item.id}
                </span>
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/80 to-accent-hover flex items-center justify-center mb-6 shadow-glow">
                  {idx === 0 && <MessageCircle className="w-6 h-6 text-primary" />}
                  {idx === 1 && <Microscope className="w-6 h-6 text-primary" />}
                  {idx === 2 && <ShieldCheck className="w-6 h-6 text-primary" />}
                  {idx === 3 && <Activity className="w-6 h-6 text-primary" />}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-light transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA / CONTACT BAR ═══════════ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-background to-muted-light/30 border border-card-border shadow-sm">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Can dostunuz için yardıma mı ihtiyacınız var?</h3>
              <p className="text-muted">7/24 bizimle iletişime geçebilir, hızlı randevu oluşturabilirsiniz.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link href="/hizmetler" className="btn-secondary-outline !rounded-2xl !py-4 w-full md:w-auto">
                Hizmetlerimiz
              </Link>
              <button onClick={handleOpenAppointment} className="btn-primary !rounded-2xl !py-4 w-full md:w-auto !bg-gradient-to-r !from-accent !to-accent-hover !text-primary !shadow-glow">
                Randevu Al
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
