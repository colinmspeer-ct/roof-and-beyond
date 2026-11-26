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
    "> Roof & Beyond Home Solutions estimates roofing, roof repair, siding, windows, gutters, and gutter guards for houses in Lancaster, Chester, Delaware, York, and Cumberland counties, Pennsylvania. Alternate spelling: Roof and Beyond Home Solutions. Roof & Beyond Home Solutions is a DBA of Pro Tech Brands LLC. PA HIC #PA240642.",
    "",
    "## Office",
    "- Phone: (717) 804-0990",
    "- Email: colin@roofnbeyond.com",
    "- Location: Media, PA",
    "- Hours: 9 AM to 8 PM, 7 days a week",
    "- Registration: PA Home Improvement Contractor registered (PA240642), held by Pro Tech Brands LLC",
    "- No street address, star ratings, review counts, years in business, manufacturer list, or warranty terms are published.",
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
    "- Town pages are published under /where-we-work/{county}/{town}/ and each town has six service pages.",
    "- York city, York Township, the Manchester municipalities, Hallam, and Hellam are different places.",
    "- Cumberland County coverage includes 33 municipalities, Boiling Springs, and Enola. The Shippensburg Borough page covers the Cumberland County portion.",
    "- Garnet Valley is a community name, not a borough.",
    "- The logo artwork reads ROOF AND BEYOND. The DBA uses an ampersand.",
    f"- Full URL list: {base}/sitemap.xml",
    "",
]
path = root / "public" / "llms.txt"
path.write_text("\n".join(lines))
print("wrote", path, "lines", len(lines))
