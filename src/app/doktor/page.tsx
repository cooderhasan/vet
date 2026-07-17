"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Search, 
  Phone, 
  User, 
  Clock, 
  BookOpen, 
  ArrowLeft, 
  Users, 
  Stethoscope, 
  ClipboardCheck,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { ClinicSettings, DoctorItem } from "@/lib/settings";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  pet: string;
  service: string;
  datetime: string;
  doctorId: string;
  date: string;
  time: string;
  createdAt: string;
}

export default function DoctorPortal() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all" | "today" | "upcoming"

  const fetchData = async () => {
    setLoading(true);
    try {
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
      const appRes = await fetch("/api/appointments");
      if (appRes.ok) {
        setAppointments(await appRes.json());
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDoctorAppointments = () => {
    if (!selectedDoctor) return [];
    
    const todayStr = new Date().toISOString().split("T")[0];
    
    return appointments.filter(app => {
      if (app.doctorId !== selectedDoctor.id) return false;
      
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.pet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.service.toLowerCase().includes(searchQuery.toLowerCase());
        
      if (!matchesSearch) return false;
      
      if (dateFilter === "today") {
        return app.date === todayStr;
      } else if (dateFilter === "upcoming") {
        return app.date >= todayStr;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by date then time
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  };

  const getMetrics = () => {
    if (!selectedDoctor) return { today: 0, upcoming: 0, total: 0 };
    const todayStr = new Date().toISOString().split("T")[0];
    const docApps = appointments.filter(app => app.doctorId === selectedDoctor.id);
    
    return {
      today: docApps.filter(app => app.date === todayStr).length,
      upcoming: docApps.filter(app => app.date >= todayStr).length,
      total: docApps.length
    };
  };

  const formatClientPhoneForWhatsApp = (phoneStr: string) => {
    let clean = phoneStr.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "90" + clean.substring(1);
    } else if (!clean.startsWith("90") && clean.length === 10) {
      clean = "90" + clean;
    }
    return clean;
  };

  const openWhatsAppClientMessage = (app: Appointment) => {
    const cleanPhone = formatClientPhoneForWhatsApp(app.phone);
    const text = `Merhaba ${app.name}, ben ${selectedDoctor?.name}. ${app.pet} dostumuzun ${app.datetime} tarihindeki randevusu hakkında bilgilendirmek/koordine etmek için yazıyorum.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center animate-spin">
            <RefreshCw className="w-8 h-8 text-accent" />
          </div>
          <span className="text-sm text-primary font-semibold tracking-wider">Hekim Portalı Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // --- SELECTION VIEW ---
  if (!selectedDoctor) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
              <Stethoscope className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">Hekim Randevu Paneli</h1>
            <p className="text-muted text-base max-w-md mx-auto">
              Randevularınızı, çalışma takviminizi ve hasta kayıtlarınızı görüntülemek için isminizi seçin.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-bold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anasayfaya Geri Dön</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {settings.doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-white border border-card-border rounded-3xl p-8 text-center hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col items-center group active:scale-95 relative overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-2 ${doctor.color.split(" ")[0] || "bg-primary"}`}></div>
                
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold uppercase ${doctor.color} shadow-inner mb-6`}>
                  {doctor.avatarInitials}
                </div>
                
                <h3 className="font-extrabold text-lg text-primary group-hover:text-accent transition-colors leading-snug">
                  {doctor.name}
                </h3>
                <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-1">
                  {doctor.role}
                </p>
                <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">
                  {doctor.specialty}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  const doctorAppointments = getDoctorAppointments();
  const metrics = getMetrics();
  const next7DaysList = () => {
    const days = [];
    const weekdays = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dateStr: d.toISOString().split("T")[0],
        label: `${d.getDate()} ${months[d.getMonth()]}`,
        dayName: weekdays[d.getDay()]
      });
    }
    return days;
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Profile Banner */}
        <div className="bg-primary text-white p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-5 relative z-10">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-all text-white active:scale-90"
              title="Geri Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl uppercase ${selectedDoctor.color} shadow-md`}>
              {selectedDoctor.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{selectedDoctor.name}</h1>
                <span className="bg-accent text-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Hekim</span>
              </div>
              <p className="text-white/80 text-sm mt-0.5">{selectedDoctor.role} • {selectedDoctor.specialty}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yenile</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Bugünkü Randevularım</p>
              <h3 className="text-3xl font-extrabold text-primary mt-1 font-mono">{metrics.today}</h3>
            </div>
            <div className="bg-primary/5 text-primary p-3.5 rounded-xl border border-primary/10">
              <ClipboardCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Gelecek Randevularım</p>
              <h3 className="text-3xl font-extrabold text-primary mt-1 font-mono">{metrics.upcoming}</h3>
            </div>
            <div className="bg-accent/10 text-accent p-3.5 rounded-xl border border-accent/20">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Toplam Kayıtlı Randevu</p>
              <h3 className="text-3xl font-extrabold text-primary mt-1 font-mono">{metrics.total}</h3>
            </div>
            <div className="bg-secondary/30 text-primary p-3.5 rounded-xl border border-secondary/40">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:max-w-md relative">
            <div className="absolute inset-y-0 left-4 pl-0.5 flex items-center pointer-events-none text-muted">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Hasta adı, evcil türü veya işlem ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-card-border pl-11 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {[
              { id: "all", label: "Tüm Tarihler" },
              { id: "today", label: "Bugün" },
              { id: "upcoming", label: "Gelecek Randevular" }
            ].map((filt) => (
              <button
                key={filt.id}
                onClick={() => setDateFilter(filt.id)}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  dateFilter === filt.id
                    ? "bg-primary border-primary text-white shadow-sm"
                    : "bg-background border-card-border text-muted hover:bg-muted-light"
                }`}
              >
                {filt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List/Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main List */}
          <div className="lg:col-span-8 bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              <span>Günlük Randevu Akışı</span>
            </h3>

            {doctorAppointments.length > 0 ? (
              <div className="space-y-4">
                {doctorAppointments.map((app) => (
                  <div 
                    key={app.id} 
                    className="border border-card-border/80 bg-background/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-primary font-mono flex-shrink-0">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-bold mt-0.5">{app.time}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-primary capitalize text-sm">{app.name}</h4>
                          <span className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {app.pet}
                          </span>
                        </div>
                        <p className="text-xs text-muted font-medium uppercase tracking-wide">{app.service}</p>
                        <div className="flex items-center gap-4 text-[11px] text-muted-dark pt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-muted/60" /> {app.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-muted/60" /> 
                            <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto border-t sm:border-t-0 border-card-border/60 pt-3 sm:pt-0 justify-end">
                      <button
                        onClick={() => openWhatsAppClientMessage(app)}
                        className="bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 hover:border-green-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 w-full sm:w-auto shadow-sm"
                        title="Hasta Sahibi ile WhatsApp İletişimi"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Bildirimi</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-20 text-muted flex flex-col items-center gap-3">
                <Calendar className="w-12 h-12 text-card-border" />
                <span className="text-sm">Kriterlere uygun planlanmış randevunuz bulunmuyor.</span>
              </div>
            )}
          </div>

          {/* Quick Schedule Grid Sidebar */}
          <div className="lg:col-span-4 bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-6 flex flex-col h-fit">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-4">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Haftalık Doluluk Paneli</span>
            </h3>

            <div className="space-y-4">
              {next7DaysList().map((day) => {
                const dayApps = appointments.filter(a => a.doctorId === selectedDoctor.id && a.date === day.dateStr);
                const isSun = day.dayName === "Paz";
                
                return (
                  <div key={day.dateStr} className="flex items-center justify-between p-3 rounded-xl border border-card-border/60 bg-[#FAF9F6]">
                    <div>
                      <p className="text-xs font-bold text-primary">{day.label}</p>
                      <p className="text-[10px] text-muted uppercase font-bold tracking-wider">{day.dayName}</p>
                    </div>
                    <div>
                      {isSun ? (
                        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100">KAPALI</span>
                      ) : dayApps.length > 0 ? (
                        <span className="bg-accent/15 text-accent border border-accent/20 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {dayApps.length} Randevu
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          Müsait
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
