# Dream Weaver AI - Complete Image System Analysis

## Executive Summary

The image system has **7 critical Unsplash dependencies**, **property name mismatches** between services, **duplicate logic**, and **unsafe array access patterns**. The frontend expects local curated images but still falls back to external URLs.

---

## 1. FILES REFERENCING UNSPLASH, APIs, OR RANDOM GENERATORS

### 🔴 Critical: Direct Unsplash URL Dependencies

#### [backend/utils/venueEngine.js](backend/utils/venueEngine.js#L55-L59)

```javascript
// Line 55-59: Dynamic Unsplash URL construction
image: `https://images.unsplash.com/photo-${v.images[0]}?auto=format&w=1200&q=85`,
gallery: v.images.map(id => `https://images.unsplash.com/photo-${id}?auto=format&w=800&q=80`)
```

- **Problem**: Constructs URLs from photo IDs - expects `v.images[0]` to be a valid photo ID
- **Risk**: URLs can break, image IDs may not exist
- **Called by**: `planner.controller.js` (getSamplePlan)
- **Impact**: All venue gallery images are Unsplash-dependent

#### [backend/services/venueSearch.service.js](backend/services/venueSearch.service.js#L108-L118)

```javascript
// Lines 108-118: Hardcoded Unsplash fallback images
'Rajasthan':        'https://images.unsplash.com/photo-1582645663737-234b077a7b8e?...',
'Goa':              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?...',
'Delhi':            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?...',
'Karnataka':        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?...',
'Kerala':           'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?...',
'Telangana':        'https://images.unsplash.com/photo-1566073771259-6a8506099945?...',
'Himachal Pradesh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?...',
// Default fallback
'DEFAULT':          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?...'
```

- **9 hardcoded Unsplash URLs** - one per state plus default
- **Called by**: Venue search service when Google Places API fails
- **Risk**: High - direct external dependency for venue fallback images

#### [src/components/ImageCarousel.tsx](src/components/ImageCarousel.tsx#L14)

```typescript
const FALLBACK =
  "https://images.unsplash.com/photo-1582645663737-234b077a7b8e?auto=format&w=900&q=85";
```

- **Purpose**: Fallback when image carousel has no images
- **Risk**: Critical - used as fallback for image display
- **Used in**: ImageCarousel component (line 14 shows this is only a variable, not actually used in rendering but imported from imageConfig)

#### [src/lib/imageConfig.ts](src/lib/imageConfig.ts#L248)

```typescript
// Line 9: Local fallback (good)
export const FALLBACK_IMAGE = "/wedding-images/hindu/wedding/01.jpg";

