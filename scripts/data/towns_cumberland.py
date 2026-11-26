"""Cumberland County municipality and community records."""

import json
from pathlib import Path

DATA = Path(__file__).resolve().parent
FACTS = json.loads((DATA / "cumberland_facts.json").read_text())
COPY_KEYS = ("town", "roofing", "roof_repair", "siding", "windows", "gutters", "gutter_guards")

# Route slugs are global. Penn Township is already in use in York County.
SLUGS = {"penn-township": "penn-township-cumberland"}


def slug_for(stem: str) -> str:
    return f"{SLUGS.get(stem, stem)}-pa"


def load_towns() -> list[dict]:
    text = (DATA / "cumberland-articles.txt").read_text()
    towns = []
    for entry in text.split("\n", 1)[1].strip().split("\n\n"):
        header, *articles = entry.splitlines()
        name, neighbors = header.split("|")
        fact = FACTS["towns"][name]
        towns.append({
            "name": name,
            "slug": slug_for(name.lower().replace(" ", "-")),
            "county": "cumberland",
            "kind": fact["kind"],
            "zips": fact["zips"],
            "neighbors": [slug_for(stem) for stem in neighbors.split(",")],
            **dict(zip(COPY_KEYS, (article.replace(" || ", "\n\n") for article in articles), strict=True)),
        })
    if {town["name"] for town in towns} != FACTS["towns"].keys():
        raise ValueError("Cumberland articles and housing geographies must match")
    return towns


TOWNS = load_towns()
