#!/usr/bin/env bash
set -euo pipefail

# Wrapper for Infisical CLI that supports both:
# - local implicit login (default)
# - headless token auth (Oz/CI) when INFISICAL_TOKEN is present

cmd="${1:-}"
if [[ -z "$cmd" ]]; then
  echo "Usage: infisical-headless.sh <run|export> [args...]" >&2
  exit 1
fi
shift || true

opts=()

if [[ -n "${INFISICAL_TOKEN:-}" ]]; then
  opts+=(--token "$INFISICAL_TOKEN")
fi

if [[ -n "${INFISICAL_PROJECT_ID:-}" ]]; then
  opts+=(--projectId "$INFISICAL_PROJECT_ID")
fi

if [[ -n "${INFISICAL_SITE_URL:-}" ]]; then
  opts+=(--domain "$INFISICAL_SITE_URL")
fi

exec infisical "$cmd" "${opts[@]}" "$@"
