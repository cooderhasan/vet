import { NextResponse } from "next/server";
import { getSettingsData, saveSettingsData } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getSettingsData();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET Settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.clinicName || !body.phone || !body.address) {
      return NextResponse.json(
        { error: "Geçersiz ayar formatı. Temel klinik bilgileri eksik." },
        { status: 400 }
      );
    }

    const saved = await saveSettingsData(body);
    return NextResponse.json({ success: true, message: "Ayarlar başarıyla kaydedildi.", data: saved });
  } catch (error) {
    console.error("POST Settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
