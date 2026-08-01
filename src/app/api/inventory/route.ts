import { NextResponse } from "next/server";
import { getInventoryData, saveInventoryData, deleteInventoryData, deductInventoryStockData } from "@/lib/db";

export async function GET() {
  try {
    const data = await getInventoryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Inventory error:", error);
    return NextResponse.json({ error: "Stok verisi yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "deduct") {
      const { items } = body;
      if (Array.isArray(items)) {
        await deductInventoryStockData(items);
      }
      const updated = await getInventoryData();
      return NextResponse.json({ success: true, inventory: updated });
    }

    const item = {
      ...body,
      id: body.id || "inv_" + Math.random().toString(36).substring(2, 9)
    };

    await saveInventoryData(item);
    const updated = await getInventoryData();
    return NextResponse.json({ success: true, inventory: updated });
  } catch (error) {
    console.error("POST Inventory error:", error);
    return NextResponse.json({ error: "Stok işlemi sırasında hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gereklidir." }, { status: 400 });
    }

    await deleteInventoryData(id);
    const updated = await getInventoryData();
    return NextResponse.json({ success: true, inventory: updated });
  } catch (error) {
    console.error("DELETE Inventory error:", error);
    return NextResponse.json({ error: "Silme hatası oluştu." }, { status: 500 });
  }
}
