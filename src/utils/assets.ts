/**
 * assets.ts — Universal asset path builder and image resolver
 * Consolidated export hub to prevent Vite SSR conflicts.
 */

export {
  getCategoryImage,
  getVenueImage,
  getDecorImage,
  getOutfitImage,
  getHeroImage,
  getMandapImage,
  getPhotographyImage,
  getFoodImage,
  getServiceImage,
  getStageImage,
  getFallbackImage,
  getRandomImage,
  getEntertainmentImage,
  handleImageFallback,
} from "./imageEngine";

export { resolveGalleryByFolder as getGallery } from "./imageGalleryResolver";
export { resolveImage, resolveGallery } from "./assetImageLoader";

/**
 * Generic asset path builder - for non-image files
 */
export function getAsset(path: string): string {
  const clean = path.startsWith("/assets/") ? path : `/assets/${path.replace(/^\/+/, "")}`;
  return clean;
}
