"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Award, ShieldCheck, Heart, GraduationCap, Users, Sparkles, BookOpen, Star, RefreshCw } from "lucide-react";
import { ClinicSettings, DoctorItem } from "@/lib/settings";

export default function AboutPage() {
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
        console.error("Hakkımızda ayarları yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const values = [
    {
      title: "Medikal Mükemmeliyet",
      desc: "Tüm tanı ve tedavilerimizde kanıta dayalı tıp ilkelerini ve en yeni medikal teknolojileri uyguluyoruz.",
      icon: Award,
    },
    {
      title: "Şefkatli Yaklaşım",
      desc: "Kliniğimize adım atan her patili dostumuzun korkusuz ve huzurlu hissetmesi için sevgiyle yaklaşıyoruz.",
      icon: Heart,
    },
    {
      title: "Güven ve Şeffaflık",
      desc: "Hasta sahiplerini tüm süreçlerde detaylı bilgilendiriyor, tedavi planlarını ve bütçeleri şeffaf paylaşıyoruz.",
      icon: ShieldCheck,
    },
  ];

  if (loading || !settings) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 max-w-6xl mx-auto">
          {/* Text content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="badge badge-accent inline-flex mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5" />
              Kurumsal Hikayemiz
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-sans text-primary">
              Can Dostlarımızın <br />
              <span className="text-accent">Mutluluğu</span> Bizim Misyonumuz
            </h1>
            <p className="text-muted leading-relaxed text-sm sm:text-base">
              {settings.aboutText1}
            </p>
            <p className="text-muted leading-relaxed text-sm sm:text-base">
              {settings.aboutText2}
            </p>
            
            <div className="flex gap-4 items-center justify-center lg:justify-start pt-2">
              <div className="flex -space-x-3.5">
                {settings.doctors.map((doc, idx) => (
                  <div 
                    key={doc.id || idx} 
                    className="relative w-11 h-11 rounded-xl border-2 border-white flex items-center justify-center bg-primary text-white font-bold text-xs uppercase shadow-sm overflow-hidden"
                  >
                    {doc.image ? (
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      doc.avatarInitials
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted font-bold tracking-wider uppercase">
                UZMAN VETERİNER HEKİM KADROSU
              </span>
            </div>
          </div>

          {/* Mission & Vision Side */}
          <div className="lg:col-span-5 bg-white border border-card-border p-8 sm:p-10 rounded-[32px] shadow-sm flex flex-col justify-center gap-6 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-bold text-2xl text-primary font-sans">Misyon & Vizyon</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-accent uppercase tracking-wider">Misyonumuz</h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {settings.aboutMission}
                </p>
              </div>
              <div className="space-y-1.5 border-t border-card-border pt-4">
                <h4 className="font-bold text-sm text-accent uppercase tracking-wider">Vizyonumuz</h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {settings.aboutVision}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Collage / Team Banner Photo */}
        <section className="mb-24 max-w-6xl mx-auto">
          <div className="relative h-[45vh] sm:h-[55vh] rounded-[32px] overflow-hidden shadow-xl">
            <Image
              src="/images/team-photo.png"
              alt="Veteriner Hekim Kadromuz"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-24 bg-white rounded-[32px] p-8 sm:p-16 border border-card-border max-w-6xl mx-auto shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="badge badge-accent inline-flex mx-auto mb-3">
              <Star className="w-3.5 h-3.5" />
              Klinik Değerleri
            </div>
            <h3 className="text-3xl font-bold font-sans text-primary">Bizi Farklı Kılan Temel Değerlerimiz</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="text-center space-y-4 group">
                  <div className="inline-flex bg-primary/10 text-primary p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-primary">{val.title}</h4>
                  <p className="text-sm text-muted leading-relaxed px-2">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hekimlerimiz Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="badge badge-accent inline-flex mx-auto">
              <Users className="w-3.5 h-3.5" />
              Hekim Kadromuz
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-sans text-primary">Uzman Veteriner Hekimlerimiz</h3>
            <p className="text-muted leading-relaxed text-sm">
              Dostlarınızı emanet ettiğiniz hekimlerimizi daha yakından tanıyın. Hepsi alanında yüksek eğitimli ve sevgi doludur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.doctors.map((doc: DoctorItem, idx) => (
              <div 
                key={doc.id || idx}
                className="card-premium overflow-hidden flex flex-col justify-between group"
              >
                {/* Doctor Portrait Header */}
                {doc.image ? (
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className={`w-full aspect-[4/3] flex items-center justify-center text-4xl font-bold font-sans ${doc.color || 'bg-primary/20 text-primary'}`}>
                    {doc.avatarInitials}
                  </div>
                )}

                {/* Doctor Info Body */}
                <div className="p-6 sm:p-8 space-y-4 flex-grow text-left">
                  <div>
                    <h4 className="text-xl font-bold text-primary leading-tight">{doc.name}</h4>
                    <p className="text-xs text-accent font-bold uppercase tracking-wider mt-1">{doc.role}</p>
                  </div>

                  <div className="space-y-3">
                    {/* Specialty */}
                    <div className="bg-background border border-card-border p-3.5 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-primary">Uzmanlık Alanı:</p>
                      <p className="text-muted leading-relaxed">{doc.specialty}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-muted text-xs leading-relaxed">{doc.bio}</p>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-[#FAF6F0]/40 border-t border-card-border p-6 flex items-center gap-3 text-xs text-muted text-left">
                  <GraduationCap className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-medium leading-relaxed">{doc.edu}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
