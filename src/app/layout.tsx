import type { Metadata, Viewport } from "next";
import { getSettings } from "@/lib/settings";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: `${settings.clinicName} | Sevgi ve Uzmanlıkla Dostlarınızın Yanındayız`,
    description: `Patiler Veteriner Kliniği satış ve tanıtım demosu. Evcil hayvanlarınız için aşı takvimi, cerrahi operasyon, genel muayene ve pet otel gibi uzman veteriner çözümleri sunuyoruz.`,
    keywords: ["veteriner kliniği", "kedi aşı takvimi", "köpek bakımı", "pet otel", "veteriner randevu", "veteriner hekim"],
    authors: [{ name: settings.clinicName }],
    robots: "index, follow",
    openGraph: {
      title: `${settings.clinicName} | Sevgi ve Uzmanlıkla Dostlarınızın Yanındayız`,
      description: "Evcil hayvanlarınız için uzman veteriner hekim kadromuzla yanınızdayız.",
      type: "website",
      locale: "tr_TR",
    },
  };
}

import { Plus_Jakarta_Sans, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import DemoBanner from "@/components/DemoBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { Analytics } from "@vercel/analytics/react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings();

  return (
    <html
      lang="tr"
      className={`${plusJakarta.variable} ${inter.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <DemoBanner />
        <Header settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
        <ChatbotWidget />
        <Analytics />
      </body>
    </html>
  );
}
