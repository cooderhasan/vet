"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Printer,
  FileSpreadsheet,
  Percent,
  Stethoscope,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Bot,
  Sparkles,
  QrCode,
  HeartPulse,
  ClipboardList,
  CheckSquare,
  Layers,
  Plus,
  Minus,
  X
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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  barcode: string;
  quantity: number;
  minAlertLevel: number;
  unit: string;
  price: number;
  expiryDate: string;
}

interface VitalLog {
  id: string;
  date: string;
  time: string;
  temp: string;
  pulse: string;
  respiration: string;
  notes: string;
}

interface TreatmentOrder {
  id: string;
  time: string;
  medication: string;
  dosage: string;
  status: "pending" | "completed";
}

interface InpatientCare {
  status: "none" | "active" | "discharged";
  roomNumber: string;
  checkInDate: string;
  targetDischargeDate: string;
  diagnosis: string;
  vitalLogs: VitalLog[];
  orders: TreatmentOrder[];
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
  inpatient?: InpatientCare;
}

export default function AdminDashboard() {
  // Tabs: "appointments" | "calendar" | "patients" | "boarding" | "finance" | "vaccines" | "reports" | "inventory" | "pos" | "general" | "services" | "doctors"
  const [activeTab, setActiveTab] = useState<"appointments" | "calendar" | "patients" | "boarding" | "finance" | "vaccines" | "reports" | "inventory" | "pos" | "general" | "services" | "doctors">("appointments");
  
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

  // Inventory & POS States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState("Aşı");
  const [invBarcode, setInvBarcode] = useState("");
  const [invQuantity, setInvQuantity] = useState(10);
  const [invMinAlertLevel, setInvMinAlertLevel] = useState(5);
  const [invUnit, setInvUnit] = useState("Adet");
  const [invPrice, setInvPrice] = useState(100);
  const [invExpiryDate, setInvExpiryDate] = useState("2027-12-31");
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("all");

  // POS States
  const [posCart, setPosCart] = useState<{ item: InventoryItem; quantity: number }[]>([]);
  const [posSelectedPatientId, setPosSelectedPatientId] = useState("");
  const [posPaymentMethod, setPosPaymentMethod] = useState<"Nakit" | "Kredi Kartı">("Kredi Kartı");

  // Inpatient & Vital Signs States
  const [isInpatientModalOpen, setIsInpatientModalOpen] = useState(false);
  const [inpatientRoom, setInpatientRoom] = useState("Kafes A-1");
  const [inpatientDiagnosis, setInpatientDiagnosis] = useState("");
  const [newOrderTime, setNewOrderTime] = useState("09:00");
  const [newOrderMed, setNewOrderMed] = useState("");
  const [newOrderDosage, setNewOrderDosage] = useState("1 Doz");
  const [newVitalTemp, setNewVitalTemp] = useState("38.5");
  const [newVitalPulse, setNewVitalPulse] = useState("110");
  const [newVitalNotes, setNewVitalNotes] = useState("Genel durumu stabil");
  const [isAddingVital, setIsAddingVital] = useState(false);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  // E-Reçete Modal State
  const [selectedPrescriptionRecord, setSelectedPrescriptionRecord] = useState<MedicalRecord | null>(null);
  const [prescriptionPatient, setPrescriptionPatient] = useState<Patient | null>(null);

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

      // Fetch inventory
      const invRes = await fetch("/api/inventory");
      if (invRes.ok) {
        const data = await invRes.json();
        setInventory(data);
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

  // 1. AI Diagnostic Assistant
  const handleGenerateAIDiagnosis = () => {
    const query = (newDiagnosis + " " + newTreatment).toLowerCase();
    
    if (query.includes("kırık") || query.includes("bacak") || query.includes("topal") || query.includes("basama") || query.includes("travma") || query.includes("düşme") || query.includes("incin")) {
      setNewDiagnosis("Ortopedik Travma / Bacak Kırığı & Çıkık Şüphesi");
      setNewTreatment("Ortopedik Muayene, Dijital X-Ray (Röntgen) Görüntüleme, Kırık Bölgeye Medikal Atel / Bandaj Uygulaması & Operasyon Hazırlığı");
      setNewPrescription("Meloxicam (Metacam) Ağrı Kesici Enjeksiyon / Şurup 1x1, Cefazol Antibiyotik, Osteo-Flex Kalsiyum Kemik Destek Paste");
      setNewAmount(1450);
      showStatus("🤖 AI Karar Destek: Ortopedik travma & kırık protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else if (query.includes("ateş") || query.includes("kusma") || query.includes("ishal") || query.includes("halsiz")) {
      setNewDiagnosis("Gastroenterit & Viral Enfeksiyon Şüphesi (Panleukopenia / Parvovirus)");
      setNewTreatment("İntravenöz Sıvı Tedavisi (Serum Fizyolojik %0.9 500ml), Geniş Spektrumlu Antibiyotik Enjeksiyonu, Anti-emetik Uygulama");
      setNewPrescription("Synulox 50mg Tablet 2x1, Metpamid Ampul 1x1, Zofran 4mg");
      setNewAmount(850);
      showStatus("🤖 AI Karar Destek: Gastroenterit & viral enfeksiyon protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else if (query.includes("öksürük") || query.includes("hapşırık") || query.includes("burun") || query.includes("göz")) {
      setNewDiagnosis("Üst Solunum Yolu Enfeksiyonu (Kedi Nezlesi / FHV-1 / Calicivirus)");
      setNewTreatment("Nebulizatör Buhar Tedavisi, Göz/Burun Antiseptik Temizliği, Antibiyotik Tedavisi");
      setNewPrescription("Vibramycin Şurup 1x1, Terramycin Göz Merhemi 2x1, L-Lysine Takviye Paste");
      setNewAmount(650);
      showStatus("🤖 AI Karar Destek: Üst solunum yolu enfeksiyonu protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else if (query.includes("kaşıntı") || query.includes("tüy") || query.includes("kızar") || query.includes("dökül")) {
      setNewDiagnosis("Alerjik Dermatit / Mantar (Microsporum canis) Şüphesi");
      setNewTreatment("Tıbbi Antifungal Şampuan Banyosu, Antihistaminik Tedavisi, Dış Parazit Uygulaması");
      setNewPrescription("VetDerm Şampuan 2x/Hafta, İzonazol Sprey 1x1, İç-Dış Parazit Damlası");
      setNewAmount(720);
      showStatus("🤖 AI Karar Destek: Dermatolojik tedavi protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else if (query.includes("diş") || query.includes("tartar") || query.includes("ağız") || query.includes("gingivit")) {
      setNewDiagnosis("Periodontal Diş Taşları & Gingivit Enfeksiyonu");
      setNewTreatment("Ultrasonik Kavitron Cihazı ile Diş Taşı Temizliği (Detertraj), Ağız Antiseptik İlaçlaması");
      setNewPrescription("Stomodeus Ağız Spreyi 2x1, Antiseptik Ağız Çalkalama Solüsyonu");
      setNewAmount(850);
      showStatus("🤖 AI Karar Destek: Diş sağlığı & detertraj protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else if (query.includes("kulak") || query.includes("koku") || query.includes("kaşıma")) {
      setNewDiagnosis("Otitis Externa (Bakteriyel / Mantarsal Kulak Enfeksiyonu)");
      setNewTreatment("Kulak Kanalı Antiseptik Yıkama, Otoskopik Muayene, Tıbbi Kulak Damlası Uygulaması");
      setNewPrescription("Oridermyl Kulak Pomatı 1x1, Surolan Damla 2x1");
      setNewAmount(580);
      showStatus("🤖 AI Karar Destek: Kulak enfeksiyonu protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    } else {
      setNewDiagnosis("Genel Sağlık Muayenesi & Sağlık Taraması");
      setNewTreatment("Fiziksel Muayene (Ateş, Nabız, Solunum, Kulak/Göz Kontrolü), Rutin Bakım");
      setNewPrescription("Genel Multivitamin Macunu, Omega-3 Balık Yağı");
      setNewAmount(450);
      showStatus("🤖 AI Karar Destek: Genel muayene ve bakım protokolü önerildi. (Lütfen hekim kontrolü ile onaylayınız)");
    }
  };

  // 2. Save / Update Inventory Item
  const handleSaveInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName || !invBarcode || invQuantity < 0 || invPrice < 0) {
      showStatus("Lütfen ürün adı, barkod, geçerli miktar ve fiyat girin.", true);
      return;
    }

    const payload = {
      id: editingInvId || undefined,
      name: invName,
      category: invCategory,
      barcode: invBarcode,
      quantity: Number(invQuantity),
      minAlertLevel: Number(invMinAlertLevel),
      unit: invUnit,
      price: Number(invPrice),
      expiryDate: invExpiryDate
    };

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showStatus(editingInvId ? "Ürün stok kartı güncellendi." : "Yeni stok ürünü eklendi.");
        setIsInventoryModalOpen(false);
        setEditingInvId(null);
        setInvName("");
        setInvBarcode("");
        setInvQuantity(10);
        setInvPrice(100);
        fetchData();
      } else {
        showStatus("Stok kaydedilemedi.", true);
      }
    } catch (err) {
      showStatus("Stok kaydedilirken hata oluştu.", true);
    }
  };

  // 3. Delete Inventory Item
  const handleDeleteInventoryItem = async (id: string) => {
    if (!confirm("Bu stok ürününü silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/inventory?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showStatus("Ürün stoktan silindi.");
        fetchData();
      } else {
        showStatus("Ürün silinemedi.", true);
      }
    } catch (err) {
      showStatus("Bağlantı hatası oluştu.", true);
    }
  };

  // 4. POS Checkout Handler
  const handlePOSCheckout = async () => {
    if (posCart.length === 0) {
      showStatus("Sepetiniz boş. Lütfen ürün ekleyin.", true);
      return;
    }

    const totalAmount = posCart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);

    try {
      // Deduct Inventory Stock
      const stockRes = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deduct",
          items: posCart.map(c => ({ id: c.item.id, quantity: c.quantity }))
        })
      });

      // If a patient is selected, append sale to patient medical history as retail purchase
      if (posSelectedPatientId) {
        const patient = patients.find(p => p.id === posSelectedPatientId);
        if (patient) {
          const itemsDesc = posCart.map(c => `${c.quantity}x ${c.item.name}`).join(", ");
          const newRecord: MedicalRecord = {
            id: "pos_" + Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString().split("T")[0],
            diagnosis: "Hızlı Kasa Satışı / Mağaza Ürün Alımı",
            treatment: `Satın Alınan Ürünler: ${itemsDesc}`,
            prescription: `Ödeme Yöntemi: ${posPaymentMethod}`,
            doctorName: "Kasa / Danışma",
            paymentStatus: "Paid",
            amount: totalAmount,
            files: []
          };
          const updatedHistory = [...(patient.medicalHistory || []), newRecord];
          await fetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...patient, medicalHistory: updatedHistory })
          });
        }
      }

      if (stockRes.ok) {
        showStatus(`Satış tamamlandı! ${totalAmount} TL tahsil edildi (${posPaymentMethod}). Stoklar güncellendi.`);
        setPosCart([]);
        setPosSelectedPatientId("");
        fetchData();
      } else {
        showStatus("Satış yapılırken stok güncelleme hatası oluştu.", true);
      }
    } catch (err) {
      showStatus("Satış işlemi sırasında hata oluştu.", true);
    }
  };

  // 5. Inpatient Care Save Handler
  const handleSaveInpatientCare = async (patientId: string, updatedInpatient: InpatientCare) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patient,
          inpatient: updatedInpatient
        })
      });

      if (res.ok) {
        showStatus("Hasta yatış & order takvimi güncellendi.");
        fetchData();
      } else {
        showStatus("Yatış kaydı güncellenemedi.", true);
      }
    } catch (err) {
      showStatus("İşlem hatası oluştu.", true);
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

  const handleDownloadReportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "VETERİNER KLİNİK RAPORU VE ANALİTİK ÖZETİ\n";
    csvContent += `Tarih,${new Date().toLocaleDateString("tr-TR")}\n\n`;

    const allHistory = patients.flatMap(p => p.medicalHistory || []);
    const totalRev = allHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const paidRev = allHistory.filter(h => h.paymentStatus === "Paid").reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const unpaidRev = totalRev - paidRev;

    const allVac = patients.flatMap(p => p.vaccinations || []);
    const completedVac = allVac.filter(v => v.status === "completed").length;
    const pendingVac = allVac.filter(v => v.status === "pending").length;

    csvContent += "METRİK,DEĞER\n";
    csvContent += `Toplam Ciro (TL),${totalRev}\n`;
    csvContent += `Tahsil Edilen (TL),${paidRev}\n`;
    csvContent += `Bekleyen Alacak (TL),${unpaidRev}\n`;
    csvContent += `Kayıtlı Hasta Sayısı,${patients.length}\n`;
    csvContent += `Tamamlanan Aşı Sayısı,${completedVac}\n`;
    csvContent += `Bekleyen Aşı Sayısı,${pendingVac}\n`;
    csvContent += `Toplam Randevu Sayısı,${appointments.length}\n\n`;

    csvContent += "HASTA DETAYLARI VE HARCAMA ÖZETİ\n";
    csvContent += "Hasta Sahibi,Telefon,Pet Adı,Tür,Irk,Toplam Harcama (TL),Aşı Sayısı\n";
    patients.forEach(p => {
      const pSpent = (p.medicalHistory || []).reduce((acc, m) => acc + (m.amount || 0), 0);
      csvContent += `"${p.ownerName}","${p.phone}","${p.petName}","${p.petType}","${p.breed}",${pSpent},${(p.vaccinations || []).length}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Klinik_Analiz_Raporu_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="bg-primary text-white p-5 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="bg-white/10 p-2.5 sm:p-3 rounded-2xl">
              <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 text-accent animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-sans font-bold tracking-tight">Klinik Yönetim Paneli</h1>
              <p className="text-white/80 text-xs sm:text-sm">Site içerikleri, fiyat listesi, kadro ve randevu yönetim ekranı</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2.5 relative z-10 w-full md:w-auto justify-end">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Yenile</span>
            </button>
            <Link 
              href="/"
              className="bg-accent hover:bg-accent/90 text-primary px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <span>Siteye Dön →</span>
            </Link>
          </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 bg-white border border-card-border p-4 lg:p-6 rounded-3xl shadow-sm lg:sticky lg:top-6 space-y-4">
            
            {/* Sidebar Branding (Only on Desktop) */}
            <div className="hidden lg:flex flex-col items-center text-center pb-6 border-b border-card-border mb-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-[18px] flex items-center justify-center text-white shadow-md relative overflow-hidden mb-3">
                <Inbox className="w-7 h-7 text-white" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white" />
              </div>
              <h2 className="font-extrabold text-primary text-[0.95rem] uppercase tracking-wider leading-tight">{settings?.clinicName || "Klinik Yönetim"}</h2>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider mt-0.5">Yönetim Paneli</p>
            </div>

            {/* Mobile Dropdown Select (Visible on Mobile Phones for 1-Tap Switching) */}
            <div className="block lg:hidden space-y-1">
              <label className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">Yönetim Sekmesi Seçin</label>
              <select
                value={activeTab}
                onChange={(e: any) => setActiveTab(e.target.value)}
                className="w-full bg-primary text-white border border-primary font-bold px-4 py-3 rounded-2xl text-xs focus:outline-none shadow-md"
              >
                <option value="appointments">📥 Randevu Talepleri ({totalCount})</option>
                <option value="calendar">📅 Hekim Çalışma Takvimi</option>
                <option value="patients">🩺 Hasta Kartları (EMR)</option>
                <option value="boarding">🛏️ Pet Oteli</option>
                <option value="finance">💰 Finans Takip</option>
                <option value="vaccines">💉 Aşı Takip</option>
                <option value="reports">📈 Raporlama & Analitik</option>
                <option value="inventory">📦 Ürün & İlaç Stok Takibi</option>
                <option value="pos">🛒 Hızlı Kasa (POS)</option>
                <option value="general">⚙️ Klinik & Genel Ayarlar</option>
                <option value="services">💼 Hizmetler & Ücretler</option>
                <option value="doctors">👨‍⚕️ Hekim Kadrosu</option>
              </select>
            </div>

            {/* Navigation Buttons (Desktop & Horizontal Scroll for Tablet) */}
            <div className="hidden lg:flex flex-col gap-1.5 p-0">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "appointments" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Inbox className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Randevu Talepleri ({totalCount})</span>
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "calendar" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Calendar className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hekim Çalışma Takvimi</span>
              </button>
              <button
                onClick={() => setActiveTab("patients")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "patients" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Activity className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Hasta Kartları (EMR)</span>
              </button>
              <button
                onClick={() => setActiveTab("boarding")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "boarding" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Bed className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Pet Oteli</span>
              </button>
              <button
                onClick={() => setActiveTab("finance")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "finance" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <DollarSign className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Finans Takip</span>
              </button>
              <button
                onClick={() => setActiveTab("vaccines")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "vaccines" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Syringe className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Aşı Takip</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "reports" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Raporlama & Analitik</span>
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "inventory" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <Package className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Ürün & İlaç Stok Takibi</span>
                {inventory.filter(i => i.quantity <= i.minAlertLevel).length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-auto animate-pulse">
                    {inventory.filter(i => i.quantity <= i.minAlertLevel).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("pos")}
                className={`font-bold flex items-center gap-3 whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-4 py-3 rounded-xl w-full text-left ${
                  activeTab === "pos" 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-transparent text-muted hover:text-primary hover:bg-primary/5 border border-transparent"
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5 flex-shrink-0 text-amber-400" />
                <span>Hızlı Kasa (POS)</span>
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

            {/* Back to Website Button (Only on Desktop) */}
            <div className="hidden lg:block pt-5 border-t border-card-border mt-6">
              <Link 
                href="/" 
                className="font-bold flex items-center justify-center gap-2 text-xs text-muted hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-xl transition-all w-full text-center border border-card-border bg-background"
              >
                <span>← Siteye Geri Dön</span>
              </Link>
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
                            ? 'bg-primary/5 border-primary/30 text-primary shadow-sm ring-1 ring-primary/20' 
                            : 'bg-background/20 border-card-border hover:border-primary/30 hover:bg-primary/[0.02]'
                        }`}
                      >
                        <div>
                          <h4 className="font-extrabold text-base capitalize text-primary">{pat.petName}</h4>
                          <p className="text-xs font-bold text-muted capitalize mt-0.5">{pat.petType} • {pat.breed}</p>
                          <p className="text-xs font-semibold text-primary/80 mt-1 capitalize">Sahibi: {pat.ownerName}</p>
                        </div>
                        <span className="text-xs text-accent font-extrabold group-hover:underline">Detay &gt;</span>
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shadow-md">
                              🐾
                            </div>
                            <div>
                              <h3 className="text-2xl sm:text-3xl font-black text-primary capitalize">{pat.petName}</h3>
                              <p className="text-xs sm:text-sm text-accent font-extrabold uppercase tracking-wider mt-0.5">{pat.petType} • {pat.breed}</p>
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
                              className="border border-card-border hover:border-primary/20 hover:bg-muted-light text-primary px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                            >
                              Profili Düzenle
                            </button>
                            <button
                              onClick={() => handleDeletePatient(pat.id)}
                              className="border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                              Profili Sil
                            </button>
                          </div>
                        </div>

                        {/* Pet Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/50 border border-card-border p-5 rounded-2xl">
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-primary/70 uppercase tracking-wider">Hasta Yakını (Sahibi)</p>
                            <p className="text-base font-black text-primary capitalize">{pat.ownerName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-primary/70 uppercase tracking-wider">İletişim Telefon</p>
                            <p className="text-base font-black text-primary font-mono">{pat.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-primary/70 uppercase tracking-wider">Yaş / Ağırlık</p>
                            <p className="text-base font-black text-primary">{pat.age} Yaş / {pat.weight} kg</p>
                          </div>
                          <div className="space-y-1 text-red-600 font-bold">
                            <p className="text-xs font-extrabold text-red-700 uppercase tracking-wider">Alerjiler</p>
                            <p className="text-base font-black text-red-600">{pat.allergies}</p>
                          </div>
                        </div>

                        {/* Otel konaklama durumu */}
                        {pat.boarding && pat.boarding.status === "active" && (
                          <div className="bg-[#FAF6F0] border border-accent/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                              <p className="text-accent font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Bed className="w-4 h-4" />
                                <span>Pet Otelinde Konaklıyor</span>
                              </p>
                              <p className="text-sm text-primary font-bold">
                                {pat.boarding.roomNumber} no'lu odada. Giriş: {pat.boarding.checkIn} - Çıkış: {pat.boarding.checkOut}
                              </p>
                            </div>
                            <button
                              onClick={() => handleBoardingCheckOut(pat.id)}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              Oda Boşalt
                            </button>
                          </div>
                        )}

                        {/* YATAN HASTA & ORDER TAKİP CARD */}
                        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b border-purple-200/80 pb-3">
                            <div className="flex items-center gap-2">
                              <HeartPulse className="w-5 h-5 text-purple-600" />
                              <span className="font-black text-purple-950 text-base">Yatan Hasta & Order Takip Sistemi</span>
                            </div>

                            {pat.inpatient && pat.inpatient.status === "active" ? (
                              <button
                                onClick={() => {
                                  const updatedInp: InpatientCare = { ...pat.inpatient!, status: "discharged" };
                                  handleSaveInpatientCare(pat.id, updatedInp);
                                }}
                                className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                              >
                                Taburcu Et
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const initialInp: InpatientCare = {
                                    status: "active",
                                    roomNumber: "Kafes A-1",
                                    checkInDate: new Date().toISOString().split("T")[0],
                                    targetDischargeDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
                                    diagnosis: "Yoğun Bakım & Serum Tedavisi",
                                    orders: [
                                      { id: "ord_1", time: "09:00", medication: "Antibiyotik Enjeksiyon", dosage: "1 Doz", status: "pending" },
                                      { id: "ord_2", time: "14:00", medication: "Serum Fizyolojik %0.9 (500ml)", dosage: "1 Şişe", status: "completed" },
                                      { id: "ord_3", time: "20:00", medication: "Vitamini Desteği", dosage: "2 ml", status: "pending" }
                                    ],
                                    vitalLogs: [
                                      { id: "v_1", date: new Date().toISOString().split("T")[0], time: "08:30", temp: "38.6", pulse: "112", respiration: "24", notes: "Yatış yapıldı, canlılık normal." }
                                    ]
                                  };
                                  handleSaveInpatientCare(pat.id, initialInp);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                              >
                                <PlusCircle className="w-4 h-4" />
                                <span>+ Hastayı Yatışa Al (Order Başlat)</span>
                              </button>
                            )}
                          </div>

                          {pat.inpatient && pat.inpatient.status === "active" ? (
                            <div className="space-y-4 pt-1">
                              <p className="text-xs font-black text-purple-900 font-mono">
                                Oda/Kafes: <span className="bg-purple-100 text-purple-950 px-2.5 py-1 rounded-lg border border-purple-300">{pat.inpatient.roomNumber}</span> • Giriş: {pat.inpatient.checkInDate} • Tahmini Taburcu: {pat.inpatient.targetDischargeDate}
                              </p>

                              {/* Orders List */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-black uppercase tracking-wider text-purple-950 block">Günlük İlaç & Serum Order Takvimi</span>
                                  <button
                                    onClick={() => setIsAddingOrder(!isAddingOrder)}
                                    className="bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-xs font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isAddingOrder ? "Kapat" : "+ Yeni Order Ekle"}</span>
                                  </button>
                                </div>

                                {/* Add Order Form */}
                                {isAddingOrder && (
                                  <div className="bg-white border border-purple-200 p-3 rounded-2xl space-y-3 animate-fade-in shadow-sm">
                                    <span className="text-xs font-black text-purple-900 block">Yeni İlaç/Serum Order Ekle</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        placeholder="Saat (örn: 18:00)"
                                        value={newOrderTime}
                                        onChange={(e) => setNewOrderTime(e.target.value)}
                                        className="bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="İlaç / Serum Adı"
                                        value={newOrderMed}
                                        onChange={(e) => setNewOrderMed(e.target.value)}
                                        className="bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-semibold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Dozaj (örn: 2 ml)"
                                        value={newOrderDosage}
                                        onChange={(e) => setNewOrderDosage(e.target.value)}
                                        className="bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-semibold"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!newOrderMed) return;
                                        const newOrdItem: TreatmentOrder = {
                                          id: "ord_" + Date.now(),
                                          time: newOrderTime || "12:00",
                                          medication: newOrderMed,
                                          dosage: newOrderDosage || "1 Doz",
                                          status: "pending"
                                        };
                                        const updatedInp: InpatientCare = {
                                          ...pat.inpatient!,
                                          orders: [...(pat.inpatient!.orders || []), newOrdItem]
                                        };
                                        handleSaveInpatientCare(pat.id, updatedInp);
                                        setNewOrderMed("");
                                        setIsAddingOrder(false);
                                      }}
                                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                                    >
                                      Order'ı Takvime Ekle
                                    </button>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {pat.inpatient.orders.map((ord, oIdx) => (
                                    <div key={ord.id} className="bg-white border border-purple-200/80 p-3 rounded-2xl flex items-center justify-between shadow-xs">
                                      <div>
                                        <span className="font-black text-primary font-mono text-xs">{ord.time}</span>
                                        <p className="font-bold text-xs text-primary truncate max-w-[120px]">{ord.medication}</p>
                                        <span className="text-xs text-muted font-medium">{ord.dosage}</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const updatedOrders: TreatmentOrder[] = pat.inpatient!.orders.map((o, idx) => oIdx === idx ? { ...o, status: (o.status === "completed" ? "pending" : "completed") as "pending" | "completed" } : o);
                                          handleSaveInpatientCare(pat.id, { ...pat.inpatient!, orders: updatedOrders });
                                        }}
                                        className={`text-xs font-black px-2.5 py-1 rounded-lg border transition-all shadow-2xs ${
                                          ord.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300"
                                        }`}
                                      >
                                        {ord.status === "completed" ? "✓ Yapıldı" : "Bekliyor"}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Vital Signs Logs */}
                              <div className="pt-3 border-t border-purple-200/60 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-black uppercase tracking-wider text-purple-950 block">Son Vital Bulgular (Ateş, Nabız)</span>
                                  <button
                                    onClick={() => setIsAddingVital(!isAddingVital)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-3 py-1 rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isAddingVital ? "Kapat" : "+ Vital Ölçüm Kaydet"}</span>
                                  </button>
                                </div>

                                {/* Add Vital Form */}
                                {isAddingVital && (
                                  <div className="bg-white border border-purple-200 p-3.5 rounded-2xl space-y-3 animate-fade-in shadow-sm">
                                    <span className="text-xs font-black text-purple-900 block">🩺 Yeni Vital Ölçüm Kaydı Girin</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <div className="space-y-0.5">
                                        <label className="text-[10px] font-bold text-muted uppercase">Ateş (°C)</label>
                                        <input
                                          type="text"
                                          placeholder="38.5"
                                          value={newVitalTemp}
                                          onChange={(e) => setNewVitalTemp(e.target.value)}
                                          className="w-full bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
                                        />
                                      </div>
                                      <div className="space-y-0.5">
                                        <label className="text-[10px] font-bold text-muted uppercase">Nabız (bpm)</label>
                                        <input
                                          type="text"
                                          placeholder="110"
                                          value={newVitalPulse}
                                          onChange={(e) => setNewVitalPulse(e.target.value)}
                                          className="w-full bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
                                        />
                                      </div>
                                      <div className="space-y-0.5">
                                        <label className="text-[10px] font-bold text-muted uppercase">Durum Notu</label>
                                        <input
                                          type="text"
                                          placeholder="Canlılık iyi, serum verildi."
                                          value={newVitalNotes}
                                          onChange={(e) => setNewVitalNotes(e.target.value)}
                                          className="w-full bg-background border border-card-border px-3 py-1.5 rounded-xl text-xs font-semibold"
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newLog: VitalLog = {
                                          id: "v_" + Date.now(),
                                          date: new Date().toISOString().split("T")[0],
                                          time: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' }),
                                          temp: newVitalTemp || "38.5",
                                          pulse: newVitalPulse || "110",
                                          respiration: "24",
                                          notes: newVitalNotes || "Ölçüm yapıldı."
                                        };
                                        const updatedInp: InpatientCare = {
                                          ...pat.inpatient!,
                                          vitalLogs: [newLog, ...(pat.inpatient!.vitalLogs || [])]
                                        };
                                        handleSaveInpatientCare(pat.id, updatedInp);
                                        setNewVitalNotes("");
                                        setIsAddingVital(false);
                                      }}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                                    >
                                      ✓ Vital Ölçümü Kaydet
                                    </button>
                                  </div>
                                )}

                                {pat.inpatient.vitalLogs.map((v) => (
                                  <div key={v.id} className="bg-white p-2.5 rounded-xl text-xs font-mono flex items-center justify-between text-primary border border-purple-100 shadow-2xs">
                                    <span>🌡️ Ateş: <strong className="text-purple-900">{v.temp} °C</strong></span>
                                    <span>💓 Nabız: <strong className="text-purple-900">{v.pulse} bpm</strong></span>
                                    <span className="text-muted font-medium truncate max-w-[200px]">{v.notes}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-purple-800">Bu hasta şu anda yatan hasta servisinde değil.</p>
                          )}
                        </div>

                        {/* Medical history list */}
                        <div className="space-y-4 pt-4">
                          <div className="flex justify-between items-center border-b border-card-border pb-3">
                            <h4 className="font-black text-primary text-base uppercase tracking-wider flex items-center gap-2">
                              <Activity className="w-5 h-5 text-accent" />
                              <span>Geçmiş Tedavi & Muayeneleri</span>
                            </h4>
                            <button
                              onClick={() => {
                                setUploadedFiles([]);
                                setIsTreatmentModalOpen(true);
                              }}
                              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <PlusCircle className="w-4 h-4 text-accent" />
                              <span>Muayene Ekle</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {pat.medicalHistory && pat.medicalHistory.length > 0 ? (
                              pat.medicalHistory.map((rec) => (
                                <div key={rec.id} className="border border-card-border/80 rounded-2xl p-5 space-y-4 hover:border-primary/20 transition-all bg-background/5 text-xs shadow-xs">
                                  <div className="flex justify-between items-center border-b border-card-border/40 pb-3">
                                    <div>
                                      <p className="font-black text-primary capitalize text-base">{rec.diagnosis}</p>
                                      <p className="text-xs text-muted font-mono font-bold mt-0.5">{rec.date} • Hekim: {rec.doctorName}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1.5">
                                      <span className="font-black text-primary font-mono text-base">{rec.amount} TL</span>
                                      <div className="flex items-center gap-2">
                                        {rec.paymentStatus === "Paid" ? (
                                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Ödendi</span>
                                        ) : rec.paymentStatus === "Partial" ? (
                                          <span className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Kısmi Ödeme</span>
                                        ) : (
                                          <span className="bg-red-50 text-red-800 border border-red-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Ödenmedi</span>
                                        )}
                                        <button
                                          onClick={() => {
                                            setSelectedPrescriptionRecord(rec);
                                            setPrescriptionPatient(pat);
                                          }}
                                          className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs"
                                        >
                                          <QrCode className="w-3.5 h-3.5 text-purple-600" />
                                          <span>ITS E-Reçete PDF</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                                    <div className="space-y-1">
                                      <span className="text-xs font-extrabold uppercase tracking-wider text-primary/70 block">Uygulanan Tedavi</span>
                                      <p className="text-primary font-semibold text-xs sm:text-sm leading-relaxed">{rec.treatment}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-xs font-extrabold uppercase tracking-wider text-primary/70 block">Reçete & İlaçlar</span>
                                      <p className="text-primary font-semibold text-xs sm:text-sm leading-relaxed">{rec.prescription || "Yazılmadı"}</p>
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
              <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-accent" />
                <span>Klinik Kasa & Finans Takip Paneli</span>
              </h3>
              <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Muayenelerden elde edilen ciroyu, bekleyen alacak bakiyelerini ve ödeme geçmişini yönetin.</p>
            </div>

            {/* Financial summary metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary/80 font-black uppercase tracking-wider">Tahsil Edilen Ciro (Ödendi)</p>
                  <h3 className="text-3xl sm:text-4xl font-black text-primary font-mono mt-1">
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
                  <p className="text-xs text-muted font-bold mt-2">Kısmi ödemelerin yarısı ciroya dahil edilmiştir.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-2xl">
                  <DollarSign className="w-9 h-9" />
                </div>
              </div>

              <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-700 font-black uppercase tracking-wider">Bekleyen Alacaklar (Ödenmedi)</p>
                  <h3 className="text-3xl sm:text-4xl font-black text-red-600 font-mono mt-1">
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
                  <p className="text-xs text-muted font-bold mt-2">Ödenmeyen kayıtlar ve kısmi borçların toplamıdır.</p>
                </div>
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl">
                  <AlertTriangle className="w-9 h-9" />
                </div>
              </div>
            </div>

            {/* Ledger Transactions list */}
            <div className="bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-black text-primary text-base uppercase tracking-wider border-b border-card-border pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <span>Kasa Ödeme Defteri (Ledger)</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-semibold text-primary">
                  <thead>
                    <tr className="border-b border-card-border bg-[#FAF6F0] text-xs uppercase tracking-wider font-black text-primary">
                      <th className="py-4 px-4">Tarih</th>
                      <th className="py-4 px-4">Evcil Hayvan / Sahibi</th>
                      <th className="py-4 px-4">Uygulanan Tedavi / Teşhis</th>
                      <th className="py-4 px-4">Tutar (TL)</th>
                      <th className="py-4 px-4">Ödeme Durumu</th>
                      <th className="py-4 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/60">
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
                      <tr key={idx} className="hover:bg-background/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs sm:text-sm">{item.record.date}</td>
                        <td className="py-4 px-4">
                          <span className="font-black text-primary capitalize text-sm">{item.petName}</span>
                          <span className="block text-xs text-muted font-bold capitalize">Sahibi: {item.ownerName}</span>
                        </td>
                        <td className="py-4 px-4 capitalize font-extrabold text-primary">{item.record.diagnosis}</td>
                        <td className="py-4 px-4 font-mono font-black text-primary text-base">{item.record.amount} TL</td>
                        <td className="py-4 px-4">
                          {item.record.paymentStatus === "Paid" ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Ödendi</span>
                          ) : item.record.paymentStatus === "Partial" ? (
                            <span className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Kısmi</span>
                          ) : (
                            <span className="bg-red-50 text-red-800 border border-red-300 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Ödenmedi</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
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
                              className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-xs"
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
              <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                <Syringe className="w-6 h-6 text-accent" />
                <span>Otomatik Aşı Hatırlatıcı & Takip Sistemi</span>
              </h3>
              <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Süresi yaklaşan veya geçmiş planlı aşıları listeleyin, sahiplerine WhatsApp üzerinden aşı hatırlatma mesajları gönderin.</p>
            </div>

            {/* Alerts List */}
            <div className="bg-white border border-card-border rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-black text-primary text-base uppercase tracking-wider border-b border-card-border pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Bekleyen Aşı Hatırlatmaları</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-semibold text-primary">
                  <thead>
                    <tr className="border-b border-card-border bg-[#FAF6F0] text-xs uppercase tracking-wider font-black text-primary">
                      <th className="py-4 px-4">Evcil Hayvan / Sahibi</th>
                      <th className="py-4 px-4">İletişim Telefon</th>
                      <th className="py-4 px-4">Planlanan Aşı Adı</th>
                      <th className="py-4 px-4">Son Yapılan Tarih</th>
                      <th className="py-4 px-4">Aşılanma Son Tarihi</th>
                      <th className="py-4 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/60">
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
                      <tr key={idx} className="hover:bg-background/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-black text-primary capitalize text-base">{item.patient.petName}</span>
                          <span className="block text-xs font-bold text-muted capitalize">{item.patient.petType} • {item.patient.breed}</span>
                        </td>
                        <td className="py-4 px-4 capitalize">
                          <span className="text-primary font-black text-sm">{item.patient.ownerName}</span>
                          <span className="block text-xs font-mono font-bold text-muted">{item.patient.phone}</span>
                        </td>
                        <td className="py-4 px-4 font-black text-primary text-sm uppercase tracking-wider">{item.vaccine.name}</td>
                        <td className="py-4 px-4 font-mono font-bold text-xs sm:text-sm">{item.vaccine.lastDate || "Hiç yapılmadı"}</td>
                        <td className="py-4 px-4 font-mono font-black text-accent text-sm sm:text-base">{item.vaccine.dueDate}</td>
                        <td className="py-4 px-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => sendVaccineAlertWhatsApp(item.patient, item.vaccine)}
                            className="bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#128C7E] px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
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
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-xs"
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

        {/* TAB 7: RAPORLAMA VE ANALİTİK PANELİ */}
        {activeTab === "reports" && (
          <div className="lg:col-span-9 space-y-8 animate-fade-in print:lg:col-span-12">
            
            {/* Header / Action Bar */}
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <span>Raporlama & Analitik Paneli</span>
                </h3>
                <p className="text-muted text-xs mt-1">Kliniğinize ait gelir, hasta demografisi, aşı takibi ve operasyonel verilerin analitiği.</p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handleDownloadReportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel / CSV İndir</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Yazdır / PDF</span>
                </button>
              </div>
            </div>

            {/* Helper Calculations */}
            {(() => {
              const allHistory = patients.flatMap(p => p.medicalHistory || []);
              const totalRev = allHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0);
              const paidRev = allHistory.filter(h => h.paymentStatus === "Paid").reduce((acc, curr) => acc + (curr.amount || 0), 0);
              const unpaidRev = totalRev - paidRev;

              const allVac = patients.flatMap(p => p.vaccinations || []);
              const completedVac = allVac.filter(v => v.status === "completed").length;
              const pendingVac = allVac.filter(v => v.status === "pending").length;
              const vacRate = allVac.length > 0 ? Math.round((completedVac / allVac.length) * 100) : 0;

              const totalPatients = patients.length;
              const kediCount = patients.filter(p => (p.petType || "").toLowerCase().includes("kedi")).length;
              const kopekCount = patients.filter(p => (p.petType || "").toLowerCase().includes("köpek") || (p.petType || "").toLowerCase().includes("kopek")).length;
              const otherCount = Math.max(0, totalPatients - kediCount - kopekCount);

              const kediPct = totalPatients > 0 ? Math.round((kediCount / totalPatients) * 100) : 0;
              const kopekPct = totalPatients > 0 ? Math.round((kopekCount / totalPatients) * 100) : 0;
              const otherPct = totalPatients > 0 ? Math.max(0, 100 - kediPct - kopekPct) : 0;

              // Doctor Revenue Breakdown
              const doctorStats: Record<string, { total: number; count: number }> = {};
              allHistory.forEach(h => {
                const docName = h.doctorName || "Genel Hekim";
                if (!doctorStats[docName]) doctorStats[docName] = { total: 0, count: 0 };
                doctorStats[docName].total += (h.amount || 0);
                doctorStats[docName].count += 1;
              });

              // Service Demand Breakdown
              const serviceStats: Record<string, number> = {};
              appointments.forEach(app => {
                const sName = app.service || "Diğer Muayene";
                serviceStats[sName] = (serviceStats[sName] || 0) + 1;
              });

              // Top Breeds
              const breedStats: Record<string, number> = {};
              patients.forEach(p => {
                if (p.breed) {
                  breedStats[p.breed] = (breedStats[p.breed] || 0) + 1;
                }
              });
              const sortedBreeds = Object.entries(breedStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

              return (
                <div className="space-y-8">
                  {/* KPI METRICS GRID (5 CARDS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1: Toplam Ciro */}
                    <div className="bg-white border border-card-border p-5 rounded-3xl shadow-sm relative overflow-hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted">Toplam Klinik Cirosu</span>
                        <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-primary font-mono">{totalRev.toLocaleString("tr-TR")} TL</div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Tahsil Edilen: {paidRev.toLocaleString("tr-TR")} TL</span>
                      </div>
                    </div>

                    {/* KPI 2: Bekleyen Alacak */}
                    <div className="bg-white border border-card-border p-5 rounded-3xl shadow-sm relative overflow-hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted">Bekleyen Bakiyeler</span>
                        <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-amber-600 font-mono">{unpaidRev.toLocaleString("tr-TR")} TL</div>
                      <div className="text-[10px] text-muted font-medium">Kısmi veya ödenmemiş muayene ücretleri</div>
                    </div>

                    {/* KPI 3: Kayıtlı Hasta */}
                    <div className="bg-white border border-card-border p-5 rounded-3xl shadow-sm relative overflow-hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted">Kayıtlı Can Dostumuz</span>
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Activity className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-primary font-mono">{totalPatients} Hasta</div>
                      <div className="text-[10px] text-muted font-medium">{kediCount} Kedi • {kopekCount} Köpek • {otherCount} Diğer</div>
                    </div>

                    {/* KPI 4: Aşı Uyum Oranı */}
                    <div className="bg-white border border-card-border p-5 rounded-3xl shadow-sm relative overflow-hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted">Aşı Uyum Başarısı</span>
                        <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                          <Percent className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-purple-600 font-mono">%{vacRate}</div>
                      <div className="text-[10px] text-muted font-medium">{completedVac} Tamamlanan / {allVac.length} Toplam Aşı</div>
                    </div>
                  </div>

                  {/* CHARTS & ANALYTICAL BREAKDOWNS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* CHART 1: Hasta Türü & Irk Dağılımı */}
                    <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm space-y-6">
                      <div className="flex justify-between items-center border-b border-card-border/60 pb-4">
                        <div>
                          <h4 className="font-bold text-primary text-base flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-accent" />
                            <span>Evcil Hayvan Demografisi</span>
                          </h4>
                          <p className="text-muted text-xs mt-0.5">Kliniğinize kayıtlı hastaların tür ve ırk dağılımları.</p>
                        </div>
                        <span className="bg-primary/5 text-primary font-bold text-xs px-3 py-1 rounded-full">{totalPatients} Toplam</span>
                      </div>

                      {/* Species Progress Bars */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-primary">
                            <span className="flex items-center gap-1.5"><Cat className="w-4 h-4 text-amber-500" /> Kedi</span>
                            <span>{kediCount} ({kediPct}%)</span>
                          </div>
                          <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-card-border">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${kediPct}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-primary">
                            <span className="flex items-center gap-1.5"><Dog className="w-4 h-4 text-blue-500" /> Köpek</span>
                            <span>{kopekCount} ({kopekPct}%)</span>
                          </div>
                          <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-card-border">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${kopekPct}%` }}></div>
                          </div>
                        </div>

                        {otherCount > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-primary">
                              <span>Diğer (Kuş/Egzotik)</span>
                              <span>{otherCount} ({otherPct}%)</span>
                            </div>
                            <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-card-border">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${otherPct}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Top 5 Breeds List */}
                      <div className="pt-4 border-t border-card-border/60 space-y-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">En Çok Gelen Irklar / Cinsler</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {sortedBreeds.length > 0 ? (
                            sortedBreeds.map(([bName, bCount], idx) => (
                              <div key={idx} className="bg-background/80 border border-card-border/70 p-2.5 rounded-xl text-center">
                                <span className="block font-bold text-primary text-xs capitalize truncate">{bName}</span>
                                <span className="text-[10px] text-muted font-mono">{bCount} Hasta</span>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-xs text-muted text-center py-2">Irk verisi bulunmuyor.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CHART 2: Hekim Performansı & Hizmet Dağılımı */}
                    <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm space-y-6">
                      <div className="flex justify-between items-center border-b border-card-border/60 pb-4">
                        <div>
                          <h4 className="font-bold text-primary text-base flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            <span>Hekim & Hizmet İstatistikleri</span>
                          </h4>
                          <p className="text-muted text-xs mt-0.5">Veteriner hekimlerin muayene ve hizmet bazlı performans ciro katkıları.</p>
                        </div>
                      </div>

                      {/* Doctor Ciro Breakdown */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">Hekim Bazlı Ciro Dağılımı</span>
                        {Object.keys(doctorStats).length > 0 ? (
                          Object.entries(doctorStats).map(([doc, stat], idx) => {
                            const pct = totalRev > 0 ? Math.round((stat.total / totalRev) * 100) : 0;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold text-primary">
                                  <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-accent" /> {doc}</span>
                                  <span className="font-mono">{stat.total.toLocaleString("tr-TR")} TL ({stat.count} İşlem)</span>
                                </div>
                                <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-card-border">
                                  <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-muted text-center py-4">Henüz tamamlanan muayene veya finansal kayıt bulunmuyor.</div>
                        )}
                      </div>

                      {/* Service Demand */}
                      <div className="pt-4 border-t border-card-border/60 space-y-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">Popüler Klinik Hizmetleri</span>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(serviceStats).map(([sName, count], idx) => (
                            <span key={idx} className="bg-primary/5 border border-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <span>{sName}</span>
                              <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">{count}</span>
                            </span>
                          ))}
                          {Object.keys(serviceStats).length === 0 && (
                            <span className="text-xs text-muted">Henüz randevu talebi bulunmuyor.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY REPORT TABLE */}
                  <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-card-border/60 pb-4">
                      <div>
                        <h4 className="font-bold text-primary text-base flex items-center gap-2">
                          <FileText className="w-5 h-5 text-accent" />
                          <span>Genel Hasta & Finansal Analiz Özet Listesi</span>
                        </h4>
                        <p className="text-muted text-xs mt-0.5">Kliniğinizdeki tüm hastaların harcama, aşı ve randevu dökümü.</p>
                      </div>
                      <span className="text-xs font-bold text-muted font-mono">{patients.length} Hasta Kaydı</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-medium text-muted">
                        <thead>
                          <tr className="border-b border-card-border text-[9px] uppercase tracking-wider font-extrabold text-primary">
                            <th className="py-3 px-4">Hasta Sahibi</th>
                            <th className="py-3 px-4">Evcil Hayvan / Tür</th>
                            <th className="py-3 px-4">Muayene / İşlem</th>
                            <th className="py-3 px-4">Aşı Durumu</th>
                            <th className="py-3 px-4 text-right">Toplam Harcama</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/40 font-mono">
                          {patients.map((pat) => {
                            const pSpent = (pat.medicalHistory || []).reduce((acc, m) => acc + (m.amount || 0), 0);
                            const pVacCount = (pat.vaccinations || []).length;
                            const pVacDone = (pat.vaccinations || []).filter(v => v.status === "completed").length;
                            return (
                              <tr key={pat.id} className="hover:bg-background/10 transition-colors">
                                <td className="py-3.5 px-4 font-bold text-primary capitalize font-sans">
                                  {pat.ownerName}
                                  <span className="block text-[10px] text-muted font-mono">{pat.phone}</span>
                                </td>
                                <td className="py-3.5 px-4 font-sans">
                                  <span className="font-bold text-primary capitalize">{pat.petName}</span>
                                  <span className="block text-[10px] text-muted capitalize">{pat.petType} • {pat.breed}</span>
                                </td>
                                <td className="py-3.5 px-4 font-sans">
                                  <span className="font-bold text-primary">{(pat.medicalHistory || []).length} Muayene</span>
                                </td>
                                <td className="py-3.5 px-4 font-sans">
                                  <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    {pVacDone}/{pVacCount} Tamamlandı
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right font-bold text-primary text-sm">
                                  {pSpent.toLocaleString("tr-TR")} TL
                                </td>
                              </tr>
                            );
                          })}
                          {patients.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-muted text-xs">Henüz hasta kaydı oluşturulmadı.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 8: ÜRÜN VE İLAÇ STOK YÖNETİMİ */}
        {activeTab === "inventory" && (
          <div className="lg:col-span-9 space-y-6 animate-fade-in">
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                  <Package className="w-6 h-6 text-accent" />
                  <span>Ürün & İlaç Stok Yönetimi</span>
                </h3>
                <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Stoktaki aşılar, ilaçlar, mamalar ve tıbbi sarf malzemelerin anlık miktar takibi ve kritik stok uyarıları.</p>
              </div>

              <button
                onClick={() => {
                  setEditingInvId(null);
                  setInvName("");
                  setInvBarcode(Math.floor(1000000000000 + Math.random() * 9000000000000).toString());
                  setInvQuantity(10);
                  setInvPrice(150);
                  setIsInventoryModalOpen(true);
                }}
                className="bg-primary hover:bg-primary-hover text-white px-5 py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md whitespace-nowrap"
              >
                <PlusCircle className="w-5 h-5 text-accent" />
                <span>+ Yeni Stok Ürünü Ekle</span>
              </button>
            </div>

            {/* Low Stock Alert Banner */}
            {inventory.filter(i => i.quantity <= i.minAlertLevel).length > 0 && (
              <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-between animate-pulse shadow-sm">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span><strong>Kritik Stok Uyarısı:</strong> {inventory.filter(i => i.quantity <= i.minAlertLevel).length} ürünün stoku tükenmek üzere veya kritik seviyenin altında!</span>
                </div>
              </div>
            )}

            {/* Search & Category Filter Bar (For Thousands of Medicines) */}
            <div className="bg-white border border-card-border p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:max-w-md relative">
                <div className="absolute inset-y-0 left-4 pl-0.5 flex items-center pointer-events-none text-muted">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  placeholder="Binlerce ilaç arasından arayın (İlaç Adı veya Barkod)..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full bg-background border border-card-border pl-11 pr-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["all", "İlaç", "Aşı", "Mama", "Sarf Malzeme"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInventoryCategoryFilter(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${
                      inventoryCategoryFilter === cat
                        ? "bg-primary border-primary text-white shadow-xs"
                        : "bg-background border-card-border text-muted hover:bg-muted-light"
                    }`}
                  >
                    {cat === "all" ? "Tüm Kategoriler" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-semibold text-primary">
                  <thead>
                    <tr className="border-b border-card-border bg-[#FAF6F0] text-xs uppercase tracking-wider font-black text-primary">
                      <th className="py-4 px-4">Ürün / İlaç Adı</th>
                      <th className="py-4 px-4">Kategori</th>
                      <th className="py-4 px-4">Barkod No</th>
                      <th className="py-4 px-4">Stok Miktarı</th>
                      <th className="py-4 px-4">Birim Fiyat</th>
                      <th className="py-4 px-4">SKT</th>
                      <th className="py-4 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/60 font-mono">
                    {inventory
                      .filter(item => {
                        const matchesSearch = !inventorySearch || 
                          item.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                          item.barcode.includes(inventorySearch);
                        const matchesCat = inventoryCategoryFilter === "all" || item.category === inventoryCategoryFilter;
                        return matchesSearch && matchesCat;
                      })
                      .map((item) => {
                      const isLow = item.quantity <= item.minAlertLevel;
                      return (
                        <tr key={item.id} className="hover:bg-background/40 transition-colors">
                          <td className="py-4 px-4 font-black text-primary font-sans text-sm sm:text-base">
                            {item.name}
                          </td>
                          <td className="py-4 px-4 font-sans">
                            <span className={`text-xs font-black px-3 py-1 rounded-xl ${
                              item.category === "Aşı" ? "bg-purple-50 text-purple-900 border border-purple-300" :
                              item.category === "İlaç" ? "bg-blue-50 text-blue-900 border border-blue-300" :
                              item.category === "Mama" ? "bg-amber-50 text-amber-900 border border-amber-300" :
                              "bg-emerald-50 text-emerald-900 border border-emerald-300"
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-primary">{item.barcode}</td>
                          <td className="py-4 px-4 font-black text-sm">
                            <span className={isLow ? "text-red-600 font-black flex items-center gap-1.5" : "text-emerald-700 font-black"}>
                              {item.quantity} {item.unit}
                              {isLow && <span className="text-xs bg-red-100 border border-red-300 text-red-800 px-2 py-0.5 rounded-md uppercase font-black">KRİTİK</span>}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-black text-primary font-mono text-base">{item.price} TL</td>
                          <td className="py-4 px-4 font-mono font-bold text-primary">{item.expiryDate || "-"}</td>
                          <td className="py-4 px-4 text-right flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingInvId(item.id);
                                setInvName(item.name);
                                setInvCategory(item.category);
                                setInvBarcode(item.barcode);
                                setInvQuantity(item.quantity);
                                setInvMinAlertLevel(item.minAlertLevel);
                                setInvUnit(item.unit);
                                setInvPrice(item.price);
                                setInvExpiryDate(item.expiryDate || "");
                                setIsInventoryModalOpen(true);
                              }}
                              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteInventoryItem(item.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: HIZLI KASA (POS) SATIŞ MODÜLÜ */}
        {activeTab === "pos" && (
          <div className="lg:col-span-9 space-y-6 animate-fade-in">
            <div className="bg-white border border-card-border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-amber-500" />
                  <span>Hızlı Kasa & Tezgah Satış (POS)</span>
                </h3>
                <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Mama, şampuan, parazit damlası ve tezgah ürünlerinin hızlı satışı, stok güncellenmesi ve tahsilat.</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-950 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Package className="w-4 h-4 text-purple-700" />
                  <span>📦 Yeni İlaç / Stok Ekle veya Düzenle</span>
                </button>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-muted block uppercase font-bold">Sepet Toplamı</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {posCart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0).toLocaleString("tr-TR")} TL
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Selection List (8 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-card-border p-4 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-3">Stoktaki Ürünler (Tıklayıp Sepete Ekleyin)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.quantity <= 0) return;
                          setPosCart(prev => {
                            const existing = prev.find(c => c.item.id === item.id);
                            if (existing) {
                              return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
                            }
                            return [...prev, { item, quantity: 1 }];
                          });
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          item.quantity <= 0
                            ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                            : "bg-background hover:bg-white hover:border-primary/40 hover:shadow-md border-card-border"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-primary text-xs">{item.name}</span>
                            <span className="text-[9px] bg-primary/5 text-primary font-bold px-1.5 py-0.5 rounded-full">{item.category}</span>
                          </div>
                          <span className="text-[10px] text-muted block font-mono mt-0.5">Barkod: {item.barcode}</span>
                        </div>
                        <div className="flex justify-between items-end mt-3 pt-2 border-t border-card-border/40 font-mono">
                          <span className="text-xs font-black text-emerald-600">{item.price} TL</span>
                          <span className={`text-[10px] font-bold ${item.quantity <= item.minAlertLevel ? "text-red-600" : "text-muted"}`}>
                            Stok: {item.quantity} {item.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart & Checkout Summary (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-card-border p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-card-border pb-3">
                    <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-accent" />
                      <span>Satış Sepeti ({posCart.reduce((sum, c) => sum + c.quantity, 0)} Ürün)</span>
                    </h4>
                    {posCart.length > 0 && (
                      <button onClick={() => setPosCart([])} className="text-[10px] text-red-600 hover:underline font-bold">Sepeti Temizle</button>
                    )}
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {posCart.map((c, idx) => (
                      <div key={idx} className="bg-background border border-card-border p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div>
                          <p className="font-bold text-primary font-sans">{c.item.name}</p>
                          <p className="text-[10px] text-muted">{c.item.price} TL x {c.quantity} = {c.item.price * c.quantity} TL</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setPosCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
                            }}
                            className="bg-white border border-card-border w-6 h-6 rounded-md font-bold hover:bg-gray-100 flex items-center justify-center text-primary"
                          >
                            -
                          </button>
                          <span className="font-bold text-primary px-1">{c.quantity}</span>
                          <button
                            onClick={() => {
                              setPosCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item));
                            }}
                            className="bg-white border border-card-border w-6 h-6 rounded-md font-bold hover:bg-gray-100 flex items-center justify-center text-primary"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setPosCart(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 ml-1 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {posCart.length === 0 && (
                      <div className="text-center py-10 text-muted text-xs border border-dashed border-card-border rounded-xl">
                        Sepetiniz henüz boş.
                      </div>
                    )}
                  </div>

                  {/* Customer / Patient Selection & Payment */}
                  <div className="space-y-3 pt-4 border-t border-card-border">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary uppercase">Müşteri / Hasta Eşleştir (Opsiyonel)</label>
                      <select
                        value={posSelectedPatientId}
                        onChange={(e) => setPosSelectedPatientId(e.target.value)}
                        className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                      >
                        <option value="">Genel Müşteri (Eşleştirme Yok)</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.ownerName} ({p.petName} - {p.petType})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary uppercase">Ödeme Yöntemi</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPosPaymentMethod("Kredi Kartı")}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            posPaymentMethod === "Kredi Kartı" ? "bg-primary text-white border-primary" : "bg-background text-muted border-card-border"
                          }`}
                        >
                          💳 Kredi Kartı
                        </button>
                        <button
                          type="button"
                          onClick={() => setPosPaymentMethod("Nakit")}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            posPaymentMethod === "Nakit" ? "bg-primary text-white border-primary" : "bg-background text-muted border-card-border"
                          }`}
                        >
                          💵 Nakit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="pt-4 border-t border-card-border space-y-2">
                  <div className="flex justify-between items-center font-bold text-sm text-primary font-mono">
                    <span>Ödenecek Tutar:</span>
                    <span className="text-xl text-emerald-600">{posCart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0).toLocaleString("tr-TR")} TL</span>
                  </div>
                  <button
                    onClick={handlePOSCheckout}
                    disabled={posCart.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Satışı Tamamla & Stoğu Güncelle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: HASTA PROFİLİ EKLEME & DÜZENLEME MODAL */}
        {isPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                  <Activity className="w-6 h-6 text-accent" />
                  <span>{selectedPatientId ? "Hasta Profilini Düzenle" : "Yeni Hasta Kaydı"}</span>
                </h3>
                <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Evcil dostumuz ve hasta yakını için klinik detay kartını doldurun.</p>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Hasta Yakını (Sahibi)</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Ahmet Yılmaz"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">İletişim Telefon</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: 05551234567"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary font-mono placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Evcil Hayvan Adı</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Pamuk"
                      value={patientPetName}
                      onChange={(e) => setPatientPetName(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Tür</label>
                    <select
                      value={patientPetType}
                      onChange={(e) => setPatientPetType(e.target.value)}
                      required
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary focus:outline-none focus:border-primary transition-all shadow-xs"
                    >
                      <option value="">Seçiniz...</option>
                      <option value="Kedi">Kedi</option>
                      <option value="Köpek">Köpek</option>
                      <option value="Kuş">Kuş</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Irk / Cins</label>
                    <input
                      type="text"
                      placeholder="örn: Tekir, Golden vb."
                      value={patientBreed}
                      onChange={(e) => setPatientBreed(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Yaş (Yıl)</label>
                    <input
                      type="text"
                      placeholder="örn: 2"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Ağırlık (kg)</label>
                    <input
                      type="text"
                      placeholder="örn: 4.5"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-red-600 uppercase tracking-wider">Bilinen Alerjiler</label>
                  <input
                    type="text"
                    placeholder="örn: Penisilin, Yok vb."
                    value={patientAllergies}
                    onChange={(e) => setPatientAllergies(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border/60">
                  <button
                    type="button"
                    onClick={() => setIsPatientModalOpen(false)}
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3.5 rounded-xl text-xs sm:text-sm font-extrabold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-xs sm:text-sm font-extrabold active:scale-95 transition-all text-center shadow-md"
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
            <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              
              <div>
                <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                  <Activity className="w-6 h-6 text-accent" />
                  <span>Yeni Tıbbi Muayene Raporu Ekle</span>
                </h3>
                <p className="text-muted-dark font-medium text-xs sm:text-sm mt-1">Dostumuz için tıbbi bulguları, reçeteyi, tahlil sonuçlarını ve fatura miktarını girin.</p>
              </div>

              <form onSubmit={handleCreateTreatment} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Teşhis / Ön Tanı & Semptomlar</label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDiagnosis}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                    >
                      <Bot className="w-4 h-4 text-purple-700" />
                      <span>🤖 AI Teşhis & Reçete Öner</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="örn: Ateş, kusma, iştahsızlık veya Kulak Enfeksiyonu vb."
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                  />
                  {/* AI Disclaimer Banner */}
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-purple-950 leading-relaxed font-semibold shadow-xs">
                    <Sparkles className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                    <span><strong>AI Karar Destek Uyarısı:</strong> Sistem önerileri klinik karara yardımcı ön bilgilendirme niteliğindedir. Teşhis, reçete ve ilaç dozajları veteriner hekim tarafından kontrol edilip onaylanmalıdır.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-primary uppercase tracking-wider">Uygulanan Tedavi</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="örn: Kulak temizlendi, damla damlatıldı."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-primary uppercase tracking-wider">Reçete & İlaçlar</label>
                  <input
                    type="text"
                    placeholder="örn: Synulox günde 2 kez, Otibiotic damla vb."
                    value={newPrescription}
                    onChange={(e) => setNewPrescription(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary placeholder:text-muted/60 focus:outline-none focus:border-primary transition-all shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Muayene Ücreti (TL)</label>
                    <input
                      type="number"
                      required
                      placeholder="örn: 1000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary font-mono focus:outline-none focus:border-primary transition-all shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Ödeme Durumu</label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary focus:outline-none focus:border-primary transition-all shadow-xs"
                    >
                      <option value="Paid">Ödendi</option>
                      <option value="Partial">Kısmi Ödeme</option>
                      <option value="Unpaid">Ödenmedi</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-wider">Sorumlu Hekim</label>
                    <select
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-primary focus:outline-none focus:border-primary transition-all shadow-xs"
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
                  <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Tahlil & Görüntüleme Belgesi Yükle (PDF, Resim)</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs font-bold text-primary focus:outline-none"
                  />
                  {uploading && <p className="text-xs text-accent animate-pulse font-extrabold">Dosya yükleniyor, lütfen bekleyin...</p>}
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="text-xs font-black text-primary uppercase">Yüklenen Dosyalar:</p>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, fIdx) => (
                          <span key={fIdx} className="bg-primary/5 border border-primary/20 text-primary text-xs font-extrabold px-2.5 py-1 rounded-lg">
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
                    className="flex-1 border border-card-border text-muted hover:bg-muted-light py-3.5 rounded-xl text-xs sm:text-sm font-extrabold active:scale-95 transition-all text-center"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-xs sm:text-sm font-extrabold active:scale-95 transition-all text-center shadow-md"
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
                        <label className="text-xs font-bold text-primary uppercase whitespace-nowrap">Renk (CSS)</label>
                        <input
                          type="text"
                          required
                          value={doctor.color}
                          onChange={(e) => handleDoctorChange(idx, "color", e.target.value)}
                          className="w-full bg-background border border-card-border px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-center font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary uppercase whitespace-nowrap">Baş Harfler</label>
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
                        <label className="text-xs font-bold text-primary uppercase whitespace-nowrap">Görsel URL</label>
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

        {/* MODAL 5: STOK ÜRÜNÜ EKLEME / DÜZENLEME MODAL */}
        {isInventoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              <div>
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  <span>{editingInvId ? "Stok Kartını Düzenle" : "Yeni Ürün / İlaç Stok Kaydı"}</span>
                </h3>
                <p className="text-muted text-xs mt-1">Aşı, ilaç, mama veya tıbbi malzeme için stok kartı detaylarını doldurun.</p>
              </div>

              <form onSubmit={handleSaveInventoryItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Ürün / İlaç Adı</label>
                    <input
                      type="text"
                      required
                      placeholder="örn: Kuduz Aşısı"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Kategori</label>
                    <select
                      value={invCategory}
                      onChange={(e) => setInvCategory(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Aşı">Aşı</option>
                      <option value="İlaç">İlaç</option>
                      <option value="Mama">Mama</option>
                      <option value="Sarf Malzeme">Sarf Malzeme</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Barkod No</label>
                    <input
                      type="text"
                      required
                      value={invBarcode}
                      onChange={(e) => setInvBarcode(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Miktar</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={invQuantity}
                      onChange={(e) => setInvQuantity(Number(e.target.value))}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Kritik Stok Sınırı</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={invMinAlertLevel}
                      onChange={(e) => setInvMinAlertLevel(Number(e.target.value))}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Birim</label>
                    <input
                      type="text"
                      required
                      placeholder="Doz / Flakon / Adet"
                      value={invUnit}
                      onChange={(e) => setInvUnit(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Birim Satış Fiyatı (TL)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={invPrice}
                      onChange={(e) => setInvPrice(Number(e.target.value))}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Son Kullanma Tarihi (SKT)</label>
                    <input
                      type="date"
                      value={invExpiryDate}
                      onChange={(e) => setInvExpiryDate(e.target.value)}
                      className="w-full bg-background border border-card-border px-3 py-2.5 rounded-xl text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-card-border">
                  <button
                    type="button"
                    onClick={() => setIsInventoryModalOpen(false)}
                    className="flex-1 border border-card-border text-muted py-3 rounded-xl text-xs font-bold"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-bold"
                  >
                    Stok Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 6: ITS / ATS KAREKODLU E-REÇETE YAZDIRMA MODAL */}
        {selectedPrescriptionRecord && prescriptionPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white border border-card-border rounded-3xl p-5 sm:p-8 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 text-left relative overflow-hidden animate-fade-in-up">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-card-border pb-4">
                <div>
                  <h3 className="text-lg font-black text-primary uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-accent" />
                    <span>T.C. Tarım ve Orman Bakanlığı ITS E-Reçete</span>
                  </h3>
                  <p className="text-muted text-[10px] font-mono mt-0.5">Reçete Kayıt No: ITS-REC-{Math.floor(10000000 + Math.random() * 90000000)}</p>
                </div>
                <button
                  onClick={() => setSelectedPrescriptionRecord(null)}
                  className="text-muted hover:text-primary p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prescription Voucher Body */}
              <div className="space-y-4 text-xs">
                
                {/* Clinic & Doctor Info */}
                <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-2xl border border-card-border font-mono">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted block">Düzenleyen Klinik</span>
                    <p className="font-extrabold text-primary text-xs">{settings?.clinicName || "PATİLER VETERİNER KLİNİĞİ"}</p>
                    <p className="text-[10px] text-muted">{settings?.address || "Ankara/Türkiye"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-muted block">Sorumlu Veteriner Hekim</span>
                    <p className="font-extrabold text-primary text-xs">{selectedPrescriptionRecord.doctorName}</p>
                    <p className="text-[10px] text-muted">Diploma / Sicil No: VET-84920</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-3 gap-2 bg-purple-50/50 p-3 rounded-2xl border border-purple-200 font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-purple-900 block">Hasta Sahibi</span>
                    <p className="font-bold text-primary capitalize">{prescriptionPatient.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-purple-900 block">Evcil Hayvan</span>
                    <p className="font-bold text-primary capitalize">{prescriptionPatient.petName} ({prescriptionPatient.petType})</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-purple-900 block">Düzenleme Tarihi</span>
                    <p className="font-bold text-primary">{selectedPrescriptionRecord.date}</p>
                  </div>
                </div>

                {/* Diagnosis & Treatment */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-primary block">Teşhis & Ön Tanı</span>
                    <p className="bg-background border border-card-border p-2.5 rounded-xl font-medium text-xs">{selectedPrescriptionRecord.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-primary block">Reçete İlaç Listesi (ITS / ATS Karekodlu)</span>
                    <p className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl font-bold font-mono text-xs">
                      {selectedPrescriptionRecord.prescription || "Özel Klinik İlaç Protokolü Uygulanmıştır."}
                    </p>
                  </div>
                </div>

                {/* QR Code & Barcode Verification */}
                <div className="flex items-center justify-between border-t border-card-border pt-4">
                  <div className="flex items-center gap-3">
                    {/* Simulated QR Code SVG */}
                    <div className="w-16 h-16 bg-primary text-white p-1.5 rounded-xl flex items-center justify-center font-black text-[9px] font-mono text-center leading-tight shadow-md">
                      ITS-QR<br />VERIFIED
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted block">Bakanlık Karekod Doğrulama</span>
                      <p className="text-[10px] font-mono text-primary font-bold">Karekod Seri: 8699501010043-9821</p>
                      <p className="text-[9px] text-emerald-600 font-bold">✓ İlaç Takip Sistemi Onaylı</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Reçete Çıktısı Al</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
