#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-/workspace}"
INFISICAL_ENV_NAME="${INFISICAL_ENV:-dev}"

cd "$ROOT_DIR"

echo "[agent-bootstrap] Node: $(node -v)"
echo "[agent-bootstrap] pnpm: $(pnpm -v || true)"

auth_opts=()
if [[ -n "${INFISICAL_TOKEN:-}" ]]; then
  auth_opts+=(--token "$INFISICAL_TOKEN")
fi
if [[ -n "${INFISICAL_PROJECT_ID:-}" ]]; then
  auth_opts+=(--projectId "$INFISICAL_PROJECT_ID")
fi
if [[ -n "${INFISICAL_SITE_URL:-}" ]]; then
  auth_opts+=(--domain "$INFISICAL_SITE_URL")
fi

if [[ ${#auth_opts[@]} -gt 0 ]]; then
  echo "[agent-bootstrap] Infisical auth detected. Pulling env (env=$INFISICAL_ENV_NAME)..."
  # Smoke test auth + access first.
  infisical export "${auth_opts[@]}" --env "$INFISICAL_ENV_NAME" > /tmp/.infisical-export-check
  rm -f /tmp/.infisical-export-check

  # Project-standard env generation.
  # This builds typed env bindings used by the monorepo.
  pnpm run env:pull
else
  echo "[agent-bootstrap] No INFISICAL_TOKEN/PROJECT auth env found."
  echo "[agent-bootstrap] Continuing without Infisical pull (expects existing .env/.dev.vars)."
fi

echo "[agent-bootstrap] Installing dependencies..."
pnpm install

if [[ $# -gt 0 ]]; then
  echo "[agent-bootstrap] Running custom command: $*"
  exec "$@"
fi

echo "[agent-bootstrap] Starting full dev stack..."
exec pnpm run dev
