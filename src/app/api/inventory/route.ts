import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const inventoryFilePath = path.join(process.cwd(), "src/data/inventory.json");

function getInventoryData() {
  try {
    if (!fs.existsSync(inventoryFilePath)) {
      fs.writeFileSync(inventoryFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const fileData = fs.readFileSync(inventoryFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading inventory.json:", error);
    return [];
  }
}

function saveInventoryData(data: any[]) {
  try {
    fs.writeFileSync(inventoryFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing inventory.json:", error);
  }
}

export async function GET() {
  const data = getInventoryData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = getInventoryData();

    if (body.action === "deduct") {
      // Deduct quantity (e.g. from POS sale or medical treatment)
      const { items } = body; // Array of { id, quantity }
      let updatedData = [...currentData];
      if (Array.isArray(items)) {
        items.forEach((item: { id: string; quantity: number }) => {
          const idx = updatedData.findIndex(i => i.id === item.id);
          if (idx !== -1) {
            updatedData[idx].quantity = Math.max(0, updatedData[idx].quantity - item.quantity);
          }
        });
      }
      saveInventoryData(updatedData);
      return NextResponse.json({ success: true, inventory: updatedData });
    }

    if (body.id) {
      // Update existing product
      const index = currentData.findIndex((item: any) => item.id === body.id);
      if (index !== -1) {
        currentData[index] = { ...currentData[index], ...body };
      } else {
        currentData.push(body);
      }
    } else {
      // Create new product
      const newProduct = {
        ...body,
        id: "inv_" + Math.random().toString(36).substring(2, 9)
      };
      currentData.push(newProduct);
    }

    saveInventoryData(currentData);
    return NextResponse.json({ success: true, inventory: currentData });
  } catch (error) {
    return NextResponse.json({ error: "İşlem sırasında hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gereklidir." }, { status: 400 });
    }

    const currentData = getInventoryData();
    const filtered = currentData.filter((item: any) => item.id !== id);
    saveInventoryData(filtered);

    return NextResponse.json({ success: true, inventory: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Silme hatası oluştu." }, { status: 500 });
  }
}
