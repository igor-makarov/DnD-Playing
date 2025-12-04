#!/bin/bash -e

# Download 5etools data
VERSION="v2.19.1"
URL="https://github.com/5etools-mirror-3/5etools-src/releases/download/${VERSION}/5etools-${VERSION}.zip"
OUTPUT_DIR="5etools"

echo "Downloading 5etools ${VERSION}..."
curl -L -o 5etools.zip "$URL"

echo "Extracting..."
rm -rf "$OUTPUT_DIR"
unzip -q 5etools.zip "data/*" -d "$OUTPUT_DIR"

echo "Cleaning up..."
rm 5etools.zip

echo "Done! 5etools data is ready in ${OUTPUT_DIR}/"
