import { NextResponse } from "next/server";
import { getPatientsData, savePatientData, deletePatientData } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    const patients = await getPatientsData();

    if (id) {
      const patient = patients.find((p: any) => p.id === id);
      if (!patient) {
        return NextResponse.json({ error: "Hasta kaydı bulunamadı." }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    if (phone) {
      const cleanInput = phone.replace(/\D/g, "");
      const matched = patients.filter((p: any) => {
        const cleanPatientPhone = p.phone.replace(/\D/g, "");
        return cleanPatientPhone.includes(cleanInput) || cleanInput.includes(cleanPatientPhone);
      });
      return NextResponse.json(matched);
    }

    return NextResponse.json(patients);
  } catch (error) {
    console.error("GET Patients error:", error);
    return NextResponse.json({ error: "Hasta verileri listelenirken hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const patient = body;

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

    const saved = await savePatientData(patient);
    return NextResponse.json({ success: true, data: saved });
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

    await deletePatientData(id);
    return NextResponse.json({ success: true, message: "Hasta kaydı silindi." });
  } catch (error) {
    console.error("DELETE Patient error:", error);
    return NextResponse.json({ error: "Hasta kaydı silinirken hata oluştu." }, { status: 500 });
  }
}
