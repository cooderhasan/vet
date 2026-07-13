"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, LayoutGrid } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: "exterior" | "interior" | "medical" | "guests";
  categoryLabel: string;
  image: string;
  description: string;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 0,
      title: "Klinik Dış Görünümü",
      category: "exterior",
      categoryLabel: "Klinik Dışı",
      image: "/images/gallery-exterior.png",
      description: "Kliniğimizin Kadıköy'deki modern, ferah ve kolay ulaşılabilir dış girişi."
    },
    {
      "id": 1,
      "title": "İç Mekan & Lobi",
      "category": "interior",
      "categoryLabel": "İç Mekan",
      "image": "/images/hero-clinic.png",
      "description": "Dostlarımızın stresten uzak, konforlu ve huzurlu hissetmesi için tasarlanmış bekleme salonumuz."
    },
    {
      "id": 2,
      "title": "Genel Muayene Odası",
      "category": "medical",
      "categoryLabel": "Muayene & Laboratuvar",
      "image": "/images/service-muayene.png",
      "description": "En hassas kontroller için gelişmiş muayene ve stetoskop tetkik ekipmanlarımız."
    },
    {
      "id": 3,
      "title": "Steril Ameliyathane",
      "category": "medical",
      "categoryLabel": "Cerrahi Odası",
      "image": "/images/service-cerrahi.png",
      "description": "Gaz anestezisi ve hasta başı monitör sistemleriyle tam donanımlı steril cerrahi ünitemiz."
    },
    {
      "id": 4,
      "title": "Dijital Röntgen & Laboratuvar",
      "category": "medical",
      "categoryLabel": "Muayene & Laboratuvar",
      "image": "/images/service-laboratuvar.png",
      "description": "Hızlı tanı koyabilmek için kullandığımız dijital görüntüleme ve kan analiz ünitemiz."
    },
    {
      "id": 5,
      "title": "Pet Oteli & Pansiyon",
      "category": "interior",
      "categoryLabel": "İç Mekan",
      "image": "/images/service-otel.png",
      "description": "Ev konforunu aratmayan, geniş, havalandırmalı ve hekim kontrollü konaklama odalarımız."
    },
    {
      "id": 6,
      "title": "Mutlu Misafirlerimiz",
      "category": "guests",
      "categoryLabel": "Misafirlerimiz",
      "image": "/images/happy-pets.png",
      "description": "Tedavileri başarıyla tamamlanan ve pansiyonumuzda keyifle vakit geçiren dostlarımız."
    },
    {
      "id": 7,
      "title": "Hekim Kadromuz",
      "category": "guests",
      "categoryLabel": "Ekibimiz",
      "image": "/images/team-photo.png",
      "description": "Sevimli dostlarınızın sağlığı için 7/24 özveriyle çalışan uzman veteriner hekimlerimiz."
    }
  ];

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const categories = [
    { value: "all", label: "Tüm Fotoğraflar" },
    { value: "exterior", label: "Dış Görünüm" },
    { value: "interior", label: "İç Mekan & Pansiyon" },
    { value: "medical", label: "Muayene & Cerrahi" },
    { value: "guests", label: "Dostlarımız & Ekibimiz" }
  ];

  const openLightbox = (index: number) => {
    // Find the original item index based on the filtered list
    const originalItem = filteredItems[index];
    const originalIndex = galleryItems.findIndex(item => item.id === originalItem.id);
    setLightboxIndex(originalIndex !== -1 ? originalIndex : index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="badge badge-accent inline-flex mx-auto">
            <Camera className="w-3.5 h-3.5" />
            Fotoğraf Galerisi
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-sans text-primary">
            Kliniğimizden <span className="text-accent">Kareler</span>
          </h1>
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            Modern muayene ve cerrahi ünitelerimiz, hijyenik pansiyon alanlarımız ve iyileşme sevinci yaşayan sevimli dostlarımızın anları.
          </p>

          {/* Filter Categories tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-muted hover:text-primary border border-card-border hover:border-primary/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="card-premium overflow-hidden group cursor-pointer flex flex-col h-full transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-grow text-left space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-muted text-xs leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal Overlay */}
        {lightboxIndex !== null && (
          <div 
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-[#0F2928]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          >
            {/* Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left navigation arrow */}
            <button 
              onClick={prevImage}
              className="absolute left-4 sm:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-40"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Main Container */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-4xl w-full max-h-[80vh] flex flex-col gap-4 text-center items-center justify-center"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={galleryItems[lightboxIndex].image}
                  alt={galleryItems[lightboxIndex].title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Text metadata below image */}
              <div className="space-y-1 text-white max-w-xl">
                <span className="text-xs text-accent font-bold uppercase tracking-wider">
                  {galleryItems[lightboxIndex].categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans">
                  {galleryItems[lightboxIndex].title}
                </h2>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {galleryItems[lightboxIndex].description}
                </p>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button 
              onClick={nextImage}
              className="absolute right-4 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-40"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-semibold">
              {lightboxIndex + 1} / {galleryItems.length}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