// Line 248: Duplicate Unsplash fallback (bad)
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1582645663737-234b077a7b8e?auto=format&w=1200&q=90";
```

- **CONFLICT**: Two different FALLBACK_IMAGE exports!
- **Risk**: Which one is actually used? Scope/export conflict
- **Issue**: Line 248 overrides line 10

#### [backend/scripts/seedVenues.js](backend/scripts/seedVenues.js#L18-L95)

```javascript
// Lines 18-95: 8 hardcoded Unsplash URLs in seed data
{
  name: "Rajasthan Palace Resort",
  image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
},
{
  name: "Goa Beachfront Villa",
  image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
},
// ... 6 more venues with Unsplash URLs
```

- **Impact**: Only used for database seeding
- **Risk**: Seed data can become stale if photos are deleted from Unsplash

---

### 🟡 API-Based Image References

#### [backend/routes/image.routes.js](backend/routes/image.routes.js)

```javascript
// POST /api/generate-image
// POST /api/update-design
```

- **Purpose**: Image generation endpoints (mentioned in code but actual implementation uses service)
- **No external API calls** - delegates to imageService which uses local images

#### [src/lib/imageConfig.ts](src/lib/imageConfig.ts#L76-L96)

```typescript
export async function getImagesByCategory(...): Promise<WeddingImage[]> {
  try {
    // Attempt to fetch from backend API first
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ religion, event, count })
    });
  } catch (err) {
    // Fallback to local defaults
    return getLocalImages(religion, event, count);
  }
}
```

- **Endpoint**: `/api/images` (attempts to fetch but not found - falls back to local)
- **Risk**: API endpoint doesn't exist, always falls back to local

---

## 2. ALL COMPONENTS THAT RENDER IMAGES (_.tsx, _.jsx files)

### Frontend Image Rendering Components

#### [src/components/ImageCarousel.tsx](src/components/ImageCarousel.tsx)

- **Purpose**: Carousel for displaying image arrays
- **Props**: `images: string[]`, `alt`, `aspectRatio`, `autoPlay`
- **Key Code**:
  ```typescript
  const valid = Array.isArray(images) ? images.filter(Boolean) : [];
  // Line 37-48: SmartImage component renders each image
  <SmartImage
    key={idx}
    src={valid[idx]}
    alt={`${alt} ${idx + 1}`}
    className="w-full h-full object-cover"
  />
  ```
- **Usage**: Displays event images in carousel format on results page
- **Fallback**: Shows skeleton if no images available

#### [src/components/ui/SmartImage.tsx](src/components/ui/SmartImage.tsx)

- **Purpose**: High-performance image component with lazy loading
- **Key Features**:
  - Lazy loading by default
  - Loading skeletons
  - Error fallback to `FALLBACK_IMAGE`
  - Smooth fade-in transitions
- **Props**: `src`, `fallbackSrc`, `preload`, `aspectRatio`
- **Key Code**:
  ```typescript
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const handleError = () => {
    setError(true);
    setCurrentSrc(fallbackSrc);
  };
  ```
- **Fallback**: Imports `FALLBACK_IMAGE` from imageConfig (which one?)

#### [src/routes/results.tsx](src/routes/results.tsx) - Multiple Image Sections

**Line 261 - Moodboard Gallery**:

```typescript
{(Array.isArray(events) ? events.flatMap(e => (Array.isArray(e.images) ? e.images : [])).slice(0, 24) : []).map((img, i) => (
  <InspirationCard src={img || ""} ... />
))}
```

- **Risk**: Assumes `events` is array; if undefined, renders nothing
- **Risk**: Assumes `e.images` is array; chains with flatMap

**Line 308 - Secondary Details Section**:

```typescript
<SmartImage
  src={venues[0]?.image || events[0]?.images?.[0] || ""}
  className="rounded-[3rem] shadow-2xl"
/>
```

- **Risk**: If both `venues` and `events` are empty, renders empty src
- **Fallback**: Relies on SmartImage to handle empty string

**Line 344 - Venue Cards**:

```typescript
<SmartImage src={venue.image || ""} aspectRatio="aspect-[4/5]" ... />
```

- **Risk**: Direct `venue.image` property access
- **Safe**: Has fallback to empty string

**Lines 460-462 - Stage Inspiration**:

```typescript
{evt.stageInspiration?.images?.[0] && (
  <SmartImage src={evt.stageInspiration.images[0] || ""} ... />
)}
```

- **Safe**: Checks for existence before rendering

**Line 471 - Event Carousel**:

```typescript
<ImageCarousel
  images={Array.isArray(evt.images) ? (evt.images as string[]) : []}
  ...
