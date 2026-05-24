#!/usr/bin/env bash
# Build SoloForge homepage hero — unique scenes only (no repeated source clips).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VID="$ROOT/assets/videos"
SRC="$ROOT/assets/videos/sources"
FF="${FFMPEG:-$ROOT/.venv-video/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1}"
FADE=0.8
REF='Referer: https://www.pexels.com/'
UA='User-Agent: Mozilla/5.0'
PEX="https://videos.pexels.com/video-files"

if [[ ! -x "$FF" ]]; then
  echo "ffmpeg not found at $FF" >&2
  exit 1
fi

GRADE="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=brightness=-0.1:contrast=1.05:saturation=0.82,fps=24,format=yuv420p"

download() {
  local out="$1" url="$2"
  if [[ -f "$out" ]] && [[ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 10000 ]]; then
    return 0
  fi
  echo "Downloading $(basename "$out")..."
  curl -fsSL -H "$REF" -H "$UA" -o "$out" "$url"
}

trim_faded() {
  local in="$1" out="$2" ss="$3" dur="$4"
  local fade_out
  fade_out=$(awk "BEGIN {printf \"%.2f\", $dur - $FADE}")
  "$FF" -y -ss "$ss" -t "$dur" -i "$in" \
    -vf "$GRADE,fade=t=in:st=0:d=$FADE,fade=t=out:st=$fade_out:d=$FADE" \
    -an -c:v libx264 -preset medium -crf 23 -movflags +faststart "$out"
}

mkdir -p "$VID" "$SRC"
cd "$VID"

# Ensure six distinct source clips exist
download "$SRC/team-meeting.mp4"    "$PEX/6339834/6339834-hd_1920_1080_30fps.mp4"
download "$SRC/ai-data.mp4"       "$PEX/6774059/6774059-hd_1920_1080_30fps.mp4"
download "$SRC/dev-team.mp4"      "$PEX/6804109/6804109-uhd_2732_1440_25fps.mp4"
download "$SRC/cloud.mp4"         "$PEX/5028622/5028622-hd_1920_1080_25fps.mp4"
download "$SRC/office-team.mp4"   "$PEX/8460902/8460902-hd_1920_1080_25fps.mp4"
download "$SRC/finance.mp4"       "$PEX/7693403/7693403-hd_1920_1080_25fps.mp4"

# One segment per source — business, data, engineering, cloud, collaboration, finance
trim_faded "$SRC/team-meeting.mp4"  clip-01-meeting.mp4    0.3  5.5
trim_faded "$SRC/ai-data.mp4"       clip-02-analytics.mp4  1.0  8.5
trim_faded "$SRC/dev-team.mp4"      clip-03-engineering.mp4 5.0  9.0
trim_faded "$SRC/cloud.mp4"         clip-04-cloud.mp4       2.0  8.5
trim_faded "$SRC/office-team.mp4"   clip-05-collab.mp4      0.8  8.5
trim_faded "$SRC/finance.mp4"       clip-06-finance.mp4     0.5  8.0

"$FF" -y \
  -i clip-01-meeting.mp4 \
  -i clip-02-analytics.mp4 \
  -i clip-03-engineering.mp4 \
  -i clip-04-cloud.mp4 \
  -i clip-05-collab.mp4 \
  -i clip-06-finance.mp4 \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v][5:v]concat=n=6:v=1:a=0[vout]" \
  -map "[vout]" -c:v libx264 -preset medium -crf 22 -movflags +faststart hero-bg.mp4

"$FF" -y -i hero-bg.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 hero-bg.webm
"$FF" -y -i hero-bg.mp4 -frames:v 1 -update 1 -q:v 2 hero-bg-poster.jpg

rm -f clip-0*.mp4

DUR=$("$FF" -i hero-bg.mp4 2>&1 | grep Duration | sed 's/.*Duration: //;s/,.*//')
echo "Homepage hero ready ($DUR) — 6 unique scenes:"
ls -lh hero-bg.mp4 hero-bg.webm hero-bg-poster.jpg
