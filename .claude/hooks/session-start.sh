#!/bin/bash
# SessionStart hook for Claude Code on the web.
# Installs Node deps so lint / typecheck / test can run immediately.
# Idempotent and cheap on warm caches.
set -euo pipefail

# Only run in remote (Claude Code on the web) environments.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "[session-start] node $(node --version 2>/dev/null || echo 'not found')"
echo "[session-start] npm $(npm --version 2>/dev/null || echo 'not found')"

# Prefer `npm ci` (fast, reproducible) when a lockfile exists.
# Fall back to `npm install` on first run / when the lockfile is absent.
if [ -f package-lock.json ]; then
  echo "[session-start] running: npm ci"
  npm ci --no-audit --no-fund --prefer-offline
else
  echo "[session-start] no package-lock.json, running: npm install"
  npm install --no-audit --no-fund --prefer-offline
fi

echo "[session-start] done"
