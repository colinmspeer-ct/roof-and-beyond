#!/usr/bin/env python3
"""Validate descriptions in the rendered static HTML."""
from html.parser import HTMLParser
from pathlib import Path
import re


class DescriptionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.descriptions = []

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            attrs = dict(attrs)
            if attrs.get("name", "").lower() == "description":
                self.descriptions.append((attrs.get("content") or "").strip())


out = Path(__file__).resolve().parents[1] / "out"
error_document = out / "404.html"
aliases = {"404/index.html", "_not-found/index.html"}
seen = {}
problems = []
max_length = 0
count = 0
for page in sorted(out.rglob("*.html")):
    route = page.relative_to(out).as_posix()
    html = page.read_text()
    # Next emits identical copies of its fallback route for static hosts.
    if route in aliases and error_document.is_file() and html == error_document.read_text():
        continue
    count += 1
    parser = DescriptionParser()
    parser.feed(re.split(r"</head\s*>", html, maxsplit=1, flags=re.I)[0])
    if len(parser.descriptions) != 1:
        problems.append(f"{route}: expected one description, found {len(parser.descriptions)}")
        continue
    description = parser.descriptions[0]
    max_length = max(max_length, len(description))
    if len(description) > 160 or not description.endswith((".", "!", "?")) or description.endswith(("..", "…")):
        problems.append(f"{route}: invalid description ({len(description)} characters): {description!r}")
    normalized = " ".join(description.casefold().split())
    if normalized in seen:
        problems.append(f"{route}: duplicates the description for {seen[normalized]}")
    seen[normalized] = route

if not count:
    problems.append("No exported HTML pages found.")
for problem in problems:
    print(problem)
print(f"meta check pages={count} maxLength={max_length} problems={len(problems)}")
raise SystemExit(bool(problems))
