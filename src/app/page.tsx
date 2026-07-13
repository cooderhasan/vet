"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, ShieldCheck, Clock, Award, Stethoscope, Calendar, ArrowRight,
  Sparkles, Phone, Star, Users, Activity, Syringe, Scissors, Home as HomeIcon,
  Apple, ChevronRight, Play, CheckCircle, PawPrint, RefreshCw
} from "lucide-react";
import { ClinicSettings, ServiceItem } from "@/lib/settings";

/* ─── Animated Counter Hook ─── */
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    
    // Safety fallback: force start if observer fails or doesn't trigger in 1.5s
    const fallbackTimeout = setTimeout(() => {
      setHasStarted(true);
    }, 1500);

    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          setHasStarted(true);
          clearTimeout(fallbackTimeout);
        } 
      },
      { threshold: 0.05 } // Trigger as soon as 5% is visible
    );
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

export default function Home() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Stats counters
  const stat1 = useCountUp(12500, 2000);
  const stat2 = useCountUp(15, 1500);
  const stat3 = useCountUp(99, 2000);
  const stat4 = useCountUp(7, 1000);

  const serviceIcons: Record<string, React.ElementType> = {
    muayene: Stethoscope, asi: Syringe, cerrahi: Scissors,
    otel: HomeIcon, diyet: Apple, default: Activity
  };

  const testimonials = [
    {
      name: "Elif K.",
      pet: "Luna (Golden Retriever)",
      text: "Luna'nın ameliyatı için çok endişeliydik ama ekip bizi her adımda bilgilendirdi. Artık sağlıklı ve mutlu koşuyor!",
      rating: 5,
    },
    {
      name: "Mehmet A.",
      pet: "Bıdık (Tekir Kedi)",
      text: "Bıdık'ın aşılarını hiç aksatmadık. Otomasyon sistemi sayesinde randevu hatırlatması geliyor, harika bir hizmet.",
      rating: 5,
    },
    {
      name: "Zeynep T.",
      pet: "Pamuk (British Shorthair)",
      text: "Çalışma saatleri çok uygun, personel son derece ilgili. Pamuk burayı çok seviyor, kliniğe girmek bile istemiyor!",
      rating: 5,
    },
  ];

  const featuredBlogs = [
    {
      title: "Kedilerde Aşı Takvimi Nasıl Olmalı?",
      excerpt: "Yavru kedilerin sağlıklı büyümesi ve enfeksiyonlara karşı korunması için aşı takvimi rehberi. Hangi aşı ne zaman yapılmalı, aşı sonrası nelere dikkat edilmeli?",
      slug: "kedilerde-asi-takvimi",
      date: "12 Temmuz 2026",
      readTime: "4 dk",
      category: "Sağlık Rehberi",
    },
    {
      title: "Köpeklerde Yaz Bakımı İpuçları",
      excerpt: "Yavru köpeklerin yaz sıcaklarında dehidrasyon ve güneş çarpmasından korunması için veteriner hekim tavsiyeleri.",
      slug: "kopeklerde-yaz-bakimi",
      date: "10 Temmuz 2026",
      readTime: "5 dk",
      category: "Bakım & Beslenme",
    },
    {
      title: "Pet Oteli Seçerken Dikkat Edilmesi Gerekenler",
      excerpt: "Tatile çıkarken evcil hayvanınızı güvenle bırakabileceğiniz bir yer mi arıyorsunuz? Bilmeniz gerekenler.",
      slug: "pet-oteli-rehberi",
      date: "8 Temmuz 2026",
      readTime: "3 dk",
      category: "Rehber",
    },
  ];

  if (loading || !settings) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <PawPrint className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const summaryServices = settings.services.slice(0, 4);

  return (
    <div className="relative overflow-hidden">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-clinic.png"
            alt="Modern veteriner kliniği"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2928]/90 via-[#0F2928]/70 to-[#0F2928]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2928]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
              <div className="badge badge-accent !bg-accent/20 !text-white inline-flex">
                <Sparkles className="w-3.5 h-3.5" />
                Patileriniz Bizimle Güvende
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                {settings.heroTitle}
              </h1>

              <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {settings.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button onClick={handleOpenAppointment} className="btn-accent !rounded-2xl !px-8 !py-4 w-full sm:w-auto">
                  <Calendar className="w-5 h-5" />
                  Online Randevu Al
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/hizmetler"
                  className="btn-secondary-outline !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !rounded-2xl !px-8 !py-4 w-full sm:w-auto"
                >
                  Hizmetlerimizi İncele
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                {[
                  { icon: ShieldCheck, text: "Lisanslı Klinik" },
                  { icon: Clock, text: "7/24 Acil Destek" },
                  { icon: Award, text: "15+ Yıl Deneyim" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <badge.icon className="w-4 h-4 text-accent" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right — Floating Cards */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative animate-slide-in-right">
              <div className="relative w-full max-w-[420px]">
                {/* Card 1 - Top */}
                <div className="glass rounded-2xl p-5 shadow-xl mb-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm">Düzenli Kontrol Hatırlatması</p>
                      <p className="text-xs text-muted">Aşı takvimi yaklaşıyor</p>
                    </div>
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                </div>

                {/* Card 2 - Center Stats */}
                <div className="glass rounded-2xl p-6 shadow-xl mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">12.5K+</p>
                      <p className="text-[10px] text-muted mt-1">Tedavi Edilen</p>
                    </div>
                    <div className="border-x border-card-border">
                      <p className="text-2xl font-bold text-accent">%99</p>
                      <p className="text-[10px] text-muted mt-1">Memnuniyet</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">15+</p>
                      <p className="text-[10px] text-muted mt-1">Yıl Deneyim</p>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Emergency */}
                <div className="glass rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center animate-pulse-glow">
                        <Phone className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Acil Hat 7/24</p>
                        <p className="text-sm font-mono font-bold text-accent">{settings.phone}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Keşfet</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="section-padding bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <span className="badge badge-accent mb-4">
              <Stethoscope className="w-3.5 h-3.5" />
              Hizmetlerimiz
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-tight">
              Dostlarınıza Sunduğumuz <br className="hidden sm:block" />
              <span className="text-accent">Profesyonel Sağlık</span> Çözümleri
            </h2>
            <p className="text-muted mt-4 leading-relaxed max-w-2xl mx-auto">
              Modern tıbbın tüm imkanlarını kullanarak koruyucu hekimlikten cerrahiye kadar geniş bir yelpazede hizmet sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryServices.map((service: ServiceItem, idx) => {
              const Icon = serviceIcons[service.id] || serviceIcons.default;
              return (
                <div
                  key={service.id}
                  className="card-premium p-7 group cursor-pointer transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all duration-500">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{service.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{service.description}</p>
                  <div className="border-t border-card-border pt-4 flex items-center justify-between">
                    <span className="text-accent font-bold text-sm">{service.price}</span>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/hizmetler" className="btn-secondary-outline !rounded-2xl">
              Tüm Hizmetleri Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY US + IMAGE ═══════════ */}
      <section className="section-padding bg-background relative gradient-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image Side */}
            <div className="relative animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/happy-pets.png"
                  alt="Mutlu ve sağlıklı evcil hayvanlar"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -right-4 sm:right-4 glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">%99.4</p>
                    <p className="text-xs text-muted">Müşteri Memnuniyeti</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6 animate-fade-in-up">
              <span className="badge badge-primary">
                <Award className="w-3.5 h-3.5" />
                Neden Biz?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary leading-tight">
                Sıradışı Bir <span className="text-accent">Bakım Deneyimi</span> Sunuyoruz
              </h2>
              <p className="text-muted leading-relaxed">
                Bizim için her evcil hayvan eşsizdir. Gelişmiş tıbbi donanımlarımız kadar onlara verdiğimiz şefkat ve sevgiyle de fark yaratıyoruz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {[
                  { icon: Award, title: "Uzman Hekim Kadrosu", desc: "Alanında akademik gelişmeleri takip eden deneyimli hekim kadromuz." },
                  { icon: Clock, title: "7/24 Acil Müdahale", desc: "Acil durumlar için özel acil servisimiz ve her an hazır hekimlerimiz." },
                  { icon: Heart, title: "Sevgi & Empati Odaklı", desc: "Her hastamızı ailemizin birer üyesi olarak görüyor, şefkatle yaklaşıyoruz." },
                  { icon: Sparkles, title: "Modern Tıbbi Donanım", desc: "Dijital röntgen, renkli ultrason ve gelişmiş laboratuvar imkanları." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">{item.title}</h4>
                      <p className="text-xs text-muted leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(224,122,95,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(141,170,157,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { ref: stat1.ref, count: stat1.count, suffix: "+", label: "Tedavi Edilen Hasta", icon: Heart },
              { ref: stat2.ref, count: stat2.count, suffix: " Yıl", label: "Sektör Deneyimi", icon: Award },
              { ref: stat3.ref, count: stat3.count, suffix: "%", label: "Müşteri Memnuniyeti", icon: Star },
              { ref: stat4.ref, count: stat4.count, suffix: "/24", label: "Acil Müdahale Hattı", icon: Clock },
            ].map((stat, idx) => (
              <div key={idx} ref={stat.ref} className="text-center text-white space-y-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold">
                  {stat.count.toLocaleString('tr-TR')}<span className="text-accent">{stat.suffix}</span>
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in-up">
            <span className="badge badge-accent mb-4">
              <Star className="w-3.5 h-3.5" />
              Müşteri Yorumları
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Can Dost Sahiplerinin <span className="text-accent">Görüşleri</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="testimonial-card transition-all duration-500 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warm-gold fill-warm-gold" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="border-t border-card-border pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-primary">{t.name}</p>
                    <p className="text-xs text-muted">{t.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BLOG ═══════════ */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 animate-fade-in-up">
            <div className="space-y-3 max-w-2xl">
              <span className="badge badge-primary">
                <Play className="w-3.5 h-3.5" />
                Blog & Rehberler
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                Sizin İçin Hazırladığımız <span className="text-accent">Sağlık Rehberleri</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group"
            >
              <span>Tüm Yazılar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((blog, idx) => (
              <Link
                key={idx}
                href={`/blog/${blog.slug}`}
                className="card-premium p-0 overflow-hidden group transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Blog Card Top Gradient Strip */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary-light" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-full font-semibold">{blog.category}</span>
                    <span className="text-muted">{blog.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-card-border">
                    <span className="text-xs text-muted">{blog.readTime} okuma</span>
                    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:text-accent transition-colors">
                      Oku <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SURGERY/TECH IMAGE BREAK ═══════════ */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src="/images/surgery-room.png"
          alt="Modern cerrahi salon"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg space-y-4 text-white animate-fade-in-up">
              <span className="badge !bg-white/15 !text-white">
                <Sparkles className="w-3.5 h-3.5" />
                Modern Teknoloji
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Son Teknoloji Cihazlarla <span className="text-accent-light">Güvenli Tedavi</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Dijital röntgen, renkli ultrason, tam donanımlı ameliyathane ve gelişmiş laboratuvarımızla hızlı ve doğru teşhis koyuyoruz.
              </p>
              <button onClick={handleOpenAppointment} className="btn-accent !rounded-2xl mt-2">
                <Calendar className="w-4 h-4" />
                Randevu Al
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
