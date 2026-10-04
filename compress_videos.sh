#!/bin/bash
# compress_videos.sh
# This script compresses all .mp4 files in the current directory
# to make them suitable for web hosting on GitHub Pages.
# It uses H.264 codec, scales down to 720p, and reduces bitrate.

if ! command -v ffmpeg &> /dev/null
then
    echo "ffmpeg could not be found. Please install it first (e.g., sudo apt install ffmpeg)"
    exit 1
fi

mkdir -p compressed

for file in *.mp4; do
    if [ -f "$file" ]; then
        echo "Compressing $file..."
        # -vcodec libx264: Use H.264 codec (widely supported on web)
        # -crf 28: Constant Rate Factor (higher means lower quality/smaller size, 23-28 is good for web)
        # -preset fast: Encoding speed
        # -vf scale=-2:720: Scale to 720p height, keep aspect ratio
        # -movflags +faststart: Optimizes for web streaming
        ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset fast -vf scale=-2:720 -movflags +faststart "compressed/$file"
        echo "Saved to compressed/$file"
    fi
done

echo "Compression complete. Check the 'compressed' folder."
