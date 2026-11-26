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
from towns_cumberland import TOWNS as CUMBERLAND  # noqa: E402

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
    "cumberland": {
        "slug": "cumberland-county-pennsylvania",
        "name": "Cumberland County",
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

def clean(text: str) -> str:
    text = re.sub(r"[ \t]+\n", "\n", text.strip())
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def paragraphs(text: str) -> list[str]:
    parts = [re.sub(r"\s+", " ", p).strip() for p in clean(text).split("\n\n")]
    return [p for p in parts if p]


def wc(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9'&-]+", text))


META_DETAILS = {
    "roofing": "Get a written scope for roof replacement, including tear-off and flashing.",
    "roof-repair": "Request an estimate for leaks, loose shingles, or damaged flashing.",
    "siding": "Get a written estimate that covers siding, trim, and wall preparation.",
    "windows": "Request a window replacement estimate based on each opening.",
    "gutters": "Get an estimate for gutter runs, outlets, and downspouts.",
    "gutter-guards": "Ask which gutter covers fit your roof edge and existing gutters.",
}


def meta_description(name: str, service: str | None = None) -> str:
    if service:
        label = "window replacement" if service == "windows" else service.replace("-", " ")
        description = f"Request {label} in {name}, PA. {META_DETAILS[service]}"
    else:
        description = f"Get a written estimate for roofing, siding, windows, or gutters in {name}, PA."
    if len(description) > 155:
        raise SystemExit(f"Meta description exceeds 155 characters: {description}")
    return description


def load_copy() -> dict:
    if not COPY_PATH.exists():
        raise SystemExit("missing scripts/data/local_copy.json; run python3 scripts/compose_local.py")
    return json.loads(COPY_PATH.read_text())["towns"]


def build_town(raw: dict, copy: dict) -> dict:
    county = COUNTIES[raw["county"]]
    paras = paragraphs(raw["town"])
    cumberland = raw["county"] == "cumberland"
    meta_place = f"{raw['name']}, {county['name']}" if cumberland else raw["name"]
    town_article = [*paras, copy["answer"], copy["riskLead"]] if cumberland else paras
    if wc(" ".join(town_article)) < 120:
        raise SystemExit(f"{raw['slug']} town copy is under 120 words")
    hook = raw.get("hook", raw["name"])
    services = {}
    for key, label, slug in SERVICES:
        body = paragraphs(raw[key])
        extra = copy["services"][slug]
        service_article = [*body, extra["answer"]] if cumberland else body
        if wc(" ".join(service_article)) < 80:
            raise SystemExit(f"{raw['slug']} {key} copy is under 80 words")
        services[slug] = {
            "label": label,
            "slug": slug,
            "h1": f"{label} on houses in {raw['name']}",
            "metaTitle": f"{label} in {raw['name']}, PA",
            "metaDescription": meta_description(meta_place, slug),
            "paragraphs": body,
            "faqs": extra["faqs"],
            "answer": extra["answer"],
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
        "metaDescription": meta_description(meta_place),
        "paragraphs": paras,
        "services": services,
        "riskLead": copy["riskLead"],
        "answer": copy["answer"],
        "localSections": copy["localSections"],
        "faqs": copy["faqs"],
        "sources": copy["sources"],
    }


def assign_photo_indices(towns: list[dict]) -> None:
    """Keep linked neighbors on different photos across the five-image rotations."""
    adjacency = {town["slug"]: set(town["neighbors"]) for town in towns}
    for town in towns:
        for neighbor in town["neighbors"]:
            adjacency[neighbor].add(town["slug"])
    assigned = {}
    remaining = set(adjacency)
    usage = [0] * 5
    while remaining:
        def rank(slug: str) -> tuple:
            used = {assigned[adjacent] for adjacent in adjacency[slug] if adjacent in assigned}
            return (-len(used), -len(adjacency[slug]), slug)

        slug = min(remaining, key=rank)
        blocked = {assigned[adjacent] for adjacent in adjacency[slug] if adjacent in assigned}
        available = set(range(len(usage))) - blocked
        if not available:
            raise ValueError(f"More photo choices needed for {slug}")
        choice = min(available, key=lambda index: (usage[index], index))
        assigned[slug] = choice
        usage[choice] += 1
        remaining.remove(slug)
    for town in towns:
        town["photoIndex"] = assigned[town["slug"]]


def main() -> None:
    raws = LANCASTER + LANCASTER_REST + CHESTER + DELAWARE + YORK + CUMBERLAND
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
    expected = {"lancaster": 28, "chester": 24, "delaware": 9, "cumberland": 35}
    for key, count in expected.items():
        if len(by_county[key]) != count:
            raise SystemExit(f"{key} has {len(by_county[key])}, expected {count}")
    if len(by_county["york"]) < 16:
        raise SystemExit("York County list is too small")
    assign_photo_indices(towns)
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
        f"york={len(by_county['york'])} cumberland={len(by_county['cumberland'])} "
        f"town_service={len(towns) * len(SERVICES)}"
    )


if __name__ == "__main__":
    main()