/>
```

- **Safe**: Type checks and defaults to empty array

**Line 538 - Full Event Images Gallery**:

```typescript
{Array.isArray(evt.images) && (evt.images as string[])?.map((img, i) => (
  <img src={img} ... />
))}
```

- **Safe**: Checks if array before mapping

**Line 673 - Bottom Gallery**:

```typescript
{(Array.isArray(events) ? events.flatMap(e => (Array.isArray(e.images) ? e.images : [])).slice(0, 15) : []).map((img: string, i: number) => (
  <img src={img} ... />
))}
```

- **Risk**: Same pattern as line 261 - assumes events array exists

---

## 3. ALL SERVICES HANDLING IMAGES (Backend & Frontend)

### Backend Image Services

#### [backend/services/image.service.js](backend/services/image.service.js)

**Function**: `generateWeddingImages()`

- **Input**: `{ eventName, religion, theme, venueType, lighting, colorPalette, budgetTier, angles, sessionId }`
- **Output**: Array of image objects with structure:
  ```javascript
  {
    id: img.id,
    src: img.src,                    // ← NOTE: 'src' not 'imageUrl'
    alt: img.alt,
    tags: img.tags,
    path: img.src,
    angle: angles[idx] || 'standard',
    style: angles[idx] || 'standard',
    isMock: false,
    source: 'local',
    revisedPrompt: `${eventName} - ${religion} - ${theme}`,
  }
  ```
- **Problem**: Returns `src` property, but controller expects `imageUrl`
- **Called by**: image.controller.js and planner.controller.js

**Function**: `updateDesignImage()`

- **Purpose**: Returns single curated décor image
- **Returns**: Single image object with same structure (using `src` property)

#### [backend/utils/imageEngine.js](backend/utils/imageEngine.js)

**Wrapper** around `src/data/images.js` image selector

- **Functions**:
  - `getEventImages(eventName, religion, theme, budgetTier, count, sessionId)` - Gets event-specific images
  - `getBrideOutfitImages(religion, theme, budgetTier, count, sessionId)` - Gets bridal outfits
  - `getGroomOutfitImages(religion, theme, budgetTier, count, sessionId)` - Gets groom outfits
  - `getVenueImages(venueType, count, sessionId)` - Gets venue images
  - `getDecorImages(category, count, sessionId)` - Gets décor images (flowers, lighting, tables, stages)
  - `getPhotographyIdeas(count, sessionId)` - Gets photography pose ideas
  - `getCuratedGallery(religion, count, sessionId)` - Gets mixed gallery for inspiration
  - `clearImageMemory(sessionId)` - Clears session tracking
  - `getImageStats()` - Returns image statistics
- **Data Source**: `require('../../src/data/images')`
- **Returns**: Array of image objects with `{ id, src, alt, tags, path }`

#### [backend/utils/imageEngine-local.js](backend/utils/imageEngine-local.js)

**IDENTICAL to imageEngine.js** (233 vs 235 lines)

- **Duplicate**: Same functions, same implementation
- **Problem**: Why two files? Which is used?
- **Usage**: Not clear if this is used or if imageEngine.js is preferred

### Frontend Image Services/Helpers

#### [src/lib/imageConfig.ts](src/lib/imageConfig.ts)

**Constants**:

```typescript
export const FALLBACK_IMAGE = "/wedding-images/hindu/wedding/01.jpg"; // Line 10

export const LOCAL_IMAGE_PATHS = {
  hindu: { engagement, mehndi, haldi, sangeet, wedding, reception },
  muslim: { engagement, mehndi, wedding, reception },
  christian: { engagement, wedding, reception },
  sikh: { engagement, wedding, reception },
  "south-indian": { engagement, mehndi, haldi, sangeet, wedding, reception },
  bridal,
  groom,
  decor,
  venues,
};

export interface WeddingImage {
  id: string;
  src: string; // Local path
  alt: string;
  religion?: string;
  event?: string;
  category?: string;
  tags?: string[];
}
```

**Function**: `getImagesByCategory(religion, event, count)`

- **Priority**: Try API → Fall back to local
- **Returns**: `Promise<WeddingImage[]>`

**Class**: `ImageSelector`

- **Method**: `getImages(religion, event, count)` - Gets images by religion/event
- **Returns**: String array of image paths

#### [src/lib/weddingLoader.ts](src/lib/weddingLoader.ts)

**Smart Data Loader**:

```typescript
// Priority:
// 1. sessionStorage  (fastest — set by quiz submit)
// 2. Backend GET /api/sample-plan  (demo mode)
// 3. Hardcoded fallback  (last resort, zero broken images)
```

**Function**: `loadWeddingData()`

- **Checks cache**: `sessionStorage.wedding_plan`
- **Validates**: Check version + image integrity
- **Falls back**: Fetches `/api/sample-plan` from backend
- **Last resort**: Builds hardcoded plan using `globalImageSelector`

**Function**: `buildHardcodedFallbackPlan(religion)`

- Uses `globalImageSelector.getImages()` for all visual elements
- Creates full plan structure with images for all events

---

## 4. ALL ROUTES THAT DISPLAY IMAGES

### Frontend Routes Displaying Images

#### [src/routes/results.tsx](src/routes/results.tsx)

**Purpose**: Main results/wedding plan page
**Image Displays**:

1. **Hero/Overview Tab** (Line 261):
   - Aesthetic Moodboard with 24 images in masonry layout
   - Uses `events.flatMap(e => e.images)`

2. **Summary Section** (Line 308):
   - Single hero image from venue or first event
   - Used with venue photography

3. **Venue Section** (Lines 330-360):
   - Venue cards with individual images
   - Carousel gallery for each venue

4. **Timeline Tab** (Lines 460-540):
   - Event cards with stage inspiration images
   - Full image carousels for each event
   - Additional image galleries for each event

5. **Bottom Gallery** (Line 673):
   - Mixed gallery of all event images
   - Used for inspiration board

### Backend Routes Serving Images

#### [backend/routes/image.routes.js](backend/routes/image.routes.js#L28-L45)

```javascript
POST /api/generate-image
  - Controller: imageController.generateImage
  - Requires: Auth
  - Rate limit: 30 req/min
  - Body: { theme, budget, color, lighting, style, venueType }

