import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ayarlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple structural validation
    if (!body.clinicName || !body.phone || !body.email || !body.address) {
      return NextResponse.json(
        { error: "Geçersiz ayar formatı. Temel klinik bilgileri eksik." },
        { status: 400 }
      );
    }

    const success = saveSettings(body);
    if (success) {
      return NextResponse.json({ success: true, message: "Ayarlar başarıyla kaydedildi." });
    } else {
      return NextResponse.json({ error: "Ayarlar dosyaya kaydedilemedi." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Ayarlar güncellenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
