import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";
import { getSettings } from "@/lib/settings";

function generateSystemPrompt(settings: any) {
  const servicesText = settings.services
    .map((s: any) => `  - ${s.title}: ${s.price}`)
    .join("\n");
    
  const doctorsText = settings.doctors
    .map((d: any) => `  - ${d.name} (${d.role}) - Uzmanlık: ${d.specialty}`)
    .join("\n");

  return `Sen, "${settings.clinicName}" için özel olarak tasarlanmış son derece kibar, yardımsever ve uzman bir veteriner kliniği yapay zekâ asistanısın. Görevin, müşterilerimizin sorularını yanıtlamak ve gerekirse onları randevu akışına yönlendirmektir.

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

### ÖNEMLİ KURALLAR (GUARDRAILS):
1. **Teşhis ve Tedavi Tavsiyesi Yasaktır**: Kullanıcı hayvanın belirtilerini anlatıp (örn: "Kedim kusuyor ne yapmalıyım?", "Köpeğimin gözü kızardı") tıbbi tavsiye isterse, asla ilaç önerme veya teşhis koyma. Kibarca bunun bir muayene gerektirdiğini söyle ve can dostunu kliniğe getirmeye yönlendir: "Hayvanınızı en yakın zamanda kliniğimize getirmenizi öneririm."
2. **Acil Durum Kelimeleri**: Eğer kullanıcı mesajında zehirlenme, kaza, kan, kanama, nefes almıyor, bayıldı, araba çarptı, şok gibi acil durum kelimelerini geçirirse, sohbeti uzatmadan derhal şu mesajı ver: "🚨 Acil bir durum tespit edildi! Lütfen zaman kaybetmeden ${settings.phone} numaralı acil telefon hattımızı arayın ve dostunuzu kliniğimize getirmek üzere yola çıkın."
3. **Randevu Yönlendirmesi**: Sohbetin sonunda veya kullanıcı randevu almak istediğinde, "Randevu almak ister misiniz?" sorusuyla randevu akışını başlat.
4. **Randevu Akışı Adımları**:
   Kullanıcı randevu almak istediğini belirttiğinde ya da senin sorunu onayladığında, şu 5 bilgiyi sırayla, adım adım topla (Hepsini tek bir seferde sorma, sohbet havasında tek tek iste):
   - Adınız Soyadınız
   - Telefon Numaranız
   - Hayvanınızın Türü (Kedi, Köpek vb.)
   - Almak istediğiniz hizmet (Muayene, Aşı, Cerrahi, Pet Otel, Diyetisyenlik)
   - Randevu için tercih ettiğiniz tarih ve saat
   
   Tüm bilgileri başarıyla topladığında, kullanıcıya bilgileri onaylat ve tam olarak şu formatta bir XML bloğunu yanıtının en sonuna ekle (bunu yapman kullanıcının randevusunu sisteme kaydetmemizi sağlar):
   <appointment_data>{"name":"[İsim]","phone":"[Telefon]","pet":"[Tür]","service":"[Hizmet]","datetime":"[Tarih/Saat]"}</appointment_data>`;
}

// Helper to get client IP for rate limiting
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
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

    // Load Dynamic Settings
    const settings = getSettings();

    // 2. Determine if Anthropic API Key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      // --- REAL CLAUDE API INTEGRATION ---
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
        system: generateSystemPrompt(settings),
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
      let datetime = "";
      let step = 0; 

      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const lowerLastUser = lastUserMessage.toLowerCase();
      const emergencyKeywords = ["zehirlenme", "kaza", "kan", "kanama", "nefes almıyor", "bayıldı", "araba çarptı", "şok", "yaralandı"];
      
      const hasEmergency = emergencyKeywords.some(keyword => lowerLastUser.includes(keyword));
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
              datetime = msg.content;
              step = 6;
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
            reply = `Son olarak, randevu için tercih ettiğiniz tarih ve saati (Örn: Cuma saat 14:00 veya 18 Temmuz Cumartesi 10:00) belirtebilir misiniz?`;
            break;
          case 6:
            reply = `Randevu talebiniz başarıyla alındı! Bilgileriniz sisteme kaydediliyor ve en kısa sürede sizi onay aramak için arayacağız.\n\n<appointment_data>{"name":"${name}","phone":"${phone}","pet":"${pet}","service":"${service}","datetime":"${datetime}"}</appointment_data>`;
            break;
          default:
            reply = "Randevu akışınız tamamlandı. Başka yardımcı olabileceğim bir konu var mı?";
        }
      } else {
        // Simple FAQ keyword responses using dynamic settings
        if (lowerLastUser.includes("fiyat") || lowerLastUser.includes("ücret") || lowerLastUser.includes("ne kadar") || lowerLastUser.includes("kaç para")) {
          const listText = settings.services.map(s => `- ${s.title}: ${s.price}`).join("\n");
          reply = `Kliniğimizde güncel hizmet fiyat aralıkları şu şekildedir:\n${listText}\n\nMuayene sonrası net bir tedavi planı çıkartılacaktır. Randevu almak ister misiniz?`;
        } else if (lowerLastUser.includes("saat") || lowerLastUser.includes("çalışma") || lowerLastUser.includes("açık") || lowerLastUser.includes("açılış")) {
          reply = `Kliniğimiz çalışma saatleri: ${settings.workingHours}. Randevu oluşturmak ister misiniz?`;
        } else if (lowerLastUser.includes("adres") || lowerLastUser.includes("nerede") || lowerLastUser.includes("konum") || lowerLastUser.includes("harita")) {
          reply = `Kliniğimizin adresi: ${settings.address}. Randevu almak ister misiniz?`;
        } else if (lowerLastUser.includes("aşı")) {
          reply = "Yavru kedilerde ve köpeklerde ilk aşılar 6-8. haftalarda iç-dış parazit uygulamalarıyla başlar. Sonrasında Karma, Lösemi ve yasal olarak zorunlu olan Kuduz aşısı yapılır. Dostunuzun aşı randevusunu oluşturmak ister misiniz?";
        } else if (lowerLastUser.includes("kısırlaştırma") || lowerLastUser.includes("ameliyat") || lowerLastUser.includes("operasyon")) {
          reply = "Kısırlaştırma operasyonları steril ameliyathanemizde gaz anestezisi altında, uzman cerrahlarımızca yapılır. Operasyon öncesinde dostunuzun en az 8-12 saat aç kalması gerekir. Randevu almak ister misiniz?";
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