POST /api/update-design
  - Controller: imageController.updateDesign
  - Requires: Auth
  - Body: { theme, color, lighting }
```

#### [backend/routes/planner.routes.js](backend/routes/planner.routes.js) - Implied

```javascript
GET /api/sample-plan
  - Controller: plannerController.getSamplePlan
  - Returns: Full wedding plan with images
  - Source: imageEngine (local images)
```

---

## 5. CURRENT STRUCTURE OF src/assets/wedding-images/

```
src/assets/wedding-images/
├── bridal/
│   ├── hindu-01.jpg through hindu-04.jpg
│   ├── muslim-01.jpg through muslim-04.jpg
│   ├── christian-01.jpg through christian-04.jpg
│   └── sikh-01.jpg through sikh-04.jpg
├── groom/
│   ├── hindu-01.jpg through hindu-04.jpg
│   ├── muslim-01.jpg through muslim-04.jpg
│   ├── christian-01.jpg through christian-04.jpg
│   └── sikh-01.jpg through sikh-04.jpg
├── decor/
│   ├── flowers-01.jpg through flowers-06.jpg
│   ├── lighting-01.jpg through lighting-06.jpg
│   ├── tables-01.jpg through tables-06.jpg
│   └── stages-01.jpg through stages-06.jpg
├── hindu/
│   ├── engagement/01.jpg through 06.jpg
│   ├── mehndi/01.jpg through 06.jpg
│   ├── haldi/01.jpg through 06.jpg
│   ├── sangeet/01.jpg through 06.jpg
│   ├── wedding/01.jpg through 06.jpg
│   └── reception/01.jpg through 06.jpg
├── muslim/
│   ├── engagement/01.jpg through 06.jpg
│   ├── mehndi/01.jpg through 06.jpg
│   ├── wedding/01.jpg through 06.jpg
│   └── reception/01.jpg through 06.jpg
├── christian/
│   ├── engagement/01.jpg through 06.jpg
│   ├── wedding/01.jpg through 06.jpg
│   └── reception/01.jpg through 06.jpg
├── sikh/
│   ├── engagement/01.jpg through 06.jpg
│   ├── wedding/01.jpg through 06.jpg
│   └── reception/01.jpg through 06.jpg
├── south-indian/
│   ├── engagement/01.jpg through 06.jpg
│   ├── mehndi/01.jpg through 06.jpg
│   ├── haldi/01.jpg through 06.jpg
│   ├── sangeet/01.jpg through 06.jpg
│   ├── wedding/01.jpg through 06.jpg
│   └── reception/01.jpg through 06.jpg
└── venues/
    └── (venue images - not documented in structure)
```

**Total Structure**: 5 religions × 6 events × 6 images + 4 outfit types × 4 religions × 4 images + 4 décor categories × 6 images = **~350+ total local images defined**

---

## 6. src/data/images.js CONTENT & STRUCTURE

### File Purpose

**Centralized image database** - the ONLY source of truth for all local wedding images. Used by both frontend and backend via `src/data/images.js`.

### Data Structure

```javascript
// Religion-based collections:
const HINDU_WEDDING_IMAGES = {
  engagement: [6 images],
  mehndi: [6 images],
  haldi: [6 images],
  sangeet: [6 images],
  wedding: [6 images],
  reception: [6 images],
}

