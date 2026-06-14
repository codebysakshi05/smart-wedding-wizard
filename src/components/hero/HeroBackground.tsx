import React, { useEffect, useState } from "react";
import { DynamicWeddingScene } from "./DynamicWeddingScene";
import { LuxuryBackdrop } from "./LuxuryBackdrop";
import { CinematicGlow } from "./CinematicGlow";
import { FloatingParticles } from "./FloatingParticles";

interface HeroBackgroundProps {
  religion?: any;
  autoRotate?: boolean;
}

export function HeroBackground({ religion, autoRotate = true }: HeroBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FFFEFA] z-0">
      {/* ── Layer 1: Cinematic Scene ── */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out z-0"
        style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px) scale(1.12)` }}
      >
        <DynamicWeddingScene religion={religion} autoRotate={autoRotate} />
      </div>

      {/* ── Layer 2 & 3: Haze, Blur & Gold Overlays ── */}
      <LuxuryBackdrop />

      {/* ── Layer 4: Floating Particles & Glow ── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <FloatingParticles />
        <CinematicGlow />
      </div>

      {/* ── Soft Warm Edge ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/40 z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.2)_100%)] z-20" />
    </div>
  );
}
