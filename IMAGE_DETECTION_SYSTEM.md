# Universal Image Detection System - Documentation

## Overview

The Dream Weaver AI application now features a **Universal Image Detection System** that automatically detects ANY image file in the `/public/assets/` directory structure, regardless of filename.

### Key Features

✅ **Zero Manual Configuration** - No hardcoded filenames needed  
✅ **Any Image Format** - Supports `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif`  
✅ **Any Filename** - Works with `cover.jpg`, `Cover.png`, `image.webp`, random names, etc.  
✅ **Automatic Fallback** - Never shows broken images or black screens  
✅ **Build-Time Scanning** - Uses Vite's `import.meta.glob` for zero runtime overhead  
✅ **Folder Hierarchy** - Supports nested folders and budget tiers (budget/mid/premium)

## Architecture

### Main Components

**`src/utils/dynamicImageResolver.ts`** - Core resolver with all image detection logic

- Scans `/public/assets/` at build time using Vite glob
- Groups images by folder and prioritizes 'cover' names
- Provides fallback for each category type
- Exports all public functions

**`src/utils/imageResolver.ts`** - Re-export wrapper for backward compatibility

- Simply re-exports all functions from dynamicImageResolver

**`src/utils/assets.ts`** - Primary API for components

- Re-exports all functions for easy import
- Provides `getAsset()` helper for non-image files
- Most commonly imported module in components

**`src/components/ui/SmartImage.tsx`** - Enhanced image component

- Prevents loading flickers and black flashing
- Automatic fallback on error
- Skeleton loader while image loads
- Type-safe fallback types

## Usage Guide

### Basic Image Resolution

```typescript
import { getCategoryImage, getVenueImage } from "@/utils/assets";

// Get category image (any filename in folder)
const categoryImg = getCategoryImage("luxury", "premium");
// Returns: /assets/categories/luxury/premium/[any-image-file]

// Get venue image
const venueImg = getVenueImage("rajasthan", "mid", "taj-mahal");
// Returns: /assets/venues/rajasthan/mid/taj-mahal/[any-image-file]
```

### All Available Functions

#### Categories

```typescript
getCategoryImage(category: string, tier: string = 'mid'): string
// getCategoryImage('luxury', 'premium')
// getCategoryImage('beach', 'mid')
// getCategoryImage('traditional', 'budget')
```

#### Venues

```typescript
getVenueImage(state: string, tier: string, slug: string): string
// getVenueImage('rajasthan', 'premium', 'taj-mahal')
// getVenueImage('goa', 'mid', 'taj-exotica')
// Falls back to state-level image if venue not found
// Falls back to default if state not found
```

#### Decor

```typescript
getDecorImage(eventType: string, tier: string = 'mid'): string
// getDecorImage('wedding', 'premium')
// getDecorImage('engagement', 'mid')
```

#### Outfits

```typescript
getOutfitImage(who: string, type: string, tier: string = 'mid'): string
// getOutfitImage('bride', 'lehenga', 'premium')
// getOutfitImage('groom', 'sherwani', 'mid')
```

#### Events & Media

```typescript
getHeroImage(page: string): string
getFoodImage(type: string): string
getServiceImage(category: string, tier: string, slug: string): string
getPhotographyImage(style: string): string
getInvitationImage(style: string): string
getJewelryImage(type: string, tier: string = 'mid'): string
getMakeupImage(type: string, tier: string = 'mid'): string
getEntertainmentImage(type: string): string
getIdeasImage(category: string, tier: string = 'mid'): string
getMandapImage(style: string, tier: string = 'mid'): string
getStageImage(eventType: string, tier: string = 'mid'): string
```

#### Utility Functions

```typescript
// Get first image from any folder
getFirstImageFromFolder(folderPath: string): string | null
// getFirstImageFromFolder('/assets/ideas')

// Get fallback image by type
getFallbackImage(type: string = 'default'): string
// getFallbackImage('venue')
// getFallbackImage('default')

// Cache management
getImageCacheStats(): { size: number; sample: Record<string, string | null> }
clearImageCache(): void
preloadImages(folderPath: string): void

// Utility resolution
resolveImageWithFallback(imagePath: string | null, fallback?: string): string

// Find any image in folder (alias for getFirstImageFromFolder)
findImageInFolder(folderPath: string): string | null
```

## Using SmartImage Component

The `SmartImage` component is the recommended way to display images:

```typescript
import SmartImage from '@/components/ui/SmartImage';

<SmartImage
  path={getCategoryImage('luxury', 'premium')}
  alt="Luxury Category"
  className="w-full h-64 object-cover rounded"
  fallbackType="category"
  priority={false}
/>
```

**Props:**

- `path` (required): Image path or URL
- `alt` (optional): Alt text for accessibility
- `className` (optional): CSS classes
- `fallbackType` (optional): Fallback type for error handling
- `priority` (optional): Set to `true` to load eagerly

**Benefits:**

- Prevents black flashing during image load
- Automatic fallback on error
- Skeleton loader while loading
- No broken image icons

## Folder Structure

Expected structure in `/public/assets/`:

```
public/assets/
├── categories/
│   ├── luxury/
│   │   ├── premium/
│   │   │   ├── cover.jpg (or any image file)
│   │   │   ├── Cover.png
│   │   │   └── image.webp
│   │   ├── mid/
│   │   └── budget/
│   ├── beach/
│   ├── traditional/
│   └── ...
├── venues/
│   ├── rajasthan/
│   │   ├── premium/
│   │   │   └── taj-mahal/
│   │   │       └── (any image file)
│   │   └── ...
│   ├── goa/
│   └── ...
├── decor/
├── outfits/
├── hero/
├── food/
├── services/
├── mandap/
├── stage/
├── photography/
├── invitations/
├── jewelry/
├── makeup/
├── entertainment/
├── ideas/
└── fallback/
    ├── default-cover.webp
    ├── venue-fallback.webp
    ├── decor-fallback.webp
    ├── outfit-fallback.webp
    └── food-fallback.webp
```

## Fallback System

The system maintains a comprehensive fallback hierarchy to ensure images always display:

```
1. Exact path image found → Use it
2. Parent folder image found → Use it
3. Fallback type specific image exists → Use it
4. Default fallback image → Use it (never breaks)
```

### Fallback Mappings

| Type       | Fallback Image                          |
| ---------- | --------------------------------------- |
| `venue`    | `/assets/fallback/venue-fallback.webp`  |
| `decor`    | `/assets/fallback/decor-fallback.webp`  |
| `outfit`   | `/assets/fallback/outfit-fallback.webp` |
| `food`     | `/assets/fallback/food-fallback.webp`   |
| All others | `/assets/fallback/default-cover.webp`   |

## No Manual Renaming Required

The system automatically works with ANY filename:

```
// All of these work without any configuration:
public/assets/categories/luxury/premium/
├── cover.jpg           ✓
├── Cover.png           ✓
├── cover.webp          ✓
├── image.jpg           ✓
├── luxury-premium.avif ✓
├── random-name.png     ✓
└── any_filename.webp   ✓
```

The system will automatically find the first valid image in priority order.

## Migration from Old System

### Before (Manual, Brittle)

```typescript
// Had to hardcode filenames
const img = "/wedding-data/assets/venues/rajasthan/cover.jpg";
// Would break if file was renamed or didn't exist
```

### After (Automatic, Robust)

```typescript
// Works with ANY filename, any format
const img = getVenueImage("rajasthan", "mid", "taj-mahal");
// Works even if file is Cover.png, image.webp, random_name.jpg, etc.
// Falls back automatically if not found
```

## Performance Optimizations

1. **Build-Time Scanning** - Uses Vite's glob at build time, not runtime
2. **Image Caching** - Caches results for instant subsequent lookups
3. **No Async Overhead** - All functions are synchronous
4. **Minimal Bundle Impact** - Only glob patterns, no large data structures

## Testing

Run the image system test component:

```typescript
import ImageSystemTest from '@/components/ImageSystemTest';

<ImageSystemTest />
```

This will run comprehensive tests on all resolver functions and display results.

## Troubleshooting

### Image Not Loading

1. Verify image file exists in correct folder
2. Check file extension is one of: `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif`
3. Confirm folder path is correct
4. Check browser console for 404 errors

### Black Screen on Load

1. Ensure SmartImage component is used (not plain `<img>`)
2. Verify fallback type is set correctly
3. Check that fallback images exist in `/public/assets/fallback/`

### TypeScript Errors

1. Ensure imports are from `@/utils/assets`
2. Check TypeScript strict mode settings
3. Rebuild the project

## Best Practices

1. **Always use SmartImage** - Prevents loading issues and black flashing
2. **Specify fallbackType** - Ensures appropriate fallback if image not found
3. **Use the resolver functions** - Don't hardcode paths
4. **Keep folder structure consistent** - Easier discovery and maintenance
5. **Use any filename** - System handles it automatically
6. **Set priority={true}** - For above-the-fold images

## API Reference

### getCategoryImage

```typescript
getCategoryImage(
  category: string,
  tier?: string
): string
```

Returns the first image found in `/assets/categories/{category}/{tier}/`

**Examples:**

- `getCategoryImage('luxury', 'premium')` → `/assets/categories/luxury/premium/[image]`
- `getCategoryImage('beach', 'mid')` → `/assets/categories/beach/mid/[image]`

---

### getVenueImage

```typescript
getVenueImage(
  state: string,
  tier: string,
  slug: string
): string
```

Returns image from `/assets/venues/{state}/{tier}/{slug}/`
Falls back to state-level image, then default

**Examples:**

- `getVenueImage('rajasthan', 'premium', 'taj-mahal')`
- `getVenueImage('goa', 'mid', 'taj-exotica')`

---

### All Other Functions

Follow the same pattern as above. Check the Folder Structure section for the expected path format.

## Future Enhancements

- [ ] Support for WebP with fallback to JPEG
- [ ] Automatic image optimization
- [ ] Image preloading strategies
- [ ] CDN integration
- [ ] Image transformation API
- [ ] Performance metrics dashboard

## Support

For issues or questions about the image system, please:

1. Check this documentation first
2. Review component examples
3. Run the test suite
4. Check browser console for errors
5. Verify file structure matches expected format
