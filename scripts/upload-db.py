#!/usr/bin/env python3
"""
Artist Excel to API Uploader

Reads artist data from Excel file and uploads to the artist API endpoint.
"""

import os
import sys
import logging
import argparse
from typing import Dict, List, Optional, Any
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('upload-artists.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class ArtistAPIClient:
    """Client for interacting with the artist API endpoints."""

    def __init__(self, base_url: str, auth_token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()

        if auth_token:
            self.session.headers.update({
                'Authorization': f'Bearer {auth_token}',
                'Content-Type': 'application/json'
            })

    def create_artist(self, artist_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new artist via POST /artist"""
        try:
            response = self.session.post(
                f"{self.base_url}/artist",
                json=artist_data
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create artist {artist_data.get('author', 'Unknown')}: {e}")
            raise

    def update_artist(self, artist_id: str, artist_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing artist via PUT /artist/:artistId"""
        try:
            response = self.session.put(
                f"{self.base_url}/artist/{artist_id}",
                json=artist_data
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to update artist {artist_id}: {e}")
            raise

    def get_artists(self, search: Optional[str] = None) -> Dict[str, Any]:
        """Get existing artists via GET /artist"""
        try:
            params = {}
            if search:
                params['search'] = search

            response = self.session.get(
                f"{self.base_url}/artist",
                params=params
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch artists: {e}")
            raise


class ExcelArtistReader:
    """Reads and processes artist data from Excel file."""

    def __init__(self, excel_path: str, sheet_name: str = "Main Table"):
        self.excel_path = Path(excel_path)
        self.sheet_name = sheet_name

        if not self.excel_path.exists():
            raise FileNotFoundError(f"Excel file not found: {excel_path}")

    def read_artists(self) -> pd.DataFrame:
        """Read artist data from Excel file."""
        try:
            df = pd.read_excel(self.excel_path, sheet_name=self.sheet_name)
            logger.info(f"Read {len(df)} rows from {self.sheet_name} sheet")
            return df
        except Exception as e:
            logger.error(f"Failed to read Excel file: {e}")
            raise

    def map_excel_to_artist_schema(self, row: pd.Series) -> Dict[str, Any]:
        """Map Excel row to artist API schema based on actual Excel columns."""
        # Exact mapping based on actual Excel file structure
        column_mapping = {
            'Author': 'author',
            'Introduction': 'introduction',
            'Twitter_link': 'twitterLink',
            'Facebook_link': 'facebookLink',
            'Instagram_link': 'instagramLink',
            'Plurk_link': 'plurkLink',
            'Baha_link': 'bahaLink',
            'Youtube_link': 'youtubeLink',
            'Twitch_link': 'twitchLink',
            'Official_link': 'officialLink',
            'Store_link': 'storeLink',
            'Myacg_link': 'myacgLink',
            'Pixiv_link': 'pixivLink',
            'Tags': 'tags',
            'Photo': 'photo',
            "Author ID": "uuid"
        }

        artist_data = {}

        # Map columns directly (exact match)
        for excel_col, api_field in column_mapping.items():
            if excel_col in row.index:
                value = row[excel_col]
                if pd.notna(value) and str(value).strip() and str(value).strip().lower() != 'nan':
                    artist_data[api_field] = str(value).strip()
                    if api_field is "uuid":
                        artist_data[api_field] = int(value)

        # Ensure required field exists
        if 'author' not in artist_data:
            # Try to get from Author ID if Author is empty
            if 'Author ID' in row.index and pd.notna(row['Author ID']):
                artist_data['author'] = row["布林後攤位"]
            else:
                raise ValueError(f"Required 'author' field not found in row. Available columns: {list(row.index)}")

        return artist_data


class ArtistUploader:
    """Main class for uploading artists from Excel to API."""

    def __init__(self, api_client: ArtistAPIClient, excel_reader: ExcelArtistReader):
        self.api_client = api_client
        self.excel_reader = excel_reader
        self.results = {
            'created': [],
            'updated': [],
            'failed': [],
            'skipped': []
        }

    def upload_artists(self, dry_run: bool = False) -> Dict[str, List]:
        """Upload all artists from Excel file."""
        logger.info(f"Starting artist upload {'(DRY RUN)' if dry_run else ''}")

        # Read Excel data
        df = self.excel_reader.read_artists()

        # Get existing artists for duplicate checking
        existing_artists = {}
        try:
            existing_data = self.api_client.get_artists()
            if 'data' in existing_data and existing_data['data']:
                for artist in existing_data['data']:
                    existing_artists[artist.get('author', '').lower()] = artist
            logger.info(f"Found {len(existing_artists)} existing artists")
        except Exception as e:
            logger.warning(f"Could not fetch existing artists: {e}")

        # Process each row
        for index, row in df.iterrows():
            try:
                artist_data = self.excel_reader.map_excel_to_artist_schema(row)
                artist_name = artist_data['author']

                logger.info(f"Processing artist {index + 1}/{len(df)}: {artist_name}")

                if dry_run:
                    logger.info(f"DRY RUN: Would process artist: {artist_data}")
                    self.results['skipped'].append(artist_name)
                    continue

                    # Check if artist already exists
                    # Create new artist
                try:
                    for x in artist_data.keys():
                        print(x + ": " + str(artist_data[x]))
                    result = self.api_client.create_artist(artist_data)
                    self.results['created'].append(artist_name)
                    logger.info(f"Created artist: {artist_name}")
                except Exception as e:
                    self.results['failed'].append({'name': artist_name, 'error': str(e)})
                    logger.error(f"Failed to create artist {artist_name}: {e}")

            except Exception as e:
                artist_name = f"Row {index + 1}"
                self.results['failed'].append({'name': artist_name, 'error': str(e)})
                logger.error(f"Failed to process row {index + 1}: {e}")

        return self.results

    def print_summary(self):
        """Print upload summary."""
        print("\n" + "=" * 50)
        print("UPLOAD SUMMARY")
        print("=" * 50)
        print(f"Created: {len(self.results['created'])}")
        print(f"Updated: {len(self.results['updated'])}")
        print(f"Failed: {len(self.results['failed'])}")
        print(f"Skipped: {len(self.results['skipped'])}")

        if self.results['failed']:
            print("\nFAILED UPLOADS:")
            for failure in self.results['failed']:
                print(f"  - {failure['name']}: {failure['error']}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Upload artist data from Excel to API")
    parser.add_argument(
        "excel_file",
        nargs='?',
        default="scripts/Author_table.xlsx",
        help="Path to Excel file (default: Author_table.xlsx)"
    )
    parser.add_argument(
        "--sheet",
        default="Main Table",
        help="Excel sheet name (default: Main Table)"
    )
    parser.add_argument(
        "--base-url",
        default=os.getenv("API_BASE_URL", "http://localhost:2000"),
        help="API base URL"
    )
    parser.add_argument(
        "--auth-token",
        default=os.getenv("API_AUTH_TOKEN"),
        help="Authentication token"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without making actual API calls"
    )

    args = parser.parse_args()

    try:
        # Initialize components
        api_client = ArtistAPIClient(args.base_url, args.auth_token)
        excel_reader = ExcelArtistReader(args.excel_file, args.sheet)
        uploader = ArtistUploader(api_client, excel_reader)

        # Run upload
        results = uploader.upload_artists(dry_run=args.dry_run)
        uploader.print_summary()

        # Exit with error code if there were failures
        if results['failed']:
            sys.exit(1)

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
