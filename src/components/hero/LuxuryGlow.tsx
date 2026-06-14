import React from "react";
import { cn } from "@/lib/utils";

interface LuxuryGlowProps {
  className?: string;
  color?: "primary" | "gold" | "white";
}

export function LuxuryGlow({ className, color = "primary" }: LuxuryGlowProps) {
  const colorMap = {
    primary: "bg-primary/20",
    gold: "bg-gold/15",
    white: "bg-white/10",
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-none blur-[120px] rounded-full animate-pulse-slow",
        colorMap[color],
        className,
      )}
    />
  );
}
