"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Dog, 
  Cat, 
  Phone, 
  RefreshCw, 
  Search, 
  Trash2, 
  CheckCircle,
  Inbox,
  LayoutDashboard,
  Settings,
  Briefcase,
  Users,
  Save,
  MapPin,
  Mail,
  Clock,
  Type
} from "lucide-react";
import { ClinicSettings, ServiceItem, DoctorItem } from "@/lib/settings";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  pet: string;
  service: string;
  datetime: string;
  createdAt: string;
}

export default function AdminDashboard() {
  // Tabs: "appointments" | "general" | "services" | "doctors"
  const [activeTab, setActiveTab] = useState<"appointments" | "general" | "services" | "doctors">("appointments");
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [petFilter, setPetFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch appointments
      const appointRes = await fetch("/api/appointments");
      if (appointRes.ok) {
        const data = await appointRes.json();
        const sorted = data.sort((a: Appointment, b: Appointment) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAppointments(sorted);
      }

      // Fetch settings
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (id: string, actionType: "completed" | "delete") => {
    if (actionType === "completed") {
      showStatus("Randevu tamamlandı/arandı olarak işaretlendi (Simülasyon).");
      setAppointments(prev => prev.filter(app => app.id !== id));
    } else {
      showStatus("Randevu başarıyla silindi (Simülasyon).");
      setAppointments(prev => prev.filter(app => app.id !== id));
    }
  };

  const showStatus = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (res.ok) {
        showStatus("Site ayarları başarıyla güncellendi! Ön yüz ve AI Chatbot güncel bilgileri kullanacaktır.");
      } else {
        throw new Error(data.error || "Ayarlar kaydedilemedi.");
      }
    } catch (err: any) {
      showStatus(err.message || "Kaydederken bir hata oluştu.", true);
    } finally {
      setSaving(false);
    }
  };

  // General Settings Input Change
  const handleGeneralChange = (key: keyof ClinicSettings, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: value
    });
  };

  // Services Settings Input Change
  const handleFeaturedServiceChange = (idx: number, key: keyof import("@/lib/settings").FeaturedServiceItem, value: any) => {
    if (!settings) return;
    const updatedServices = [...(settings.featuredServices || [])];
    updatedServices[idx] = {
      ...updatedServices[idx],
      [key]: value
    };
    setSettings({
      ...settings,
      featuredServices: updatedServices
    });
  };

  // Doctors Settings Input Change
  const handleDoctorChange = (idx: number, key: keyof DoctorItem, value: string) => {
    if (!settings) return;
    const updatedDoctors = [...settings.doctors];
    updatedDoctors[idx] = {
      ...updatedDoctors[idx],
      [key]: value
    };
    setSettings({
      ...settings,
      doctors: updatedDoctors
    });
  };

  // Filter & Search appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      app.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const petType = app.pet.toLowerCase();
    let matchesPet = true;
    if (petFilter === "kedi") {
      matchesPet = petType.includes("kedi");
    } else if (petFilter === "kopek") {
      matchesPet = petType.includes("köpek") || petType.includes("kopek");
    } else if (petFilter === "diger") {
      matchesPet = !petType.includes("kedi") && !petType.includes("köpek") && !petType.includes("kopek");
    }

    return matchesSearch && matchesPet;
  });

  const totalCount = appointments.length;
  const kediCount = appointments.filter(app => app.pet.toLowerCase().includes("kedi")).length;
  const kopekCount = appointments.filter(app => app.pet.toLowerCase().includes("köpek") || app.pet.toLowerCase().includes("kopek")).length;
  const otherCount = totalCount - kediCount - kopekCount;

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Dashboard Banner */}
        <div className="bg-primary text-white p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl">
              <LayoutDashboard className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-sans font-bold tracking-tight">Klinik Yönetim Paneli</h1>
              <p className="text-white/80 text-sm">Site içerikleri, fiyat listesi, kadro ve randevu yönetim ekranı</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50 relative z-10 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Verileri Yenile</span>
          </button>
        </div>

        {/* Status Toast Notifications */}
        {statusMessage && (
          <div className="bg-secondary/15 border border-secondary text-primary font-medium p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle className="w-5 h-5 text-accent" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-medium p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in shadow-sm">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="border-b border-card-border flex overflow-x-auto gap-6 text-sm">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-4 font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "appointments" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Randevu Talepleri ({totalCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-4 font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "general" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Klinik & Genel Ayarlar</span>
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-4 font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "services" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Hizmetler & Ücretler</span>
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`pb-4 font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "doctors" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Hekim Kadrosu</span>
          </button>
        </div>

        {/* TAB CONTENT: 1. APPOINTMENTS LIST */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            {/* Metric widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-card-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Toplam Randevu</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-mono mt-1">{totalCount}</h3>
                </div>
                <div className="bg-primary/10 text-primary p-3 rounded-xl">
                  <Inbox className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-card-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Kedi Talebi</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-mono mt-1">{kediCount}</h3>
                </div>
                <div className="bg-accent/15 text-accent p-3 rounded-xl">
                  <Cat className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-card-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Köpek Talebi</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-mono mt-1">{kopekCount}</h3>
                </div>
                <div className="bg-secondary/35 text-primary p-3 rounded-xl">
                  <Dog className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-card-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Diğer Hayvanlar</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-mono mt-1">{otherCount}</h3>
                </div>
                <div className="bg-[#FAF6F0] text-muted p-3 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter and Table */}
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:max-w-md relative">
                <div className="absolute inset-y-0 left-4 pl-0.5 flex items-center pointer-events-none text-muted">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Müşteri adı, telefon veya işlem ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-card-border pl-11 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {["all", "kedi", "kopek", "diger"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPetFilter(filter)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                      petFilter === filter
                        ? "bg-primary border-primary text-white"
                        : "bg-background border-card-border text-muted hover:bg-muted-light"
                    }`}
                  >
                    {filter === "all" ? "Tümü" : filter === "kopek" ? "Köpek" : filter === "diger" ? "Diğer" : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-card-border rounded-3xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center text-muted">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                  <span>Randevular yükleniyor...</span>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-card-border text-xs sm:text-sm text-left">
                    <thead className="bg-[#FAF6F0] text-primary font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-4">Müşteri Detayı</th>
                        <th className="px-6 py-4">Hayvan Türü</th>
                        <th className="px-6 py-4">İşlem / Hizmet</th>
                        <th className="px-6 py-4">İstenen Zaman</th>
                        <th className="px-6 py-4">Talep Tarihi</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border bg-white text-muted">
                      {filteredAppointments.map((app) => (
                        <tr key={app.id} className="hover:bg-background/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-primary">{app.name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted mt-1">
                              <Phone className="w-3.5 h-3.5 text-accent" />
                              <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                            </div>
                          </td>
                          <td className="px-6 py-4 capitalize font-medium">{app.pet}</td>
                          <td className="px-6 py-4 font-semibold text-primary">{app.service}</td>
                          <td className="px-6 py-4 font-medium text-accent">{app.datetime}</td>
                          <td className="px-6 py-4 text-xs">
                            {new Date(app.createdAt).toLocaleDateString("tr-TR")} - {new Date(app.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleAction(app.id, "completed")}
                              title="Arandı ve Onaylandı"
                              className="bg-secondary/20 hover:bg-secondary/40 text-primary p-2 rounded-lg transition-colors inline-flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleAction(app.id, "delete")}
                              title="İsteği Sil"
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors inline-flex items-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center text-muted flex flex-col items-center gap-3">
                  <Calendar className="w-12 h-12 text-card-border" />
                  <span>Henüz alınmış bir randevu isteği bulunmuyor.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. GENERAL SETTINGS FORM */}
        {activeTab === "general" && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-card-border rounded-3xl p-8 shadow-sm space-y-8 text-left">
            <h3 className="text-xl font-bold text-primary border-b border-card-border pb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              <span>Klinik Detayları & Slogan Ayarları</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  <span>Klinik Adı</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.clinicName}
                  onChange={(e) => handleGeneralChange("clinicName", e.target.value)}
                  className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>İletişim / Acil Telefon</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => handleGeneralChange("phone", e.target.value)}
                  className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-Posta Adresi</span>
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => handleGeneralChange("email", e.target.value)}
                  className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Çalışma Saatleri</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.workingHours}
                  onChange={(e) => handleGeneralChange("workingHours", e.target.value)}
                  className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Klinik Adresi</span>
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => handleGeneralChange("address", e.target.value)}
                className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="border-t border-card-border/60 pt-6 space-y-6">
              <h4 className="font-bold text-sm text-accent">Ön Yüz Sloganları & Tanıtım Alanları</h4>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase">Hero Bölümü Başlığı</label>
                <input
                  type="text"
                  required
                  value={settings.heroTitle}
                  onChange={(e) => handleGeneralChange("heroTitle", e.target.value)}
                  className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase">Hero Alt Yazısı</label>
                <textarea
                  rows={3}
                  required
                  value={settings.heroSub}
                  onChange={(e) => handleGeneralChange("heroSub", e.target.value)}
                  className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase">Klinik Hikayesi (Giriş Paragrafı)</label>
                  <textarea
                    rows={4}
                    required
                    value={settings.aboutText1}
                    onChange={(e) => handleGeneralChange("aboutText1", e.target.value)}
                    className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase">Klinik Hikayesi (Gelişme Paragrafı)</label>
                  <textarea
                    rows={4}
                    required
                    value={settings.aboutText2}
                    onChange={(e) => handleGeneralChange("aboutText2", e.target.value)}
                    className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-card-border/60 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase text-accent">Klinik Misyonu</label>
                  <textarea
                    rows={3}
                    required
                    value={settings.aboutMission}
                    onChange={(e) => handleGeneralChange("aboutMission", e.target.value)}
                    className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none font-medium text-primary"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase text-accent">Klinik Vizyonu</label>
                  <textarea
                    rows={3}
                    required
                    value={settings.aboutVision}
                    onChange={(e) => handleGeneralChange("aboutVision", e.target.value)}
                    className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none font-medium text-primary"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Genel Ayarları Kaydet</span>
            </button>
          </form>
        )}

        {/* TAB CONTENT: 3. SERVICES & PRICING EDITOR */}
        {activeTab === "services" && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-card-border rounded-3xl p-8 shadow-sm space-y-8 text-left">
            <h3 className="text-xl font-bold text-primary border-b border-card-border pb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <span>Hizmetler ve Fiyat Listesi Yönetimi</span>
            </h3>

            <div className="space-y-8 divide-y divide-card-border/80">
              {settings.featuredServices?.map((service, idx) => (
                <div key={service.id} className={`${idx > 0 ? 'pt-8' : ''} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-primary text-base flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-mono">{idx + 1}</span>
                      <span>{service.title || "Yeni Hizmet"}</span>
                    </h4>
                    <span className="text-xs text-muted font-bold font-mono uppercase bg-background px-2.5 py-1 rounded border border-card-border">ID: {service.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Hizmet Başlığı</label>
                      <input
                        type="text"
                        required
                        value={service.title}
                        onChange={(e) => handleFeaturedServiceChange(idx, "title", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase text-accent">Fiyat Aralığı</label>
                      <input
                        type="text"
                        required
                        value={service.price}
                        onChange={(e) => handleFeaturedServiceChange(idx, "price", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-bold text-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase">Kısa Açıklama</label>
                    <textarea
                      rows={2}
                      required
                      value={service.description}
                      onChange={(e) => handleFeaturedServiceChange(idx, "description", e.target.value)}
                      className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase">Hizmet Detayları (Virgülle ayırarak girin)</label>
                    <input
                      type="text"
                      required
                      value={service.details ? service.details.join(", ") : ""}
                      onChange={(e) => handleFeaturedServiceChange(idx, "details", e.target.value.split(",").map(val => val.trim()))}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                      placeholder="Muayene maddesi 1, Muayene maddesi 2..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Hizmetleri & Fiyatları Kaydet</span>
            </button>
          </form>
        )}

        {/* TAB CONTENT: 4. DOCTORS / TEAM EDITOR */}
        {activeTab === "doctors" && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-card-border rounded-3xl p-8 shadow-sm space-y-8 text-left">
            <h3 className="text-xl font-bold text-primary border-b border-card-border pb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span>Veteriner Hekim Kadrosu Yönetimi</span>
            </h3>

            <div className="space-y-8 divide-y divide-card-border/80">
              {settings.doctors.map((doctor, idx) => (
                <div key={doctor.id} className={`${idx > 0 ? 'pt-8' : ''} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-primary text-base flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-mono">{idx + 1}</span>
                      <span>{doctor.name || "Yeni Hekim"}</span>
                    </h4>
                    <span className="text-xs text-muted font-bold font-mono uppercase bg-background px-2.5 py-1 rounded border border-card-border">ID: {doctor.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Hekim Adı Soyadı</label>
                      <input
                        type="text"
                        required
                        value={doctor.name}
                        onChange={(e) => handleDoctorChange(idx, "name", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Klinik Rol / Unvan</label>
                      <input
                        type="text"
                        required
                        value={doctor.role}
                        onChange={(e) => handleDoctorChange(idx, "role", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-accent font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary uppercase">Renk (CSS Sınıfı)</label>
                        <input
                          type="text"
                          required
                          value={doctor.color}
                          onChange={(e) => handleDoctorChange(idx, "color", e.target.value)}
                          className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-center font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary uppercase">Baş Harfler (Avatar)</label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          value={doctor.avatarInitials}
                          onChange={(e) => handleDoctorChange(idx, "avatarInitials", e.target.value)}
                          className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-center font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary uppercase">Görsel URL / Yol</label>
                        <input
                          type="text"
                          value={doctor.image || ""}
                          onChange={(e) => handleDoctorChange(idx, "image", e.target.value)}
                          className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-mono"
                          placeholder="/images/doctor.png"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Uzmanlık Alanı</label>
                      <input
                        type="text"
                        required
                        value={doctor.specialty}
                        onChange={(e) => handleDoctorChange(idx, "specialty", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Eğitim / Mezuniyet</label>
                      <input
                        type="text"
                        required
                        value={doctor.edu}
                        onChange={(e) => handleDoctorChange(idx, "edu", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase">Biyografi / Kısa Özgeçmiş</label>
                    <textarea
                      rows={3}
                      required
                      value={doctor.bio}
                      onChange={(e) => handleDoctorChange(idx, "bio", e.target.value)}
                      className="w-full bg-background border border-card-border p-4 rounded-xl text-xs focus:outline-none focus:border-primary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Hekim Kadrosunu Kaydet</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
