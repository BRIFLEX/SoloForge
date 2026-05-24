#!/usr/bin/env bash
# Build page-specific hero background videos (Pexels, free license).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/videos/sources"
OUT="$ROOT/assets/videos/pages"
FF="${FFMPEG:-$ROOT/.venv-video/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1}"
REF='Referer: https://www.pexels.com/'
UA='User-Agent: Mozilla/5.0'

GRADE="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=brightness=-0.12:contrast=1.06:saturation=0.8,fps=24,format=yuv420p"

if [[ ! -x "$FF" ]]; then
  echo "ffmpeg not found at $FF" >&2
  exit 1
fi

mkdir -p "$SRC" "$OUT"

download() {
  local out="$1" url="$2"
  if [[ -f "$out" ]] && [[ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 10000 ]]; then
    return 0
  fi
  echo "Downloading $(basename "$out")..."
  curl -fsSL -H "$REF" -H "$UA" -o "$out" "$url"
}

build_clip() {
  local slug="$1" src="$2" ss="$3" dur="$4"
  local tmp="$OUT/.tmp-$slug.mp4"
  echo "Encoding $slug (${dur}s from ${ss}s)..."
  "$FF" -y -ss "$ss" -t "$dur" -i "$src" \
    -vf "$GRADE" -an \
    -c:v libx264 -preset medium -crf 22 -movflags +faststart \
    "$tmp"
  mv "$tmp" "$OUT/$slug.mp4"
  "$FF" -y -i "$OUT/$slug.mp4" -c:v libvpx-vp9 -crf 33 -b:v 0 "$OUT/$slug.webm" 2>/dev/null || true
  "$FF" -y -i "$OUT/$slug.mp4" -frames:v 1 -update 1 -q:v 2 "$OUT/${slug}-poster.jpg"
}

# slug | source file | url (empty = use existing local) | start | duration
process() {
  local slug="$1" src_name="$2" url="${3:-}" ss="$4" dur="$5"
  local src="$SRC/$src_name"
  if [[ -n "$url" ]]; then
    download "$src" "$url"
  elif [[ ! -f "$src" ]]; then
    echo "Missing source for $slug: $src" >&2
    exit 1
  fi
  build_clip "$slug" "$src" "$ss" "$dur"
}

PEX="https://videos.pexels.com/video-files"

# Services
process ai-data       ai-data.mp4       "$PEX/6774059/6774059-hd_1920_1080_30fps.mp4"  0   16
process cloud         cloud.mp4         "$PEX/5028622/5028622-hd_1920_1080_25fps.mp4"  1.5 18
process engineering   dev-team.mp4      "$PEX/6804109/6804109-uhd_2732_1440_25fps.mp4"  7   18
process legacy        strategy.mp4      "$PEX/7147921/7147921-hd_1920_1080_25fps.mp4"  2   16
process staff         team-meeting.mp4  "$PEX/6339834/6339834-hd_1920_1080_30fps.mp4"  0.5 14

# Industries
process healthcare    healthcare-doctor.mp4 "$PEX/8413638/8413638-uhd_1440_2560_25fps.mp4" 1 15
process finance       finance.mp4       "$PEX/7693403/7693403-hd_1920_1080_25fps.mp4"  0   15
process logistics     logistics.mp4     "$PEX/4281239/4281239-hd_1920_1080_25fps.mp4"  1.5 16
process energy        energy.mp4        "$PEX/5989390/5989390-uhd_2560_1440_25fps.mp4"  4   18
process edtech        edtech.mp4        "$PEX/4498849/4498849-hd_1920_1080_25fps.mp4"  2   16
process ecommerce     ecommerce.mp4     "$PEX/3209663/3209663-hd_1920_1080_25fps.mp4"  2   18

echo ""
echo "Page hero videos ready:"
ls -lh "$OUT"/*.mp4
