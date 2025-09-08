#!/usr/bin/env bash
set -euo pipefail

echo "Checking for references to deprecated frontends…"

# 1) Block changes inside these directories entirely (in case they reappear)
CHANGED=$(git diff --name-only --diff-filter=ACMRTUXB origin/${GITHUB_BASE_REF:-main}...HEAD || true)
if echo "$CHANGED" | grep -E '^(frontend/|_legacy_frontend/)' >/dev/null 2>&1; then
  echo "Error: changes under 'frontend/' or '_legacy_frontend/' are not allowed." >&2
  echo "$CHANGED" | grep -E '^(frontend/|_legacy_frontend/)' || true
  exit 1
fi

# 2) Block code references to those paths outside the attic
if command -v rg >/dev/null 2>&1; then
  rg -n --hidden --no-ignore-vcs \
    -g '!attic/**' -g '!node_modules/**' -g '!.git/**' \
    -e "(^|[\'\"\(\s])(_legacy_frontend|frontend)/" || true
  if [ $? -eq 0 ]; then
    echo "Error: found references to deprecated paths ('frontend/' or '_legacy_frontend/') outside attic/." >&2
    exit 1
  fi
else
  # Fallback to grep if ripgrep is unavailable
  if grep -RInE --exclude-dir=attic --exclude-dir=node_modules --exclude-dir=.git "(^|[\'\"\(\s])(_legacy_frontend|frontend)/" . >/dev/null 2>&1; then
    echo "Error: found references to deprecated paths ('frontend/' or '_legacy_frontend/') outside attic/." >&2
    exit 1
  fi
fi

echo "No legacy frontend references found."
