#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Running backend tests..."
cd backend && npm test
cd ..

echo ""
echo "Running frontend tests..."
cd frontend && npm test
cd ..

echo ""
echo "All tests passed."
