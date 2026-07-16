"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  Phone, 
  Calendar, 
  Activity, 
  ClipboardCheck, 
  FileText, 
  User, 
  Award, 
  ArrowLeft,
  Search,
  Lock,
  Download,
  AlertTriangle,
  PawPrint,
  Clock,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface LabFile {
  name: string;
  url: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  doctorName: string;
  paymentStatus: string;
  amount: number;
  files: LabFile[];
}

interface Vaccine {
  name: string;
  lastDate: string;
  dueDate: string;
  status: string;
}

interface BoardingInfo {
  status: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  foodRoutine: string;
  notes: string;
}

interface Patient {
  id: string;
  ownerName: string;
  phone: string;
  petName: string;
  petType: string;
  breed: string;
  age: string;
  weight: string;
  allergies: string;
  medicalHistory: MedicalRecord[];
  vaccinations: Vaccine[];
  boarding: BoardingInfo;
}

export default function PetPassportPortal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPet, setSelectedPet] = useState<Patient | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setSearchAttempted(false);
    setSelectedPet(null);

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const res = await fetch(`/api/patients?phone=${cleanedPhone}`);
      const data = await res.json();

      if (res.ok) {
        setPatients(data);
        if (data.length === 1) {
          setSelectedPet(data[0]);
        }
        setSearchAttempted(true);
      } else {
        setErrorMsg(data.error || "Randevu sorgulanırken hata oluştu.");
      }
    } catch (err) {
      setErrorMsg("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      
      {/* Container */}
      <div className="max-w-4xl w-full mx-auto space-y-8 flex-grow">
        
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
              <PawPrint className="w-6 h-6 text-accent fill-accent" />
            </div>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-3">Dijital Evcil Hayvan Karnesi</h1>
          <p className="text-muted text-sm max-w-md mx-auto">
            Dostlarımızın aşı geçmişini, muayene raporlarını, tahlil sonuçlarını ve güncel otel durumlarını inceleyin.
          </p>
        </div>

        {/* --- LOGIN OR SEARCH PAGE --- */}
        {!selectedPet && (
          <div className="max-w-md w-full mx-auto bg-white border border-card-border rounded-3xl p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/15 text-accent rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary">Kimlik Doğrulama</h2>
              <p className="text-xs text-muted">Kayıtlı olduğunuz 10 haneli telefon numaranızı girin.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Telefon Numarası</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="örn: 5551234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-background border border-card-border pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Karneyi Görüntüle</span>
              </button>
            </form>

            {/* List Results if multiple pets found */}
            {searchAttempted && patients.length > 0 && (
              <div className="border-t border-card-border pt-6 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Kayıtlı Hayvanlarınız:</p>
                <div className="grid grid-cols-1 gap-2">
                  {patients.map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => setSelectedPet(pat)}
                      className="w-full border border-card-border hover:border-primary/20 hover:bg-primary/[0.02] p-4 rounded-2xl flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-bold text-primary">
                          🐾
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-sm capitalize">{pat.petName}</h4>
                          <p className="text-xs text-muted capitalize">{pat.petType} • {pat.breed}</p>
                        </div>
                      </div>
                      <span className="text-xs text-accent font-semibold group-hover:underline">Seç &gt;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchAttempted && patients.length === 0 && (
              <div className="bg-amber-50 text-amber-800 border border-amber-100 p-4 rounded-xl text-xs leading-relaxed space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kayıt Bulunamadı</span>
                </div>
                <p>Girdiğiniz telefon numarasına kayıtlı bir evcil hayvan bulunamadı. Lütfen klinikle iletişime geçiniz.</p>
              </div>
            )}
          </div>
        )}

        {/* --- PORTAL PASSPORT VIEW --- */}
        {selectedPet && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Navigation back */}
            <div className="flex justify-between items-center">
              {patients.length > 1 ? (
                <button
                  onClick={() => setSelectedPet(null)}
                  className="flex items-center gap-1.5 text-muted hover:text-primary font-bold text-xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Evcil Hayvan Seçimine Dön</span>
                </button>
              ) : (
                <button
                  onClick={() => { setSelectedPet(null); setPatients([]); setSearchAttempted(false); }}
                  className="flex items-center gap-1.5 text-muted hover:text-primary font-bold text-xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Giriş Ekranına Dön</span>
                </button>
              )}
              
              <span className="bg-accent/15 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                Pasaport ID: {selectedPet.id}
              </span>
            </div>

            {/* Pet Passport Card */}
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0F2928]/5 rounded-full blur-3xl -z-10"></div>
              
              {/* Profile Sidebar */}
              <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 border-b md:border-b-0 md:border-r border-card-border pb-6 md:pb-0 md:pr-6">
                <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-lg text-4xl relative overflow-hidden group">
                  <span className="group-hover:scale-110 transition-transform duration-300">🐾</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-primary capitalize">{selectedPet.petName}</h2>
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider mt-1">{selectedPet.petType} • {selectedPet.breed}</p>
                </div>

                <div className="w-full space-y-2 pt-4 border-t border-card-border/60 text-left text-xs font-medium text-muted">
                  <div className="flex justify-between py-1 border-b border-card-border/40">
                    <span className="text-primary font-bold">Hasta Sahibi:</span>
                    <span className="capitalize">{selectedPet.ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-card-border/40">
                    <span className="text-primary font-bold">Dostumuzun Yaşı:</span>
                    <span>{selectedPet.age} Yaş</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-card-border/40">
                    <span className="text-primary font-bold">Ağırlık (Kilo):</span>
                    <span>{selectedPet.weight} kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-card-border/40 text-red-600 font-bold">
                    <span>Alerji Durumu:</span>
                    <span>{selectedPet.allergies}</span>
                  </div>
                </div>

                {/* Live Boarding status banner */}
                {selectedPet.boarding && selectedPet.boarding.status === "active" && (
                  <div className="w-full bg-[#FAF6F0] border-2 border-dashed border-accent/50 rounded-2xl p-4 text-left space-y-2 animate-pulse mt-4">
                    <div className="flex items-center gap-1.5 text-accent font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Şu An Otelde Konaklıyor</span>
                    </div>
                    <div className="text-[10px] text-muted space-y-0.5 font-medium">
                      <p><span className="font-bold text-primary">Kafes/Oda:</span> {selectedPet.boarding.roomNumber}</p>
                      <p><span className="font-bold text-primary">Giriş Tarihi:</span> {selectedPet.boarding.checkIn}</p>
                      <p><span className="font-bold text-primary">Tahmini Çıkış:</span> {selectedPet.boarding.checkOut}</p>
                      <p><span className="font-bold text-primary">Mama Rutini:</span> {selectedPet.boarding.foodRoutine}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-8 space-y-8">
                
                {/* 1. VACCINES CARNESI */}
                {selectedPet.vaccinations && selectedPet.vaccinations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-accent" />
                      <span>Aşı Takip Takvimi</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPet.vaccinations.map((vac, idx) => (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all ${
                            vac.status === 'completed' 
                              ? 'bg-green-50/40 border-green-100 text-green-800' 
                              : 'bg-amber-50/30 border-amber-100 text-amber-800'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-xs uppercase tracking-wider text-primary">{vac.name}</p>
                            <p className="text-[10px] text-muted mt-1">
                              Son Aşı: <span className="font-semibold font-mono">{vac.lastDate || "-"}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            {vac.status === 'completed' ? (
                              <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Tamamlandı</span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Planlandı</span>
                            )}
                            <p className="text-[10px] text-muted mt-1">
                              Gerekli Tarih: <span className="font-semibold font-mono text-accent">{vac.dueDate}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MEDICAL HISTORY */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-accent" />
                    <span>Geçmiş Tedaviler & Raporlar</span>
                  </h3>

                  {selectedPet.medicalHistory && selectedPet.medicalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPet.medicalHistory.map((rec) => (
                        <div key={rec.id} className="border border-card-border rounded-2xl p-5 space-y-4 hover:border-primary/20 hover:shadow-md transition-all text-left">
                          
                          {/* Top Row Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-card-border/40 pb-3">
                            <div>
                              <h4 className="font-bold text-primary capitalize text-sm">{rec.diagnosis}</h4>
                              <p className="text-[10px] text-muted font-mono mt-0.5">Muayene Tarihi: {rec.date}</p>
                            </div>
                            <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-lg font-semibold capitalize">
                              Hekim: {rec.doctorName}
                            </span>
                          </div>

                          {/* Info Rows */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                            <div className="space-y-1">
                              <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Uygulanan Tedavi</span>
                              <p className="text-primary font-normal leading-relaxed">{rec.treatment}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Reçete & İlaçlar</span>
                              <p className="text-primary font-normal leading-relaxed">{rec.prescription || "Yazılmadı"}</p>
                            </div>
                          </div>

                          {/* Lab attachments if any */}
                          {rec.files && rec.files.length > 0 && (
                            <div className="border-t border-card-border/40 pt-3 space-y-2">
                              <span className="text-[10px] text-muted uppercase tracking-wider font-bold flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Tahlil & Görüntüleme Sonuçları</span>
                              </span>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {rec.files.map((file, fIdx) => (
                                  <a
                                    key={fIdx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-background border border-card-border hover:border-primary/20 hover:bg-muted-light px-3.5 py-2 rounded-xl text-xs text-primary transition-all shadow-inner font-semibold"
                                  >
                                    <Download className="w-3.5 h-3.5 text-accent" />
                                    <span>{file.name}</span>
                                    <ExternalLink className="w-3 h-3 text-muted/60" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-background/30 border border-dashed border-card-border rounded-2xl text-muted text-xs">
                      Dostumuz adına kayıtlı muayene geçmişi bulunmuyor.
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer copyright */}
      <div className="text-center pt-8 border-t border-card-border/60 text-xs text-muted font-medium mt-16 max-w-4xl w-full mx-auto">
        <p>© {new Date().getFullYear()} Patiler Veteriner Kliniği. Dostlarımızın Sağlık Portalı.</p>
        <Link href="/" className="text-accent hover:underline mt-1 inline-block font-semibold">Ana Sayfaya Dön</Link>
      </div>

    </div>
  );
}
