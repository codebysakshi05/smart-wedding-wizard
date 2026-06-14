/**
 * src/utils/imageEngine.ts
 * DYNAMIC IMAGE ENGINE - Uses Manifest-Based Resolution with Deterministic Rotation
 */

import MANIFEST from "@/data/assetManifest.json";

// Normalize helpers
const toLower = (str?: string): string => (str || "").toLowerCase().trim();
const withDash = (str?: string): string => toLower(str).replace(/\s+/g, "-");

const GLOBAL_FALLBACK = "/assets/fallback/cover.webp";

const manifestObj = MANIFEST as Record<string, string>;
const manifestKeys = Object.keys(manifestObj).sort();
const requestCounts: Record<string, number> = {};

function resolveFromManifest(folderPath: string): string {
  const normalized = folderPath.replace(/\/$/, "");
  const key = normalized.toLowerCase();

  // 1. Exact match
  if (manifestObj[key]) {
    return manifestObj[key];
  }

  // 2. Prefix match (find ALL keys that start with `key/` or exactly `key`)
  const prefix = key + "/";
  let matches = manifestKeys.filter((k) => k === key || k.startsWith(prefix));

  // 3. Broader fallback (if we asked for /assets/venues/goa/premium but it doesn't exist, try /assets/venues/goa)
  if (matches.length === 0) {
    const parts = key.split("/");
    if (parts.length > 3) {
      parts.pop(); // remove tier
      const broaderPrefix = parts.join("/") + "/";
      matches = manifestKeys.filter((k) => k === parts.join("/") || k.startsWith(broaderPrefix));
    }
  }

  // 4. If we found matches, distribute them deterministically
  if (matches.length > 0) {
    if (!requestCounts[key]) {
      requestCounts[key] = 0;
    }
    const index = requestCounts[key] % matches.length;
    requestCounts[key]++;
    return manifestObj[matches[index]];
  }

  // Fallback to global
  return GLOBAL_FALLBACK;
}

export function getCategoryImage(category: string, budget: string = "mid"): string {
  return resolveFromManifest(`/assets/categories/${withDash(category)}/${toLower(budget)}`);
}

export function getVenueImage(state: string, budget: string = "mid"): string {
  return resolveFromManifest(`/assets/venues/${withDash(state)}/${toLower(budget)}`);
}

export function getDecorImage(theme: string, budget: string = "mid"): string {
  return resolveFromManifest(`/assets/decor/${withDash(theme)}/${toLower(budget)}`);
}

export function getOutfitImage(type: string, style?: string): string {
  const path = style
    ? `/assets/outfits/${withDash(type)}/${withDash(style)}/premium`
    : `/assets/outfits/${withDash(type)}/premium`;
  return resolveFromManifest(path);
}

export function getHeroImage(page: string): string {
  return resolveFromManifest(`/assets/hero/${withDash(page)}`);
}

export function getMandapImage(style: string, budget: string = "premium"): string {
  return resolveFromManifest(`/assets/mandap/${withDash(style)}/${toLower(budget)}`);
}

export function getPhotographyImage(theme: string, budget: string = "premium"): string {
  return resolveFromManifest(`/assets/photography/${withDash(theme)}/${toLower(budget)}`);
}

export function getFoodImage(type: string): string {
  return resolveFromManifest(`/assets/food/${withDash(type)}`);
}

export function getServiceImage(category: string, budget: string = "premium"): string {
  return resolveFromManifest(`/assets/services/${withDash(category)}/${toLower(budget)}`);
}

export function getStageImage(type: string, budget: string = "mid"): string {
  return resolveFromManifest(`/assets/stage/${withDash(type)}/${toLower(budget)}`);
}

export function getFallbackImage(): string {
  return GLOBAL_FALLBACK;
}

export function getRandomImage(folder: string): string {
  return resolveFromManifest(`/assets/${folder.toLowerCase()}`);
}

export function getEntertainmentImage(type: string, budget?: string): string {
  const path = budget
    ? `/assets/entertainment/${withDash(type)}/${toLower(budget)}`
    : `/assets/entertainment/${withDash(type)}`;
  return resolveFromManifest(path);
}

export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  if (!img) return;

  const currentUrl = new URL(img.src, window.location.origin);
  const path = currentUrl.pathname;

  if (path === GLOBAL_FALLBACK) return;

  // Since assets might be served under /wedding-data in production but / in dev
  // we try fallback permutations natively
  const state = parseInt(img.dataset.fbState || "0", 10);
  const basePath = path.replace(/\.(webp|avif|jpg|jpeg|png)$/, "");

  switch (state) {
    case 0:
      img.src = `${basePath}.webp`;
      img.dataset.fbState = "1";
      break;
    case 1:
      img.src = `${basePath}.avif`;
      img.dataset.fbState = "2";
      break;
    case 2:
      img.src = `${basePath}.jpg`;
      img.dataset.fbState = "3";
      break;
    case 3:
      img.src = GLOBAL_FALLBACK;
      img.dataset.fbState = "4";
      break;
  }
}