const MUSLIM_WEDDING_IMAGES = {
  engagement: [6], mehndi: [6], wedding: [6], reception: [6]
}

const CHRISTIAN_WEDDING_IMAGES = {
  engagement: [6], wedding: [6], reception: [6]
}

const SIKH_WEDDING_IMAGES = {
  engagement: [6], wedding: [6], reception: [6]
}

const SOUTH_INDIAN_WEDDING_IMAGES = {
  engagement: [6], mehndi: [6], haldi: [6], sangeet: [6], wedding: [6], reception: [6]
}

// Outfit collections:
const BRIDAL_OUTFITS = {
  hindu: [4 images],
  muslim: [4 images],
  christian: [4 images],
  sikh: [4 images],
}

const GROOM_OUTFITS = {
  hindu: [4 images],
  muslim: [4 images],
  christian: [4 images],
  sikh: [4 images],
}

// Décor collections:
const DECOR_IMAGES = {
  flowers: [6 images],
  lighting: [6 images],
  tables: [6 images],
  stages: [6 images],
}
```

### Key Methods (Image Selector)

```javascript
// getEventImages(religion, event, sessionId, count)
// Returns: Array of images for specific religion + event

// getBridalOutfits(religion, sessionId, count)
// Returns: Bridal outfit images for religion

// getGroomOutfits(religion, sessionId, count)
// Returns: Groom outfit images for religion

// getDecorImages(category, sessionId, count)
// Returns: Décor images by category (flowers, lighting, etc.)

// getPhotographyImages(sessionId, count)
// Returns: Mixed photography idea images

// getVenueImages(venueType, sessionId, count)
// Returns: Venue type images

// getCuratedGallery(religion, sessionId, count)
// Returns: Mixed curated images for inspiration

// getFallbackImages(count)
// Returns: Default Hindu wedding images if nothing else available

