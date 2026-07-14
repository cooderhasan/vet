import fs from "fs";
import path from "path";

export interface WhyUsItem {
  id: string;
  title: string;
  description: string;
}

export interface FeaturedServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  details: string[];
  image?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  edu: string;
  bio: string;
  color: string;
  avatarInitials: string;
  image?: string;
}

export interface ClinicSettings {
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  heroTitle: string;
  heroSub: string;
  aboutText1: string;
  aboutText2: string;
  aboutMission: string;
  aboutVision: string;
  whyUs: WhyUsItem[];
  featuredServices: FeaturedServiceItem[];
  services: ServiceItem[];
  doctors: DoctorItem[];
}

const SETTINGS_PATH = path.join(process.cwd(), "src", "data", "settings.json");

export function getSettings(): ClinicSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const fileContent = fs.readFileSync(SETTINGS_PATH, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading settings.json:", error);
  }
  
  // Return fallback defaults if reading fails
  return {
    clinicName: "Patiler Veteriner Kliniği",
    phone: "0555 123 45 67",
    email: "info@patilervet.com",
    address: "Moda Cad. No:123 Kadıköy / İstanbul",
    workingHours: "Pazartesi - Pazar: 7/24 Açık",
    heroTitle: "Modern Veteriner Kliniği",
    heroSub: "Can dostlarınız için profesyonel muayene, laboratuvar, aşı ve cerrahi hizmetlerini en üst düzey kalite standartlarında sunuyoruz.",
    aboutText1: "Kliniğimizde, can dostlarınızın sağlığını en az sizin kadar önemsiyoruz.",
    aboutText2: "Gelişmiş tıbbi donanımlarımız ve alanında uzman ekibimizle, onlara sadece tedavi değil, aynı zamanda şefkat dolu bir ortam sunuyoruz.",
    aboutMission: "Hasta sahiplerinin süreci anlayabilmesini, seçenekleri bilmesini ve kontrol planını güvenle takip edebilmesini önemsiyoruz.",
    aboutVision: "Veteriner hekimlikte ulusal ve uluslararası güncel tedavi protokollerini takip ederek en güvenilir referans kliniği olmak.",
    whyUs: [],
    featuredServices: [],
    services: [],
    doctors: [
      {
        id: "ahmet",
        name: "Prof. Dr. Ahmet Yılmaz",
        role: "Kurucu & Başhekim",
        specialty: "Cerrahi, Ortopedi ve Travmatoloji",
        edu: "Ankara Üniversitesi",
        bio: "25 yılı aşkın cerrahi deneyimiyle uzmanlaşmıştır.",
        color: "bg-primary/20 text-primary",
        avatarInitials: "AY",
        image: "/images/ahmet.png"
      },
      {
        id: "selin",
        name: "Dr. Selin Kaya",
        role: "Uzman Veteriner Hekim",
        specialty: "İç Hastalıkları & Kedi Sağlığı",
        edu: "İstanbul Üniversitesi",
        bio: "Kedilerin davranış psikolojileri ve koruyucu hekimlik konularında uzmandır.",
        color: "bg-accent/20 text-accent",
        avatarInitials: "SK",
        image: "/images/selin.png"
      },
      {
        id: "can",
        name: "Vet. Hekim Can Demir",
        role: "Veteriner Hekim",
        specialty: "Egzotik Hayvanlar",
        edu: "Fırat Üniversitesi",
        bio: "Kuşlar ve egzotik hayvanların tedavisi konularında çalışmalarını sürdürmektedir.",
        color: "bg-[#FAF6F0] text-primary",
        avatarInitials: "CD",
        image: "/images/can.png"
      }
    ]
  };
}

export function saveSettings(settings: ClinicSettings): boolean {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing settings.json:", error);
    return false;
  }
}
