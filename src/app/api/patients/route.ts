import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "src", "data", "patients.json");

function getPatients() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(fileContent || "[]");
    }
  } catch (error) {
    console.error("Error reading patients file:", error);
  }
  return [];
}

function savePatients(patients: any[]) {
  try {
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(patients, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing patients file:", error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    const patients = getPatients();

    if (id) {
      const patient = patients.find((p: any) => p.id === id);
      if (!patient) {
        return NextResponse.json({ error: "Hasta kaydı bulunamadı." }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    if (phone) {
      // Clean phone number for comparison
      const cleanInput = phone.replace(/\D/g, "");
      const matched = patients.filter((p: any) => {
        const cleanPatientPhone = p.phone.replace(/\D/g, "");
        return cleanPatientPhone.includes(cleanInput) || cleanInput.includes(cleanPatientPhone);
      });
      return NextResponse.json(matched);
    }

    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: "Hasta verileri listelenirken hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const patients = getPatients();
    
    let targetPatientIdx = -1;
    let patient = body;

    if (patient.id) {
      targetPatientIdx = patients.findIndex((p: any) => p.id === patient.id);
    }

    if (targetPatientIdx > -1) {
      // Update existing
      patients[targetPatientIdx] = {
        ...patients[targetPatientIdx],
        ...patient,
      };
      patient = patients[targetPatientIdx];
    } else {
      // Create new
      patient.id = patient.id || "pat_" + Math.random().toString(36).substring(2, 9);
      patient.medicalHistory = patient.medicalHistory || [];
      patient.vaccinations = patient.vaccinations || [];
      patient.boarding = patient.boarding || {
        status: "none",
        roomNumber: "",
        checkIn: "",
        checkOut: "",
        foodRoutine: "",
        notes: ""
      };
      patients.push(patient);
    }

    const success = savePatients(patients);
    if (success) {
      return NextResponse.json({ success: true, data: patient });
    } else {
      return NextResponse.json({ error: "Veriler dosyaya yazılamadı." }, { status: 500 });
    }
  } catch (error) {
    console.error("Error saving patient:", error);
    return NextResponse.json({ error: "Hasta kaydı işlenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parametresi eksik." }, { status: 400 });
    }

    const patients = getPatients();
    const filtered = patients.filter((p: any) => p.id !== id);
    
    const success = savePatients(filtered);
    if (success) {
      return NextResponse.json({ success: true, message: "Hasta kaydı silindi." });
    } else {
      return NextResponse.json({ error: "Silme işlemi kaydedilemedi." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Hasta kaydı silinirken hata oluştu." }, { status: 500 });
  }
}
