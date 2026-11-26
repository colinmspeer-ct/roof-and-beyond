"""Load researched articles for the Dauphin and York expansion batches."""

import json
from pathlib import Path

DATA = Path(__file__).resolve().parent
COPY_KEYS = ("town", "roofing", "roof_repair", "siding", "windows", "gutters", "gutter_guards")


def load_county(county: str) -> list[dict]:
    facts = json.loads((DATA / f"{county}_extension_facts.json").read_text())
    entries = (DATA / f"{county}-articles.txt").read_text().strip().split("\n\n")[1:]
    towns = []
    for entry in entries:
        header, *articles = entry.splitlines()
        name, neighbors = header.split("|")
        fact = facts[name]
        towns.append({
            "name": name,
            "slug": f"{name.lower().replace(' ', '-')}-pa",
            "county": county,
            "kind": fact["kind"],
            "zips": fact["zips"],
            "neighbors": [f"{stem}-pa" for stem in neighbors.split(",")],
            "research": fact,
            **dict(zip(COPY_KEYS, articles, strict=True)),
        })
    return towns


DAUPHIN = load_county("dauphin")
