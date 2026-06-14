import os
import re

files_to_fix = [
    "src/components/hero/DynamicWeddingScene.tsx",
    "src/components/hero/WeddingBackground.tsx",
    "src/data/curatedJourneys.ts",
    "src/data/mockData.ts",
    "src/lib/weddingLoader.ts",
    "src/routes/editor.tsx",
    "src/routes/explore.tsx",
    "src/routes/index.tsx"
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # getVenueImage(state, budget, slug) -> getVenueImage(state, budget)
    content = re.sub(r'getVenueImage\(([^,]+),\s*([^,]+),\s*[^)]+\)', r'getVenueImage(\1, \2)', content)
    
    # getServiceImage(category, budget, slug) -> getServiceImage(category, budget)
    content = re.sub(r'getServiceImage\(([^,]+),\s*([^,]+),\s*[^)]+\)', r'getServiceImage(\1, \2)', content)

    # getOutfitImage(type, style, budget) -> getOutfitImage(type)
    content = re.sub(r'getOutfitImage\(([^,]+),\s*[^,]+,\s*[^)]+\)', r'getOutfitImage(\1)', content)
    
    # getMandapImage(style, budget) -> getMandapImage(style) (Wait, user says getMandapImage(style))
    # Actually, the user says `getMandapImage(style)` but earlier in strictAssetResolver it was (theme, budget).
    content = re.sub(r'getMandapImage\(([^,]+),\s*[^)]+\)', r'getMandapImage(\1)', content)
    
    # getFallbackImage('default') -> getFallbackImage()
    content = re.sub(r'getFallbackImage\([^)]+\)', r'getFallbackImage()', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in files_to_fix:
    path = os.path.join(r"C:\Users\dlike\OneDrive\Documents\dream-weaver-ai-main", f)
    if os.path.exists(path):
        fix_file(path)
        print(f"Fixed {f}")