// clearSession(sessionId)
// Clears session tracking to allow image repetition
```

### Session Tracking

- **Purpose**: Prevent duplicate images in same session
- **Implementation**: Maintains per-sessionId "used images" tracker
- **Problem**: Backend requires ES6 module but uses `require()` to load

---

## 7. IMAGE-RELATED UTILITY FILES

### [backend/utils/imageEngine.js](backend/utils/imageEngine.js)

- **Purpose**: Central image fetching wrapper
- **Source**: Loads `src/data/images.js` at runtime
- **Functions**: 12 image getter functions + memory management
- **Issue**: Duplicates imageEngine-local.js

### [backend/utils/imageEngine-local.js](backend/utils/imageEngine-local.js)

- **DUPLICATE**: Exact same code as imageEngine.js
- **Functions**: Identical wrapper functions
- **Issue**: Which one is actually used in production?

### [src/lib/imageConfig.ts](src/lib/imageConfig.ts)

- **Constants**: Image paths, fallback definitions, interfaces
- **Functions**: Image selector class, API fetchers
- **Exports**: `FALLBACK_IMAGE`, `LOCAL_IMAGE_PATHS`, `WeddingImage` interface
- **Issue**: Defines FALLBACK_IMAGE twice (lines 10 and 248)

### [src/lib/weddingLoader.ts](src/lib/weddingLoader.ts)

- **Purpose**: Smart plan loader with fallback chain
- **Functions**: `loadWeddingData()`, `buildHardcodedFallbackPlan()`
- **Logic**: sessionStorage → API → hardcoded fallback

### [backend/utils/validators.js](backend/utils/validators.js)

- **Purpose**: Input validation for image endpoints
- **Functions**: `validateImageRequest`, `validateUpdateDesignRequest`
- **Line 112**: Validates `/api/generate-image` requests

### [backend/utils/venueEngine.js](backend/utils/venueEngine.js)

- **Line 55-59**: Unsplash URL construction for venue galleries
- **Function**: `findMatches()` - finds matching venues and enriches with Unsplash URLs

### [backend/utils/responseFormatter.js](backend/utils/responseFormatter.js)

- **Purpose**: Formats API responses
- **Used by**: Image controller for consistent response structure

---

## 8. BACKEND IMAGE CONTROLLERS & SERVICES

### [backend/controllers/image.controller.js](backend/controllers/image.controller.js)

**Function**: `generateImage(req, res)`

- **Endpoint**: POST `/api/generate-image`
- **Flow**:
  1. Validate input (theme, budget, color, lighting, style, venueType)
  2. Normalize styles array (lowercase, deduplicate, max 3)
  3. Check image cache (10 min TTL)
  4. Call `imageService.generateWeddingImages()`
  5. Extract `imageUrl` property from results (**PROBLEM**: Service returns `src` not `imageUrl`)
  6. Filter URLs, ensure non-empty array (max 3 images)
  7. If empty, fallback to `imageService.generateWeddingImages()` with just theme
  8. Return response with images array

- **Critical Issue** (Lines 85, 93, 97):

  ```javascript
  let images = result
    .map(img => img?.imageUrl)  // ← Service returns 'src' not 'imageUrl'
    .filter(url => typeof url === "string" && url.startsWith("http"));

  // Fallback
  const fallbackPool = await imageService.generateWeddingImages({ ... });
  images = fallbackPool.map(img => img.imageUrl);  // ← Will fail!
  ```

  **Result**: All `.imageUrl` accesses will be `undefined`!

**Function**: `updateDesign(req, res)` (implied, not shown in excerpt)

- Similar pattern to generateImage

### [backend/controllers/planner.controller.js](backend/controllers/planner.controller.js)

**Function**: `getSamplePlan(req, res)` (Lines 55-225)

- **Purpose**: GET `/api/sample-plan` - serves demo/fallback plan
- **Flow**:
  1. Use imageEngine to fetch session-unique images
  2. Clears previous session images with `clearImageMemory(sessionId)`
  3. Calls multiple image fetchers:
     - `getEventDecorImages()` - 5 images per event
     - `getBrideOutfitImages()` - 3 bridal images
     - `getGroomOutfitImages()` - 3 groom images
     - `getFoodPresentationImages()` - 3 food images
     - `getPhotographyIdeas()` - 3 photography ideas
  4. Builds event objects with image arrays
  5. Categorizes images:
     - venueImages (6)
     - decorImages (12)
     - ceremonyImages (6)
     - outfitImages (8)
  6. Returns complete plan structure with cache version

- **Uses**: `imageEngine.js` for all image fetching
- **Returns**: Consistent structure with `images` property containing string arrays

### [backend/services/image.service.js](backend/services/image.service.js)

**Function**: `generateWeddingImages({ eventName, religion, theme, venueType, lighting, colorPalette, budgetTier, angles, sessionId })`

- **Implementation**:

  ```javascript
  const images = await imageEngine.getEventImages(
    eventName,
    religion,
    theme,
    budgetTier,
    angles.length || 5,
    sessionId,
  );

  return images.map((img, idx) => ({
    id: img.id,
    src: img.src, // ← Returns 'src' property
    alt: img.alt,
    tags: img.tags,
    path: img.src,
    angle: angles[idx] || "standard",
    style: angles[idx] || "standard",
    isMock: false,
    source: "local",
    revisedPrompt: `${eventName} - ${religion} - ${theme}`,
  }));
  ```

- **Problem**: Returns object with `src` property, but image.controller expects `.imageUrl`
- **Returns**: Array of image metadata objects (not strings)

**Function**: `updateDesignImage({ theme, color, lighting, sessionId })`

- **Implementation**: Calls `imageEngine.getDecorImages()`
- **Returns**: Single image object or null object

---

## 9. SPECIFIC ISSUES FOUND

### 🔴 Critical Issues

#### Issue #1: imageUrl vs src Property Mismatch

**Files**:

- [backend/services/image.service.js](backend/services/image.service.js#L32-L44) - Returns `src` property
- [backend/controllers/image.controller.js](backend/controllers/image.controller.js#L85) - Expects `imageUrl` property

**Code**:

```javascript
// Service returns:
return images.map((img, idx) => ({
  src: img.src, // ← 'src' property
  // ...
}));

