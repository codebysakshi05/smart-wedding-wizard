import { useState, useEffect } from "react";
import { getHeroImage, getVenueImage } from "@/utils/assets";
import { handleImageFallback } from "@/utils/imageEngine";

const SLIDE_MS = 6000;
const FADE_MS = 2000;

export function WeddingBackground() {
  const [slides, setSlides] = useState<string[]>([]);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [out, setOut] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load images on mount using dynamic resolver
  useEffect(() => {
    try {
      // Functions are now synchronous - no async needed!
      const hero1 = getHeroImage("homepage");
      const hero2 = getHeroImage("planner");
      const hero3 = getHeroImage("explore");
      const hero4 = getHeroImage("dashboard");

      setSlides([hero1, hero2, hero3, hero4]);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load wedding slides:", err);
      setSlides([]);
      setLoading(false);
    }
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;

    const t = setInterval(() => {
      const next = (cur + 1) % slides.length;
      setPrev(cur);
      setOut(true);
      const cleanup = setTimeout(() => {
        setCur(next);
        setPrev(null);
        setOut(false);
      }, FADE_MS);
      return () => clearTimeout(cleanup);
    }, SLIDE_MS);

    return () => clearInterval(t);
  }, [cur, slides.length]);

  const slideStyle = (isLeaving = false): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
    opacity: isLeaving ? (out ? 0 : 1) : 1,
    transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
    animation: isLeaving ? "none" : `wedding-ken-burns ${SLIDE_MS + FADE_MS}ms ease-out both`,
  });

  // Show loading state while images are being resolved
  if (loading || slides.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-[100vh] min-h-[100vh] overflow-hidden bg-black" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-[100vh] min-h-[100vh] overflow-hidden bg-black">
      {prev !== null && (
        <img
          src={slides[prev]}
          alt="Wedding Background"
          style={slideStyle(true)}
          className="transform-gpu backface-hidden"
          draggable={false}
          onError={handleImageFallback}
          loading="lazy"
        />
      )}
      <img
        key={cur}
        src={slides[cur]}
        alt="Wedding Background"
        style={slideStyle(false)}
        className="transform-gpu backface-hidden"
        draggable={false}
        onError={handleImageFallback}
        loading="lazy"
      />
    </div>
  );
}
