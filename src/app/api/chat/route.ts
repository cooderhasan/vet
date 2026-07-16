import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { rateLimit } from "@/lib/rateLimit";
import { getSettings } from "@/lib/settings";

const APPOINTMENTS_FILE = path.join(process.cwd(), "src", "data", "appointments.json");

function getAppointments() {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const fileContent = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
      return JSON.parse(fileContent || "[]");
    }
  } catch (error) {
    console.error("Error reading appointments:", error);
  }
  return [];
}

function getBusySlotsText(appointments: any[], doctors: any[]) {
  // Only check today and future appointments
  const todayStr = new Date().toISOString().split("T")[0];
  const activeApps = appointments.filter(app => app.date >= todayStr);

  return doctors.map((doc: any) => {
    const docApps = activeApps.filter(app => app.doctorId === doc.id);
    if (docApps.length === 0) {
      return `  - ${doc.name} (ID: ${doc.id}): Şu an için tüm saatler boştur.`;
    }
    const slots = docApps.map(app => `${app.date} saat ${app.time}`).join(", ");
    return `  - ${doc.name} (ID: ${doc.id}): Dolu olan saatler: [${slots}]`;
  }).join("\n");
}

function generateSystemPrompt(settings: any, appointments: any[]) {
  const servicesText = settings.services
    .map((s: any) => `  - ${s.title}: ${s.price}`)
    .join("\n");
    
  const doctorsText = settings.doctors
    .map((d: any) => `  - ${d.name} (${d.role}) - ID: ${d.id} - Uzmanlık: ${d.specialty}`)
    .join("\n");

  const today = new Date();
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const formattedToday = `${today.getDate()} Temmuz 2026 ${dayNames[today.getDay()]}`;

  const busySlotsText = getBusySlotsText(appointments, settings.doctors);

  return `Sen, "${settings.clinicName}" için özel olarak tasarlanmış son derece kibar, yardımsever ve uzman bir veteriner kliniği yapay zekâ asistanısın. Görevin, müşterilerimizin sorularını yanıtlamak ve gerekirse onları randevu akışına yönlendirmektir.

### BUGÜNÜN TARİHİ:
- **Tarih**: ${formattedToday}
- Çalışma Saatlerimiz: Pazartesi - Cumartesi: 09:00 - 18:00 (Her saat başı randevu alınabilir: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00). Pazar günleri kapalıyız.

### KLİNİK BİLGİLERİ:
- **Klinik Adı**: ${settings.clinicName}
- **Çalışma Saatleri**: ${settings.workingHours} (Pazar günleri kapalıyız, acil durumlar hariç).
- **Telefon / Acil Hat**: ${settings.phone}
- **E-posta**: ${settings.email}
- **Adres**: ${settings.address}
- **Hizmetler ve Fiyatlar**:
${servicesText}
- **Uzman Hekim Kadrosu**:
${doctorsText}
- **Sıkça Sorulan Sorular (SSS)**:
  - Aşı ne zaman yapılır? Yavrular 6-8 haftalıkken parazit tedavisiyle başlar, ardından karma ve kuduz aşıları yapılır.
  - Kısırlaştırma süreci nasıldır? Ameliyat öncesi 8-12 saat açlık gerekir. Operasyon steril şartlarda gaz anestezisiyle yapılır, genellikle aynı gün taburcu edilir.
  - Acil durumda ne yapılmalı? Trafik kazası, zehirlenme, kanama veya nefes darlığı gibi durumlarda vakit kaybetmeden ${settings.phone} numaralı acil hattımızı arayarak yola çıkmalısınız.

### HEKİMLERİN MEVCUT DOLULUK DURUMLARI (TAKVİM):
Bu saatler doludur ve bu saatlere randevu veremezsin:
${busySlotsText}

### ÖNEMLİ KURALLAR (GUARDRAILS):
1. **Teşhis, Tedavi ve İlaç Tavsiyesi Yasaktır**: Kullanıcı ilaç ismi sorarsa veya herhangi bir belirti için ilaç tavsiyesi isterse, "İlaç tavsiyelerine ve tedavisine yalnızca veteriner hekimlerimiz karar verebilir, bu yüzden ilaç tavsiyesi veya reçetelendirme yapamam. Dostunuzu kliniğimize getirerek muayene ettirmelisiniz." şeklinde net bir şekilde ilaç tavsiyesi yapamayacağını belirt.
2. **Acil Durum Kelimeleri**: Eğer kullanıcı mesajında zehirlenme, kaza, kan, kanama, nefes almıyor, bayıldı, araba çarptı, şok gibi acil durum kelimelerini geçirirse, sohbeti uzatmadan derhal şu mesajı ver: "🚨 Acil bir durum tespit edildi! Lütfen zaman kaybetmeden ${settings.phone} numaralı acil telefon hattımızı arayın ve dostunuzu kliniğimize getirmek üzere yola çıkın."
3. **Randevu Yönlendirmesi**: Kullanıcı randevu almak istediğinde, "Randevu almak ister misiniz?" sorusuyla randevu akışını başlat.
4. **Randevu Akışı Adımları**:
   Kullanıcı randevu almak istediğini belirttiğinde ya da senin sorunu onayladığında, şu 6 bilgiyi sırayla, sohbet havasında tek tek iste (Hepsini tek seferde sorma!):
   - Adınız Soyadınız
   - Telefon Numaranız
   - Hayvanınızın Türü (Kedi, Köpek vb.)
   - Almak istediğiniz hizmet (Muayene, Aşı, Cerrahi, Pet Otel, Diyetisyenlik)
   - Tercih ettiğiniz hekim (Hekim kadromuzu ID'leriyle veya isimleriyle gösterip seçtir)
   - Randevu için tercih ettiğiniz tarih ve saat (Hekimin doluluk durumuna bakarak boş bir saat önermelisin. Pazar günlerine randevu verme. Seçilen tarih formatını YYYY-MM-DD ve saat formatını HH:mm olarak belirlemelisin).
   
   Eğer kullanıcı dolu bir tarih ve saat seçerse veya çalışma saatleri dışındaysa, hekimin dolu saatlerini hatırlatarak başka bir saat önermesini iste.
   
   Tüm bilgileri başarıyla topladığında, kullanıcıya bilgileri onaylat ve tam olarak şu formatta bir XML bloğunu yanıtının en sonuna ekle:
   <appointment_data>{"name":"[İsim]","phone":"[Telefon]","pet":"[Tür]","service":"[Hizmet]","datetime":"[Okunabilir Tarih/Saat Tanımı]","doctorId":"[Seçilen Doktor ID'si]","date":"[YYYY-MM-DD]","time":"[HH:mm]"}</appointment_data>`;
}

