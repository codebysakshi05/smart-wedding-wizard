import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles, Heart, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

type Msg = { role: "user" | "ai"; text: string };

const QUICK_SUGGESTIONS = [
  "Best venues under ₹20 lakh?",
  "What should a bride wear for Mehndi?",
  "How many days before should I book vendors?",
  "Suggest a Sangeet theme",
  "Tips for royal Rajasthan weddings",
  "Groom outfit for Sikh wedding?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Namaste! ✨ I'm your personal AI wedding consultant. Ask me anything about venues, décor, budgets, ceremonies, or outfits — I'm here to help compose your dream wedding.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;

    const userMsg: Msg = { role: "user", text };
    const currentMessages = [...messages, userMsg];

    setMessages(currentMessages);
    setInput("");
    setTyping(true);
    setShowSuggestions(false);

    try {
      const history = messages
        .filter((m) => m.role !== "ai" || !m.text.startsWith("Namaste!"))
        .map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
        }));

      const res = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: text, history }),
      });

      setMessages([...currentMessages, { role: "ai", text: res.data.response }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages([
        ...currentMessages,
        {
          role: "ai",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full grid place-items-center shadow-[0_8px_40px_rgba(201,153,74,0.35)] hover:scale-110 transition-all duration-300"
        style={{ background: GOLD }}
        aria-label="Open chat"
      >
        {open ? <X className="h-5 w-5 text-black" /> : <Sparkles className="h-5 w-5 text-black" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-[380px] rounded-[2rem] overflow-hidden flex flex-col border border-white/10 animate-in slide-in-from-bottom-4 fade-in duration-400"
          style={{
            background: "rgba(8,6,3,0.96)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,153,74,0.08)",
            height: "520px",
          }}
        >
          {/* ── HEADER ── */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b border-white/8"
            style={{ background: "rgba(201,153,74,0.05)" }}
          >
            <div className="relative">
              <div
                className="h-10 w-10 rounded-full grid place-items-center shadow-[0_0_20px_rgba(201,153,74,0.3)]"
                style={{ background: GOLD }}
              >
                <Heart className="h-4 w-4 text-black fill-black" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-black" />
            </div>
            <div className="flex-1">
              <p
                className="font-display text-lg text-white leading-none"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                AI Wedding Consultant
              </p>
              <p
                className="text-[0.6rem] uppercase tracking-[0.25em] mt-1 font-bold"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Online · Instant replies
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── MESSAGES ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div
                    className="h-7 w-7 rounded-full grid place-items-center flex-shrink-0"
                    style={{ background: GOLD }}
                  >
                    <Sparkles className="h-3 w-3 text-black" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                    m.role === "user"
                      ? "rounded-br-sm text-black"
                      : "rounded-bl-sm text-white/85 border border-white/8"
                  }`}
                  style={
                    m.role === "user"
                      ? { background: GOLD }
                      : { background: "rgba(255,255,255,0.06)" }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2.5">
                <div
                  className="h-7 w-7 rounded-full grid place-items-center flex-shrink-0"
                  style={{ background: GOLD }}
                >
                  <Sparkles className="h-3 w-3 text-black" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm border border-white/8"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex gap-1.5 items-center">
                    {[0, 180, 360].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 rounded-full animate-bounce"
                        style={{
                          background: "rgba(201,153,74,0.7)",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[0.6rem] uppercase tracking-widest text-white/25 font-bold">
                  Popular questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-3 py-1.5 rounded-full text-[0.65rem] border border-white/10 text-white/50 hover:border-amber-400/40 hover:text-amber-400 transition-all duration-200 bg-white/3"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── INPUT ── */}
          <div
            className="p-3 border-t border-white/8 flex gap-2 items-center"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="flex-1 flex items-center rounded-full border border-white/10 focus-within:border-amber-400/30 transition-all px-4"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask your wedding consultant…"
                className="flex-1 bg-transparent py-3 text-sm outline-none text-white/80 placeholder:text-white/20"
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 hover:shadow-[0_0_20px_rgba(201,153,74,0.4)] transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
              style={{ background: GOLD }}
              aria-label="Send"
            >
              <Send className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
