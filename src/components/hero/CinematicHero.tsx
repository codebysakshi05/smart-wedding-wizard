import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ArrowRight, Play, Sparkles, Star, Heart, Camera, Crown } from "lucide-react";
import { WeddingBackground } from "./WeddingBackground";
import { motion, AnimatePresence } from "motion/react";

// ──────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────
const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";
const GOLD_SOLID = "#c9994a";

const STATS = [
  { value: "500+", label: "Royal Venues", icon: Crown },
  { value: "200K+", label: "Happy Couples", icon: Heart },
  { value: "50K+", label: "Elite Vendors", icon: Star },
  { value: "150K+", label: "Events Planned", icon: Camera },
];

const HERO_WORDS = ["Dream Wedding", "Royal Ceremony", "Perfect Moments", "Love Story"];

// ──────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────
export default function CinematicHero() {
  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // ── Mount delay for smooth entrance ──────────
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Cycling hero words ────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setWordIdx((i) => (i + 1) % HERO_WORDS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // ── GSAP: smooth parallax on mouse move ───────
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      rafId = 0;
    const STRENGTH = 14;

    const onMove = (e: MouseEvent) => {
      tx = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * STRENGTH;
      ty = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * STRENGTH;
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      gsap.set(el, { x: cx, y: cy, scale: 1.06 });
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── GSAP: stagger entrance animations ─────────
  useEffect(() => {
    if (!mounted) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (titleRef.current)
      tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.3);
    if (subtitleRef.current)
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.7,
      );
    if (ctaRef.current)
      tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 1.0);
    if (statsRef.current)
      tl.fromTo(statsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.3);
  }, [mounted]);

  return (
    <div className="relative w-full h-[100vh] min-h-[100vh] bg-black text-white overflow-hidden">
      {/* ── CINEMATIC BACKGROUND ──────────────────────────── */}
      <div ref={parallaxRef} className="absolute inset-0 z-0 will-change-transform scale-[1.05]">
        <WeddingBackground />
      </div>

      {/* ── MULTI-LAYER CINEMATIC OVERLAYS ───────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(10,6,2,0.15) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ── HERO CONTENT ─────────────────────────────────── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-32 pb-10">
        {/* ── MAIN CONTENT AREA ────────────── */}
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-5xl mx-auto w-full">
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -16 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center gap-2.5 mb-8"
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30"
              style={{ background: "rgba(201,153,74,0.12)", backdropFilter: "blur(16px)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[0.62rem] uppercase tracking-[0.38em] text-amber-300 font-bold">
                AI-Powered Luxury Wedding Planning
              </span>
            </div>
          </motion.div>

          {/* ── CINEMATIC HEADLINE ─────────── */}
          <div ref={titleRef} style={{ opacity: 0 }}>
            {/* Line 1 */}
            <h1
              className="leading-[0.9] tracking-tight mb-2"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(52px, 9.5vw, 118px)",
                color: "#fff",
                textShadow: "0 2px 40px rgba(0,0,0,0.5)",
              }}
            >
              Design Your
            </h1>

            {/* Line 2 — gold animated cycling word */}
            <div className="overflow-hidden mb-2" style={{ height: "clamp(56px, 10vw, 128px)" }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={wordIdx}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  className="leading-[0.9] tracking-tight italic"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(52px, 9.5vw, 118px)",
                    background: GOLD,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px rgba(201,153,74,0.35))",
                  }}
                >
                  {HERO_WORDS[wordIdx]}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Line 3 */}
            <h1
              className="leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(52px, 9.5vw, 118px)",
                color: "#fff",
                textShadow: "0 2px 40px rgba(0,0,0,0.5)",
              }}
            >
              With AI
            </h1>
          </div>

          {/* ── SUBTITLE ───────────────────── */}
          <p
            ref={subtitleRef}
            className="mt-6 max-w-2xl leading-relaxed mx-auto text-center"
            style={{
              opacity: 0,
              fontFamily: "'Barlow', sans-serif",
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Personalized recommendations, trusted vendors, stunning venues, and unforgettable
            wedding experiences — crafted by AI.
          </p>

          {/* ── CTA BUTTONS ────────────────── */}
          <div
            ref={ctaRef}
            className="flex items-center justify-center gap-4 mt-10 flex-wrap"
            style={{ opacity: 0 }}
          >
            <Link
              to="/plan"
              className="group relative overflow-hidden flex items-center gap-3 rounded-full px-8 py-4 text-[0.75rem] uppercase tracking-[0.28em] font-bold text-black transition-all duration-500 hover:scale-105 active:scale-95"
              style={{
                background: GOLD,
                boxShadow: "0 0 40px rgba(201,153,74,0.50), 0 4px 24px rgba(0,0,0,0.30)",
              }}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              <span className="relative">Begin Your Journey</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/explore"
              className="group flex items-center gap-3 rounded-full px-8 py-4 text-[0.75rem] uppercase tracking-[0.28em] font-bold text-white border transition-all duration-300 hover:scale-105 hover:border-amber-400/50 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current opacity-70" />
              <span>Explore Inspirations</span>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM BAR ───────────────────────────────────── */}
        <div className="shrink-0 w-full">
          <div
            ref={statsRef}
            className="flex flex-col md:flex-row items-center justify-between gap-6 w-full"
            style={{ opacity: 0 }}
          >
            {/* Bottom left descriptor */}
            <p
              className="max-w-[200px] text-center md:text-left text-[0.65rem] uppercase tracking-[0.22em] leading-relaxed"
              style={{ fontFamily: "'Barlow', sans-serif", color: "rgba(255,255,255,0.65)" }}
            >
              AI-powered wedding planning designed for unforgettable celebrations
            </p>

            {/* Stats pills */}
            <div
              className="flex items-stretch divide-x rounded-2xl overflow-hidden shrink-0 mx-auto"
              style={{
                background: "rgba(8,5,0,0.55)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(201,153,74,0.15)",
                boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
              }}
            >
              {STATS.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="px-6 py-4 text-center flex flex-col items-center gap-0.5"
                  style={{ borderColor: "rgba(201,153,74,0.12)" }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3" style={{ color: GOLD_SOLID }} />
                  </div>
                  <p
                    className="text-lg font-bold leading-none"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-[0.52rem] uppercase tracking-[0.2em] text-white/50 font-semibold mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom right descriptor */}
            <p
              className="max-w-[200px] text-center md:text-right text-[0.65rem] uppercase tracking-[0.22em] leading-relaxed hidden md:block"
              style={{ fontFamily: "'Barlow', sans-serif", color: "rgba(255,255,255,0.65)" }}
            >
              Venues · Outfits · Rituals · Decor · Vendors
              <br />
              all tailored to your vision
            </p>
          </div>
        </div>
      </div>

      {/* ── AMBIENT GOLD ORB (bottom center) ─────────────── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none z-[3]"
        style={{
          background: "radial-gradient(ellipse, rgba(201,153,74,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── SCROLL LINE INDICATOR ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col items-center gap-3"
      >
        <div
          className="h-16 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${GOLD_SOLID}80, transparent)`,
          }}
        />
        <span
          className="text-[0.48rem] uppercase tracking-[0.35em] rotate-90 origin-center translate-y-5"
          style={{ color: "rgba(201,153,74,0.55)" }}
        >
          Scroll
        </span>
      </motion.div>
    </div>
  );
}
