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
  Type,
  DollarSign,
  PlusCircle,
  Bed,
  Syringe,
  FileText,
  Upload,
  Eye,
  Activity,
  Download,
  AlertTriangle
} from "lucide-react";
import { ClinicSettings, ServiceItem, DoctorItem } from "@/lib/settings";

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

export default function AdminDashboard() {
  // Tabs: "appointments" | "calendar" | "patients" | "boarding" | "finance" | "vaccines" | "general" | "services" | "doctors"
  const [activeTab, setActiveTab] = useState<"appointments" | "calendar" | "patients" | "boarding" | "finance" | "vaccines" | "general" | "services" | "doctors">("appointments");
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [petFilter, setPetFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Calendar & Manual Appointment States
  const [selectedCalendarDoc, setSelectedCalendarDoc] = useState("ahmet");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualDoctorId, setManualDoctorId] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualPet, setManualPet] = useState("");
  const [manualService, setManualService] = useState("");

  // EMR States
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientPetName, setPatientPetName] = useState("");
  const [patientPetType, setPatientPetType] = useState("");
  const [patientBreed, setPatientBreed] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientWeight, setPatientWeight] = useState("");
  const [patientAllergies, setPatientAllergies] = useState("Yok");

  // Treatment Modal States
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newPrescription, setNewPrescription] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newPaymentStatus, setNewPaymentStatus] = useState("Paid");
  const [newDoctorName, setNewDoctorName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Boarding Modal States
  const [isBoardingModalOpen, setIsBoardingModalOpen] = useState(false);
  const [boardingPatientId, setBoardingPatientId] = useState("");
  const [boardingRoomNumber, setBoardingRoomNumber] = useState("");
  const [boardingCheckIn, setBoardingCheckIn] = useState("");
  const [boardingCheckOut, setBoardingCheckOut] = useState("");
  const [boardingFoodRoutine, setBoardingFoodRoutine] = useState("");
  const [boardingNotes, setBoardingNotes] = useState("");

  // Vaccine Modal States
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDueDate, setNewVaccineDueDate] = useState("");

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

      // Fetch patients
      const patientsRes = await fetch("/api/patients");
      if (patientsRes.ok) {
        const data = await patientsRes.json();
        setPatients(data);
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

  const handleAction = async (id: string, actionType: "completed" | "delete") => {
    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        if (actionType === "completed") {
          showStatus("Randevu tamamlandı ve arşivlendi.");
        } else {
          showStatus("Randevu başarıyla silindi.");
        }
        fetchData();
      } else {
        showStatus(data.error || "İşlem gerçekleştirilemedi.", true);
      }
    } catch (err) {
      showStatus("Sunucu hatası oluştu.", true);
    }
  };

  const handleCreateManualAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDoctorId || !manualDate || !manualTime || !manualName || !manualPhone || !manualPet || !manualService) {
      showStatus("Lütfen tüm alanları doldurun.", true);
      return;
    }

    try {
      const weekdays = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
      const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
      const d = new Date(manualDate);
      const dayName = weekdays[d.getDay()];
      const monthName = months[d.getMonth()];
      const datetime = `${d.getDate()} ${monthName} ${dayName.toUpperCase()} saat ${manualTime}`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: manualName,
          phone: manualPhone,
          pet: manualPet,
          service: manualService,
          datetime,
          doctorId: manualDoctorId,
          date: manualDate,
          time: manualTime
        })
      });

      const data = await res.json();
      if (res.ok) {
        showStatus("Randevu başarıyla eklendi.");
        setIsManualModalOpen(false);
        setManualName("");
        setManualPhone("");
        setManualPet("");
        setManualService("");
        fetchData();
        
        // Notify doctor via WhatsApp automatically
        const doctor = settings?.doctors.find(doc => doc.id === manualDoctorId);
        if (doctor) {
          sendWhatsAppNotification(data.data, doctor);
        }
      } else {
        showStatus(data.error || "Randevu eklenemedi.", true);
      }
    } catch (err) {
      showStatus("Randevu kaydedilirken hata oluştu.", true);
    }
  };

  const sendWhatsAppNotification = (app: any, doctor: DoctorItem) => {
    const text = `Merhaba ${doctor.name}, yeni bir randevunuz bulunmaktadır:\n\n` +
      `- Hasta Yakını: ${app.name}\n` +
      `- İletişim Tel: ${app.phone}\n` +
      `- Evcil Dostumuz: ${app.pet}\n` +
      `- İşlem/Hizmet: ${app.service}\n` +
      `- Tarih/Saat: ${app.datetime}\n\n` +
      `İyi çalışmalar dileriz.`;
    const url = `https://wa.me/${doctor.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !patientPetName || !patientPetType) {
      showStatus("Lütfen gerekli alanları doldurun.", true);
      return;
    }

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: patientName,
          phone: patientPhone,
          petName: patientPetName,
          petType: patientPetType,
          breed: patientBreed,
          age: patientAge,
          weight: patientWeight,
          allergies: patientAllergies,
          id: selectedPatientId || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        showStatus(selectedPatientId ? "Hasta profili güncellendi." : "Hasta profili oluşturuldu.");
        setIsPatientModalOpen(false);
        setPatientName("");
        setPatientPhone("");
        setPatientPetName("");
        setPatientPetType("");
        setPatientBreed("");
        setPatientAge("");
        setPatientWeight("");
        setPatientAllergies("Yok");
        setSelectedPatientId(null);
        fetchData();
      } else {
        showStatus(data.error || "Hasta profili kaydedilemedi.", true);
      }
    } catch (err) {
      showStatus("Hasta profili kaydedilirken hata oluştu.", true);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm("Bu hasta profilini ve tüm tıbbi geçmişini silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/patients?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showStatus("Hasta kaydı başarıyla silindi.");
        setSelectedPatientId(null);
        fetchData();
      } else {
        showStatus("Hasta kaydı silinemedi.", true);
      }
    } catch (err) {
      showStatus("Bağlantı hatası oluştu.", true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedFiles(prev => [...prev, { name: data.name, url: data.url }]);
        showStatus("Dosya başarıyla yüklendi.");
      } else {
        showStatus(data.error || "Dosya yüklenemedi.", true);
      }
    } catch (err) {
      showStatus("Dosya yüklenirken bağlantı hatası oluştu.", true);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newDiagnosis || !newTreatment) {
      showStatus("Teşhis ve Tedavi alanları zorunludur.", true);
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const newRecord: MedicalRecord = {
      id: "med_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      prescription: newPrescription,
      doctorName: newDoctorName || settings?.doctors[0]?.name || "Belirtilmedi",
      paymentStatus: newPaymentStatus,
      amount: Number(newAmount) || 0,
      files: uploadedFiles
    };

    const updatedHistory = [...(patient.medicalHistory || []), newRecord];

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patient,
          medicalHistory: updatedHistory
        })
      });

      if (res.ok) {
        showStatus("Tıbbi muayene raporu hasta kartına eklendi.");
        setIsTreatmentModalOpen(false);
        setNewDiagnosis("");
        setNewTreatment("");
        setNewPrescription("");
        setNewAmount(0);
        setNewPaymentStatus("Paid");
        setUploadedFiles([]);
        fetchData();
      } else {
        showStatus("Tıbbi rapor eklenemedi.", true);
      }
    } catch (err) {
      showStatus("Rapor kaydedilirken hata oluştu.", true);
    }
  };

  const handleCreateVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newVaccineName || !newVaccineDueDate) {
      showStatus("Aşı adı ve tarih alanları zorunludur.", true);
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const newVac: Vaccine = {
      name: newVaccineName,
      lastDate: new Date().toISOString().split("T")[0],
      dueDate: newVaccineDueDate,
      status: "pending"
    };

    const updatedVaccines = [...(patient.vaccinations || []), newVac];

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patient,
          vaccinations: updatedVaccines
        })
      });

      if (res.ok) {
        showStatus("Aşı takvimi başarıyla güncellendi.");
        setIsVaccineModalOpen(false);
        setNewVaccineName("");
        setNewVaccineDueDate("");
        fetchData();
      } else {
        showStatus("Aşı eklenemedi.", true);
      }
    } catch (err) {
      showStatus("Aşı kaydedilirken hata oluştu.", true);
    }
  };

  const handleBoardingCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardingPatientId || !boardingRoomNumber || !boardingCheckIn || !boardingCheckOut) {
      showStatus("Lütfen zorunlu alanları doldurun.", true);
      return;
    }

    const patient = patients.find(p => p.id === boardingPatientId);
    if (!patient) return;

    const boarding: BoardingInfo = {
      status: "active",
      roomNumber: boardingRoomNumber,
      checkIn: boardingCheckIn,
      checkOut: boardingCheckOut,
      foodRoutine: boardingFoodRoutine,
      notes: boardingNotes
    };

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patient,
          boarding
        })
      });

      if (res.ok) {
        showStatus("Konaklama kaydı başarıyla oluşturuldu.");
        setIsBoardingModalOpen(false);
        setBoardingPatientId("");
        setBoardingRoomNumber("");
        setBoardingCheckIn("");
        setBoardingCheckOut("");
        setBoardingFoodRoutine("");
        setBoardingNotes("");
        fetchData();
      } else {
        showStatus("Konaklama kaydı oluşturulamadı.", true);
      }
    } catch (err) {
      showStatus("Konaklama kaydedilirken hata oluştu.", true);
    }
  };

  const handleBoardingCheckOut = async (patientId: string) => {
    if (!confirm("Bu evcil hayvanın otel çıkışını yapmak ve odayı boşaltmak istediğinize emin misiniz?")) return;
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const boarding: BoardingInfo = {
      status: "none",
      roomNumber: "",
      checkIn: "",
      checkOut: "",
      foodRoutine: "",
      notes: ""
    };

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patient,
          boarding
        })
      });

      if (res.ok) {
        showStatus("Otel çıkış işlemi başarıyla yapıldı.");
        fetchData();
      } else {
        showStatus("Çıkış işlemi kaydedilemedi.", true);
      }
    } catch (err) {
      showStatus("İşlem sırasında hata oluştu.", true);
    }
  };

  const sendVaccineAlertWhatsApp = (patient: Patient, vaccine: Vaccine) => {
    const text = `Merhaba ${patient.ownerName},\n\n` +
      `Kliniğimizde kayıtlı can dostumuz ${patient.petName}'in ${vaccine.name} aşısının zamanı gelmiştir (Son Tarih: ${vaccine.dueDate}).\n\n` +
      `Sistem üzerinden veya bizi arayarak kolayca randevu alabilirsiniz. İyi günler dileriz.`;
    const url = `https://wa.me/${formatPhoneForWhatsApp(patient.phone)}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const formatPhoneForWhatsApp = (phoneStr: string) => {
    let clean = phoneStr.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "90" + clean.substring(1);
    } else if (!clean.startsWith("90") && clean.length === 10) {
      clean = "90" + clean;
    }
    return clean;
  };

  const getNext7Days = () => {
    const days = [];
    const weekdays = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      days.push({
        dateStr,
        dayLabel: `${d.getDate()} ${months[d.getMonth()]}`,
        dayName: weekdays[d.getDay()],
        isSunday: d.getDay() === 0
      });
    }
    return days;
  };

  const getHours = () => {
    return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
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
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
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

        {/* Sidebar & Content Layout wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 bg-white lg:border border-card-border lg:p-5 rounded-3xl lg:shadow-sm space-y-2 sticky lg:top-6">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-1.5 p-2 lg:p-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "appointments" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Inbox className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Randevu Talepleri ({totalCount})</span>
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "calendar" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Calendar className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hekim Çalışma Takvimi</span>
              </button>
              <button
                onClick={() => setActiveTab("patients")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "patients" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Activity className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hasta Kartları (EMR)</span>
              </button>
              <button
                onClick={() => setActiveTab("boarding")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "boarding" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Bed className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Pet Oteli</span>
              </button>
              <button
                onClick={() => setActiveTab("finance")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "finance" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <DollarSign className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Finans Takip</span>
              </button>
              <button
                onClick={() => setActiveTab("vaccines")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "vaccines" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Syringe className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Aşı Takip</span>
              </button>
              <button
                onClick={() => setActiveTab("general")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "general" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Settings className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Klinik & Genel Ayarlar</span>
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "services" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Briefcase className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hizmetler & Ücretler</span>
              </button>
              <button
                onClick={() => setActiveTab("doctors")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full lg:text-left ${
                  activeTab === "doctors" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background lg:bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-card-border lg:border-transparent"
                }`}
              >
                <Users className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hekim Kadrosu</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="lg:col-span-9 space-y-6">

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
                        <th className="px-6 py-4">Hekim</th>
                        <th className="px-6 py-4">İstenen Zaman</th>
                        <th className="px-6 py-4">Talep Tarihi</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border bg-white text-muted">
                      {filteredAppointments.map((app) => {
                        const doctor = settings?.doctors.find(d => d.id === (app as any).doctorId);
                        return (
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
                            <td className="px-6 py-4 font-medium">
                              <span className="bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                                {doctor ? doctor.name : "Belirtilmedi"}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-accent">{app.datetime}</td>
                            <td className="px-6 py-4 text-xs">
                              {new Date(app.createdAt).toLocaleDateString("tr-TR")} - {new Date(app.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                {doctor && (
                                  <button
                                    onClick={() => sendWhatsAppNotification(app, doctor)}
                                    title="Hekime WhatsApp Gönder"
                                    className="bg-green-50 hover:bg-green-100 text-green-600 p-2.5 rounded-lg transition-colors inline-flex items-center"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleAction(app.id, "completed")}
                                  title="Arandı ve Onaylandı"
                                  className="bg-secondary/20 hover:bg-secondary/40 text-primary p-2.5 rounded-lg transition-colors inline-flex items-center"
                                >
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                </button>
                                <button
                                  onClick={() => handleAction(app.id, "delete")}
                                  title="İsteği Sil"
                                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-lg transition-colors inline-flex items-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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

        {/* TAB CONTENT: 2. DOCTOR WORK CALENDAR */}
        {activeTab === "calendar" && settings && (
          <div className="space-y-6">
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span>Hekim Randevu Takvimi</span>
                </h3>
                <p className="text-muted text-xs mt-1">Hekimlerimizin 7 günlük doluluk durumlarını inceleyin ve manuel randevu ekleyin.</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-primary uppercase whitespace-nowrap">Hekim Seçin:</label>
                <select
                  value={selectedCalendarDoc}
                  onChange={(e) => setSelectedCalendarDoc(e.target.value)}
                  className="bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all text-primary"
                >
                  {settings.doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border border-card-border rounded-3xl p-6 shadow-sm overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Grid Header (Days) */}
                <div className="grid grid-cols-10 border-b border-card-border pb-4">
                  <div className="col-span-1 flex items-center justify-center font-bold text-xs text-primary uppercase tracking-wider bg-[#FAF6F0] rounded-xl py-2">
                    Saat
                  </div>
                  {getNext7Days().map((day) => (
                    <div
                      key={day.dateStr}
                      className={`col-span-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center ${
                        day.isSunday ? 'bg-red-50 text-red-600' : 'text-primary'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{day.dayName}</span>
                      <span className="text-xs font-extrabold mt-0.5">{day.dayLabel}</span>
                    </div>
                  ))}
                  <div className="col-span-2"></div>
                </div>

                {/* Grid Body (Hours) */}
                <div className="divide-y divide-card-border/60">
                  {getHours().map((hour) => (
                    <div key={hour} className="grid grid-cols-10 py-3.5 items-center">
                      <div className="col-span-1 text-center font-bold text-xs text-muted font-mono">
                        {hour}
                      </div>
                      
                      {getNext7Days().map((day) => {
                        const app = appointments.find(a => a.doctorId === selectedCalendarDoc && a.date === day.dateStr && a.time === hour);
                        const isSunday = day.isSunday;

                        if (isSunday) {
                          return (
                            <div key={day.dateStr} className="col-span-1 px-1 flex justify-center text-center">
                              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider bg-red-50/50 px-2 py-1 rounded">Kapalı</span>
                            </div>
                          );
                        }

                        if (app) {
                          const doc = settings.doctors.find(d => d.id === selectedCalendarDoc);
                          return (
                            <div key={day.dateStr} className="col-span-1 px-1.5">
                              <div className="bg-primary/5 border border-primary/15 rounded-xl p-2.5 space-y-1 shadow-sm text-left group relative hover:border-accent transition-all">
                                <div className="font-bold text-[11px] text-primary truncate leading-tight capitalize" title={app.name}>
                                  {app.name}
                                </div>
                                <div className="text-[9px] text-muted font-medium truncate uppercase leading-none mt-1" title={app.service}>
                                  {app.service}
                                </div>
                                <div className="text-[9px] text-accent font-bold truncate leading-none mt-1 capitalize">
                                  🐾 {app.pet}
                                </div>
                                <div className="flex items-center justify-between border-t border-card-border/40 pt-1.5 mt-1.5">
                                  {doc && (
                                    <button
                                      onClick={() => sendWhatsAppNotification(app, doc)}
                                      title="Hekime Bildir"
                                      className="text-green-600 hover:text-green-800 transition-colors p-0.5 rounded hover:bg-green-50"
                                    >
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleAction(app.id, "delete")}
                                    title="Sil"
                                    className="text-red-500 hover:text-red-700 transition-colors p-0.5 rounded hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={day.dateStr} className="col-span-1 px-1 flex justify-center">
                            <button
                              onClick={() => {
                                setManualDoctorId(selectedCalendarDoc);
                                setManualDate(day.dateStr);
                                setManualTime(hour);
                                setIsManualModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-full border border-dashed border-card-border hover:border-accent hover:bg-accent/5 flex items-center justify-center text-muted hover:text-accent transition-all active:scale-90"
                              title="Randevu Ekle"
                            >
                              <span className="text-sm font-bold">+</span>
                            </button>
                          </div>
                        );
                      })}
                      <div className="col-span-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TAB CONTENT: PATIENTS (EMR) MANAGEMENT */}
        {activeTab === "patients" && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span>Hasta Kartları & Tıbbi Geçmiş (EMR)</span>
                </h3>
                <p className="text-muted text-xs mt-1">Hastalarınızın profillerini arayın, tıbbi geçmişlerini inceleyin ve tedavi ekleyin.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPatientId(null);
                  setPatientName("");
                  setPatientPhone("");
                  setPatientPetName("");
                  setPatientPetType("");
                  setPatientBreed("");
                  setPatientAge("");
                  setPatientWeight("");
                  setPatientAllergies("Yok");
                  setIsPatientModalOpen(true);
                }}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-accent" />
                <span>Yeni Hasta Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: Search & Patients List */}
              <div className="lg:col-span-4 bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Hasta veya sahip adı ile ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-card-border pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-medium"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {patients
                    .filter(p => 
                      p.petName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.phone.includes(searchQuery)
                    )
                    .map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setSelectedPatientId(pat.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                          selectedPatientId === pat.id 
                            ? 'bg-primary/5 border-primary/20 text-primary shadow-inner' 
                            : 'bg-background/20 border-card-border hover:border-primary/20 hover:bg-primary/[0.01]'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-sm capitalize">{pat.petName}</h4>
                          <p className="text-[10px] text-muted capitalize mt-0.5">{pat.petType} • {pat.breed}</p>
                          <p className="text-[10px] font-semibold text-primary/70 mt-1 capitalize">Sahibi: {pat.ownerName}</p>
                        </div>
                        <span className="text-[10px] text-accent font-bold group-hover:underline">Detay &gt;</span>
                      </button>
                    ))}
                  {patients.length === 0 && (
                    <div className="text-center py-8 text-muted text-xs">Hasta kaydı bulunamadı.</div>
                  )}
                </div>
              </div>

              {/* Right Side: EMR Details */}
              <div className="lg:col-span-8 space-y-6">
                {selectedPatientId ? (
                  (() => {
                    const pat = patients.find(p => p.id === selectedPatientId);
                    if (!pat) return <div className="bg-white border border-card-border rounded-3xl p-8 text-center text-muted text-sm shadow-sm">Hasta bulunamadı.</div>;
                    
                    return (
                      <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                        {/* Patient Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/60 pb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold shadow-md">
                              🐾
                            </div>
                            <div>
                              <h3 className="text-2xl font-extrabold text-primary capitalize">{pat.petName}</h3>
                              <p className="text-xs text-accent font-bold uppercase tracking-wider mt-0.5">{pat.petType} • {pat.breed}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setPatientName(pat.ownerName);
                                setPatientPhone(pat.phone);
                                setPatientPetName(pat.petName);
                                setPatientPetType(pat.petType);
                                setPatientBreed(pat.breed);
                                setPatientAge(pat.age);
                                setPatientWeight(pat.weight);
                                setPatientAllergies(pat.allergies);
                                setIsPatientModalOpen(true);
                              }}
                              className="border border-card-border hover:border-primary/20 hover:bg-muted-light text-primary px-3 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95"
                            >
                              Profili Düzenle
                            </button>
                            <button
                              onClick={() => handleDeletePatient(pat.id)}
                              className="border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 px-3 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95"
                            >
                              Profili Sil
                            </button>
                          </div>
                        </div>

                        {/* Pet Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/30 border border-card-border p-4 rounded-2xl text-xs font-semibold text-muted">
                          <div className="space-y-1">
                            <p className="opacity-60 uppercase text-[9px] tracking-wider font-bold">Hasta Yakını (Sahibi)</p>
                            <p className="text-primary text-sm capitalize">{pat.ownerName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="opacity-60 uppercase text-[9px] tracking-wider font-bold">Telefon</p>
                            <p className="text-primary text-sm font-mono">{pat.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="opacity-60 uppercase text-[9px] tracking-wider font-bold">Yaş / Ağırlık</p>
                            <p className="text-primary text-sm">{pat.age} Yaş / {pat.weight} kg</p>
                          </div>
                          <div className="space-y-1 text-red-600 font-bold">
                            <p className="opacity-60 uppercase text-[9px] tracking-wider font-bold">Alerjiler</p>
                            <p className="text-sm">{pat.allergies}</p>
                          </div>
                        </div>

                        {/* Otel konaklama durumu */}
                        {pat.boarding && pat.boarding.status === "active" && (
                          <div className="bg-[#FAF6F0] border border-accent/30 rounded-2xl p-4 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-accent font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5" />
                                <span>Pet Otelinde Konaklıyor</span>
                              </p>
                              <p className="text-xs text-primary font-semibold">
                                {pat.boarding.roomNumber} no'lu odada. Giriş: {pat.boarding.checkIn} - Çıkış: {pat.boarding.checkOut}
                              </p>
                            </div>
                            <button
                              onClick={() => handleBoardingCheckOut(pat.id)}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                            >
                              Oda Boşalt
                            </button>
                          </div>
                        )}

                        {/* Medical history list */}
                        <div className="space-y-4 pt-4">
                          <div className="flex justify-between items-center border-b border-card-border/60 pb-3">
                            <h4 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-accent" />
                              <span>Geçmiş Tedavi & Muayeneleri</span>
                            </h4>
                            <button
                              onClick={() => {
                                setUploadedFiles([]);
                                setIsTreatmentModalOpen(true);
                              }}
                              className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-xl font-bold text-[10px] shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-accent" />
                              <span>Muayene Ekle</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {pat.medicalHistory && pat.medicalHistory.length > 0 ? (
                              pat.medicalHistory.map((rec) => (
                                <div key={rec.id} className="border border-card-border/80 rounded-2xl p-4 space-y-3 hover:border-primary/10 transition-all bg-background/5 text-xs">
                                  <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
                                    <div>
                                      <p className="font-bold text-primary capitalize text-sm">{rec.diagnosis}</p>
                                      <p className="text-[10px] text-muted font-mono mt-0.5">{rec.date} • Hekim: {rec.doctorName}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-bold text-primary font-mono">{rec.amount} TL</span>
                                      <div className="mt-0.5">
                                        {rec.paymentStatus === "Paid" ? (
                                          <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Ödendi</span>
                                        ) : rec.paymentStatus === "Partial" ? (
                                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Kısmi Ödeme</span>
                                        ) : (
                                          <span className="bg-red-50 text-red-700 border border-red-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Ödenmedi</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-muted">
                                    <div className="space-y-0.5">
                                      <span className="text-[9px] uppercase tracking-wider opacity-60">Tedavi</span>
                                      <p className="text-primary font-normal">{rec.treatment}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[9px] uppercase tracking-wider opacity-60">Reçete</span>
                                      <p className="text-primary font-normal">{rec.prescription || "Yazılmadı"}</p>
                                    </div>
                                  </div>

                                  {rec.files && rec.files.length > 0 && (
                                    <div className="border-t border-card-border/30 pt-2 space-y-1.5">
                                      <span className="text-[9px] uppercase tracking-wider font-bold text-muted opacity-60 flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        <span>Raporlar & Laboratuvar Sonuçları</span>
                                      </span>
                                      <div className="flex flex-wrap gap-2">
                                        {rec.files.map((file, fIdx) => (
                                          <a
                                            key={fIdx}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 bg-white border border-card-border hover:border-primary/20 px-2 py-1 rounded-lg text-[10px] text-primary transition-all shadow-inner font-semibold"
                                          >
                                            <Download className="w-3 h-3 text-accent" />
                                            <span>{file.name}</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 text-muted text-xs border border-dashed border-card-border rounded-2xl">Muayene geçmişi bulunmuyor.</div>
                            )}
                          </div>
                        </div>

                        {/* Vaccinations timeline */}
                        <div className="space-y-4 pt-4 border-t border-card-border/60">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-1.5">
                              <Syringe className="w-4 h-4 text-accent" />
                              <span>Aşı Takvimi & Planlaması</span>
                            </h4>
                            <button
                              onClick={() => setIsVaccineModalOpen(true)}
                              className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-xl font-bold text-[10px] shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-accent" />
                              <span>Aşı Planı Ekle</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {pat.vaccinations && pat.vaccinations.length > 0 ? (
                              pat.vaccinations.map((vac, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl border border-card-border/80 bg-background/5 text-xs flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-primary uppercase tracking-wider">{vac.name}</p>
                                    <p className="text-[9px] text-muted mt-0.5">Son Aşı: {vac.lastDate || "-"}</p>
                                  </div>
                                  <div className="text-right">
                                    {vac.status === "completed" ? (
                                      <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Tamamlandı</span>
                                    ) : (
                                      <button
                                        onClick={async () => {
                                          const updated = pat.vaccinations.map((v, i) => i === idx ? { ...v, status: "completed", lastDate: new Date().toISOString().split("T")[0] } : v);
                                          const res = await fetch("/api/patients", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ ...pat, vaccinations: updated })
                                          });
                                          if (res.ok) {
                                            showStatus("Aşı tamamlandı olarak işaretlendi.");
                                            fetchData();
                                          }
                                        }}
                                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-all"
                                      >
                                        Planlandı (Yapıldı)
                                      </button>
                                    )}
                                    <p className="text-[9px] text-accent font-bold mt-1">Gerekli Tarih: {vac.dueDate}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 text-center py-6 text-muted text-xs border border-dashed border-card-border rounded-2xl">Aşı planı bulunmuyor.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white border border-card-border rounded-3xl p-16 text-center text-muted text-xs shadow-sm flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center text-2xl">
                      🐾
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary">Hasta Seçilmedi</p>
                      <p className="mt-1">Detaylı tıbbi geçmişi, aşı takvimini ve otel durumunu incelemek için sol taraftaki listeden bir hasta seçin.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PET BOARDING (PET OTELİ) */}
        {activeTab === "boarding" && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Bed className="w-5 h-5 text-accent" />
                  <span>Pet Oteli & Konaklama Yönetimi</span>
                </h3>
                <p className="text-muted text-xs mt-1">Kafes ve konaklama alanlarının doluluk durumunu takip edin, yeni check-in girişleri yapın.</p>
              </div>
              <button
                onClick={() => {
                  setBoardingPatientId("");
                  setBoardingRoomNumber("");
                  setBoardingCheckIn(new Date().toISOString().split("T")[0]);
                  setBoardingCheckOut("");
                  setBoardingFoodRoutine("");
                  setBoardingNotes("");
                  setIsBoardingModalOpen(true);
                }}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-accent" />
                <span>Otele Giriş Yap (Check-in)</span>
              </button>
            </div>

            {/* Visual Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {["Kafes 1", "Kafes 2", "Kafes 3", "Kafes 4", "Kafes 5", "Oda A", "Oda B", "Oda C"].map((room) => {
                const resident = patients.find(p => p.boarding && p.boarding.status === "active" && p.boarding.roomNumber === room);

                return (
                  <div 
                    key={room} 
                    className={`border rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[180px] transition-all ${
                      resident 
                        ? 'bg-amber-50/20 border-accent/30' 
                        : 'bg-white border-card-border hover:border-primary/20 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-2">
                        <span className="text-xs font-extrabold text-primary uppercase tracking-wider">{room}</span>
                        {resident ? (
                          <span className="bg-accent/15 text-accent text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Dolu</span>
                        ) : (
                          <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Boş</span>
                        )}
                      </div>

                      {resident ? (
                        <div className="mt-3 space-y-1.5 text-xs text-muted font-medium text-left">
                          <h4 className="font-extrabold text-primary text-sm capitalize">{resident.petName} <span className="font-normal text-[10px] text-muted capitalize">({resident.petType})</span></h4>
                          <p className="text-[10px] font-semibold text-primary/70 capitalize">Sahibi: {resident.ownerName}</p>
                          <p className="text-[10px]">Giriş: <span className="font-semibold font-mono text-primary">{resident.boarding.checkIn}</span></p>
                          <p className="text-[10px]">Çıkış: <span className="font-semibold font-mono text-accent">{resident.boarding.checkOut}</span></p>
                        </div>
                      ) : (
                        <div className="mt-8 text-center text-[10px] text-muted font-medium">
                          Konaklayan bulunmuyor.
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-card-border/20 mt-4">
                      {resident ? (
                        <button
                          onClick={() => handleBoardingCheckOut(resident.id)}
                          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95"
                        >
                          Çıkış Yap / Boşalt
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setBoardingRoomNumber(room);
                            setBoardingCheckIn(new Date().toISOString().split("T")[0]);
                            setBoardingCheckOut("");
                            setBoardingFoodRoutine("");
                            setBoardingNotes("");
                            setIsBoardingModalOpen(true);
                          }}
                          className="w-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95"
                        >
                          Check-in Yap
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB CONTENT: CLINIC BILLING & FINANCE (FİNANS TAKİP) */}
        {activeTab === "finance" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <span>Klinik Kasa & Finans Takip Paneli</span>
              </h3>
              <p className="text-muted text-xs mt-1">Muayenelerden elde edilen ciroyu, bekleyen alacak bakiyelerini ve ödeme geçmişini yönetin.</p>
            </div>

            {/* Financial summary metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Tahsil Edilen Ciro (Ödendi)</p>
                  <h3 className="text-3xl font-extrabold text-primary font-mono mt-1">
                    {patients.reduce((acc, p) => {
                      const paidSum = (p.medicalHistory || [])
                        .filter(m => m.paymentStatus === "Paid")
                        .reduce((sum, m) => sum + m.amount, 0);
                      const partialSum = (p.medicalHistory || [])
                        .filter(m => m.paymentStatus === "Partial")
                        .reduce((sum, m) => sum + (m.amount / 2), 0);
                      return acc + paidSum + partialSum;
                    }, 0)} TL
                  </h3>
                  <p className="text-[10px] text-muted mt-2">Kısmi ödemelerin yarısı ciroya dahil edilmiştir.</p>
                </div>
                <div className="bg-green-50 text-green-600 border border-green-200 p-4 rounded-xl">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>

              <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Bekleyen Alacaklar (Ödenmedi)</p>
                  <h3 className="text-3xl font-extrabold text-red-600 font-mono mt-1">
                    {patients.reduce((acc, p) => {
                      const unpaidSum = (p.medicalHistory || [])
                        .filter(m => m.paymentStatus === "Unpaid")
                        .reduce((sum, m) => sum + m.amount, 0);
                      const partialSum = (p.medicalHistory || [])
                        .filter(m => m.paymentStatus === "Partial")
                        .reduce((sum, m) => sum + (m.amount / 2), 0);
                      return acc + unpaidSum + partialSum;
                    }, 0)} TL
                  </h3>
                  <p className="text-[10px] text-muted mt-2">Ödenmeyen kayıtlar ve kısmi borçların toplamıdır.</p>
                </div>
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Ledger Transactions list */}
            <div className="bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider border-b border-card-border/60 pb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                <span>Kasa Ödeme Defteri (Ledger)</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-muted">
                  <thead>
                    <tr className="border-b border-card-border text-[9px] uppercase tracking-wider font-extrabold text-primary">
                      <th className="py-3 px-4">Tarih</th>
                      <th className="py-3 px-4">Evcil Hayvan / Sahibi</th>
                      <th className="py-3 px-4">Uygulanan Tedavi / Teşhis</th>
                      <th className="py-3 px-4">Tutar (TL)</th>
                      <th className="py-3 px-4">Ödeme Durumu</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/40">
                    {patients.flatMap(pat => 
                      (pat.medicalHistory || []).map(rec => ({
                        patientId: pat.id,
                        petName: pat.petName,
                        ownerName: pat.ownerName,
                        record: rec
                      }))
                    )
                    .sort((a, b) => new Date(b.record.date).getTime() - new Date(a.record.date).getTime())
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-background/10 transition-colors">
                        <td className="py-3.5 px-4 font-mono">{item.record.date}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-primary capitalize">{item.petName}</span>
                          <span className="block text-[10px] text-muted capitalize">Sahibi: {item.ownerName}</span>
                        </td>
                        <td className="py-3.5 px-4 capitalize font-semibold text-primary/80">{item.record.diagnosis}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">{item.record.amount} TL</td>
                        <td className="py-3.5 px-4">
                          {item.record.paymentStatus === "Paid" ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ödendi</span>
                          ) : item.record.paymentStatus === "Partial" ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Kısmi</span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ödenmedi</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {item.record.paymentStatus !== "Paid" && (
                            <button
                              onClick={async () => {
                                const pat = patients.find(p => p.id === item.patientId);
                                if (!pat) return;
                                const updatedHistory = pat.medicalHistory.map(m => m.id === item.record.id ? { ...m, paymentStatus: "Paid" } : m);
                                const res = await fetch("/api/patients", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ ...pat, medicalHistory: updatedHistory })
                                });
                                if (res.ok) {
                                  showStatus("Ödeme başarıyla tahsil edildi.");
                                  fetchData();
                                }
                              }}
                              className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                            >
                              Ödendi İşaretle
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {patients.flatMap(p => p.medicalHistory || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted text-xs">Kasa defterinde işlem bulunmuyor.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: VACCINATION TRACKER & REMINDERS (AŞI TAKİP) */}
        {activeTab === "vaccines" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <Syringe className="w-5 h-5 text-accent" />
                <span>Otomatik Aşı Hatırlatıcı & Takip Sistemi</span>
              </h3>
              <p className="text-muted text-xs mt-1">Süresi yaklaşan veya geçmiş planlı aşıları listeleyin, sahiplerine WhatsApp üzerinden aşı hatırlatma mesajları gönderin.</p>
            </div>

            {/* Alerts List */}
            <div className="bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider border-b border-card-border/60 pb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" />
                <span>Bekleyen Aşı Hatırlatmaları</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-muted">
                  <thead>
                    <tr className="border-b border-card-border text-[9px] uppercase tracking-wider font-extrabold text-primary">
                      <th className="py-3 px-4">Evcil Hayvan / Sahibi</th>
                      <th className="py-3 px-4">İletişim Telefon</th>
                      <th className="py-3 px-4">Planlanan Aşı Adı</th>
                      <th className="py-3 px-4">Son Yapılan Tarih</th>
                      <th className="py-3 px-4">Aşılanma Son Tarihi</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/40">
                    {patients.flatMap(pat => 
                      (pat.vaccinations || [])
                        .filter(v => v.status === "pending")
                        .map(vac => ({
                          patient: pat,
                          vaccine: vac
                        }))
                    )
                    .sort((a, b) => new Date(a.vaccine.dueDate).getTime() - new Date(b.vaccine.dueDate).getTime())
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-background/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-primary capitalize">{item.patient.petName}</span>
                          <span className="block text-[10px] text-muted capitalize">{item.patient.petType} • {item.patient.breed}</span>
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="text-primary font-bold">{item.patient.ownerName}</span>
                          <span className="block text-[10px] text-muted font-mono">{item.patient.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-primary uppercase tracking-wider">{item.vaccine.name}</td>
                        <td className="py-3.5 px-4 font-mono">{item.vaccine.lastDate || "Hiç yapılmadı"}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-accent">{item.vaccine.dueDate}</td>
                        <td className="py-3.5 px-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => sendVaccineAlertWhatsApp(item.patient, item.vaccine)}
                            className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#128C7E] px-3.5 py-1.5 rounded-lg text-[9px] font-bold transition-all active:scale-95 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp Hatırlat</span>
                          </button>
                          <button
                            onClick={async () => {
                              const updated = item.patient.vaccinations.map(v => v.name === item.vaccine.name ? { ...v, status: "completed", lastDate: new Date().toISOString().split("T")[0] } : v);
                              const res = await fetch("/api/patients", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ...item.patient, vaccinations: updated })
                              });
                              if (res.ok) {
                                showStatus("Aşı tamamlandı olarak işaretlendi.");
                                fetchData();
                              }
                            }}
                            className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Yapıldı Olarak Kaydet
                          </button>
                        </td>
                      </tr>
                    ))}
                    {patients.flatMap(p => p.vaccinations || []).filter(v => v.status === "pending").length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted text-xs">Yakın zamanda planlanmış aşı kaydı bulunmuyor.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: HASTA PROFİLİ EKLEME & DÜZENLEME MODAL */}
        {isPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span>{selectedPatientId ? "Hasta Profilini Düzenle" : "Yeni Hasta Kaydı"}</span>
                </h3>
                <p className="text-muted text-xs mt-1">Evcil dostumuz ve hasta yakını için klinik detay kartını doldurun.</p>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Hasta Yakını (Sahibi)</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Ahmet Yılmaz"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">İletişim Telefon</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: 05551234567"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Evcil Hayvan Adı</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Pamuk"
                      value={patientPetName}
                      onChange={(e) => setPatientPetName(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Tür</label>
                    <select
                      value={patientPetType}
                      onChange={(e) => setPatientPetType(e.target.value)}
                      required
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="">Seçiniz...</option>
                      <option value="Kedi">Kedi</option>
                      <option value="Köpek">Köpek</option>
                      <option value="Kuş">Kuş</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Irk / Cins</label>
                    <input
                      type="text"
                      placeholder="örn: Tekir, Golden vb."
                      value={patientBreed}
                      onChange={(e) => setPatientBreed(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Yaş (Yıl)</label>
                    <input
                      type="text"
                      placeholder="örn: 2"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Ağırlık (kg)</label>
                    <input
                      type="text"
                      placeholder="örn: 4.5"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase text-red-600">Bilinen Alerjiler</label>
                  <input
                    type="text"
                    placeholder="örn: Penisilin, Yok vb."
                    value={patientAllergies}
                    onChange={(e) => setPatientAllergies(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsPatientModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: YENİ MUAYENE / TEDAVİ EKLEME MODAL */}
        {isTreatmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span>Yeni Tıbbi Muayene Raporu Ekle</span>
                </h3>
                <p className="text-muted text-xs mt-1">Dostumuz için tıbbi bulguları, reçeteyi, tahlil sonuçlarını ve fatura miktarını girin.</p>
              </div>

              <form onSubmit={handleCreateTreatment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Teşhis / Ön Tanı</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: Kulak Enfeksiyonu, Karma Aşı Tekrarı vb."
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Uygulanan Tedavi</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="örn: Kulak temizlendi, damla damlatıldı."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Reçete & İlaçlar</label>
                  <input
                    type="text"
                    placeholder="örn: Synulox günde 2 kez, Otibiotic damla vb."
                    value={newPrescription}
                    onChange={(e) => setNewPrescription(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Muayene Ücreti (TL)</label>
                    <input
                      type="number"
                      required
                      placeholder="örn: 1000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Ödeme Durumu</label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Paid">Ödendi</option>
                      <option value="Partial">Kısmi Ödeme</option>
                      <option value="Unpaid">Ödenmedi</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Sorumlu Hekim</label>
                    <select
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="">Seçiniz...</option>
                      {settings?.doctors.map((doc) => (
                        <option key={doc.id} value={doc.name}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Laboratory file upload */}
                <div className="space-y-2 border-t border-card-border/60 pt-4">
                  <label className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>Tahlil & Görüntüleme Belgesi Yükle (PDF, Resim)</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                  {uploading && <p className="text-[10px] text-accent animate-pulse font-bold">Dosya yükleniyor, lütfen bekleyin...</p>}
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="text-[9px] font-extrabold text-primary uppercase">Yüklenen Dosyalar:</p>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, fIdx) => (
                          <span key={fIdx} className="bg-primary/5 border border-primary/15 text-primary text-[10px] font-bold px-2 py-1 rounded-lg">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsTreatmentModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Raporu Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: YENİ PLANLI AŞI EKLEME MODAL */}
        {isVaccineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-accent" />
                  <span>Yeni Aşı Planı Oluştur</span>
                </h3>
                <p className="text-muted text-xs mt-1">Dostumuz için aşı türünü ve hedeflenen aşılanma son tarihini girin.</p>
              </div>

              <form onSubmit={handleCreateVaccine} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Aşı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: Kuduz Aşısı, Karma Aşı vb."
                    value={newVaccineName}
                    onChange={(e) => setNewVaccineName(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Hedeflenen Son Tarih</label>
                  <input
                    type="date"
                    required
                    value={newVaccineDueDate}
                    onChange={(e) => setNewVaccineDueDate(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsVaccineModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Aşı Planla
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: OTELE GİRİŞ YAPMA (CHECK-IN) MODAL */}
        {isBoardingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Bed className="w-5 h-5 text-accent" />
                  <span>Pet Oteli Check-in Kaydı</span>
                </h3>
                <p className="text-muted text-xs mt-1">Konaklayacak evcil hayvanı ve oda/kafes seçimini yapın.</p>
              </div>

              <form onSubmit={handleBoardingCheckIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Evcil Hayvan Seçin</label>
                  <select
                    value={boardingPatientId}
                    onChange={(e) => setBoardingPatientId(e.target.value)}
                    required
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="">Seçiniz...</option>
                    {patients.map((pat) => (
                      <option key={pat.id} value={pat.id}>{pat.petName} ({pat.petType} - Sahibi: {pat.ownerName})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Giriş Tarihi</label>
                    <input
                      type="date"
                      required
                      value={boardingCheckIn}
                      onChange={(e) => setBoardingCheckIn(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Çıkış Tarihi (Tahmini)</label>
                    <input
                      type="date"
                      required
                      value={boardingCheckOut}
                      onChange={(e) => setBoardingCheckOut(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Kafes / Konaklama Oda No</label>
                  <select
                    value={boardingRoomNumber}
                    onChange={(e) => setBoardingRoomNumber(e.target.value)}
                    required
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="">Seçiniz...</option>
                    {["Kafes 1", "Kafes 2", "Kafes 3", "Kafes 4", "Kafes 5", "Oda A", "Oda B", "Oda C"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Mama & Beslenme Düzeni</label>
                  <input
                    type="text"
                    placeholder="örn: Günde 2 kez kuru mama, yaş mama vb."
                    value={boardingFoodRoutine}
                    onChange={(e) => setBoardingFoodRoutine(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Özel Notlar</label>
                  <textarea
                    rows={2}
                    placeholder="örn: İlaç saati, hassasiyet notları..."
                    value={boardingNotes}
                    onChange={(e) => setBoardingNotes(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsBoardingModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Check-in Yap
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. GENERAL SETTINGS FORM */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">WhatsApp Telefon (905...)</label>
                      <input
                        type="text"
                        required
                        value={doctor.phone || ""}
                        onChange={(e) => handleDoctorChange(idx, "phone", e.target.value)}
                        className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-mono"
                        placeholder="905551234567"
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

        {/* MANUEL RANDEVU EKLEME MODALI */}
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span>Yeni Randevu Ekle</span>
                </h3>
                <p className="text-muted text-xs mt-1">Belirttiğiniz tarih ve saat için hekime randevu kaydı oluşturun.</p>
              </div>

              <form onSubmit={handleCreateManualAppointment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Tarih</label>
                    <input
                      type="date"
                      required
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Saat</label>
                    <select
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                    >
                      {getHours().map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Hekim</label>
                  <select
                    value={manualDoctorId}
                    onChange={(e) => setManualDoctorId(e.target.value)}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                  >
                    {settings?.doctors?.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Hasta Yakını Adı Soyadı</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: Ahmet Yılmaz"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase">Telefon Numarası</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: 5551234567"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Hayvan Türü</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Kedi, Köpek"
                      value={manualPet}
                      onChange={(e) => setManualPet(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">İşlem / Hizmet</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Genel Muayene, Aşı"
                      value={manualService}
                      onChange={(e) => setManualService(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Randevu Oluştur</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
