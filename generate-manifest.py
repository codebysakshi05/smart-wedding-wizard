#!/usr/bin/env python3
"""
Generate assetManifest.json based on actual files in public/assets/
Maps folder paths to their first/best image file
"""

import json
import os
from pathlib import Path
from collections import defaultdict

def get_asset_files(base_path):
    """Get all image files organized by folder"""
    folder_images = defaultdict(list)
    
    for root, dirs, files in os.walk(base_path):
        # Get relative path from base
        rel_path = os.path.relpath(root, base_path)
        if rel_path == ".":
            rel_path = ""
        
        # Find image files
        images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'))]
        
        if images:
            # Convert to web path format
            if rel_path:
                web_folder = "/assets/" + rel_path.replace("\\", "/")
            else:
                web_folder = "/assets"
            
            # Sort images to get consistent selection (prefer 'cover' files)
            images.sort(key=lambda x: (not x.lower().startswith('cover'), x))
            best_image = images[0]
            
            # Full web path to the image
            web_path = web_folder + "/" + best_image
            folder_images[web_folder] = web_path
    
    return folder_images

def main():
    base_path = Path("c:/Users/dlike/OneDrive/Documents/dream-weaver-ai-main/public/assets")
    
    if not base_path.exists():
        print(f"Error: {base_path} does not exist")
        return
    
    print(f"Scanning assets in {base_path}...")
    manifest = get_asset_files(str(base_path))
    
    # Sort for consistency
    manifest = dict(sorted(manifest.items()))
    
    print(f"Found {len(manifest)} folders with images")
    
    # Write manifest file
    output_file = Path("c:/Users/dlike/OneDrive/Documents/dream-weaver-ai-main/src/data/assetManifest.json")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {output_file}")
    print(f"   Total entries: {len(manifest)}")
    
    # Show first few entries
    print("\nFirst 10 entries:")
    for key, value in list(manifest.items())[:10]:
        print(f"  {key} → {value}")

if __name__ == "__main__":
    main()
