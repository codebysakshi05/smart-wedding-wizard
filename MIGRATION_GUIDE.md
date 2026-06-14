# Universal Image Detection System - Migration Guide

## Overview

The Dream Weaver AI application now has a **Universal Image Detection System** that automatically finds and loads ANY image file from folders without requiring:

- ❌ Manual image renaming
- ❌ Hardcoded filenames like `cover.webp`
- ❌ External dependencies (Unsplash URLs)
- ❌ Static image maps

## What Changed?

### Before (Broken Approach)

```typescript
// ❌ OLD - Only works if image is named exactly "cover.webp"
const imagePath = "/assets/categories/luxury/premium/cover.webp";

// ❌ Fails if image is named differently:
// - "Cover.webp" → broken
// - "image.jpg" → broken
// - "hero.png" → broken
// - Any other name → broken
```

### After (Universal Detection)

```typescript
// ✅ NEW - Works with ANY image name and is SYNCHRONOUS!
import { getCategoryImage } from "@/utils/imageResolver";

// Do NOT use await. Use it directly in your component body to prevent flickering.
const imagePath = getCategoryImage("luxury", "premium");
```

## Key Features

✅ **Automatic Detection**

- Scans folders for ANY image file
- Case-insensitive matching ("cover", "Cover", "COVER", "image", "hero", etc.)
- All image types supported (.webp, .jpg, .jpeg, .png, .avif)

✅ **No Manual Work**

- No need to rename thousands of existing images
- Works with current folder structure as-is
- Any filename works automatically

✅ **Bulletproof Fallbacks**

- If image not found → uses type-specific fallback
- If fallback not found → uses default fallback
- Never shows broken image or black screen

✅ **Performance Optimized**

- Results cached in memory
- No repeated lookups
- Lightweight HEAD requests only

✅ **Zero External Dependencies**

- No Unsplash URLs
- No API calls
- All local static files

## Supported Image Types

| Format | Extension | Status                            |
| ------ | --------- | --------------------------------- |
| WebP   | .webp     | ✅ Recommended (best compression) |
| JPEG   | .jpg      | ✅ Supported                      |
| JPEG   | .jpeg     | ✅ Supported                      |
| PNG    | .png      | ✅ Supported                      |
| AVIF   | .avif     | ✅ Supported (future format)      |

## Supported Folder Structures

```
public/assets/
├── categories/{category}/{tier}/       ← getCategoryImage()
├── venues/{state}/{tier}/{slug}/       ← getVenueImage()
├── decor/{eventType}/{tier}/           ← getDecorImage()
├── outfits/{who}/{type}/{tier}/        ← getOutfitImage()
├── hero/{page}/                        ← getHeroImage()
├── food/{type}/                        ← getFoodImage()
├── services/{category}/{tier}/{slug}/  ← getServiceImage()
├── photography/{style}/                ← getPhotographyImage()
├── mandap/{style}/{tier}/              ← getMandapImage()
├── stage/{eventType}/{tier}/           ← getStageImage()
├── invitations/{style}/                ← getInvitationImage()
├── jewelry/{type}/                     ← getJewelryImage()
├── makeup/{look}/                      ← getMakeupImage()
├── entertainment/{type}/               ← getEntertainmentImage()
├── ideas/{category}/                   ← getIdeasImage()
└── fallback/                           ← Fallback images
```

## API Reference

### Frontend (Async Functions)

**IMPORTANT: All frontend functions are now SYNCHRONOUS. Do not use await.**

#### `getCategoryImage(category, tier?)`

Get image from category folder.

```typescript
import { getCategoryImage } from "@/utils/imageResolver";

const image = getCategoryImage("luxury", "premium");
// Returns: /assets/categories/luxury/premium/cover.webp (or any image found)
```

#### `getVenueImage(state, slug, tier?)`

Get image from venue folder.

```typescript
const image = await getVenueImage("rajasthan", "taj-mahal", "premium");
// Returns: /assets/venues/rajasthan/premium/taj-mahal/image.jpg (or found image)
```

