import { NextResponse } from "next/server";
import { getAppointmentsData, saveAppointmentData, deleteAppointmentData } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, pet, service, datetime, doctorId, date, time } = body;

    if (!name || !phone || !pet || !service || !datetime) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    const newAppointment = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      phone,
      pet,
      service,
      datetime,
      doctorId: doctorId || "ahmet",
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00",
      createdAt: new Date().toISOString(),
    };

    const saved = await saveAppointmentData(newAppointment);

    return NextResponse.json(
      { 
        success: true, 
        message: "Randevu talebi başarıyla alındı.", 
        data: saved 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving appointment:", error);
    return NextResponse.json(
      { error: "Randevu kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await getAppointmentsData();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET Appointments error:", error);
    return NextResponse.json(
      { error: "Randevular listelenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parametresi eksik." }, { status: 400 });
    }

    await deleteAppointmentData(id);
    return NextResponse.json({ success: true, message: "Randevu başarıyla silindi." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Randevu silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
