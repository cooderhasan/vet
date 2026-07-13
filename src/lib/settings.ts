import fs from "fs";
import path from "path";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  details: string[];
  image?: string;
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
    address: "Patiler Mah. Şefkat Cad. No:12, Kadıköy / İstanbul",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 19:00",
    heroTitle: "Sevimli Dostlarınız İçin Uzman & Şefkatli Bakım",
    heroSub: "Patiler Veteriner Kliniği olarak, ileri teknoloji tıbbi cihazlarımız ve alanında deneyimli uzman veteriner hekim kadromuzla, patili dostlarınıza sıcak, güvenli ve profesyonel sağlık çözümleri sunuyoruz.",
    aboutText1: "Patiler Veteriner Kliniği, 2016 yılında Kadıköy'de, sevimli dostlarımıza hak ettikleri modern ve şefkatli sağlık hizmetini sunmak amacıyla kuruldu. Kısa sürede edindiğimiz güven ve sevgiyle, binlerce can dostumuzun hayatına dokunduk.",
    aboutText2: "Kliniğimiz, koruyucu hekimlikten acil cerrahi müdahalelere, pet otelden kişiselleştirilmiş diyet programlarına kadar kapsamlı bir hizmet yelpazesi sunar. Gelişmiş tıbbi altyapımız ve laboratuvar donanımımız sayesinde teşhis süreçlerini en aza indirerek hızlı tedavi uyguluyoruz.",
    aboutMission: "Tıbbi etik ilkelerinden ödün vermeden, can dostlarımızın fiziksel ve ruhsal sağlığını en üst düzeyde korumak, hasta sahiplerine güven verici bir süreç sunmak.",
    aboutVision: "Veteriner hekimlik alanındaki uluslararası gelişmeleri ve teknolojileri takip ederek, bölgemizde referans gösterilen en modern veteriner sağlık kuruluşu olmak.",
    services: [],
    doctors: []
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