// Controller expects:
let images = result.map((img) => img?.imageUrl); // ← 'imageUrl' property
```

**Impact**: Image generation endpoint will return `undefined` URLs
**Severity**: CRITICAL - breaks image generation

---

#### Issue #2: Two Identical Image Engine Files

**Files**:

- [backend/utils/imageEngine.js](backend/utils/imageEngine.js) (235 lines)
- [backend/utils/imageEngine-local.js](backend/utils/imageEngine-local.js) (233 lines)

**Problem**: Exact duplicate code

```javascript
// Both files have identical function:
const getImageSelector = () => {
  if (!imageSelector) {
    try {
      imageSelector =
        require("../../src/data/images").default || require("../../src/data/images").imageSelector;
    } catch (err) {
      console.warn("[ImageEngine] Could not load local images, using fallbacks:", err.message);
    }
  }
  return imageSelector;
};
```

**Questions**:

- Which file is used in production?
- Why maintain two identical copies?
- Creates maintenance burden

---

#### Issue #3: Duplicate FALLBACK_IMAGE Exports

**File**: [src/lib/imageConfig.ts](src/lib/imageConfig.ts)

**Problem**:

```typescript
// Line 10:
export const FALLBACK_IMAGE = "/wedding-images/hindu/wedding/01.jpg";

