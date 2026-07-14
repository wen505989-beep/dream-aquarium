"""Create WebP copies of the fish sprites for the production Vite build."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
FISH_DIR = ROOT / "src" / "assets" / "fish"


def main() -> None:
    for source in FISH_DIR.rglob("*.png"):
        destination = source.with_suffix(".webp")
        with Image.open(source) as image:
            image.save(destination, "WEBP", quality=82, method=6)
        print(f"{source.relative_to(ROOT)} -> {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