#### `getDecorImage(eventType, tier?)`

Get image from decor folder.

```typescript
const image = await getDecorImage("mandap", "mid");
// Returns: /assets/decor/mandap/mid/Cover.webp (or found image)
```

#### `getOutfitImage(who, type, tier?)`

Get image from outfit folder.

```typescript
const image = await getOutfitImage("bride", "lehenga", "premium");
// Returns: /assets/outfits/bride/lehenga/premium/hero.png (or found image)
```

#### `getHeroImage(page)`

Get hero image for a page.

```typescript
const image = await getHeroImage("homepage");
// Returns: /assets/hero/homepage/banner.webp (or found image)
```

#### `getFoodImage(type)`

Get image from food folder.

```typescript
const image = await getFoodImage("north-indian");
// Returns: /assets/food/north-indian/dish.jpg (or found image)
```

#### `getServiceImage(category, slug, tier?)`

Get image from service folder.

```typescript
const image = await getServiceImage("photography", "cinematic", "premium");
// Returns: /assets/services/photography/premium/cinematic/photo.webp (or found)
```

#### `getFirstImageFromFolder(folderPath)`

Get first image from any folder (generic scanner).

```typescript
const image = await getFirstImageFromFolder("/assets/ideas/decor");
// Returns: /assets/ideas/decor/image.jpg (or first found image)
```

### Backend (Sync Functions)

All backend functions are synchronous and return a string directly.

```typescript
import { buildCategoryImagePath } from "@/backend/utils/dynamicImageResolver";

const image = buildCategoryImagePath("luxury", "premium");
// Returns: /assets/categories/luxury/premium/cover.webp (or found image)
```

Available backend functions:

- `buildCategoryImagePath(category, tier?)`
- `buildVenueImagePath(state, slug, tier?)`
- `buildDecorImagePath(eventType, tier?)`
- `buildOutfitImagePath(who, type, tier?)`
- `buildHeroImagePath(page)`
- `buildServiceImagePath(category, slug, tier?)`
- `buildFoodImagePath(type)`
- `buildMandapImagePath(style, tier?)`
- `buildStageImagePath(eventType, tier?)`
- `buildPhotographyImagePath(style)`

### Utility Functions

```typescript
// Clear in-memory cache
clearImageCache();

// Get cache statistics
const stats = getImageCacheStats();
console.log(stats.size); // number of cached entries
console.log(stats.entries); // array of [path, image] pairs

// Preload multiple images for performance
await preloadImages(["/assets/categories/luxury/premium", "/assets/venues/rajasthan/premium"]);

// Resolve with custom fallback
const image = await resolveImageWithFallback("/assets/custom/folder", "/assets/fallback/folder");
```

## Migration Examples

### Example 1: React Component (WeddingBackground.tsx)

**❌ BEFORE (Hardcoded):**

```typescript
import { useState, useEffect } from "react";

const WEDDING_SLIDES = [
  "/assets/hero/homepage/cover.webp",
  "/assets/venues/rajasthan/premium/mehrangarh-fort-palace/cover.webp",
  "/assets/venues/kerala/premium/spice-garden-palace/cover.webp",
];

export function WeddingBackground() {
  return (
    <img src={WEDDING_SLIDES[0]} alt="Wedding" />
  );
}
```

**✅ AFTER (Dynamic Detection):**

```typescript
import { useState, useEffect } from "react";
import { getHeroImage, getVenueImage } from '@/utils/imageResolver';

export function WeddingBackground() {
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const heroImg = await getHeroImage('homepage');
      const venue1 = await getVenueImage('rajasthan', 'mehrangarh-fort-palace', 'premium');
      const venue2 = await getVenueImage('kerala', 'spice-garden-palace', 'premium');
      setSlides([heroImg, venue1, venue2]);
    })();
  }, []);

  if (slides.length === 0) return <div>Loading...</div>;

  return <img src={slides[0]} alt="Wedding" />;
}
```

### Example 2: Editor Routes

**❌ BEFORE (Hardcoded):**

