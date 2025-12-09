#!/bin/bash
# Simple wrapper: ./jq <file> <jq-expression> [jq-options...]
# Example: ./jq 5etools/data/races.json '.race[] | select(.name == "Dwarf")'

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <file> <jq-expression> [jq-options...]" >&2
    exit 1
fi

file="$1"
expr="$2"
shift 2

exec jq "$expr" "$@" "$file"
