import fs from "fs";
import path from "path";
import { Pool } from "pg";

const dataDir = path.join(process.cwd(), "src", "data");

// Create PostgreSQL connection pool if DATABASE_URL is configured
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("postgres:") ? false : { rejectUnauthorized: false }
    })
  : null;

// Initialize PostgreSQL Tables if connecting for the first time
let isDbInitialized = false;

export async function initPostgresTables() {
  if (!pool || isDbInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          owner_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          pet_name TEXT NOT NULL,
          pet_type TEXT NOT NULL,
          breed TEXT DEFAULT '',
          age TEXT DEFAULT '',
          weight TEXT DEFAULT '',
          allergies TEXT DEFAULT '',
          medical_history JSONB DEFAULT '[]',
          vaccinations JSONB DEFAULT '[]',
          boarding JSONB,
          inpatient JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS appointments (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          pet TEXT NOT NULL,
          service TEXT NOT NULL,
          datetime TEXT NOT NULL,
          notes TEXT DEFAULT '',
          status TEXT DEFAULT 'pending',
          doctor_id TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inventory (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          barcode TEXT UNIQUE NOT NULL,
          quantity INT DEFAULT 0,
          min_alert_level INT DEFAULT 5,
          unit TEXT DEFAULT 'Adet',
          price NUMERIC DEFAULT 0,
          expiry_date TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS clinic_settings (
          id TEXT PRIMARY KEY DEFAULT 'default',
          clinic_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          working_hours TEXT NOT NULL,
          doctors JSONB DEFAULT '[]',
          services JSONB DEFAULT '[]',
          full_config JSONB DEFAULT '{}',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS full_config JSONB DEFAULT '{}';
      `);

      // Seed initial data if tables are empty
      const setCont = await client.query("SELECT COUNT(*) FROM clinic_settings");
      const jsonPath = path.join(dataDir, "settings.json");
      if (fs.existsSync(jsonPath)) {
        const item = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        if (parseInt(setCont.rows[0].count) === 0) {
          await client.query(
            `INSERT INTO clinic_settings (id, clinic_name, phone, address, working_hours, doctors, services, full_config)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO UPDATE SET full_config = EXCLUDED.full_config`,
            [
              "default", 
              item.clinicName || "", 
              item.phone || "", 
              item.address || "", 
              item.workingHours || "", 
              JSON.stringify(item.doctors || []), 
              JSON.stringify(item.services || []),
              JSON.stringify(item)
            ]
          );
        } else {
          // Always ensure full_config has latest fields
          await client.query(
            `UPDATE clinic_settings SET full_config = $1 WHERE id = 'default'`,
            [JSON.stringify(item)]
          );
        }
      }
      const pCount = await client.query("SELECT COUNT(*) FROM patients");
      if (parseInt(pCount.rows[0].count) === 0) {
        const jsonPath = path.join(dataDir, "patients.json");
        if (fs.existsSync(jsonPath)) {
          const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          for (const item of items) {
            await client.query(
              `INSERT INTO patients (id, owner_name, phone, pet_name, pet_type, breed, age, weight, allergies, medical_history, vaccinations, boarding, inpatient)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
               ON CONFLICT (id) DO NOTHING`,
              [
                item.id,
                item.ownerName || "",
                item.phone || "",
                item.petName || "",
                item.petType || "",
                item.breed || "",
                item.age || "",
                item.weight || "",
                item.allergies || "",
                JSON.stringify(item.medicalHistory || []),
                JSON.stringify(item.vaccinations || []),
                item.boarding ? JSON.stringify(item.boarding) : null,
                item.inpatient ? JSON.stringify(item.inpatient) : null
              ]
            );
          }
        }
      }

      const invCount = await client.query("SELECT COUNT(*) FROM inventory");
      if (parseInt(invCount.rows[0].count) === 0) {
        const jsonPath = path.join(dataDir, "inventory.json");
        if (fs.existsSync(jsonPath)) {
          const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          for (const item of items) {
            await client.query(
              `INSERT INTO inventory (id, name, category, barcode, quantity, min_alert_level, unit, price, expiry_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (id) DO NOTHING`,
              [item.id, item.name, item.category, item.barcode, item.quantity, item.minAlertLevel || 5, item.unit || "Adet", item.price || 0, item.expiryDate || ""]
            );
          }
        }
      }

      const appCount = await client.query("SELECT COUNT(*) FROM appointments");
      if (parseInt(appCount.rows[0].count) === 0) {
        const jsonPath = path.join(dataDir, "appointments.json");
        if (fs.existsSync(jsonPath)) {
          const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          for (const item of items) {
            await client.query(
              `INSERT INTO appointments (id, name, phone, pet, service, datetime, notes, status, doctor_id, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               ON CONFLICT (id) DO NOTHING`,
              [item.id, item.name, item.phone, item.pet, item.service, item.datetime, item.notes || "", item.status || "pending", item.doctorId || "", item.createdAt || new Date().toISOString()]
            );
          }
        }
      }

      isDbInitialized = true;
      console.log("✅ PostgreSQL tables and initial dataset initialized successfully.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Failed to initialize PostgreSQL tables:", err);
  }
}

// -------------------------------------------------------------
// PATIENTS DATA ACCESS
// -------------------------------------------------------------
export async function getPatientsData() {
  if (pool) {
    await initPostgresTables();
    const res = await pool.query("SELECT * FROM patients ORDER BY created_at DESC");
    return res.rows.map(row => ({
      id: row.id,
      ownerName: row.owner_name,
      phone: row.phone,
      petName: row.pet_name,
      petType: row.pet_type,
      breed: row.breed,
      age: row.age,
      weight: row.weight,
      allergies: row.allergies,
      medicalHistory: row.medical_history || [],
      vaccinations: row.vaccinations || [],
      boarding: row.boarding || undefined,
      inpatient: row.inpatient || undefined
    }));
  }

  const file = path.join(dataDir, "patients.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export async function savePatientData(patient: any) {
  if (pool) {
    await initPostgresTables();
    const query = `
      INSERT INTO patients (id, owner_name, phone, pet_name, pet_type, breed, age, weight, allergies, medical_history, vaccinations, boarding, inpatient)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        owner_name = EXCLUDED.owner_name,
        phone = EXCLUDED.phone,
        pet_name = EXCLUDED.pet_name,
        pet_type = EXCLUDED.pet_type,
        breed = EXCLUDED.breed,
        age = EXCLUDED.age,
        weight = EXCLUDED.weight,
        allergies = EXCLUDED.allergies,
        medical_history = EXCLUDED.medical_history,
        vaccinations = EXCLUDED.vaccinations,
        boarding = EXCLUDED.boarding,
        inpatient = EXCLUDED.inpatient;
    `;
    await pool.query(query, [
      patient.id,
      patient.ownerName || "",
      patient.phone || "",
      patient.petName || "",
      patient.petType || "",
      patient.breed || "",
      patient.age || "",
      patient.weight || "",
      patient.allergies || "",
      JSON.stringify(patient.medicalHistory || []),
      JSON.stringify(patient.vaccinations || []),
      patient.boarding ? JSON.stringify(patient.boarding) : null,
      patient.inpatient ? JSON.stringify(patient.inpatient) : null
    ]);
    return patient;
  }

  const file = path.join(dataDir, "patients.json");
  const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
  const idx = list.findIndex((p: any) => p.id === patient.id);
  if (idx >= 0) list[idx] = patient;
  else list.unshift(patient);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return patient;
}

export async function deletePatientData(id: string) {
  if (pool) {
    await initPostgresTables();
    await pool.query("DELETE FROM patients WHERE id = $1", [id]);
    return true;
  }

  const file = path.join(dataDir, "patients.json");
  if (!fs.existsSync(file)) return true;
  let list = JSON.parse(fs.readFileSync(file, "utf-8"));
  list = list.filter((p: any) => p.id !== id);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return true;
}

// -------------------------------------------------------------
// APPOINTMENTS DATA ACCESS
// -------------------------------------------------------------
export async function getAppointmentsData() {
  if (pool) {
    await initPostgresTables();
    const res = await pool.query("SELECT * FROM appointments ORDER BY created_at DESC");
    return res.rows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      pet: row.pet,
      service: row.service,
      datetime: row.datetime,
      notes: row.notes,
      status: row.status,
      doctorId: row.doctor_id,
      createdAt: row.created_at
    }));
  }

  const file = path.join(dataDir, "appointments.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export async function saveAppointmentData(app: any) {
  if (pool) {
    await initPostgresTables();
    const query = `
      INSERT INTO appointments (id, name, phone, pet, service, datetime, notes, status, doctor_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        pet = EXCLUDED.pet,
        service = EXCLUDED.service,
        datetime = EXCLUDED.datetime,
        notes = EXCLUDED.notes,
        status = EXCLUDED.status,
        doctor_id = EXCLUDED.doctor_id;
    `;
    await pool.query(query, [
      app.id,
      app.name,
      app.phone,
      app.pet,
      app.service,
      app.datetime,
      app.notes || "",
      app.status || "pending",
      app.doctorId || "",
      app.createdAt || new Date().toISOString()
    ]);
    return app;
  }

  const file = path.join(dataDir, "appointments.json");
  const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
  const idx = list.findIndex((a: any) => a.id === app.id);
  if (idx >= 0) list[idx] = app;
  else list.unshift(app);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return app;
}

export async function deleteAppointmentData(id: string) {
  if (pool) {
    await initPostgresTables();
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
    return true;
  }

  const file = path.join(dataDir, "appointments.json");
  if (!fs.existsSync(file)) return true;
  let list = JSON.parse(fs.readFileSync(file, "utf-8"));
  list = list.filter((a: any) => a.id !== id);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return true;
}

export async function updateAppointmentStatusData(id: string, status: string) {
  if (pool) {
    await initPostgresTables();
    await pool.query("UPDATE appointments SET status = $1 WHERE id = $2", [status, id]);
    return true;
  }

  const file = path.join(dataDir, "appointments.json");
  if (!fs.existsSync(file)) return true;
  const list = JSON.parse(fs.readFileSync(file, "utf-8"));
  const idx = list.findIndex((a: any) => a.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  }
  return true;
}

// -------------------------------------------------------------
// INVENTORY DATA ACCESS
// -------------------------------------------------------------
export async function getInventoryData() {
  if (pool) {
    await initPostgresTables();
    const res = await pool.query("SELECT * FROM inventory ORDER BY name ASC");
    return res.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      barcode: row.barcode,
      quantity: row.quantity,
      minAlertLevel: row.min_alert_level,
      unit: row.unit,
      price: parseFloat(row.price),
      expiryDate: row.expiry_date
    }));
  }

  const file = path.join(dataDir, "inventory.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export async function saveInventoryData(item: any) {
  if (pool) {
    await initPostgresTables();
    const query = `
      INSERT INTO inventory (id, name, category, barcode, quantity, min_alert_level, unit, price, expiry_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        barcode = EXCLUDED.barcode,
        quantity = EXCLUDED.quantity,
        min_alert_level = EXCLUDED.min_alert_level,
        unit = EXCLUDED.unit,
        price = EXCLUDED.price,
        expiry_date = EXCLUDED.expiry_date;
    `;
    await pool.query(query, [
      item.id,
      item.name,
      item.category,
      item.barcode,
      item.quantity,
      item.minAlertLevel || 5,
      item.unit || "Adet",
      item.price || 0,
      item.expiryDate || ""
    ]);
    return item;
  }

  const file = path.join(dataDir, "inventory.json");
  const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
  const idx = list.findIndex((i: any) => i.id === item.id);
  if (idx >= 0) list[idx] = item;
  else list.push(item);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return item;
}

export async function deleteInventoryData(id: string) {
  if (pool) {
    await initPostgresTables();
    await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
    return true;
  }

  const file = path.join(dataDir, "inventory.json");
  if (!fs.existsSync(file)) return true;
  let list = JSON.parse(fs.readFileSync(file, "utf-8"));
  list = list.filter((i: any) => i.id !== id);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return true;
}

export async function deductInventoryStockData(items: { id: string; quantity: number }[]) {
  if (pool) {
    await initPostgresTables();
    for (const cartItem of items) {
      await pool.query(
        "UPDATE inventory SET quantity = GREATEST(0, quantity - $1) WHERE id = $2",
        [cartItem.quantity, cartItem.id]
      );
    }
    return true;
  }

  const file = path.join(dataDir, "inventory.json");
  if (!fs.existsSync(file)) return true;
  const list = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const cartItem of items) {
    const target = list.find((i: any) => i.id === cartItem.id);
    if (target) {
      target.quantity = Math.max(0, target.quantity - cartItem.quantity);
    }
  }
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  return true;
}

// -------------------------------------------------------------
// CLINIC SETTINGS DATA ACCESS
// -------------------------------------------------------------
export async function getSettingsData() {
  const jsonFile = path.join(dataDir, "settings.json");
  const fallbackSettings = fs.existsSync(jsonFile) ? JSON.parse(fs.readFileSync(jsonFile, "utf-8")) : {};

  if (pool) {
    await initPostgresTables();
    const res = await pool.query("SELECT * FROM clinic_settings WHERE id = 'default'");
    if (res.rows.length > 0) {
      const row = res.rows[0];
      const dbConfig = row.full_config || {};
      return {
        ...fallbackSettings,
        ...dbConfig,
        clinicName: dbConfig.clinicName || row.clinic_name || fallbackSettings.clinicName,
        phone: dbConfig.phone || row.phone || fallbackSettings.phone,
        address: dbConfig.address || row.address || fallbackSettings.address,
        workingHours: dbConfig.working_hours || row.working_hours || fallbackSettings.workingHours,
        doctors: (dbConfig.doctors && dbConfig.doctors.length > 0) ? dbConfig.doctors : (row.doctors && row.doctors.length > 0) ? row.doctors : fallbackSettings.doctors || [],
        services: (dbConfig.services && dbConfig.services.length > 0) ? dbConfig.services : (row.services && row.services.length > 0) ? row.services : fallbackSettings.services || [],
        featuredServices: (dbConfig.featuredServices && dbConfig.featuredServices.length > 0) ? dbConfig.featuredServices : fallbackSettings.featuredServices || [],
        whyUs: (dbConfig.whyUs && dbConfig.whyUs.length > 0) ? dbConfig.whyUs : fallbackSettings.whyUs || [],
        aboutMission: dbConfig.aboutMission || fallbackSettings.aboutMission || "",
        aboutVision: dbConfig.aboutVision || fallbackSettings.aboutVision || "",
        aboutText1: dbConfig.aboutText1 || fallbackSettings.aboutText1 || "",
        aboutText2: dbConfig.aboutText2 || fallbackSettings.aboutText2 || "",
        heroTitle: dbConfig.heroTitle || fallbackSettings.heroTitle || "",
        heroSub: dbConfig.heroSub || fallbackSettings.heroSub || "",
        email: dbConfig.email || fallbackSettings.email || ""
      };
    }
  }

  return fallbackSettings;
}

export async function saveSettingsData(settings: any) {
  const file = path.join(dataDir, "settings.json");
  fs.writeFileSync(file, JSON.stringify(settings, null, 2), "utf-8");

  if (pool) {
    await initPostgresTables();
    const query = `
      INSERT INTO clinic_settings (id, clinic_name, phone, address, working_hours, doctors, services, full_config)
      VALUES ('default', $1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        clinic_name = EXCLUDED.clinic_name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        working_hours = EXCLUDED.working_hours,
        doctors = EXCLUDED.doctors,
        services = EXCLUDED.services,
        full_config = EXCLUDED.full_config;
    `;
    await pool.query(query, [
      settings.clinicName || "",
      settings.phone || "",
      settings.address || "",
      settings.workingHours || "",
      JSON.stringify(settings.doctors || []),
      JSON.stringify(settings.services || []),
      JSON.stringify(settings)
    ]);
  }

  return settings;
}
