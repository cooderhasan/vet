import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to save appointments
const DATA_DIR = path.join(process.cwd(), "src", "data");
const FILE_PATH = path.join(DATA_DIR, "appointments.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, pet, service, datetime } = body;

    // Validation
    if (!name || !phone || !pet || !service || !datetime) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let appointments = [];

    // Read existing appointments if file exists
    if (fs.existsSync(FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
        appointments = JSON.parse(fileContent || "[]");
      } catch (err) {
        console.error("Error reading appointments file, resetting:", err);
      }
    }

    // Create new appointment
    const newAppointment = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      phone,
      pet,
      service,
      datetime,
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);

    // Save back to file
    fs.writeFileSync(FILE_PATH, JSON.stringify(appointments, null, 2), "utf-8");

    return NextResponse.json(
      { 
        success: true, 
        message: "Randevu talebi başarıyla alındı.", 
        data: newAppointment 
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
    if (!fs.existsSync(FILE_PATH)) {
      return NextResponse.json([]);
    }
    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    const appointments = JSON.parse(fileContent || "[]");
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: "Randevular listelenirken hata oluştu." },
      { status: 500 }
    );
  }
}
