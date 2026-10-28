"""Version static asset URLs by content so HTML never reuses outdated CSS/JS."""
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
PATTERN = re.compile(r'((?:href|src)=")([a-zA-Z0-9_./-]+\.(?:css|js))(?:\?[^"\s]*)?(")')


def version(match):
    prefix, name, suffix = match.groups()
    asset = (ROOT / name).resolve()
    if ROOT not in asset.parents or not asset.is_file():
        raise ValueError(f"Invalid asset path: {name}")
    digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
    return f"{prefix}{name}?v={digest}{suffix}"


def main():
    original = HTML.read_text(encoding="utf-8")
    updated = PATTERN.sub(version, original)
    if "--check" in sys.argv:
        if original != updated:
            raise SystemExit("Asset URLs are outdated. Run python3 scripts/version_assets.py.")
        print("Static asset versions match their contents.")
    elif updated != original:
        HTML.write_text(updated, encoding="utf-8")
        print("Updated CSS and JavaScript asset versions.")


if __name__ == "__main__":
    main()
