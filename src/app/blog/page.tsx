"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const blogs = [
    {
      title: "Kedilerde Aşı Takvimi Nasıl Olmalı?",
      excerpt: "Yavru kedilerin sağlıklı büyümesi ve enfeksiyonlara karşı korunması için aşı takvimi rehberi. Hangi aşı ne zaman yapılmalı, aşı sonrası nelere dikkat edilmeli?",
      slug: "kedilerde-asi-takvimi",
      date: "12 Temmuz 2026",
      readTime: "4 dk okuma",
      category: "Kedi Sağlığı",
      categoryColor: "bg-teal-500/10 text-teal-600",
      image: "/images/blog-asi-takvimi.png",
    },
    {
      title: "Köpeklerde Yaz Bakımı İpuçları",
      excerpt: "Yaz sıcaklarında can dostlarımızı sıcaktan koruma yolları. Dehidrasyon, doğru yürüyüş saatleri, pati bakımı ve sıcak çarpmasına karşı acil önlemler.",
      slug: "kopeklerde-yaz-bakimi",
      date: "10 Temmuz 2026",
      readTime: "5 dk okuma",
      category: "Köpek Bakımı",
      categoryColor: "bg-orange-500/10 text-orange-600",
      image: "/images/blog-yaz-bakimi.png",
    },
    {
      title: "Pet Oteli Seçerken Dikkat Edilmesi Gerekenler",
      excerpt: "Tatile çıkarken evcil hayvanınızı güvenle bırakabileceğiniz bir yer mi arıyorsunuz? Bilmeniz gereken hijyen, bakım ve sosyalleşme kriterleri.",
      slug: "pet-oteli-rehberi",
      date: "8 Temmuz 2026",
      readTime: "3 dk okuma",
      category: "Rehberler",
      categoryColor: "bg-blue-500/10 text-blue-600",
      image: "/images/blog-pet-otel.png",
    },
    {
      title: "Yavru Köpeklerde Beslenme Düzeni Nasıl Olmalı?",
      excerpt: "Yavru köpeklerin sağlıklı kemik ve kas gelişimi için anne sütünden kuru mamaya geçiş süreçleri ve besleme sıklığı rehberi.",
      slug: "yavru-kopek-beslenmesi",
      date: "5 Temmuz 2026",
      readTime: "4 dk okuma",
      category: "Beslenme",
      categoryColor: "bg-purple-500/10 text-purple-600",
      image: "/images/blog-yavru-kopek.png",
    },
    {
      title: "Kedilerde Kısırlaştırma Sonrası Bakım Rehberi",
      excerpt: "Kısırlaştırma ameliyatı sonrası iyileşme döneminde dikkat edilmesi gerekenler, yara bakımı, egzersiz kısıtlaması ve mama değişiklikleri.",
      slug: "kedilerde-kisirlastirma",
      date: "2 Temmuz 2026",
      readTime: "5 dk okuma",
      category: "Kedi Sağlığı",
      categoryColor: "bg-teal-500/10 text-teal-600",
      image: "/images/blog-kisirlastirma.png",
    }
  ];

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="badge badge-accent inline-flex mx-auto">
            <BookOpen className="w-3.5 h-3.5" />
            Veteriner Hekim Blogu
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-sans text-primary">
            Dostlarımız İçin <span className="text-accent">Sağlık & Bakım</span> Rehberi
          </h1>
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            Sevimli dostlarımızın sağlıklı, mutlu ve konforlu bir yaşam sürmesi için veteriner hekimlerimiz tarafından hazırlanan güncel rehberler.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-6 relative group">
            <div className="absolute inset-y-0 left-4 pl-0.5 pt-6 flex items-center pointer-events-none text-muted">
              <Search className="w-5 h-5 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Yazı, konu veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-card-border pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Blog Post List */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredBlogs.map((blog, idx) => (
              <article 
                key={idx}
                className="card-premium flex flex-col justify-between overflow-hidden group transition-all duration-300"
              >
                <div>
                  {/* Blog Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-8 space-y-4">
                    {/* Category and Date */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-3 py-1 rounded-full font-bold ${blog.categoryColor}`}>
                        {blog.category}
                      </span>
                      <span className="text-muted/60">•</span>
                      <span className="text-muted flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-primary group-hover:text-accent transition-colors leading-snug">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted text-sm leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  </div>
                </div>

                {/* Footer read time & Link */}
                <div className="px-8 pb-8 pt-4 border-t border-card-border flex items-center justify-between text-sm">
                  <span className="text-muted text-xs flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    {blog.readTime}
                  </span>
                  
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1 group/btn"
                  >
                    <span>Oku</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-card-border rounded-3xl max-w-md mx-auto p-8 shadow-sm space-y-4">
            <Sparkles className="w-10 h-10 text-muted mx-auto animate-pulse" />
            <h3 className="font-bold text-primary">Sonuç Bulunamadı</h3>
            <p className="text-muted text-sm leading-relaxed">
              "{searchQuery}" aramasına uygun bir rehber veya makale bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-sm font-semibold text-accent hover:underline"
            >
              Aramayı Temizle
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
