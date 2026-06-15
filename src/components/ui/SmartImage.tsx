import React, { useState, useRef, useEffect } from "react";
import { fixAssetPath } from "@/utils/fixAssetPath";
import { resolveImage } from "@/utils/assetImageLoader";

const FALLBACK = "/assets/fallback/cover.webp";

interface SmartImageProps {
  path?: string;
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  preload?: boolean;
  aspectRatio?: string;
  fallbackType?: string;
  priority?: boolean;
}

export default function SmartImage({
  path,
  src,
  alt = "Image",
  className = "",
  containerClassName = "",
  aspectRatio = "",
  priority = false,
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const rawPath = path || src || FALLBACK;

  // Folder paths → resolve via manifest; file paths (with extension) → pass through
  const resolvedPath = rawPath.match(/\.(webp|jpg|jpeg|png|avif)$/i)
    ? rawPath
    : resolveImage(rawPath);

  const initialSrc = fixAssetPath(resolvedPath || FALLBACK);

  // Handle already-cached images (onLoad may not fire)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [initialSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img || img.src.includes("fallback")) {
      setHasError(true);
      setIsLoaded(true); // show fallback placeholder
      return;
    }
    // Try fallback
    img.src = FALLBACK;
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName} ${aspectRatio}`}>
      {/* Skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" />
      )}

      {hasError ? (
        /* Error state — subtle placeholder */
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
          <span className="text-neutral-700 text-xs uppercase tracking-widest">Image</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={initialSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
