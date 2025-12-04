#!/bin/bash -e
# Setup script for submodules with sparse checkout

echo "Setting up 5etools submodule with sparse checkout..."

# Initialize submodule without checkout
git submodule update --init --depth 1 -N -- 5etools

# Configure sparse checkout for data directory only
git -C 5etools sparse-checkout init --no-cone
echo "data/*" | git -C 5etools sparse-checkout set --stdin

# Checkout with sparse configuration
git -C 5etools checkout main

echo "✓ Submodule setup complete. Only data/ directory is checked out."
