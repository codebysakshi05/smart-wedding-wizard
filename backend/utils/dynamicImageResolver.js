/**
 * Dynamic Image Resolver - Backend Edition
 * =========================================
 * Synchronous version for Node.js backend use.
 *
 * Since backend files cannot use async/await for synchronous image resolution,
 * this version uses synchronous patterns and pre-built knowledge of folder structures.
 *
 * For dynamic detection, it provides utility functions that build likely paths,
 * and the server can verify them via file system checks if needed.
 */

import fs from "fs";
import path from "path";

const PUBLIC_ASSETS_DIR = path.join(process.cwd(), "public", "assets");

const SUPPORTED_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

const COMMON_IMAGE_NAMES = ["cover", "hero", "image", "main", "primary", "featured", "top"];

// Cache for file existence checks
const fileExistsCache = new Map();

/**
 * Check if a file exists on the file system.
 */
function fileExists(filePath) {
  if (fileExistsCache.has(filePath)) {
    return fileExistsCache.get(filePath) || false;
  }

  try {
    const fullPath = path.join(PUBLIC_ASSETS_DIR, filePath.replace(/^\/+/, ""));
    const exists = fs.existsSync(fullPath);
    fileExistsCache.set(filePath, exists);
    return exists;
  } catch {
    return false;
  }
}

/**
 * Find first image in a folder using common names.
 */
export function findImageInFolderSync(folderPath) {
  const cleanPath = folderPath.startsWith("/") ? folderPath : `/${folderPath}`;

  // Try each common image name with each supported extension
  for (const name of COMMON_IMAGE_NAMES) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const imagePath = `${cleanPath}/${name}${ext}`.replace(/\/+/g, "/");
      if (fileExists(imagePath)) {
        return imagePath;
      }
    }
  }

  // Try case variations
  for (const name of COMMON_IMAGE_NAMES) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const imagePath = `${cleanPath}/${capitalizedName}${ext}`.replace(/\/+/g, "/");
      if (fileExists(imagePath)) {
        return imagePath;
      }
    }
  }

  return null;
}

/**
 * Get fallback image based on type.
 */
function getFallbackImage(type = "default") {
  const fallbacks = {
    venue: "/assets/fallback/venue-fallback.webp",
    category: "/assets/fallback/category-fallback.webp",
    decor: "/assets/fallback/decor-fallback.webp",
    outfit: "/assets/fallback/outfit-fallback.webp",
    hero: "/assets/fallback/hero-fallback.webp",
    service: "/assets/fallback/service-fallback.webp",
    default: "/assets/fallback/default.webp",
  };

  return fallbacks[type] || fallbacks.default;
}

/**
 * Build likely image path for category.
 * Returns best guess or fallback.
 */
export function buildCategoryImagePath(category, tier = "mid") {
  if (!category || !tier) {
    return getFallbackImage("category");
  }

  const folderPath = `/assets/categories/${category.toLowerCase()}/${tier.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("category");
}

/**
 * Build likely image path for venue.
 */
export function buildVenueImagePath(state, slug, tier = "mid") {
  if (!state || !slug || !tier) {
    return getFallbackImage("venue");
  }

  // Try primary path
  let folderPath = `/assets/venues/${state.toLowerCase()}/${tier.toLowerCase()}/${slug.toLowerCase()}`;
  let image = findImageInFolderSync(folderPath);

  if (image) {
    return image;
  }

  // Fallback to state-level image
  folderPath = `/assets/venues/${state.toLowerCase()}/${tier.toLowerCase()}`;
  image = findImageInFolderSync(folderPath);

  if (image) {
    return image;
  }

  return getFallbackImage("venue");
}

/**
 * Build likely image path for decor.
 */
export function buildDecorImagePath(eventType, tier = "mid") {
  if (!eventType || !tier) {
    return getFallbackImage("decor");
  }

  const folderPath = `/assets/decor/${eventType.toLowerCase()}/${tier.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("decor");
}

/**
 * Build likely image path for outfit.
 */
export function buildOutfitImagePath(who, type, tier = "mid") {
  if (!who || !type || !tier) {
    return getFallbackImage("outfit");
  }

  const folderPath = `/assets/outfits/${who.toLowerCase()}/${type.toLowerCase()}/${tier.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("outfit");
}

/**
 * Build likely image path for hero.
 */
export function buildHeroImagePath(page) {
  if (!page) {
    return getFallbackImage("hero");
  }

  const folderPath = `/assets/hero/${page.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("hero");
}

/**
 * Build likely image path for service.
 */
export function buildServiceImagePath(category, slug, tier = "mid") {
  if (!category || !slug || !tier) {
    return getFallbackImage("service");
  }

  let folderPath = `/assets/services/${category.toLowerCase()}/${tier.toLowerCase()}/${slug.toLowerCase()}`;
  let image = findImageInFolderSync(folderPath);

  if (image) {
    return image;
  }

  // Fallback to category-level image
  folderPath = `/assets/services/${category.toLowerCase()}/${tier.toLowerCase()}`;
  image = findImageInFolderSync(folderPath);

  if (image) {
    return image;
  }

  return getFallbackImage("service");
}

/**
 * Build likely image path for food.
 */
export function buildFoodImagePath(type) {
  if (!type) {
    return getFallbackImage("default");
  }

  const folderPath = `/assets/food/${type.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("default");
}

/**
 * Build likely image path for mandap.
 */
export function buildMandapImagePath(style, tier = "mid") {
  if (!style || !tier) {
    return getFallbackImage("decor");
  }

  const folderPath = `/assets/mandap/${style.toLowerCase()}/${tier.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("decor");
}

/**
 * Build likely image path for stage.
 */
export function buildStageImagePath(eventType, tier = "mid") {
  if (!eventType || !tier) {
    return getFallbackImage("decor");
  }

  const folderPath = `/assets/stage/${eventType.toLowerCase()}/${tier.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("decor");
}

/**
 * Build likely image path for photography.
 */
export function buildPhotographyImagePath(style) {
  if (!style) {
    return getFallbackImage("service");
  }

  const folderPath = `/assets/photography/${style.toLowerCase()}`;
  const image = findImageInFolderSync(folderPath);

  return image || getFallbackImage("service");
}

/**
 * Clear file existence cache.
 */
export function clearFileCache() {
  fileExistsCache.clear();
}

/**
 * Get cache statistics for debugging.
 */
export function getFileCacheStats() {
  return {
    size: fileExistsCache.size,
    entries: Array.from(fileExistsCache.entries()),
  };
}
