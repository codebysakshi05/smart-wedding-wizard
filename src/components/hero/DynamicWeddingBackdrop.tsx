import React, { useState, useEffect } from "react";
import SmartImage from "../ui/SmartImage";
import { fixAssetPath } from "@/utils/fixAssetPath";

const BACKDROPS = {
  hindu: fixAssetPath("/assets/hero-rajasthan-palace.jpg"),
  muslim: fixAssetPath("/assets/hero-ballroom-reception.jpg"),
  christian: fixAssetPath("/assets/hero-goa-beach.jpg"),
  sikh: fixAssetPath("/assets/hero-ballroom-reception.jpg"),
  "south-indian": fixAssetPath("/assets/hero-south-indian-temple.jpg"),
  default: fixAssetPath("/assets/wedding-floral-arch.jpg"),
};

interface DynamicWeddingBackdropProps {
  religion?: keyof typeof BACKDROPS;
  autoRotate?: boolean;
}

export function DynamicWeddingBackdrop({
  religion,
  autoRotate = false,
}: DynamicWeddingBackdropProps) {
  const [currentId, setCurrentId] = useState(BACKDROPS[religion || "default"]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (religion) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentId(BACKDROPS[religion] || BACKDROPS.default);
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [religion]);

  useEffect(() => {
    if (autoRotate && !religion) {
      const keys = Object.keys(BACKDROPS).filter((k) => k !== "default") as Array<
        keyof typeof BACKDROPS
      >;
      let i = 0;
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentId(BACKDROPS[keys[i]]);
          setIsTransitioning(false);
          i = (i + 1) % keys.length;
        }, 1000);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, religion]);

  const src = currentId || BACKDROPS.default;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[2000ms] ${isTransitioning ? "opacity-0" : "opacity-100"}`}
    >
      <SmartImage
        src={src}
        alt="Luxury Wedding Backdrop"
        className="h-full w-full object-cover blur-[2px] opacity-65 brightness-[1.02] saturate-[0.95] transition-opacity duration-1000"
        containerClassName="absolute inset-0 bg-transparent"
        preload
      />
    </div>
  );
}
