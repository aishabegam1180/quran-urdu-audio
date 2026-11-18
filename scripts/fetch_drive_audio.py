#!/usr/bin/env python3
"""Download every audio file from a public Google Drive folder, give each a
clean name (001-01.mp3 = surah 1, part 1) and write manifest.json for the app.

Usage: python fetch_drive_audio.py <drive-folder-id> <output-dir>
Runs inside GitHub Actions (needs internet + `pip install gdown requests`).
"""
import html
import json
import re
import sys
import time
from pathlib import Path

import gdown
import requests

AUDIO_EXT = (".mp3", ".m4a", ".aac", ".ogg", ".wav")
UA = {"User-Agent": "Mozilla/5.0"}


def list_folder(folder_id, path=""):
    """Return [(file_id, name)] for a public folder, recursing into subfolders.
    Uses Drive's embedded folder view, which lists all items (no 50-file cap)."""
    url = f"https://drive.google.com/embeddedfolderview?id={folder_id}#list"
    page = requests.get(url, headers=UA, timeout=60).text
    entries = re.findall(
        r'<a href="(https://drive\.google\.com/(?:file/d/|drive/folders/)[^"]+)"[^>]*>.*?'
        r'<div class="flip-entry-title">(.*?)</div>',
        page,
        flags=re.S,
    )
    out = []
    for link, title in entries:
        title = html.unescape(title).strip()
        if "/drive/folders/" in link:
            sub_id = link.split("/drive/folders/")[1].split("?")[0].split("/")[0]
            out += list_folder(sub_id, f"{path}{title}/")
        else:
            file_id = link.split("/file/d/")[1].split("/")[0]
            out.append((file_id, title))
    return out


def parse(name):
    """'001-Sura Al-Fatiha [Ayahs 1-7].mp3' -> (1, 'Sura Al-Fatiha', 'Ayahs 1-7', 1)"""
    stem = re.sub(r"\.[A-Za-z0-9]+$", "", name)
    m = re.match(r"\s*(\d{1,3})", stem)
    if not m:
        return None
    surah = int(m.group(1))
    rest = stem[m.end():].replace("_", " ")
    ayahs_m = re.search(r"Ayahs?\s*(\d+)\s*-\s*(\d+)", rest, flags=re.I)
    ayahs = f"Ayahs {ayahs_m.group(1)}-{ayahs_m.group(2)}" if ayahs_m else ""
    first_ayah = int(ayahs_m.group(1)) if ayahs_m else 0
    title = re.sub(r"[\[\(].*?[\]\)]", "", rest)          # drop [Ayahs ...]
    title = re.sub(r"Ayahs?\s*\d+\s*-\s*\d+", "", title, flags=re.I)
    title = re.sub(r"\s+", " ", title).strip(" -_")
    return surah, title or f"Surah {surah}", ayahs, first_ayah


def main():
    folder_id, out_dir = sys.argv[1], Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    files = [(fid, n) for fid, n in list_folder(folder_id) if n.lower().endswith(AUDIO_EXT)]
    print(f"Found {len(files)} audio files in the Drive folder")
    if not files:
        sys.exit("No audio files found. Is the folder shared as 'Anyone with the link'?")

    parsed, skipped = [], []
    for fid, name in files:
        p = parse(name)
        (parsed.append((p, fid, name)) if p else skipped.append(name))
    for s in skipped:
        print(f"SKIPPED (no surah number at start of name): {s}")

    parsed.sort(key=lambda x: (x[0][0], x[0][3], x[2]))
    tracks, part_count = [], {}
    for (surah, title, ayahs, _), fid, name in parsed:
        part_count[surah] = part_count.get(surah, 0) + 1
        part = part_count[surah]
        ext = Path(name).suffix.lower()
        clean = f"{surah:03d}-{part:02d}{ext}"
        dest = out_dir / clean
        for attempt in range(4):
            try:
                gdown.download(id=fid, output=str(dest), quiet=True)
                if dest.exists() and dest.stat().st_size > 10_000:
                    break
            except Exception as e:  # noqa: BLE001
                print(f"  retry {attempt + 1} for {name}: {e}")
            time.sleep(5 * (attempt + 1))
        else:
            sys.exit(f"Could not download {name}")
        print(f"{clean}  <-  {name}  ({dest.stat().st_size // 1024} KB)")
        tracks.append({"id": clean.rsplit(".", 1)[0], "surah": surah, "part": part,
                       "title": title, "ayahs": ayahs, "file": clean,
                       "bytes": dest.stat().st_size})

    surahs = sorted({t["surah"] for t in tracks})
    missing = [n for n in range(1, 115) if n not in surahs]
    print(f"\n{len(tracks)} tracks covering {len(surahs)} surahs.")
    if missing:
        print(f"WARNING: no audio for surah numbers: {missing}")

    (out_dir / "manifest.json").write_text(
        json.dumps({"version": int(time.time()), "tracks": tracks}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
