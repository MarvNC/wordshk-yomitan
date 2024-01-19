#!/bin/bash

# Define the directory name
csv_dir="csvs"

# Create the directory if it doesn't exist
mkdir -p "$csv_dir"

# Delete contents of the directory if it exists
rm -rf "$csv_dir"/*

# Read each line in the file and process
while IFS= read -r url || [ -n "$url" ]; do
  # Ignore empty lines
  if [ -n "$url" ]; then
    # Extract filename from URL
    filename=$(basename "$url")

    # Check if the file already exists
    if [ -f "$csv_dir/$filename" ]; then
      echo "File $filename already exists. Skipping..."
      continue
    else
      echo "File $filename does not exist. Downloading..."
      # Download the file
      echo "Downloading $filename..."
      wget "$url" -O "$csv_dir/$filename"
    fi

    # Unzip the downloaded file
    echo "Unzipping $filename..."
    gzip -d "$csv_dir/$filename"
  fi
done <csv.gz.URLs.txt