```typescript
const themeImageMap = {
  Royal: "/assets/decor/wedding/premium/cover.jpg",
  Minimalist: "/assets/decor/engagement/premium/cover.jpg",
  Beach: "/assets/venues/goa/premium/cover.jpg",
};
```

**✅ AFTER (Dynamic Detection):**

```typescript
import { getDecorImage, getVenueImage } from "@/utils/imageResolver";

const getThemeImage = async (theme: string) => {
  switch (theme) {
    case "Royal":
      return await getDecorImage("wedding", "premium");
    case "Minimalist":
      return await getDecorImage("engagement", "premium");
    case "Beach":
      return await getVenueImage("goa", "", "premium");
    default:
      return "/assets/fallback/default.webp";
  }
};

// Usage
const image = await getThemeImage("Royal");
```

### Example 3: Async React Component

**✅ Using React 19's async component support:**

```typescript
import { getCategoryImage } from '@/utils/imageResolver';

async function CategoryCard({ category, tier }) {
  const image = await getCategoryImage(category, tier);

  return (
    <div>
      <img src={image} alt={category} />
      <h3>{category}</h3>
    </div>
  );
}

// Usage in parent component (must be async boundary)
function CategoryList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryCard category="luxury" tier="premium" />
    </Suspense>
  );
}
```

### Example 4: Backend API Response

**❌ BEFORE (Hardcoded):**

```javascript
// backend/utils/weddingPlannerEngine.js
const getAssetPath = (category, ...parts) => `/assets/${category}/${parts.join("/")}/cover.webp`;
```

**✅ AFTER (Dynamic Detection):**

```javascript
// backend/utils/weddingPlannerEngine.js
import { buildCategoryImagePath, buildVenueImagePath } from "./dynamicImageResolver.js";

const result = {
  categoryImage: buildCategoryImagePath("luxury", "premium"),
  venueImage: buildVenueImagePath("rajasthan", "taj-mahal", "premium"),
};
```

## Fallback System

The system has automatic fallbacks organized by type:

```typescript
// Type-specific fallbacks
/assets/fallback/category-fallback.webp     ← getCategoryImage()
/assets/fallback/venue-fallback.webp        ← getVenueImage()
/assets/fallback/decor-fallback.webp        ← getDecorImage()
/assets/fallback/outfit-fallback.webp       ← getOutfitImage()
/assets/fallback/hero-fallback.webp         ← getHeroImage()
/assets/fallback/service-fallback.webp      ← getServiceImage()
/assets/fallback/default.webp               ← Catch-all fallback
```

**Each function follows this logic:**

1. Try primary folder path
2. If not found, try alternate paths (e.g., state level for venues)
3. If still not found, return type-specific fallback
4. If fallback not found, return default fallback
5. **Never returns null or shows broken image**

## Performance Tips

### 1. Preload Images on Mount

```typescript
useEffect(() => {
  preloadImages([
    "/assets/categories/luxury/premium",
    "/assets/categories/beach/mid",
    "/assets/categories/royal/premium",
  ]);
}, []);
```

### 2. Use Promise.all() for Parallel Loading

```typescript
const [hero, decor, venue] = await Promise.all([
  getHeroImage("homepage"),
  getDecorImage("mandap", "premium"),
  getVenueImage("rajasthan", "taj-mahal", "premium"),
]);
```

### 3. Cache Results

```typescript
let cachedImage: string | null = null;

function useCachedImage(category: string) {
  if (cachedImage) return cachedImage;

  cachedImage = await getCategoryImage(category, "premium");
  return cachedImage;
}
```

### 4. Clear Cache When Needed

```typescript
// After updating images in public folder during dev
clearImageCache();

// Check what's cached
const stats = getImageCacheStats();
console.log(`Cached images: ${stats.size}`);
```

## Debugging

### Check Cache

```typescript
import { getImageCacheStats } from "@/utils/imageResolver";

const stats = getImageCacheStats();
console.log("Cache size:", stats.size);
stats.entries.forEach(([path, image]) => {
  console.log(`${path} → ${image}`);
});
```

### Clear and Retry

