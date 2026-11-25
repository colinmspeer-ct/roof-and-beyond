#!/usr/bin/env python3
"""Build unique page copy for Roof & Beyond Home Solutions.

Town prose lives in scripts/data/towns_*.py. This script only assembles
metadata, FAQs, and JSON. It does not swap a town name into a shared essay.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent / "data"))
COPY_PATH = ROOT / "scripts" / "data" / "local_copy.json"

from towns_lancaster import TOWNS as LANCASTER  # noqa: E402
from towns_lancaster_rest import TOWNS as LANCASTER_REST  # noqa: E402
from towns_chester import TOWNS as CHESTER  # noqa: E402
from towns_delaware import TOWNS as DELAWARE  # noqa: E402
from towns_york import TOWNS as YORK  # noqa: E402

COUNTIES = {
    "lancaster": {
        "slug": "lancaster-county-pennsylvania",
        "name": "Lancaster County",
    },
    "chester": {
        "slug": "chester-county-pennsylvania",
        "name": "Chester County",
    },
    "delaware": {
        "slug": "delaware-county-pennsylvania",
        "name": "Delaware County",
    },
    "york": {
        "slug": "york-county-pennsylvania",
        "name": "York County",
    },
}

SERVICES = [
    ("roofing", "Roofing", "roofing"),
    ("roof_repair", "Roof repair", "roof-repair"),
    ("siding", "Siding", "siding"),
    ("windows", "Windows", "windows"),
    ("gutters", "Gutters", "gutters"),
    ("gutter_guards", "Gutter guards", "gutter-guards"),
]

Q_FRAMES = {
    "roofing": [
        "Which roof shapes dominate around {hook}?",
        "What does a full roof scope have to separate in {name}?",
        "Where do {name} roofs differ from one street to the next?",
    ],
    "roof_repair": [
        "Where do active leaks show up around {hook}?",
        "When is a patch the wrong scope in {name}?",
        "What should a repair visit look at first in {name}?",
    ],
    "siding": [
        "Which wall materials are actually on houses near {hook}?",
        "What fails first on exterior walls in {name}?",
        "How should a siding scope treat masonry in {name}?",
    ],
    "windows": [
        "What window mix exists around {hook}?",
        "Which openings should a {name} estimate name individually?",
        "What water signs show up at windows in {name}?",
    ],
    "gutters": [
        "Where does roof water go wrong around {hook}?",
        "What gutter detail matters on {name} lots?",
        "How do downspouts fail in {name}?",
    ],
    "gutter_guards": [
        "What debris would a guard have to pass near {hook}?",
        "When is a gutter cover a poor fit in {name}?",
        "What should a guard estimate refuse to promise in {name}?",
    ],
}


def clean(text: str) -> str:
    text = re.sub(r"[ \t]+\n", "\n", text.strip())
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def paragraphs(text: str) -> list[str]:
    parts = [re.sub(r"\s+", " ", p).strip() for p in clean(text).split("\n\n")]
    return [p for p in parts if p]


def wc(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9'&-]+", text))


def meta_desc(text: str, limit: int = 158) -> str:
    one = re.sub(r"\s+", " ", text).strip()
    if len(one) <= limit:
        return one
    cut = one[: limit - 1]
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip(",;:") + "."


def load_copy() -> dict:
    if not COPY_PATH.exists():
        raise SystemExit("missing scripts/data/local_copy.json; run python3 scripts/compose_local.py")
    return json.loads(COPY_PATH.read_text())["towns"]


def build_town(raw: dict, copy: dict) -> dict:
    county = COUNTIES[raw["county"]]
    paras = paragraphs(raw["town"])
    if wc(" ".join(paras)) < 120:
        raise SystemExit(f"{raw['slug']} town copy is under 120 words")
    hook = raw.get("hook", raw["name"])
    services = {}
    for key, label, slug in SERVICES:
        body = paragraphs(raw[key])
        if wc(" ".join(body)) < 80:
            raise SystemExit(f"{raw['slug']} {key} copy is under 80 words")
        extra = copy["services"][slug]
        services[slug] = {
            "label": label,
            "slug": slug,
            "h1": f"{label} on houses in {raw['name']}",
            "metaTitle": f"{label} in {raw['name']}, PA",
            "metaDescription": meta_desc(body[0]),
            "paragraphs": body,
            "faqs": extra["faqs"],
            "answer": extra["answer"],
            "costHeading": extra["costHeading"],
            "costParagraphs": extra["costParagraphs"],
            "priceNote": extra["priceNote"],
        }
    return {
        "slug": raw["slug"],
        "name": raw["name"],
        "county": raw["county"],
        "countySlug": county["slug"],
        "countyName": county["name"],
        "kind": raw["kind"],
        "zips": raw["zips"],
        "neighbors": raw["neighbors"],
        "hook": hook,
        "h1": raw.get("h1") or f"Roofs, walls, and water on houses in {raw['name']}",
        "metaTitle": f"Exterior work in {raw['name']}, {county['name']}",
        "metaDescription": meta_desc(paras[0]),
        "paragraphs": paras,
        "services": services,
        "riskLead": copy["riskLead"],
        "answer": copy["answer"],
        "localSections": copy["localSections"],
        "faqs": copy["faqs"],
        "sources": copy["sources"],
    }


def main() -> None:
    raws = LANCASTER + LANCASTER_REST + CHESTER + DELAWARE + YORK
    copy = load_copy()
    missing = [raw["slug"] for raw in raws if raw["slug"] not in copy]
    if missing:
        raise SystemExit(f"local copy missing {missing[:5]}")
    towns = [build_town(raw, copy[raw["slug"]]) for raw in raws]
    slugs = [t["slug"] for t in towns]
    if len(slugs) != len(set(slugs)):
        raise SystemExit("duplicate town slug")
    by_county: dict[str, list] = {k: [] for k in COUNTIES}
    known = set(slugs)
    for t in towns:
        by_county[t["county"]].append(t["slug"])
        for n in t["neighbors"]:
            if n not in known:
                raise SystemExit(f"{t['slug']} missing neighbor {n}")
    expected = {"lancaster": 28, "chester": 24, "delaware": 9}
    for key, count in expected.items():
        if len(by_county[key]) != count:
            raise SystemExit(f"{key} has {len(by_county[key])}, expected {count}")
    if len(by_county["york"]) < 16:
        raise SystemExit("York County list is too small")
    out_dir = ROOT / "src" / "content" / "generated"
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "counties": [
            {"key": key, **val, "towns": by_county[key]} for key, val in COUNTIES.items()
        ],
        "towns": towns,
        "services": [
            {"key": key, "label": label, "slug": slug} for key, label, slug in SERVICES
        ],
    }
    dest = out_dir / "areas.json"
    dest.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(
        f"wrote {dest} towns={len(towns)} "
        f"york={len(by_county['york'])} "
        f"town_service={len(towns) * len(SERVICES)}"
    )


if __name__ == "__main__":
    main()