// Line 248:
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1582645663737-234b077a7b8e?auto=format&w=1200&q=90";
```

**Impact**:

- Line 248 definition overrides line 10
- Final export is Unsplash URL (unstable)
- Local path never used as fallback
- SmartImage component inherits Unsplash fallback

**Severity**: HIGH - Fallback is external dependency instead of local

---

#### Issue #4: Seven Hardcoded Unsplash URLs

**Files** with Unsplash dependencies:

1. [backend/utils/venueEngine.js](backend/utils/venueEngine.js#L58-L59) - 2 URLs (dynamic construction)
2. [backend/services/venueSearch.service.js](backend/services/venueSearch.service.js#L110-L118) - 8 state-based URLs
3. [src/components/ImageCarousel.tsx](src/components/ImageCarousel.tsx#L14) - 1 URL (unused)
4. [backend/scripts/seedVenues.js](backend/scripts/seedVenues.js#L18-L95) - 8 venue URLs (seeding only)

**Total**: 19+ Unsplash URL references

**Risk**:

- External service dependency
- Rate limits (Unsplash API has rate limits)
- URL validity (photos can be deleted)
- No authentication (relying on public access)

---

### 🟠 Medium Priority Issues

#### Issue #5: Unsafe Array Access Patterns in Results Page

**File**: [src/routes/results.tsx](src/routes/results.tsx)

**Pattern #1** (Lines 261, 673):

```typescript
{(Array.isArray(events) ? events.flatMap(e => (Array.isArray(e.images) ? e.images : [])).slice(0, 24) : [])
```

- Assumes `events` is always defined before Array.isArray check
- If `events` is undefined, renders empty
- Safe but verbose

**Pattern #2** (Line 308):

```typescript
<SmartImage src={venues[0]?.image || events[0]?.images?.[0] || ""} />
```

- Relies on optional chaining
- If both fail, renders empty src
- SmartImage will handle empty string

**Pattern #3** (Line 261, 673):

```typescript
events.flatMap((e) => (Array.isArray(e.images) ? e.images : []));
```

- Nested flatMap could fail if events items are undefined
- Type safety unclear

**Issue**: Inconsistent null-checking patterns

---

#### Issue #6: Backend Loading ES6 Module with require()

**File**: [backend/utils/imageEngine.js](backend/utils/imageEngine.js#L19)

**Code**:

```javascript
imageSelector =
  require("../../src/data/images").default || require("../../src/data/images").imageSelector;
```

**Problem**:

- `src/data/images.js` is ES6 module
- Backend uses `require()` which is CommonJS
- Will fail if file uses ES6 exports/imports
- Fallback to `.imageSelector` property suggests this might work, but fragile

**Fix Needed**: Either convert to CommonJS or use dynamic import with await

---

#### Issue #7: Session Memory Not Properly Isolated

**File**: [src/data/images.js](src/data/images.js)

**Pattern**: Session-based image tracking

```javascript
// Prevents duplicate images in same session
const SESSION_TRACKING = new Map();

getEventImages(religion, event, sessionId = 'default', count = 6) {
  const key = `${religion}:${event}`;
  // Track used images per session
  // Returns different images on subsequent calls
}
```

**Issue**:

- Session memory is in-process (memory leak in long-running server)
- If server restarts, memory is lost
- No cleanup mechanism visible
- Could grow unbounded with many sessions

---

### 🟡 Low Priority Issues

#### Issue #8: Unused /api/images Endpoint

**File**: [src/lib/imageConfig.ts](src/lib/imageConfig.ts#L83)

**Code**:

```typescript
const response = await fetch("/api/images", {
  method: "POST",
  body: JSON.stringify({ religion, event, count }),
});
```

**Problem**: Endpoint `/api/images` doesn't exist in backend
**Result**: Always falls back to local images (which is fine)
**Cleanup**: Remove this dead code path

---

#### Issue #9: Inconsistent Image Structure

**Service returns**:

```javascript
{
  (id, src, alt, tags, path, angle, style, isMock, source, revisedPrompt);
}
```

**Frontend expects**:

```typescript
type: string[]  // Just image URL strings
// or
interface: { image, images }
```

**Issue**: Format mismatch between what service returns and what frontend expects
**Example**: [planner.controller.js](backend/controllers/planner.controller.js#L120) passes `decorImgs` which are objects, but results.tsx expects strings

---

#### Issue #10: Missing Error Handling in Image Carousel

**File**: [src/components/ImageCarousel.tsx](src/components/ImageCarousel.tsx)

**Code**:

```typescript
const valid = Array.isArray(images) ? images.filter(Boolean) : [];
if (!valid.length) return <div className="...skeleton-shimmer..." />;
```

**Problem**: If image carousel receives non-array, shows skeleton indefinitely
**Fix**: Add error boundary or console warning

---

## Summary Statistics

| Category                         | Count                             |
| -------------------------------- | --------------------------------- |
| **Unsplash URL Dependencies**    | 19+                               |
| **Duplicate File Structures**    | 2 (imageEngine files)             |
| **Duplicate Constants**          | 2 (FALLBACK_IMAGE)                |
| **Local Image References**       | 350+                              |
| **Unsafe Array Access Patterns** | 10+                               |
| **Component Files Using Images** | 5+                                |
| **Backend Image Routes**         | 2 (generate-image, update-design) |
| **Image Service Functions**      | 12+                               |
| **Décor Categories**             | 4                                 |
| **Religion Categories**          | 5                                 |
| **Events per Religion**          | 4-6                               |

---

## Recommendations

### Immediate Actions (Fix Critical Issues)

1. **Fix imageUrl vs src mismatch** in [image.controller.js](backend/controllers/image.controller.js)

   ```javascript
   // Change from:
   .map(img => img?.imageUrl)
   // To:
   .map(img => img?.src)
   ```

2. **Remove duplicate FALLBACK_IMAGE** export in [imageConfig.ts](src/lib/imageConfig.ts#L248)
   - Keep line 10 (local path)
   - Delete line 248 (Unsplash URL)

3. **Choose one imageEngine file**
   - Delete `backend/utils/imageEngine-local.js`
   - Keep `backend/utils/imageEngine.js`

### Medium Priority (Improve Stability)

4. **Replace Unsplash fallback URLs** in [venueSearch.service.js](backend/services/venueSearch.service.js)
   - Use local venue images instead
   - Or serve placeholder color/gradient

5. **Remove dead /api/images code** in [imageConfig.ts](src/lib/imageConfig.ts)

6. **Add image structure validation**
   - Ensure image objects have `src` property before passing to UI

### Long Term (Architecture)

7. **Convert image.service to return strings** instead of objects
   - Return array of image URL strings directly
   - Move metadata handling to separate function

8. **Implement Redis caching** for session image tracking
   - Replace in-memory Map with Redis
   - Proper session cleanup

9. **Add image validation tests**
   - Ensure all image paths exist
   - Validate URL structure
   - Test fallback chains
