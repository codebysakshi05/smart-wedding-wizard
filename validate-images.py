#!/usr/bin/env python3
"""
Validate that all images in the manifest exist
"""

import json
import os
from pathlib import Path

def validate_manifest():
    """Validate all manifest entries point to real files"""
    manifest_path = Path("c:/Users/dlike/OneDrive/Documents/dream-weaver-ai-main/src/data/assetManifest.json")
    assets_path = Path("c:/Users/dlike/OneDrive/Documents/dream-weaver-ai-main/public")
    
    if not manifest_path.exists():
        print("❌ Manifest not found")
        return
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    
    print(f"📋 Validating {len(manifest)} entries...")
    
    missing = []
    valid = 0
    
    for folder_path, image_path in manifest.items():
        # Convert web path to file path
        file_path = assets_path / image_path.lstrip('/')
        
        if file_path.exists():
            valid += 1
        else:
            missing.append((folder_path, image_path, str(file_path)))
    
    print(f"\n✅ Valid entries: {valid}/{len(manifest)}")
    
    if missing:
        print(f"❌ Missing entries: {len(missing)}")
        print("\nMissing files:")
        for folder, image_path, full_path in missing[:10]:  # Show first 10
            print(f"  Folder: {folder}")
            print(f"  Image:  {image_path}")
            print(f"  Path:   {full_path}\n")
        if len(missing) > 10:
            print(f"... and {len(missing) - 10} more")
    else:
        print("\n✨ All manifest entries point to valid image files!")
    
    # Test a few common paths
    print("\n🧪 Testing common image paths:")
    test_paths = [
        "/assets/categories/luxury/premium",
        "/assets/venues/rajasthan/premium",
        "/assets/decor/wedding/premium",
        "/assets/hero/homepage",
        "/assets/fallback",
    ]
    
    for test_path in test_paths:
        if test_path in manifest:
            img = manifest[test_path]
            file_path = assets_path / img.lstrip('/')
            status = "✅" if file_path.exists() else "❌"
            print(f"  {status} {test_path}")
            print(f"     → {img}")
        else:
            print(f"  ⚠️  {test_path} (not in manifest)")

if __name__ == "__main__":
    validate_manifest()
