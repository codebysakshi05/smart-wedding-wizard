/**
 * imageGalleryResolver.ts
 * =======================
 * Manifest-driven gallery loader for /public/assets.
 * Requirements:
 *  - dynamically load images via extension detection (.webp/.jpg/.jpeg/.png)
 *  - normalize lowercase folder paths
 *  - stop repeated images (de-dupe)
 *  - return unique, stable results for any folder prefix
 */

import MANIFEST from "@/data/assetManifest.json";

const manifest: Record<string, string> = MANIFEST as Record<string, string>;

export type ImageExt = ".webp" | ".jpg" | ".jpeg" | ".png";

const SUPPORTED_EXTS: ImageExt[] = [".webp", ".jpg", ".jpeg", ".png"];

function normalizeFolder(folderPath: string): string {
  // Ensure leading slash, remove trailing slash, lowercase
  return ("/" + folderPath.replace(/^\/+/, "").replace(/\/+$/, "").trim()).toLowerCase();
}

function hasSupportedExt(url: string): boolean {
  const lower = url.toLowerCase();
  return SUPPORTED_EXTS.some((ext) => lower.endsWith(ext));
}

function uniqStable(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    if (!x) continue;
    const key = x.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(x);
  }
  return out;
}

/**
 * Resolve all images whose manifest key (folder) starts with the given folderPath prefix.
 * Example:
 *  - folderPath: '/assets/venues/goa/premium/taj-holiday-village'
 *  - returns all files under that folder.
 */
export function resolveGalleryByFolder(folderPath: string): string[] {
  if (!folderPath) return [];
  const key = normalizeFolder(folderPath);
  const prefixKey = key + "/";

  const urls: string[] = [];
  for (const [manifestKey, url] of Object.entries(manifest)) {
    const k = normalizeFolder(manifestKey);
    if (k === key || k.startsWith(prefixKey)) {
      if (hasSupportedExt(url)) urls.push(url);
    }
  }

  return uniqStable(urls);
}

/**
 * Convenience: resolve a "cover" image from a folder by preferring common extensions.
 * It does not hardcode a single extension; it uses the manifest mapping.
 */
export function resolvePrimaryImageFromFolder(folderPath: string): string | null {
  const gallery = resolveGalleryByFolder(folderPath);
  return gallery.length ? gallery[0] : null;
}
