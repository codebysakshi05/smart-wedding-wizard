/**
 * strictAssetResolver.ts
 * ======================
 * STRICT hierarchical asset mapping engine.
 * Solves the issue of random images by enforcing exact folder mapping.
 */

import MANIFEST from "@/data/assetManifest.json";

const GLOBAL_FALLBACK = "/assets/fallback/cover.webp";

function getManifest(): Record<string, string> {
  return MANIFEST as Record<string, string>;
}

function resolveStrict(
  exactFolder: string,
  budgetFallback: string,
  categoryPrefix: string,
): string {
  const manifest = getManifest();

  // 1. Exact Folder Match
  const exact = manifest[exactFolder.toLowerCase()];
  if (exact) {
    return exact;
  }

  // 2. Exact Budget Match (if exactFolder was a specific slug that failed)
  if (budgetFallback) {
    const budgetPrefix = budgetFallback.toLowerCase() + "/";
    const budgetMatch = Object.keys(manifest).find(
      (k) => k.startsWith(budgetPrefix) || k === budgetFallback.toLowerCase(),
    );
    if (budgetMatch) {
      return manifest[budgetMatch];
    }
  }

  // 3. Same Category Fallback
  // (e.g. if /assets/venues/rajasthan/premium fails, try any /assets/venues/rajasthan)
  const prefix = categoryPrefix.toLowerCase() + "/";
  const categoryFallback = Object.keys(manifest).find(
    (k) => k.startsWith(prefix) || k === categoryPrefix.toLowerCase(),
  );
  if (categoryFallback) {
    const matched = manifest[categoryFallback];
    return matched;
  }

  // 4. Global Fallback
  return GLOBAL_FALLBACK;
}

export function getCategoryImage(category: string, budget: string = "mid"): string {
  if (!category) return GLOBAL_FALLBACK;
  const path = `/assets/categories/${category}/${budget}`;
  const prefix = `/assets/categories/${category}`;
  return resolveStrict(path, path, prefix);
}

export function getVenueImage(state: string, budget: string = "mid", slug: string = ""): string {
  if (!state) return GLOBAL_FALLBACK;
  const budgetPath = `/assets/venues/${state}/${budget}`;
  const path = slug ? `${budgetPath}/${slug}` : budgetPath;
  const prefix = `/assets/venues/${state}`;
  return resolveStrict(path, budgetPath, prefix);
}

export function getDecorImage(event: string, budget: string = "mid"): string {
  if (!event) return GLOBAL_FALLBACK;
  const path = `/assets/decor/${event}/${budget}`;
  const prefix = `/assets/decor/${event}`;
  return resolveStrict(path, path, prefix);
}

export function getOutfitImage(type: string, style: string, budget: string = "mid"): string {
  if (!type || !style) return GLOBAL_FALLBACK;
  const path = `/assets/outfits/${type}/${style}/${budget}`;
  const prefix = `/assets/outfits/${type}/${style}`;
  return resolveStrict(path, path, prefix);
}

export function getHeroImage(page: string): string {
  if (!page) return GLOBAL_FALLBACK;
  const path = `/assets/hero/${page}`;
  return resolveStrict(path, "", path);
}

export function getMandapImage(theme: string, budget: string = "mid"): string {
  if (!theme) return GLOBAL_FALLBACK;
  const path = `/assets/mandap/${theme}/${budget}`;
  const prefix = `/assets/mandap/${theme}`;
  return resolveStrict(path, path, prefix);
}

export function getStageImage(type: string, budget: string = "mid"): string {
  if (!type) return GLOBAL_FALLBACK;
  const path = `/assets/stage/${type}/${budget}`;
  const prefix = `/assets/stage/${type}`;
  return resolveStrict(path, path, prefix);
}

// Keep a few common ones that might still be used:
export function getServiceImage(
  category: string,
  budget: string = "mid",
  slug: string = "",
): string {
  if (!category) return GLOBAL_FALLBACK;
  const budgetPath = `/assets/services/${category}/${budget}`;
  const path = slug ? `${budgetPath}/${slug}` : budgetPath;
  const prefix = `/assets/services/${category}`;
  return resolveStrict(path, budgetPath, prefix);
}

export function getPhotographyImage(style: string): string {
  if (!style) return GLOBAL_FALLBACK;
  const path = `/assets/photography/${style}`;
  return resolveStrict(path, "", path);
}

export function getFoodImage(type: string): string {
  if (!type) return GLOBAL_FALLBACK;
  const path = `/assets/catering/${type}/premium`;
  const prefix = `/assets/catering/${type}`;
  return resolveStrict(path, path, prefix);
}

export function getFallbackImage(): string {
  return GLOBAL_FALLBACK;
}
