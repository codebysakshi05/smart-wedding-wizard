import React from "react";

export function CinematicGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
      {/* ── Bloom Lighting ── */}
      <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] bg-primary/20 blur-[140px] rounded-full animate-pulse-slow opacity-60 mix-blend-screen" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-gold/15 blur-[140px] rounded-full animate-pulse-slow opacity-40 mix-blend-screen" />
      <div className="absolute top-0 right-1/4 w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow delay-700 opacity-30" />

      {/* ── Central Spotlight (Behind Content) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[60%] bg-primary/10 blur-[180px] rounded-full opacity-80" />

      {/* ── Luxury Gradient Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-gold/10 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.15)_100%)]" />

      {/* ── Textural Grain & Shimmer ── */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 bg-shimmer pointer-events-none opacity-20" />
    </div>
  );
}
