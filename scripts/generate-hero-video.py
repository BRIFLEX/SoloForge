#!/usr/bin/env python3
"""Generate SoloForge hero background ad video (dark + gold cinematic loop)."""

import math
import random
import sys
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "videos"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720
FPS = 24
DURATION = 10
FRAMES = FPS * DURATION

random.seed(42)
np.random.seed(42)

# Pre-generate particles
PARTICLES = [
    {
        "x": random.uniform(0, W),
        "y": random.uniform(0, H),
        "r": random.uniform(1.0, 2.8),
        "speed": random.uniform(8, 28),
        "phase": random.uniform(0, math.tau),
        "alpha": random.uniform(0.15, 0.55),
    }
    for _ in range(90)
]

STREAKS = [
    {
        "y": random.uniform(0.1, 0.9) * H,
        "speed": random.uniform(40, 120),
        "len": random.uniform(80, 220),
        "phase": random.uniform(0, W),
        "alpha": random.uniform(0.04, 0.12),
    }
    for _ in range(12)
]


def lerp(a, b, t):
    return a + (b - a) * t


def base_gradient(t):
    """Dark premium gradient with slow gold wash."""
    img = Image.new("RGB", (W, H), (10, 10, 11))
    draw = ImageDraw.Draw(img, "RGBA")

    # Deep vignette
    for i in range(8):
        alpha = int(18 + i * 4)
        inset = i * 28
        draw.rectangle(
            [inset, inset, W - inset, H - inset],
            outline=(0, 0, 0, alpha),
            width=2,
        )

    # Animated gold glow (top-right, like site hero)
    pulse = 0.5 + 0.5 * math.sin(t * math.tau * 0.35)
    gx = int(W * lerp(0.72, 0.78, pulse))
    gy = int(H * lerp(0.08, 0.18, 0.5 + 0.5 * math.sin(t * math.tau * 0.22)))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow, "RGBA")
    radius = int(lerp(280, 360, pulse))
    for r in range(radius, 0, -8):
        a = int(lerp(0, 38, (radius - r) / radius) * lerp(0.65, 1.0, pulse))
        gdraw.ellipse(
            [gx - r, gy - r, gx + r, gy + r],
            fill=(201, 162, 39, a),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(28))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")

    # Secondary cool glow bottom-left
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g2 = ImageDraw.Draw(glow2, "RGBA")
    gx2 = int(W * lerp(0.08, 0.14, pulse))
    gy2 = int(H * lerp(0.75, 0.82, pulse))
    for r in range(200, 0, -6):
        a = int(lerp(0, 14, (200 - r) / 200))
        g2.ellipse([gx2 - r, gy2 - r, gx2 + r, gy2 + r], fill=(40, 38, 55, a))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(22))
    img = Image.alpha_composite(img.convert("RGBA"), glow2).convert("RGB")

    return img.convert("RGBA")


def draw_grid(img, t):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    spacing = 28
    drift = int((t * 28) % spacing)
    alpha = int(lerp(10, 18, 0.5 + 0.5 * math.sin(t * math.tau * 0.5)))
    for x in range(-spacing, W + spacing, spacing):
        draw.line([(x + drift, 0), (x + drift, H)], fill=(201, 162, 39, alpha), width=1)
    for y in range(-spacing, H + spacing, spacing):
        draw.line([(0, y + drift), (W, y + drift)], fill=(201, 162, 39, alpha), width=1)
    return Image.alpha_composite(img, overlay)


def draw_particles(img, t):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    for p in PARTICLES:
        x = (p["x"] + math.sin(t * math.tau + p["phase"]) * 12 + t * p["speed"] * 0.15) % (W + 40) - 20
        y = (p["y"] + math.cos(t * math.tau * 0.7 + p["phase"]) * 10 - t * p["speed"] * 0.08) % (H + 40) - 20
        a = int(255 * p["alpha"] * (0.6 + 0.4 * math.sin(t * math.tau * 2 + p["phase"])))
        r = p["r"]
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(232, 197, 71, a))
    return Image.alpha_composite(img, overlay)


def draw_streaks(img, t):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    for s in STREAKS:
        x = (s["phase"] + t * s["speed"] * 8) % (W + s["len"]) - s["len"]
        y = s["y"] + math.sin(t * math.tau + s["phase"]) * 6
        a = int(255 * s["alpha"])
        draw.line([(x, y), (x + s["len"], y)], fill=(201, 162, 39, a), width=1)
    return Image.alpha_composite(img, overlay)


def draw_scanline(img, t):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    y = int((t * 0.18) % 1.2 * H)
    draw.rectangle([0, y, W, y + 2], fill=(255, 255, 255, 6))
    return Image.alpha_composite(img, overlay)


def render_frame(frame_idx):
    t = frame_idx / FRAMES
    img = base_gradient(t)
    img = draw_grid(img, t)
    img = draw_streaks(img, t)
    img = draw_particles(img, t)
    img = draw_scanline(img, t)

    # Soft film grain
    noise = np.random.randint(0, 8, (H, W, 3), dtype=np.uint8)
    arr = np.array(img.convert("RGB"), dtype=np.int16)
    arr = np.clip(arr + noise - 4, 0, 255).astype(np.uint8)
    return arr


def main():
    mp4_path = OUT_DIR / "hero-bg.mp4"
    webm_path = OUT_DIR / "hero-bg.webm"

    print(f"Rendering {FRAMES} frames at {W}x{H}...")
    frames = [render_frame(i) for i in range(FRAMES)]

    print(f"Writing {mp4_path}...")
    imageio.mimsave(
        mp4_path,
        frames,
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=1,
        output_params=["-crf", "23", "-preset", "medium", "-movflags", "+faststart"],
    )

    print(f"Writing {webm_path}...")
    try:
        imageio.mimsave(webm_path, frames, fps=FPS, codec="libvpx-vp9", quality=8)
    except Exception as exc:
        print(f"WebM skipped: {exc}", file=sys.stderr)

    size_kb = mp4_path.stat().st_size // 1024
    print(f"Done — {mp4_path.name} ({size_kb} KB)")


if __name__ == "__main__":
    main()
