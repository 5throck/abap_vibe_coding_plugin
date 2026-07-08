#!/usr/bin/env bash
# sync-md.sh - Update memory/MEMORY.md index
# Usage: bash scripts/sync-md.sh "YYYY-MM-DD" "summary"
# If date already exists, the summary is updated (not duplicated).
DATE="${1:-$(date +%Y-%m-%d)}"
SUMMARY="${2:-update}"
MEMORY_FILE="memory/MEMORY.md"
[ ! -f "$MEMORY_FILE" ] && printf "# Memory Index\n\n| Date | Summary |\n|------|----------|\n" > "$MEMORY_FILE"
if grep -qF "[$DATE]" "$MEMORY_FILE"; then
  # Update existing entry's summary (idempotent — safe for hook + dev-sync)
  sed -i -E "s/\| \[$DATE\]\($DATE\.md\) \|[^|]*\|/| [$DATE]($DATE.md) | $SUMMARY |/" "$MEMORY_FILE"
else
  echo "| [$DATE]($DATE.md) | $SUMMARY |" >> "$MEMORY_FILE"
fi
