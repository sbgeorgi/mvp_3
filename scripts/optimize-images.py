"""Create responsive WebP encodings without changing or replacing source imagery."""
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = root / "public" / "images"
output = source / "optimized"
output.mkdir(exist_ok=True)
metadata = {}
original_bytes = optimized_bytes = 0
for filename in sorted(source.glob("*.jpg")):
    image = ImageOps.exif_transpose(Image.open(filename)).convert("RGB")
    width, height = image.size
    widths = sorted(set([min(480, width), min(800, width), width]))
    variants = []
    for size in widths:
        target = output / (filename.stem + "-" + str(size) + ".webp")
        resized = image.resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
        resized.save(target, "WEBP", quality=86, method=6)
        variants.append({"file": target.name, "width": size})
    full = output / variants[-1]["file"]
    metadata[filename.name] = {"file": full.name, "width": width, "height": height, "variants": variants}
    original_bytes += filename.stat().st_size
    optimized_bytes += full.stat().st_size
(root / "src" / "image-meta.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
print(f"{len(metadata)} images; full-size encodings: {original_bytes:,} -> {optimized_bytes:,} bytes ({(1-optimized_bytes/original_bytes)*100:.1f}% smaller).")
