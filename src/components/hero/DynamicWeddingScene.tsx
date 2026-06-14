import React, { useState, useEffect } from "react";
import SmartImage from "../ui/SmartImage";
import { getMandapImage, getDecorImage, getVenueImage } from "@/utils/assets";

const SCENES = {
  hindu: getDecorImage("wedding", "premium"),
  muslim: getDecorImage("nikah", "premium"),
  christian: getDecorImage("church", "premium"),
  sikh: getDecorImage("sangeet", "premium"),
  "south-indian": getDecorImage("temple", "premium"),
  default: getVenueImage("rajasthan", "premium"),
};

interface DynamicWeddingSceneProps {
  religion?: keyof typeof SCENES;
  autoRotate?: boolean;
}

export function DynamicWeddingScene({ religion, autoRotate = true }: DynamicWeddingSceneProps) {
  const [currentId, setCurrentId] = useState(SCENES[religion || "default"]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (religion) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentId(SCENES[religion] || SCENES.default);
        setIsTransitioning(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [religion]);

  useEffect(() => {
    if (autoRotate && !religion) {
      const keys = Object.keys(SCENES).filter((k) => k !== "default") as Array<keyof typeof SCENES>;
      let i = 0;
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentId(SCENES[keys[i]]);
          setIsTransitioning(false);
          i = (i + 1) % keys.length;
        }, 1500);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, religion]);

  const src = currentId;

  return (
    <div
      className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
    >
      <SmartImage
        src={src}
        alt="Luxury Wedding Backdrop"
        className="h-full w-full object-cover blur-[1.5px] opacity-55 transition-opacity duration-1000"
        containerClassName="absolute inset-0 bg-transparent"
        preload
      />
    </div>
  );
}
