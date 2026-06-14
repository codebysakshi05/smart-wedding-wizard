import React, { useState } from "react";
import { handleImageFallback } from "@/utils/imageEngine";
import { fixAssetPath } from "@/utils/fixAssetPath";
import { resolveImage } from "@/utils/assetImageLoader";

interface SmartImageProps {
  path?: string;
  src?: string;
  alt?: string;
  /** Classes applied to the <img> element (animations, filters, etc.) */
  className?: string;
  /** Classes applied to the wrapper div (use when you need special sizing/positioning) */
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
  const rawPath = path || src || "/assets/fallback/cover.webp";
  // Folder paths → resolve via manifest; file paths (with extension) → pass through
  const resolvedPath = rawPath.match(/\.(webp|jpg|jpeg|png|avif)$/i)
    ? rawPath
    : resolveImage(rawPath);
  const initialSrc = fixAssetPath(resolvedPath);

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName} ${aspectRatio}`}>
      {/* Dark skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800" />
      )}

      {/* Image — className goes here so scale/brightness/filter animations work */}
      <img
        src={initialSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          // Keep skeleton loader active while trying fallbacks
          setIsLoaded(false);
          handleImageFallback(e);
          // If all fallbacks are exhausted (it returned early), we'll just keep showing the skeleton
          // or we could set isLoaded(true) to show the cover. The onLoad of the fallback cover will trigger setIsLoaded(true).
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}
