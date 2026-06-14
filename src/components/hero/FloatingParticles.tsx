import React from "react";

export function FloatingParticles() {
  const particles = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {particles.map((_, i) => {
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 15;
        const opacity = Math.random() * 0.4 + 0.1;
        const shimmer = Math.random() > 0.5;

        return (
          <div
            key={i}
            className={`absolute rounded-full bg-gold-light/40 blur-[0.5px] animate-float ${shimmer ? "animate-pulse" : ""}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity: opacity,
              animationDelay: `${delay}s`,
              animationDuration: shimmer
                ? `${duration}s, ${Math.random() * 3 + 2}s`
                : `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
