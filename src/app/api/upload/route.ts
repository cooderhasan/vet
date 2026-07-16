import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "Yüklenecek dosya seçilmedi." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename to prevent conflicts
    const filename = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    console.log(`Saved file to ${filepath}`);

    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl, 
      name: file.name 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Dosya kaydedilirken sunucu hatası oluştu." }, { status: 500 });
  }
}