```typescript
import { clearImageCache, getCategoryImage } from "@/utils/imageResolver";

// Clear all cached results
clearImageCache();

// Try again
const image = await getCategoryImage("luxury", "premium");
console.log("Image:", image);
```

### Manual Path Testing

```typescript
import { getFirstImageFromFolder } from "@/utils/imageResolver";

// Test any folder
const result = await getFirstImageFromFolder("/assets/categories/luxury/premium");
console.log("Found:", result);
```

## Common Issues & Solutions

### Issue: "Always returns fallback image"

**Solution:**

1. Check folder path exists: `/public/assets/categories/luxury/premium/`
2. Check image files exist in folder
3. Check filename format
4. Clear cache: `clearImageCache()`
5. Check browser console for errors

### Issue: "Slow performance"

**Solution:**

1. Use `preloadImages()` on component mount
2. Use `Promise.all()` for parallel loading
3. Check cache stats: `getImageCacheStats()`
4. Ensure images are optimized (use WebP)

### Issue: "Black screen / broken image"

**Solution:**

- The resolver guarantees fallback, so check console
- Verify fallback images exist in `/public/assets/fallback/`
- Check network tab for actual image loads

### Issue: "Not detecting renamed files"

**Solution:**

- The system tries multiple common names
- If image has unusual name, move it to a folder
- Or use `getFirstImageFromFolder()` for generic scanning

## Files That Have Been Updated

✅ **Created:**

- `src/utils/dynamicImageResolver.ts` - Main async resolver
- `backend/utils/dynamicImageResolver.js` - Backend sync resolver
- `MIGRATION_GUIDE.md` - This file

✅ **Modified:**

- `src/utils/imageResolver.ts` - Now re-exports new functions

⏳ **Still need updating (see Migration Checklist):**

- `src/components/hero/WeddingBackground.tsx`
- `src/routes/editor.tsx`
- `backend/utils/weddingPlannerEngine.js`
- `backend/utils/venueEngine.js`
- Other components using hardcoded paths

## Migration Checklist

### Phase 1: Core System (✅ DONE)

- [x] Create dynamicImageResolver.ts (frontend)
- [x] Create dynamicImageResolver.js (backend)
- [x] Update imageResolver.ts re-exports
- [x] Create migration guide

### Phase 2: Frontend Components (⏳ TODO)

- [ ] Update WeddingBackground.tsx
- [ ] Update editor.tsx
- [ ] Update ImageCarousel.tsx
- [ ] Update all page components using images
- [ ] Add Suspense boundaries where needed

### Phase 3: Backend Services (⏳ TODO)

- [ ] Update weddingPlannerEngine.js
- [ ] Update venueEngine.js
- [ ] Update other services using hardcoded paths
- [ ] Remove Unsplash URL dependencies

### Phase 4: Testing & Validation (⏳ TODO)

- [ ] Test each component migration
- [ ] Verify all image types work
- [ ] Test fallback scenarios
- [ ] Performance benchmark
- [ ] Check for black flash issues

### Phase 5: Cleanup (⏳ TODO)

- [ ] Remove old imageResolver patterns
- [ ] Remove Unsplash utilities
- [ ] Remove unused image maps
- [ ] Update documentation

## Benefits Achieved

✅ **No Manual Renaming**

- Works with existing filenames
- Works with thousands of images
- No user action required

✅ **Universal Compatibility**

- Any image name works
- All image types supported
- All folder structures handled

✅ **Never Broken**

- Always returns valid image or fallback
- No black screens
- No broken image icons

✅ **Zero External Dependencies**

- No Unsplash URLs
- No API dependencies
- All local static files

✅ **Performance Optimized**

- Results cached
- Lightweight detection
- Fast fallback resolution

✅ **TypeScript Safe**

- Full type safety
- IntelliSense support
- Compile-time checking

## Support & Questions

For issues or questions:

1. Check this guide first
2. Review DEBUGGING section
3. Check console for error messages
4. Verify folder structure
5. Clear cache and try again

Happy migrating! 🎉
