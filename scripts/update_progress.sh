#!/usr/bin/env bash
set -euo pipefail
TARGET=${1:-memory-bank/progress.md}
TMP="${TARGET}.tmp"

if [ -n "${2-}" ]; then
  cat "$2" > "$TMP"
else
  cat - > "$TMP"
fi

mv -f "$TMP" "$TARGET"
echo "Updated $TARGET (atomic move from $TMP)"
