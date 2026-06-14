import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";

interface Props {
  images: string[];
  alt?: string;
  aspectRatio?: string;
  onFullscreen?: (src: string) => void;
  className?: string;
  autoPlay?: boolean;
}

export function ImageCarousel({
  images,
  alt = "Wedding image",
  aspectRatio = "aspect-video",
  onFullscreen,
  className = "",
  autoPlay = false,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const valid = Array.isArray(images) ? images.filter(Boolean) : [];

  useEffect(() => {
    setIdx(0);
    setLoaded(false);
  }, [images]);

  useEffect(() => {
    if (!autoPlay || valid.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % valid.length), 4200);
    return () => clearInterval(t);
  }, [autoPlay, valid.length]);

  if (!valid.length)
    return <div className={`${aspectRatio} rounded-3xl skeleton-shimmer ${className}`} />;

  const prev = () => setIdx((i) => (i - 1 + valid.length) % valid.length);
  const next = () => setIdx((i) => (i + 1) % valid.length);

  return (
    <div className={`relative ${aspectRatio} rounded-3xl overflow-hidden group ${className}`}>
      {/* Image */}
      <SmartImage
        key={idx}
        path={valid[idx]}
        alt={`${alt} ${idx + 1}`}
        className="w-full h-full object-cover transition-opacity duration-700 absolute inset-0"
        fallbackType="default"
      />

      {/* Controls — only show when >1 image */}
      {valid.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {valid.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-300 ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Fullscreen button */}
      {onFullscreen && (
        <button
          onClick={() => onFullscreen(valid[idx])}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:bg-black/70"
          aria-label="Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Image count badge */}
      {valid.length > 1 && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.65rem] font-medium backdrop-blur-sm">
          {idx + 1} / {valid.length}
        </div>
      )}
    </div>
  );
}
