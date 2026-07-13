"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  PhoneCall,
  RefreshCw
} from "lucide-react";
import { ClinicSettings } from "@/lib/settings";

export default function ContactPage() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Muayene Talebi",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("İletişim ayarları yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Muayene Talebi",
      message: "",
    });
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <PhoneCall className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const contactInfo = [
    {
      title: "Adresimiz",
      desc: settings.address,
      icon: MapPin,
    },
    {
      title: "Telefon Numarası",
      desc: settings.phone,
      link: `tel:${settings.phone.replace(/\s+/g, '')}`,
      icon: Phone,
    },
    {
      title: "E-Posta Adresi",
      desc: settings.email,
      link: `mailto:${settings.email}`,
      icon: Mail,
    },
    {
      title: "Mesai Saatlerimiz",
      desc: settings.workingHours,
      icon: Clock,
    },
  ];

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="badge badge-accent inline-flex mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            İletişim Merkezi
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-sans text-primary">
            Bizimle <span className="text-accent">İletişime</span> Geçin
          </h1>
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            Sorularınız, fiyat teklifleri veya randevu talepleriniz için aşağıdaki formu doldurabilir ya da doğrudan iletişim kanallarımızdan bize ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div key={idx} className="bg-white border border-card-border p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary text-sm">{info.title}</h4>
                      {info.link ? (
                        <a href={info.link} className="text-muted text-sm hover:text-accent transition-colors font-medium">
                          {info.desc}
                        </a>
                      ) : (
                        <p className="text-muted text-sm leading-relaxed font-medium">{info.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white border border-card-border p-4 rounded-3xl shadow-sm space-y-3">
              <div className="h-64 bg-[#E9DFCF] rounded-2xl overflow-hidden relative flex flex-col justify-between p-5 text-primary">
                {/* Visual grid representing map grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#C8BDB0_1px,transparent_1px),linear-gradient(to_bottom,#C8BDB0_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
                
                {/* Custom Styled Map Badge */}
                <div className="bg-white/95 backdrop-blur-sm border border-card-border p-3 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2.5 self-start relative z-10">
                  <MapPin className="w-4 h-4 text-accent fill-accent animate-bounce" />
                  <span>{settings.clinicName} - Kadıköy / İSTANBUL</span>
                </div>

                <div className="text-[10px] text-muted self-end bg-white/70 px-2 py-0.5 rounded relative z-10">
                  Enlem: 40.9902 | Boylam: 29.0204 (Simüle Edilmiştir)
                </div>
              </div>
              <p className="text-[11px] text-muted text-center italic">
                * Bu bir demo sitesi olduğundan aktif harita anahtarı eklenmemiştir.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white border border-card-border rounded-3xl p-8 sm:p-10 shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-6">Bize İleti Gönderin</h3>
            
            {isSubmitted ? (
              <div className="bg-[#FAF6F0] border border-card-border text-primary p-8 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Mesajınız Gönderildi!</span>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  Bize ulaştığınız için teşekkür ederiz. İletiniz başarıyla kaydedilmiştir. Müşteri temsilcilerimiz en kısa sürede sizinle irtibata geçecektir.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-accent !py-2.5 !px-5 !text-xs !rounded-xl"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-primary uppercase tracking-wider">Adınız Soyadınız</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold text-primary uppercase tracking-wider">Telefon Numaranız</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-primary uppercase tracking-wider">E-Posta Adresiniz</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      placeholder="ornek@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-primary uppercase tracking-wider">Konu</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    >
                      <option value="Muayene Talebi">Genel Muayene / Aşı Randevusu</option>
                      <option value="Pet Otel Rezervasyonu">Pet Otel Rezervasyonu</option>
                      <option value="Fiyat Sorgusu">Fiyat / Bilgi Sorgulama</option>
                      <option value="Diğer">Diğer Konular</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-primary uppercase tracking-wider">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    placeholder="Lütfen mesajınızı veya randevu notlarınızı buraya yazın..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary !rounded-xl !py-3.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