// Helper to get client IP for rate limiting
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

// Turkish date/time parser helper for Mock Chatbot
function parseDateTime(input: string): { date: string; time: string; datetime: string } {
  const today = new Date();
  const targetDate = new Date();
  const daysOfWeek = ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"];
  
  const lowerInput = input.toLowerCase();
  
  // Try to find YYYY-MM-DD or DD.MM.YYYY
  const dateMatch = lowerInput.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/) || lowerInput.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  let dateStr = "";
  if (dateMatch) {
    if (dateMatch[1].length === 4) {
      dateStr = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
    } else {
      dateStr = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
    }
  } else {
    let foundDayIdx = -1;
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (lowerInput.includes(daysOfWeek[i])) {
        foundDayIdx = i;
        break;
      }
    }
    
    if (foundDayIdx !== -1) {
      const currentDay = today.getDay();
      let daysToAdd = foundDayIdx - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Next occurrence
      }
      targetDate.setDate(today.getDate() + daysToAdd);
      dateStr = targetDate.toISOString().split('T')[0];
    } else {
      // Default to tomorrow
      targetDate.setDate(today.getDate() + 1);
      dateStr = targetDate.toISOString().split('T')[0];
    }
  }
  
  const timeMatch = lowerInput.match(/(\d{1,2})[:.](\d{2})/);
  let timeStr = "10:00";
  if (timeMatch) {
    timeStr = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
  }
  
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const d = new Date(dateStr);
  const dayName = daysOfWeek[d.getDay()];
  const monthName = months[d.getMonth()];
  const formattedDatetime = `${d.getDate()} ${monthName} ${dayName.toUpperCase()} saat ${timeStr}`;
  
  return { date: dateStr, time: timeStr, datetime: formattedDatetime };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitResult = rateLimit(ip);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Çok fazla istek gönderdiniz. Lütfen ${Math.ceil(limitResult.reset / 1000)} saniye sonra tekrar deneyin.` },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil(limitResult.reset / 1000).toString(),
          }
        }
      );
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Geçersiz mesaj formatı." }, { status: 400 });
    }

    const settings = getSettings();
    const appointments = getAppointments();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const anthropic = new Anthropic({ apiKey });
      
      const apiMessages = messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }));

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: generateSystemPrompt(settings, appointments),
        messages: apiMessages,
      });

      const responseText = response.content[0].type === "text" ? response.content[0].text : "";
      
      return NextResponse.json({ message: responseText });
    } else {
      // --- MOCK CHATBOT ENGINE (BACKUP) ---
      let inProgress = false;
      let name = "";
      let phone = "";
      let pet = "";
      let service = "";
      let doctorId = "";
      let datetime = "";
      let date = "";
      let time = "";
      let step = 0; 

      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const normalizedUserText = normalizeTurkish(lastUserMessage);
      const lowerLastUser = lastUserMessage.toLowerCase();
      const emergencyKeywords = [
        "zehirlenme",
        "kaza",
        "kan",
        "kanama",
        "nefes almiyor",
        "bayildi",
        "araba carpti",
        "araba vurdu",
        "sok",
        "yaralandi",
        "acil"
      ];
      
      const hasEmergency = emergencyKeywords.some(keyword => normalizedUserText.includes(keyword));
      if (hasEmergency) {
        return NextResponse.json({
          message: `🚨 Acil bir durum tespit edildi! Lütfen zaman kaybetmeden ${settings.phone} numaralı acil telefon hattımızı arayın ve dostunuzu kliniğimize getirmek üzere yola çıkın.`
        });
      }

      // Reconstruct booking flow state
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.role === "user") {
          const txt = msg.content.toLowerCase();
          
          if (!inProgress && (txt.includes("randevu") || txt.includes("rezervasyon") || txt.includes("kayıt") || txt.includes("oda ayırt"))) {
            inProgress = true;
            step = 1;
            continue;
          }
          
          if (inProgress) {
            if (step === 1) {
              name = msg.content;
              step = 2;
            } else if (step === 2) {
              phone = msg.content;
              step = 3;
            } else if (step === 3) {
              pet = msg.content;
              step = 4;
            } else if (step === 4) {
              service = msg.content;
              step = 5;
            } else if (step === 5) {
              const matchedDoc = settings.doctors.find(d => 
                txt.includes(d.id) || 
                txt.includes(d.name.toLowerCase()) || 
                (txt.includes("ahmet") && d.id === "ahmet") ||
                (txt.includes("selin") && d.id === "selin") ||
                (txt.includes("can") && d.id === "can")
              );
              doctorId = matchedDoc ? matchedDoc.id : "ahmet";
              step = 6;
            } else if (step === 6) {
              const parsed = parseDateTime(msg.content);
              date = parsed.date;
              time = parsed.time;
              datetime = parsed.datetime;
              
              // Check if slot is busy
              const isBusy = appointments.some((app: any) => app.doctorId === doctorId && app.date === date && app.time === time);
              if (isBusy) {
                // Stay on step 6 and prompt again
                step = 6;
              } else {
                step = 7;
              }
            }
          }
        }
      }

      let reply = "";

      if (inProgress) {
        switch (step) {
          case 1:
            reply = "Tabii ki randevu oluşturmanıza yardımcı olayım. Size nasıl hitap etmeliyim? (Adınız ve Soyadınız nedir?)";
            break;
          case 2:
            reply = `Teşekkürler ${name}. Size ulaşabileceğimiz 10 haneli telefon numarasını yazar mısınız?`;
            break;
          case 3:
            reply = `Telefon numaranızı kaydettim. Can dostumuzun türü nedir? (Örn: Kedi, Köpek, Kuş vb.)`;
            break;
          case 4:
            reply = `Anlaştık, bir ${pet}. Hangi hizmet için randevu oluşturmak istersiniz? (Aşı, Genel Muayene, Cerrahi, Pet Otel, Diyetisyenlik vb.)`;
            break;
          case 5:
            const docsList = settings.doctors.map((d, index) => `${index + 1}- ${d.name} (${d.specialty})`).join("\n");
            reply = `Tercih ettiğiniz hekimimizi seçer misiniz?\n\n${docsList}`;
            break;
          case 6:
            const chosenDoc = settings.doctors.find(d => d.id === doctorId);
            const docApps = appointments.filter((app: any) => app.doctorId === doctorId && app.date >= new Date().toISOString().split("T")[0]);
            const busyTimes = docApps.map((app: any) => `${app.date} saat ${app.time}`).join(", ");
            
            let busyNote = "";
            if (busyTimes) {
              busyNote = `\n(Hekimimizin dolu olduğu saatler: ${busyTimes}. Lütfen bu saatler dışından seçiniz.)`;
            }
            
            if (lastUserMessage.toLowerCase().includes("saat") || lastUserMessage.match(/\d/)) {
              // If we reached here and step is still 6, it means the slot was busy!
              reply = `Seçtiğiniz zaman dilimi hekimimiz için doludur.${busyNote}\nLütfen başka bir gün ve saat belirtir misiniz? (Örn: Pazartesi saat 14:00)`;
            } else {
              reply = `Hekimimiz ${chosenDoc?.name} için randevu tarihi ve saati belirtir misiniz? (Örn: Cuma saat 14:00 veya 20 Temmuz saat 10:00)${busyNote}`;
            }
            break;
          case 7:
            const docName = settings.doctors.find(d => d.id === doctorId)?.name || "";
            reply = `Randevu talebiniz başarıyla alındı! Bilgileriniz hekimimiz ${docName} için kaydediliyor.\n\n<appointment_data>{"name":"${name}","phone":"${phone}","pet":"${pet}","service":"${service}","datetime":"${datetime}","doctorId":"${doctorId}","date":"${date}","time":"${time}"}</appointment_data>`;
            break;
          default:
            reply = "Randevu akışınız tamamlandı. Başka yardımcı olabileceğim bir konu var mı?";
        }
      } else {
        if (lowerLastUser.includes("fiyat") || lowerLastUser.includes("ücret") || lowerLastUser.includes("ne kadar") || lowerLastUser.includes("kaç para")) {
          const listText = (settings.featuredServices || []).map(s => `- ${s.title}: ${s.price}`).join("\n");
          reply = `Kliniğimizde güncel hizmet fiyat aralıkları şu şekildedir:\n${listText}\n\nMuayene sonrası net bir tedavi planı çıkartılacaktır. Randevu almak ister misiniz?`;
        } else if (lowerLastUser.includes("saat") || lowerLastUser.includes("çalışma") || lowerLastUser.includes("açık") || lowerLastUser.includes("açılış")) {
          reply = `Kliniğimiz çalışma saatleri: ${settings.workingHours}. Randevu oluşturmak ister misiniz?`;
        } else if (lowerLastUser.includes("adres") || lowerLastUser.includes("nerede") || lowerLastUser.includes("konum") || lowerLastUser.includes("harita")) {
          reply = `Kliniğimizin adresi: ${settings.address}. Randevu almak ister misiniz?`;
        } else if (lowerLastUser.includes("aşı")) {
          reply = "Yavru kedilerde ve köpeklerde ilk aşılar 6-8. haftalarda iç-dış parazit uygulamalarıyla başlar. Sonrasında Karma, Lösemi ve yasal olarak zorunlu olan Kuduz aşısı yapılır. Dostunuzun aşı randevusunu oluşturmak ister misiniz?";
        } else if (lowerLastUser.includes("kısırlaştırma") || lowerLastUser.includes("ameliyat") || lowerLastUser.includes("operasyon")) {
          reply = "Kısırlaştırma operasyonları steril ameliyathanemizde gaz anestezisi altında, uzman cerrahlarımızca yapılır. Operasyon öncesinde dostunuzun en az 8-12 saat aç kalması gerekir. Randevu almak ister misiniz?";
        } else if (
          lowerLastUser.includes("ilaç") || 
          lowerLastUser.includes("ilac") || 
          lowerLastUser.includes("hap") || 
          lowerLastUser.includes("şurup") || 
          lowerLastUser.includes("surup") || 
          lowerLastUser.includes("damla") || 
          lowerLastUser.includes("antibiyotik") || 
          lowerLastUser.includes("krem") || 
          lowerLastUser.includes("merhem") || 
          lowerLastUser.includes("aspirin")
        ) {
          reply = "İlaç tavsiyelerine ve tedavisine yalnızca veteriner hekimlerimiz karar verebilir. Yapay zekâ olarak ilaç tavsiyesi veya reçetelendirme yapamam. Can dostunuzun sağlığı için lütfen en kısa sürede kliniğimize getirerek hekimlerimize muayene ettiriniz. Randevu oluşturmamı ister misiniz?";
        } else if (lowerLastUser.includes("kusuyor") || lowerLastUser.includes("hasta") || lowerLastUser.includes("ishal") || lowerLastUser.includes("kaşınıyor") || lowerLastUser.includes("halsiz")) {
          reply = "Can dostunuzun durumuna üzüldüm. Ancak tam bir teşhis koyabilmek için veteriner hekimimizin fiziki muayene yapması gerekmektedir. Hayvanınızı en yakın zamanda kliniğimize getirmenizi öneririm. Randevu oluşturmamı ister misiniz?";
        } else {
          reply = `Merhaba! Ben ${settings.clinicName} AI Asistanıyım. 🐾\n\nSize çalışma saatlerimiz, adresimiz, hizmet fiyatlarımız, hekim kadromuz, aşı programlarımız veya kısırlaştırma süreçleri hakkında bilgi verebilirim. Randevu oluşturmak isterseniz 'Randevu almak istiyorum' yazabilirsiniz. Nasıl yardımcı olabilirim?`;
        }
      }

      return NextResponse.json({ message: reply });
    }
  } catch (error: any) {
    console.error("Error in Chat API Route:", error);
    return NextResponse.json(
      { error: "İstek işlenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
