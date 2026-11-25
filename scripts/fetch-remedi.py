#!/usr/bin/env python3
"""Download public Remedi pages and store normalized sentences and 8-grams.

The HTML is kept only in scripts/.cache, which is gitignored. Nothing from
that site is copied into Roof & Beyond pages.
"""

from __future__ import annotations

import html
import re
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "scripts" / ".cache"
SITEMAP = "https://remedipestcontrol.com/sitemap.xml"
UA = {"User-Agent": "RoofBeyondPreviewBot/1.0 (duplicate-content comparison)"}


class Visible(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.skip = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript", "svg"}:
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript", "svg"} and self.skip:
            self.skip -= 1
        if tag in {"p", "div", "li", "h1", "h2", "h3", "br", "section"}:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def norm(text: str) -> str:
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(SITEMAP, headers=UA)
    xml = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "replace")
    urls = re.findall(r"<loc>(.*?)</loc>", xml)
    sentences: set[str] = set()
    grams: set[str] = set()
    for url in urls:
        raw = ""
        for attempt in range(3):
            try:
                request = urllib.request.Request(url, headers=UA)
                raw = urllib.request.urlopen(request, timeout=40).read().decode("utf-8", "replace")
                break
            except Exception as error:
                if attempt == 2:
                    raise SystemExit(f"failed {url}: {error}") from error
                time.sleep(1.5)
        parser = Visible()
        parser.feed(raw)
        text = html.unescape("".join(parser.parts))
        for part in re.split(r"[.!?]+|\n+", text):
            cleaned = norm(part)
            words = cleaned.split()
            if len(words) >= 8:
                sentences.add(" ".join(words))
        words = norm(text).split()
        for i in range(len(words) - 7):
            grams.add(" ".join(words[i : i + 8]))
        time.sleep(0.1)
        print(url)
    (CACHE / "remedi-sentences.txt").write_text("\n".join(sorted(sentences)) + "\n")
    (CACHE / "remedi-8grams.txt").write_text("\n".join(sorted(grams)) + "\n")
    print(f"sentences={len(sentences)} grams={len(grams)}")


if __name__ == "__main__":
    main()
