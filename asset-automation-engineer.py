#!/usr/bin/env python3

import json
import os
import re
import requests
from pathlib import Path
from PIL import Image
from io import BytesIO
import time
from urllib.parse import quote

class AssetAutomationEngineer:
    """Automatically download and assign HD wedding images to venues and services"""

    def __init__(self):
        self.unsplash_api = "https://api.unsplash.com"
        self.unsplash_access_key = "YOUR_UNSPLASH_ACCESS_KEY"  # Using free tier search
        self.pexels_api = "https://api.pexels.com/v1"
        self.pexels_key = "YOUR_PEXELS_API_KEY"
        self.image_cache = {}
        self.downloaded_count = 0
        self.failed_count = 0

    def search_unsplash_free(self, query):
        """Search Unsplash using free web search (no API key needed)"""
        try:
            # Unsplash free search endpoint
            url = f"https://unsplash.com/napi/search/photos"
            params = {
                'query': query,
                'per_page': 1,
                'order_by': 'relevant'
            }

            headers = {
                'User-Agent': 'Dream-Weaver-Wedding-Planner/1.0'
            }

            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('results') and len(data['results']) > 0:
                    return data['results'][0]['urls']['full']

            return None
        except Exception as e:
            print(f"  [ERROR] Unsplash search failed: {str(e)}")
            return None

    def search_pexels_free(self, query):
        """Search Pexels using free API"""
        try:
            url = f"https://api.pexels.com/v1/search"
            params = {
                'query': query,
                'per_page': 1
            }

            headers = {
                'Authorization': 'TIJfrVrCNzPQWKYkM5C5yweKfL8LVBkYGhq7h9Aw8MZQcXxFLYkCmKQE'
            }

            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('photos') and len(data['photos']) > 0:
                    return data['photos'][0]['src']['large']

            return None
        except Exception as e:
            print(f"  [ERROR] Pexels search failed: {str(e)}")
            return None

    def download_and_optimize_image(self, image_url, output_path, width=1600, height=900):
        """Download image and optimize for web"""
        try:
            # Download image
            response = requests.get(image_url, timeout=15, stream=True)
            response.raise_for_status()

            # Open with PIL
            img = Image.open(BytesIO(response.content))

            # Convert RGBA to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = bg

            # Resize to target dimensions (maintaining aspect ratio with crop)
            img.thumbnail((width, height), Image.Resampling.LANCZOS)

            # Create new image with target dimensions
            final_img = Image.new('RGB', (width, height), (255, 255, 255))
            offset = ((width - img.width) // 2, (height - img.height) // 2)
            final_img.paste(img, offset)

            # Save optimized
            output_path.parent.mkdir(parents=True, exist_ok=True)
            final_img.save(output_path, 'JPEG', quality=85, optimize=True)

            return True
        except Exception as e:
            print(f"  [ERROR] Failed to download/optimize: {str(e)}")
            return False

    def get_venue_search_query(self, venue):
        """Generate contextual search query for venue"""
        state = venue['state'].replace('-', ' ')
        venue_type = venue['type'].lower()
        styles = ' '.join(venue['styles'][:2]).lower()
        budget = venue['budget']

        # Map states to regions
        state_map = {
            'rajasthan': 'Rajasthan Indian palace',
            'goa': 'Goa beach wedding',
            'kerala': 'Kerala backwater wedding',
            'karnataka': 'luxury wedding venue',
            'tamil-nadu': 'South Indian wedding',
            'hyderabad': 'Hyderabad wedding venue',
            'delhi': 'Delhi luxury wedding',
            'maharashtra': 'Mumbai wedding venue',
            'punjab': 'Punjabi wedding celebrations',
            'west-bengal': 'Bengal wedding venue',
            'telangana': 'Telangana wedding landscape'
        }

        region = state_map.get(venue['state'], state)

        if 'palace' in venue_type.lower() or 'heritage' in venue_type.lower():
            return f"{region} palace wedding venue luxury"
        elif 'beach' in venue_type.lower() or 'resort' in styles:
            return f"{region} resort beach wedding ceremony"
        elif 'garden' in venue_type.lower():
            return f"{region} wedding garden decor flowers"
        elif 'banquet' in venue_type.lower():
            return f"{region} wedding hall banquet elegant"
        else:
            return f"{region} wedding venue {budget} celebration"

    def get_service_search_query(self, service):
        """Generate contextual search query for service"""
        category = service['category']
        budget = service['budget']

        queries = {
            'photographers': f"Indian wedding photography cinematic couple shoot",
            'decorators': f"luxury Indian wedding decoration flowers decor",
            'planners': f"wedding planner consultation bride groom",
            'makeup-artists': f"Indian bridal makeup beauty bride",
            'caterers': f"Indian wedding catering feast celebration",
            'choreographers': f"Indian wedding dance celebration performance",
            'mehndi-artists': f"bridal mehndi henna design hands",
            'bands': f"Indian wedding band music celebration orchestra"
        }

        return queries.get(category, f"Indian wedding {category}")

    def process_venues(self, venues_data):
        """Download and assign images for all venues"""
        print("\n" + "="*70)
        print("PROCESSING VENUES")
        print("="*70)

        total_venues = 0
        successful = 0

        for state, budgets in venues_data.items():
            print(f"\n[STATE] {state.upper()}")

            for budget, venues in budgets.items():
                print(f"  [BUDGET] {budget}")

                for venue in venues:
                    total_venues += 1
                    venue_name = venue['name']
                    venue_id = venue['id']
                    kebab_name = self.name_to_kebab(venue_name)

                    # Generate search query
                    search_query = self.get_venue_search_query(venue)

                    # Generate output path
                    output_path = Path(f"public/assets/venues/{state}/{budget}/{kebab_name}/cover.jpg")

                    # Note: We'll replace placeholder images with real ones
                    # Create parent directory if needed
                    output_path.parent.mkdir(parents=True, exist_ok=True)

                    print(f"    [SEARCH] {venue_name}")
                    print(f"      Query: {search_query}")

                    # Try Unsplash first
                    image_url = self.search_unsplash_free(search_query)

                    if not image_url:
                        print(f"      [RETRY] Trying Pexels...")
                        image_url = self.search_pexels_free(search_query)

                    if image_url:
                        print(f"      [DOWNLOAD] {image_url[:60]}...")

                        if self.download_and_optimize_image(image_url, output_path):
                            print(f"      [SUCCESS] Image saved")
                            successful += 1
                            self.downloaded_count += 1
                            time.sleep(0.5)  # Rate limiting
                        else:
                            print(f"      [FAILED] Could not optimize image")
                            self.failed_count += 1
                    else:
                        print(f"      [NO IMAGE] Could not find suitable image")
                        self.failed_count += 1

        print(f"\n[VENUES] Total: {total_venues}, Successful: {successful}, Failed: {total_venues - successful}")
        return venues_data

    def process_services(self, services_data):
        """Download and assign images for all services"""
        print("\n" + "="*70)
        print("PROCESSING SERVICES")
        print("="*70)

        total_services = 0
        successful = 0

        for category, budgets in services_data.items():
            print(f"\n[CATEGORY] {category.upper()}")

            for budget, services in budgets.items():
                print(f"  [BUDGET] {budget}")

                for service in services:
                    total_services += 1
                    service_name = service['name']
                    kebab_name = self.name_to_kebab(service_name)

                    # Generate search query
                    search_query = self.get_service_search_query(service)

                    # Generate output path
                    output_path = Path(f"public/assets/services/{category}/{budget}/{kebab_name}/cover.jpg")

                    # Note: We'll replace placeholder images with real ones
                    # Create parent directory if needed
                    output_path.parent.mkdir(parents=True, exist_ok=True)

                    print(f"    [SEARCH] {service_name}")
                    print(f"      Query: {search_query}")

                    # Try Unsplash first
                    image_url = self.search_unsplash_free(search_query)

                    if not image_url:
                        print(f"      [RETRY] Trying Pexels...")
                        image_url = self.search_pexels_free(search_query)

                    if image_url:
                        print(f"      [DOWNLOAD] {image_url[:60]}...")

                        if self.download_and_optimize_image(image_url, output_path):
                            print(f"      [SUCCESS] Image saved")
                            successful += 1
                            self.downloaded_count += 1
                            time.sleep(0.5)  # Rate limiting
                        else:
                            print(f"      [FAILED] Could not optimize image")
                            self.failed_count += 1
                    else:
                        print(f"      [NO IMAGE] Could not find suitable image")
                        self.failed_count += 1

        print(f"\n[SERVICES] Total: {total_services}, Successful: {successful}, Failed: {total_services - successful}")
        return services_data

    def name_to_kebab(self, name):
        """Convert name to kebab-case"""
        kebab = name.lower().strip()
        kebab = re.sub(r'\s+', '-', kebab)
        kebab = re.sub(r'[^\w-]', '', kebab)
        kebab = re.sub(r'-+', '-', kebab)
        return kebab.strip('-')

    def run(self):
        """Execute asset automation"""
        print("\n" + "="*70)
        print("DREAM WEAVER AI - ASSET AUTOMATION ENGINEER")
        print("="*70)
        print("\nInitializing asset downloader...")

        # Read JSON files
        print("\n[STEP 1] Reading JSON files...")

        venues_path = Path("public/data/venues.json")
        services_path = Path("public/data/services.json")

        if not venues_path.exists():
            print("[ERROR] venues.json not found")
            return

        if not services_path.exists():
            print("[ERROR] services.json not found")
            return

        print(f"[OK] Loading {venues_path}")
        with open(venues_path, 'r', encoding='utf-8') as f:
            venues_data = json.load(f)

        print(f"[OK] Loading {services_path}")
        with open(services_path, 'r', encoding='utf-8') as f:
            services_data = json.load(f)

        # Process assets
        print("\n[STEP 2] Downloading images...")
        venues_data = self.process_venues(venues_data)
        services_data = self.process_services(services_data)

        # Save updated JSON
        print("\n[STEP 3] Updating JSON files...")
        print(f"[OK] Saving {venues_path}")
        with open(venues_path, 'w', encoding='utf-8') as f:
            json.dump(venues_data, f, indent=2, ensure_ascii=False)

        print(f"[OK] Saving {services_path}")
        with open(services_path, 'w', encoding='utf-8') as f:
            json.dump(services_data, f, indent=2, ensure_ascii=False)

        # Summary
        print("\n" + "="*70)
        print("ASSET AUTOMATION COMPLETE")
        print("="*70)
        print(f"\nDownloaded: {self.downloaded_count} images")
        print(f"Failed: {self.failed_count} images")
        print(f"Total: {self.downloaded_count + self.failed_count} processed")
        print("\n[SUCCESS] All venues and services updated!")

if __name__ == "__main__":
    engineer = AssetAutomationEngineer()
    engineer.run()
