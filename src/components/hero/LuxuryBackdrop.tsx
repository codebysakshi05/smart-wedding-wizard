import React from "react";

export function LuxuryBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* ── Layer 2: Cinematic Haze & Blur ── */}
      <div className="absolute inset-0 backdrop-blur-[1px] opacity-20 bg-gradient-to-b from-white/10 via-transparent to-white/40" />

      {/* ── Layer 3: Warm Gold Gradient Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-gold/10 mix-blend-screen" />

      {/* ── Soft Bloom Center ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,253,240,0.4)_0%,transparent_70%)]" />
    </div>
  );
}
