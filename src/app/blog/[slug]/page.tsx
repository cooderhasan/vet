import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  User, 
  ShieldAlert, 
  Bookmark, 
  ArrowRight,
  Info,
  Award
} from "lucide-react";

// Mock database for static posts
const BLOG_POSTS: Record<string, {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  categoryColor: string;
  image: string;
  content: React.ReactNode;
}> = {
  "kedilerde-asi-takvimi": {
    title: "Kedilerde Aşı Takvimi Nasıl Olmalı?",
    description: "Yavru kedilerin sağlıklı büyümesi ve salgın hastalıklardan korunması için veteriner kontrolünde aşı takvimi rehberi.",
    category: "Kedi Sağlığı",
    date: "12 Temmuz 2026",
    readTime: "4 dk okuma",
    author: "Dr. Selin Kaya",
    authorRole: "Uzman Veteriner Hekim",
    categoryColor: "bg-teal-500/10 text-teal-600",
    image: "/images/blog-asi-takvimi.png",
    content: (
      <div className="space-y-6 text-[#1A2E2D] leading-relaxed text-sm sm:text-base">
        <p className="text-base sm:text-lg text-muted/90 font-medium">
          Kedilerimizin sağlıklı ve uzun bir ömür sürmesi için koruyucu hekimliğin en önemli halkası aşı takibidir. Yavruluk döneminde yapılan aşılar, onları ölümcül olabilen virüslere ve enfeksiyonlara karşı hayati bir kalkan gibi korur.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">İlk Aşılar Ne Zaman Başlar?</h2>
        <p>
          Yavru kedilerde aşılama programı genellikle anne sütünden kesilmeyi takiben <strong>6. veya 8. haftalarda</strong> başlar. Bu döneme kadar yavru kediler anne sütündeki antikorlar (kolostrum) sayesinde korunurlar. Anne sütünden gelen koruma azaldıkça, dış dünyaya açık hale gelirler ve aşılama süreci başlar.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">Yavru Kedi Örnek Aşı Takvimi</h2>
        <p>
          Kliniğimizde dünya standartlarına (WSAVA) uygun olarak uyguladığımız genel aşı takvimi şu şekildedir:
        </p>

        <div className="overflow-x-auto my-6 border border-card-border rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-card-border text-sm">
            <thead className="bg-[#FAF6F0] text-primary font-bold">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Dönem / Hafta</th>
                <th className="px-6 py-4 text-left font-semibold">Uygulanan Aşı / İşlem</th>
                <th className="px-6 py-4 text-left font-semibold">Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border bg-white text-muted">
              <tr>
                <td className="px-6 py-4 font-semibold text-primary">6 - 8. Hafta</td>
                <td className="px-6 py-4 font-semibold text-accent">İç ve Dış Parazit Tedavisi</td>
                <td className="px-6 py-4">Aşılamaya başlamadan önce vücuttaki parazitlerin temizlenmesi şarttır.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-primary">8. Hafta</td>
                <td className="px-6 py-4 font-semibold text-accent">Karma Aşı (FVRCP) - I</td>
                <td className="px-6 py-4">Gençlik hastalığı, herpesvirüs ve calicivirüse karşı ilk doz.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-primary">10. Hafta</td>
                <td className="px-6 py-4 font-semibold text-accent">Karma Aşı (FVRCP) - II</td>
                <td className="px-6 py-4">İlk aşının koruyuculuğunu pekiştiren tekrar dozu.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-primary">11 - 12. Hafta</td>
                <td className="px-6 py-4 font-semibold text-accent">Lösemi Aşısı (FeLV) - I</td>
                <td className="px-6 py-4">Kedi lösemi virüsüne karşı koruyucu ilk doz.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-primary">13 - 14. Hafta</td>
                <td className="px-6 py-4 font-semibold text-accent">Lösemi - II & Kuduz Aşısı</td>
                <td className="px-6 py-4">Lösemi aşısının tekrarı ve yasal olarak zorunlu olan Kuduz aşısı.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">Aşı Sonrası Nelere Dikkat Edilmeli?</h2>
        <p>
          Aşı sonrasında sevimli dostumuzda hafif halsizlik, uykulu olma hali ve aşı bölgesinde hafif bir hassasiyet görülmesi normaldir. Ancak aşağıdaki belirtilerden biri gözlemlenirse vakit kaybetmeden kliniğimizle iletişime geçmelisiniz:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted">
          <li>Yüzde, dudakta veya göz çevresinde aşırı şişme (alerjik reaksiyon)</li>
          <li>Durmayan kusma veya ishal</li>
          <li>Yüksek ateş ve 24 saati aşan aşırı durgunluk</li>
          <li>Nefes almada zorluk çekme veya hırıltı</li>
        </ul>

        <div className="bg-accent/10 border-l-4 border-accent p-5 rounded-r-2xl my-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-primary text-sm">Önemli Hatırlatma</h4>
            <p className="text-xs text-muted leading-relaxed mt-1">
              Aşı takvimi tamamlanana kadar yavru kedinizi diğer hayvanlarla temas ettirmemeniz ve dışarıya çıkarmamanız enfeksiyon riskini önlemek için kritik önem taşır.
            </p>
          </div>
        </div>

        <p className="pt-4">
          Dostunuzun aşı takvimini planlamak veya güncel durumunu kontrol ettirmek için{" "}
          <Link href="/hizmetler" className="text-accent hover:underline font-semibold">
            Aşı ve Koruyucu Hekimlik
          </Link>{" "}
          hizmetimizi inceleyebilir veya doğrudan online randevu alabilirsiniz.
        </p>
      </div>
    )
  },
  "kopeklerde-yaz-bakimi": {
    title: "Köpeklerde Yaz Bakımı İpuçları",
    description: "Yaz sıcaklarında köpeklerimizi sıcaktan ve dehidrasyondan korumak için veteriner hekim tavsiyeleri.",
    category: "Köpek Bakımı",
    date: "10 Temmuz 2026",
    readTime: "5 dk okuma",
    author: "Vet. Hekim Can Demir",
    authorRole: "Veteriner Hekim & Diyetisyen",
    categoryColor: "bg-orange-500/10 text-orange-600",
    image: "/images/blog-yaz-bakimi.png",
    content: (
      <div className="space-y-6 text-[#1A2E2D] leading-relaxed text-sm sm:text-base">
        <p className="text-base sm:text-lg text-muted/90 font-medium">
          Yaz aylarının kavurucu sıcakları, insanlar kadar can dostlarimizi da olumsuz etkiler. Köpeklerin ter bezleri olmadığından vücut ısılarını sadece soluk alıp vererek (hızlı nefes alma) ve patilerinden terleyerek dengelerler. Bu yüzden sıcak havalarda ısı çarpması riski çok yüksektir.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">1. Yürüyüş Saatlerini Doğru Ayarlayın</h2>
        <p>
          Yaz aylarında yürüyüşler kesinlikle günün en sıcak saatlerinde (11:00 - 17:00 arası) yapılmamalıdır. Sabahın erken saatleri veya akşam güneş battıktan sonraki serin saatler tercih edilmelidir. 
        </p>
        <p className="bg-[#FAF6F0] p-5 rounded-2xl border border-card-border text-sm italic text-muted">
          <strong className="text-primary font-bold">Pati Kuralı:</strong> Elinizin tersini asfalta 5 saniye boyunca bastırın. Eğer asfalt elinizi yakıyorsa, dostunuzun patilerini de yakacaktır. Yürüyüşü erteleyin ya da çim alanları tercih edin.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">2. Bol Taze Su ve Serin Alanlar Sunun</h2>
        <p>
          Yazın köpeklerin su tüketimi neredeyse iki katına çıkar. Evin farklı noktalarında her zaman taze, temiz ve soğuk (buzlu olmamak kaydıyla) su bulundurmalısınız. Güneş ışığına maruz kalan su kaplarını sık saatlerde yenileyin.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">3. Tıraş Konusunda Hatalardan Kaçının</h2>
        <p>
          Birçok köpek sahibi dostunun sıcaklamaması için tüylerini sıfıra yakın kestirir. Ancak çift katmanlı (Double Coat) tüylere sahip olan ırklar (Husky, Golden, Pomeranian, Chow Chow vb.) kesinlikle tıraş edilmemelidir. Tüyler, onları sıcaktan ve güneşin zararlı UV ışınlarından koruyan bir izolasyon tabakasıdır. Tıraş etmek güneş yanıklarına ve ısı çarpmasına davetiye çıkarır. Sadece düzenli tarama yaparak ölü tüylerden arındırmanız yeterlidir.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">4. Sıcak Arabada Asla Bırakmayın</h2>
        <p>
          Gölgede bile olsa, park halindeki bir arabanın içi 10 dakika içinde fırın sıcaklığına ulaşabilir. Camları hafif açık bırakmak bu sıcaklığı düşürmez. Dostunuzu araç içinde kesinlikle yalnız bırakmayın. Bu durum organ yetmezliğine ve ölüme yol açabilir.
        </p>
      </div>
    )
  },
  "pet-oteli-rehberi": {
    title: "Pet Oteli Seçerken Dikkat Edilmesi Gerekenler",
    description: "Tatile çıkarken evcil hayvanınızı güvenle bırakabileceğiniz bir pet oteli ararken nelere dikkat etmelisiniz?",
    category: "Rehberler",
    date: "8 Temmuz 2026",
    readTime: "3 dk okuma",
    author: "Vet. Hekim Can Demir",
    authorRole: "Veteriner Hekim & Diyetisyen",
    categoryColor: "bg-blue-500/10 text-blue-600",
    image: "/images/blog-pet-otel.png",
    content: (
      <div className="space-y-6 text-[#1A2E2D] leading-relaxed text-sm sm:text-base">
        <p className="text-base sm:text-lg text-muted/90 font-medium">
          Tatile çıkarken veya seyahat ederken aklımızın can dostumuzda kalmaması en büyük önceliğimizdir. Profesyonel bir pet oteli, onların güvende, temiz ve stresten uzak bir şekilde vakit geçirmelerini sağlamalıdır.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">1. Hijyen Standartları</h2>
        <p>
          Otel alanlarının düzenli dezenfekte edilmesi, havalandırma sistemlerinin bulunması ve ortak kullanım alanlarının temizliği salgın hastalıkların önlenmesinde bir numaralı önceliktir.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">2. Veteriner Hekim Kontrolü</h2>
        <p>
          Otelin bünyesinde veya hemen yanı başında acil durumlara müdahale edebilecek lisanslı veteriner hekimlerin bulunması, her türlü acil durumda hayati önem taşır.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">3. Bireysel İlgi ve Oyun Zamanı</h2>
        <p>
          Can dostlarımızın kafeslerde sürekli kapalı kalmaması, gün içinde bireysel olarak enerjilerini atabilecekleri oyun saatlerinin bulunması ve sosyalleştirilmeleri gerekir.
        </p>
      </div>
    )
  },
  "yavru-kopek-beslenmesi": {
    title: "Yavru Köpeklerde Beslenme Düzeni Nasıl Olmalı?",
    description: "Yavru köpeklerin sağlıklı kemik ve kas gelişimi için anne sütünden kuru mamaya geçiş süreçleri ve besleme sıklığı rehberi.",
    category: "Beslenme",
    date: "5 Temmuz 2026",
    readTime: "4 dk okuma",
    author: "Vet. Hekim Can Demir",
    authorRole: "Veteriner Hekim & Diyetisyen",
    categoryColor: "bg-purple-500/10 text-purple-600",
    image: "/images/blog-yavru-kopek.png",
    content: (
      <div className="space-y-6 text-[#1A2E2D] leading-relaxed text-sm sm:text-base">
        <p className="text-base sm:text-lg text-muted/90 font-medium">
          Yavru köpeklerin gelişim süreçleri oldukça hızlıdır. Bu dönemde alacakları vitaminler, mineraller ve protein miktarı, yetişkinlikteki eklem ve organ sağlığının temelini oluşturur.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">Öğün Sıklığı Nasıl Planlanmalı?</h2>
        <p>
          Yavruların mideleri küçük ancak enerji ihtiyaçları yüksektir. Bu yüzden günlük mama miktarı bölünerek verilmelidir:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted">
          <li><strong>2-4 Ay Arası:</strong> Günde 4 öğün</li>
          <li><strong>4-6 Ay Arası:</strong> Günde 3 öğün</li>
          <li><strong>6 Ay ve Üzeri:</strong> Günde 2 öğün</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">Anne Sütünden Kuru Mamaya Geçiş</h2>
        <p>
          Yavrular 6-8. haftaya kadar anne sütüyle beslenmelidir. Kuru mamaya geçiş aniden değil, mamayı ılık su veya et suyu ile yumuşatarak püre halinde başlanıp kademeli olarak yapılmalıdır.
        </p>
      </div>
    )
  },
  "kedilerde-kisirlastirma": {
    title: "Kedilerde Kısırlaştırma Sonrası Bakım Rehberi",
    description: "Kısırlaştırma ameliyatı sonrası iyileşme döneminde dikkat edilmesi gerekenler, yara bakımı ve beslenme değişiklikleri.",
    category: "Kedi Sağlığı",
    date: "2 Temmuz 2026",
    readTime: "5 dk okuma",
    author: "Dr. Selin Kaya",
    authorRole: "Uzman Veteriner Hekim",
    categoryColor: "bg-teal-500/10 text-teal-600",
    image: "/images/blog-kisirlastirma.png",
    content: (
      <div className="space-y-6 text-[#1A2E2D] leading-relaxed text-sm sm:text-base">
        <p className="text-base sm:text-lg text-muted/90 font-medium">
          Kısırlaştırma operasyonu, kedilerin daha sakin, sağlıklı ve uzun bir ömür sürmesine yardımcı olan rutin bir cerrahi işlemdir. Operasyon sonrasındaki ilk 1 hafta, yaranın korunması ve enfeksiyon riskinin önlenmesi açısından kritiktir.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">1. Yakalık (Elizabeth Tasması) Kullanımı</h2>
        <p>
          Kediler yaralarını yalayarak temizleme eğilimindedir. Ancak dillerindeki pürüzlü yapı dikişleri patlatabilir veya ağızlarındaki bakteriler yarayı enfekte edebilir. Hekimimizin önerdiği yakalığı dikişler alınana kadar (yaklaşık 7-10 gün) kesinlikle çıkarmamalısınız.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">2. Egzersiz Kısıtlaması</h2>
        <p>
          Ameliyat sonrası ilk 3-4 gün kedinizin yüksek yerlere (dolap üstü, kapı vb.) atlamasını engellemelisiniz. Ani hareketler iç dikişlere zarar verebilir. Mümkünse sakin, yumuşak bir odada dinlenmesini sağlayın.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-primary pt-4">3. Beslenme Düzeninde Değişiklik</h2>
        <p>
          Kısırlaştırma sonrası kedilerin metabolizması yavaşlar ve iştahları artar. Obezite riskini önlemek için hekiminizin önereceği kısırlaştırılmış kedi (Neutered) mamalarına geçiş yapmalı ve porsiyon kontrolü sağlamalısınız.
        </p>
      </div>
    )
  }
};

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.slug];
  
  if (!post) {
    return {
      title: "Yazı Bulunamadı | Patiler Vet",
    };
  }

  return {
    title: `${post.title} | Patiler Veteriner Kliniği`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Makalelere Geri Dön</span>
          </Link>
        </div>

        {/* Article Layout */}
        <article className="bg-white border border-card-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Post Header Image */}
          {post.image && (
            <div className="relative w-full aspect-[21/9] bg-muted">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-8 sm:p-12 space-y-6">
            {/* Category & Date */}
            <div className="flex items-center flex-wrap gap-3 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${post.categoryColor}`}>
                {post.category}
              </span>
              <span className="text-muted/60">•</span>
              <span className="text-muted font-medium">{post.date}</span>
              <span className="text-muted/60">•</span>
              <span className="text-muted font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                {post.readTime}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-sans text-primary leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center gap-3.5 border-y border-card-border py-5 my-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {post.author.split(' ').pop()?.charAt(0) || <User className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-primary flex items-center gap-1">
                  {post.author}
                  <Award className="w-3.5 h-3.5 text-accent" />
                </p>
                <p className="text-xs text-muted/80">{post.authorRole}</p>
              </div>
            </div>

            {/* Main Body */}
            <div className="prose prose-teal max-w-none">
              {post.content}
            </div>

            {/* Call to Action Inside Article */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 sm:p-8 mt-12 border border-card-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="font-bold text-primary text-base">Dostunuzun Kontrol Zamanı mı Geldi?</h4>
                <p className="text-xs text-muted">Hemen AI asistanımızla konuşun veya bize ulaşarak hızlıca randevunuzu planlayın.</p>
              </div>
              <Link 
                href="/iletisim"
                className="btn-accent !py-3 !px-6 !text-sm !rounded-xl whitespace-nowrap flex items-center gap-1.5"
              >
                <span>İletişime Geçin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>

      </div>
    </div>
  );
}
