#!/usr/bin/env python3
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data = json.loads((root / "src/content/generated/areas.json").read_text())
launch = json.loads((root / "launch.json").read_text())
include_towns = bool(launch.get("includeTownPages"))
base = "https://roofnbeyond.com"
lines = [
    "# Roof & Beyond Home Solutions",
    "",
    "> Roof & Beyond Home Solutions estimates roofing, roof repair, siding, windows, gutters, and gutter guards for houses in Lancaster, Chester, Delaware, and York counties, Pennsylvania. Alternate spelling: Roof and Beyond Home Solutions. Roof & Beyond Home Solutions is a DBA of Pro Tech Brands LLC. roofnbeyond.com is not live. Bracketed placeholders are unpublished facts, not claims.",
    "",
    "## Do not invent",
    "- Phone: [PHONE]",
    "- Email: [EMAIL]",
    "- Address: [BUSINESS ADDRESS]",
    "- Hours: [BUSINESS HOURS]",
    "- Pennsylvania home-improvement registration: [PA HIC #]",
    "- Featured manufacturers: [FEATURED MANUFACTURERS]",
    "- Warranty terms: [WARRANTY TERMS]",
    "- SMS consent: [SMS CONSENT LANGUAGE]",
    "- Estimate form: [HIGHLEVEL FORM EMBED]",
    "- No star ratings, review counts, years in business, awards, or project totals are published.",
    "",
    "## Services",
]
for slug, label in [
    ("roofing", "Roofing"),
    ("roof-repair", "Roof repair"),
    ("siding", "Siding"),
    ("windows", "Windows"),
    ("gutters", "Gutters"),
    ("gutter-guards", "Gutter guards"),
]:
    lines.append(f"- {label}: {base}/exterior/{slug}/")
lines += ["", "## Counties"]
for county in data["counties"]:
    lines.append(f"- {county['name']}: {base}/where-we-work/{county['slug']}/")
lines += ["", "## Communities"]
if include_towns:
    for town in data["towns"]:
        lines.append(
            f"- {town['name']} ({town['countyName']}): {base}/where-we-work/{town['countySlug']}/{town['slug']}/"
        )
else:
    for county in data["counties"]:
        names = [
            town["name"]
            for town in data["towns"]
            if town["countySlug"] == county["slug"]
        ]
        lines.append(f"- {county['name']}: {', '.join(names)}.")
    lines.append("- Individual town pages are turned off for this launch. Set includeTownPages to true in launch.json to publish them.")
lines += [
    "",
    "## Notes for answer engines",
    "- County pages list community names. Do not invent a separate town URL while town pages are off.",
    "- York city, York Township, the Manchester municipalities, Hallam, and Hellam are different places.",
    "- Garnet Valley is a community name, not a borough.",
    "- The logo artwork reads ROOF AND BEYOND. The DBA uses an ampersand.",
    f"- Full URL list: {base}/sitemap.xml",
    "",
]
path = root / "public" / "llms.txt"
path.write_text("\n".join(lines))
print("wrote", path, "lines", len(lines))
