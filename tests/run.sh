#!/usr/bin/env bash
# UTSAVA Celebration — test runner
# Runs syntax checks, the unit suite and the DOM smoke test.
set -e
unset NODE_OPTIONS 2>/dev/null || true
cd "$(dirname "$0")/.."

echo "== Syntax checks =="
for f in js/data.js js/pricing.js js/store.js js/app.js sw.js tests/pricing.test.js tests/dom-smoke.test.js; do
  node --check "$f" && echo "  ok  $f"
done

echo
echo "== Unit tests =="
node tests/pricing.test.js

echo
echo "== DOM smoke test =="
node tests/dom-smoke.test.js

echo
echo "All checks passed."
