# Artist Excel Uploader

This script reads artist data from an Excel file and uploads it to the artist API endpoint.

## Setup

1. Install dependencies (from root directory):
```bash
poetry install
```

2. Configure environment variables:
```bash
cp scripts/.env.example scripts/.env
# Edit .env with your API configuration
```

## Usage

### Basic usage:
```bash
poetry run python scripts/upload-db.py
```

### With custom Excel file:
```bash
poetry run python scripts/upload-db.py path/to/your/file.xlsx
```

### Dry run (test without uploading):
```bash
poetry run python scripts/upload-db.py --dry-run
```

### Full options:
```bash
poetry run python scripts/upload-db.py Author_table.xlsx \
  --sheet "Main Table" \
  --base-url "https://your-api.com" \
  --auth-token "your-token" \
  --dry-run
```

## Excel Format

The script expects an Excel file with a "Main Table" sheet containing artist data. Column mapping based on the actual Excel structure:

| Excel Column | API Field | Required | Notes |
|--------------|-----------|----------|--------|
| Author | author | Yes | Artist name (fallback to Artist_ID if empty) |
| Introduction | introduction | No | Artist description |
| Twitter_link | twitterLink | No | Twitter profile URL |
| Facebook_link | facebookLink | No | Facebook profile URL |
| Instagram_link | instagramLink | No | Instagram profile URL |
| Plurk_link | plurkLink | No | Plurk profile URL |
| Baha_link | bahaLink | No | Bahamut profile URL |
| Youtube_link | youtubeLink | No | YouTube channel URL |
| Twitch_link | twitchLink | No | Twitch channel URL |
| Official_link | officialLink | No | Official website URL |
| Store_link | storeLink | No | Online store URL |
| Myacg_link | myacgLink | No | MyACG profile URL |
| Pixiv_link | pixivLink | No | Pixiv profile URL |
| Tags | tags | No | Comma-separated tags |
| Photo | photo | No | Profile photo URL |

**Note**: The Excel file contains 1,955 rows, but only 71 have Author names filled. The script will skip rows without valid author names.

## Logging

The script creates a log file `upload-artists.log` with detailed information about the upload process.

## Authentication

The script requires authentication for creating/updating artists. Set your auth token in the `.env` file or pass it via `--auth-token` argument.