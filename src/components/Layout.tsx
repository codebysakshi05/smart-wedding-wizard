import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import { WeddingBackground } from "./hero/WeddingBackground";

interface LayoutProps {
  children: ReactNode;
  /** Set true on the home page so no extra padding-top is added — hero handles its own spacing */
  fullBleed?: boolean;
}

export function Layout({ children, fullBleed = false }: LayoutProps) {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* ── Fixed cinematic background ─────────────────────── */}
      <div className="fixed inset-0 z-0">
        <WeddingBackground />
      </div>

      {/* ── Base dark scrim (barely visible — lets the imagery shine) ── */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.04)" }}
      />

      {/* ── Ambient gold orbs ───────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2]">
        <div
          className="absolute -top-48 -left-48 h-[560px] w-[560px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(201,153,74,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-48 h-[440px] w-[440px] rounded-full opacity-25 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(220,160,80,0.30) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Single global floating navbar ──────────────────── */}
      <Navbar />

      {/* ── Page content ───────────────────────────────────── */}
      <div
        className={`relative z-10 w-full flex flex-col min-h-screen ${fullBleed ? "" : "pt-28"}`}
      >
        <div className="flex-1 w-full">{children}</div>
        <div className="w-full max-w-7xl mx-auto px-6 pb-10">
          <Footer />
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
