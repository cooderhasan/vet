"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, PawPrint, Calendar, Phone, Stethoscope } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  bookingReceipt?: {
    name: string;
    phone: string;
    pet: string;
    service: string;
    datetime: string;
  };
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Merhaba! Patiler Veteriner Kliniği AI Asistanına hoş geldiniz. 🐾\n\nSize çalışma saatlerimiz, aşı programımız, kısırlaştırma süreçleri veya fiyatlarımız hakkında bilgi verebilirim. Randevu oluşturmak isterseniz 'Randevu almak istiyorum' yazabilirsiniz. Nasıl yardımcı olabilirim?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle outside UI trigger (e.g. from "Randevu Al" buttons)
  useEffect(() => {
    const handleOpenBooking = () => {
      setIsOpen(true);
      
      // Prevent duplicates if already starting/in progress
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.content.toLowerCase().includes("randevu")) {
        return;
      }
      
      sendSystemTrigger("Randevu almak istiyorum");
    };

    window.addEventListener("open-chatbot-booking", handleOpenBooking);
    return () => window.removeEventListener("open-chatbot-booking", handleOpenBooking);
  }, [messages]);

  const sendSystemTrigger = async (text: string) => {
    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sunucu hatası oluştu.");
      }

      processBotResponse(data.message, updatedMessages);
    } catch (err: any) {
      setErrorMsg(err.message || "Mesaj gönderilemedi.");
      setIsLoading(false);
    }
  };

  const processBotResponse = async (botText: string, currentMessages: Message[]) => {
    const xmlRegex = /<appointment_data>([\s\S]*?)<\/appointment_data>/;
    const match = botText.match(xmlRegex);
    
    let cleanText = botText;
    let bookingData = null;

    if (match) {
      cleanText = botText.replace(xmlRegex, "").trim();
      try {
        bookingData = JSON.parse(match[1]);
      } catch (e) {
        console.error("JSON Parse error of appointment data", e);
      }
    }

    const botMessage: Message = {
      id: Math.random().toString(),
      role: "assistant",
      content: cleanText,
    };

    let nextMessages = [...currentMessages, botMessage];

    if (bookingData) {
      // Create background appointment
      try {
        const appointRes = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        
        const appointData = await appointRes.json();
        
        if (appointRes.ok) {
          // Add receipt card message
          const receiptMessage: Message = {
            id: Math.random().toString(),
            role: "system",
            content: "Randevu talebiniz başarıyla kaydedildi!",
            bookingReceipt: bookingData,
          };
          nextMessages.push(receiptMessage);
        } else {
          throw new Error(appointData.error || "Randevu API hatası.");
        }
      } catch (err: any) {
        console.error("Error creating appointment:", err);
        nextMessages.push({
          id: Math.random().toString(),
          role: "system",
          content: `⚠️ Randevu kaydedilirken hata oluştu: ${err.message || "Bilinmeyen hata"}`
        });
      }
    }

    setMessages(nextMessages);
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setErrorMsg("");

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sunucu hatası.");
      }

      processBotResponse(data.message, updatedMessages);
    } catch (err: any) {
      setErrorMsg(err.message || "Mesaj gönderilirken hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white rounded-3xl border border-card-border shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 animate-fade-in">
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-xl">
                <PawPrint className="w-5 h-5 text-accent fill-accent" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm tracking-tight">Patiler Asistan</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  <span className="text-[10px] text-white/70 font-semibold uppercase">Çevrimiçi (AI)</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5] text-sm">
            {messages.map((msg) => {
              if (msg.role === "system" && msg.bookingReceipt) {
                // Render booking receipt
                const rec = msg.bookingReceipt;
                return (
                  <div key={msg.id} className="bg-secondary/15 border-2 border-dashed border-secondary/50 rounded-2xl p-4 text-primary space-y-3 shadow-inner my-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-accent font-bold">
                      <Calendar className="w-5 h-5" />
                      <span>Randevu Talebi Alındı!</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted border-t border-card-border/50 pt-2 font-medium">
                      <p><span className="font-semibold text-primary">Hasta Yakını:</span> {rec.name}</p>
                      <p><span className="font-semibold text-primary">İletişim Tel:</span> {rec.phone}</p>
                      <p><span className="font-semibold text-primary">Dostumuz:</span> {rec.pet}</p>
                      <p><span className="font-semibold text-primary">İşlem:</span> {rec.service}</p>
                      <p><span className="font-semibold text-primary">Tarih & Saat:</span> {rec.datetime}</p>
                    </div>
                    <p className="text-[11px] text-accent/80 font-bold leading-normal border-t border-card-border/50 pt-2">
                      ✓ En kısa sürede uygun saat doğrulaması için sizi telefonla arayacağız.
                    </p>
                  </div>
                );
              }

              const isBot = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-line leading-relaxed ${
                      isBot
                        ? "bg-white border border-card-border text-primary"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-card-border text-muted rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="text-center bg-red-50 text-red-600 text-xs py-2 px-3 rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-card-border bg-white flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Sorunuzu buraya yazın..."
              disabled={isLoading}
              className="flex-grow bg-background border border-card-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all disabled:opacity-55"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-xl transition-all disabled:opacity-55 flex-shrink-0 flex items-center justify-center active:scale-95"
              aria-label="Gönder"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 active:scale-95 hover:shadow-primary/30"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-semibold text-xs whitespace-nowrap">
          AI Asistan
        </span>
      </button>

    </div>
  );
}
