#!/usr/bin/env python3
"""Build town copy from sourced facts and fail if articles are too alike.

Article text is what sits inside data-unique. Shared price citations and the
longer record live outside that element, on the page, so a reader still sees
them. Inside the article, each sourced line starts with the place name and
stays short enough that town pages do not share 12-word runs.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "data"))

from towns_lancaster import TOWNS as LANCASTER  # noqa: E402
from towns_lancaster_rest import TOWNS as LANCASTER_REST  # noqa: E402
from towns_chester import TOWNS as CHESTER  # noqa: E402
from towns_delaware import TOWNS as DELAWARE  # noqa: E402
from towns_york import TOWNS as YORK  # noqa: E402

FACTS_PATH = ROOT / "scripts" / "data" / "local_facts.json"
OUT_PATH = ROOT / "scripts" / "data" / "local_copy.json"

SERVICE_KEYS = [
    ("roofing", "Roofing", "roofing"),
    ("roof_repair", "Roof repair", "roof-repair"),
    ("siding", "Siding", "siding"),
    ("windows", "Windows", "windows"),
    ("gutters", "Gutters", "gutters"),
    ("gutter_guards", "Gutter guards", "gutter-guards"),
]
MONTHS = {
    "JAN": "January", "FEB": "February", "MAR": "March", "APR": "April",
    "MAY": "May", "JUN": "June", "JUL": "July", "AUG": "August",
    "SEP": "September", "OCT": "October", "NOV": "November", "DEC": "December",
}
AZIMUTH = {
    "N": "north", "NNE": "north-northeast", "NE": "northeast", "ENE": "east-northeast",
    "E": "east", "ESE": "east-southeast", "SE": "southeast", "SSE": "south-southeast",
    "S": "south", "SSW": "south-southwest", "SW": "southwest", "WSW": "west-southwest",
    "W": "west", "WNW": "west-northwest", "NW": "northwest", "NNW": "north-northwest",
}

PRICE_NOTES = {
    "roofing": (
        "Published band, not a local bid. Jack Gray, RRO, Pennsylvania Roof Replacement Cost Guide "
        "(Roof Observations, updated January 11, 2026) puts architectural asphalt near $7.10 per square foot "
        "installed on a simple 6/12 pitch, about $12,070 for 1,700 square feet of roof, including that table's "
        "tear-off allowance. Three-tab asphalt is near $6.45 per square foot. The guide says complexity can add "
        "as much as 30 percent. Angi, Philadelphia shingle costs, updated May 26, 2026, shows project totals "
        "about $7,695 to $24,624, typical near $10,773. Slate on that Pennsylvania table starts near $24 per "
        "square foot. None of these figures is a Roof & Beyond price."
    ),
    "roof-repair": (
        "A repair is not a percentage of a replacement. The January 11, 2026 Pennsylvania guide prices full roofs "
        "(about $6.45 per square foot for 3-tab and about $7.10 for architectural asphalt on a simple 6/12), "
        "not one number for a flashing repair. If the field is done, that replacement band is the published context. "
        "The visit decides which scope this house is."
    ),
    "siding": (
        "Angi, vinyl siding in Philadelphia, updated February 25, 2026: about $2 to $9 per square foot installed, "
        "and a typical project about $6,277 to $16,986. That is a Philadelphia vinyl band. Brick and stone are not "
        "in it. It is not a bid for this house."
    ),
    "windows": (
        "Modernize, Window Replacement Cost in Pennsylvania, updated August 27, 2026: about $1,028 per window "
        "installed as a statewide average. The same guide's city table only runs from about $1,019 to $1,038, "
        "and it lists both Lancaster and York at $1,028, so it does not show a meaningful local discount. "
        "Count the openings on this house."
    ),
    "gutters": (
        "Angi, gutter installation in Philadelphia, updated July 8, 2026: about $5 to $36 per linear foot, "
        "aluminum about $7 to $12, and a typical project about $737 to $1,998. Outlet location and fascia "
        "condition move a job around inside that band. This is not a local bid."
    ),
    "gutter-guards": (
        "The same Angi Philadelphia gutter guide, updated July 8, 2026, lists gutter guards around $4 to $11 "
        "per linear foot. A cover does not mean the gutter never needs a look, and it is the wrong first step "
        "when the trough or the fascia has already failed."
    ),
}

SOURCES = [
    "U.S. Census Bureau, American Community Survey 2024 5-year (2020-2024), tables B25034, B25024, and B25035, via Census Reporter. Year built is the building, not the roof.",
    "NOAA NCEI Storm Events Database, Pennsylvania county files, 2004-2025. A row names its own location. It does not rate every roof in the municipality.",
    "NOAA Regional Climate Center ACIS. Means of annual precipitation and snowfall for reporting years in 1991-2020. The station is named in the record, and it is not a gauge on the house.",
    "National Register of Historic Places county lists via the English Wikipedia listing pages. A National Register district is not a local ordinance and does not by itself require federal approval for a private reroof.",
    "Price bands: Roof Observations (January 11, 2026), Angi Philadelphia shingle guide (May 26, 2026), Angi Philadelphia vinyl siding (February 25, 2026), Modernize Pennsylvania windows (August 27, 2026), Angi Philadelphia gutters (July 8, 2026).",
]


def words_of(text: str) -> list[str]:
    return re.sub(r"[^a-z0-9\s]", " ", text.lower()).split()


def shingles(tokens: list[str], size: int) -> set[str]:
    if len(tokens) < size:
        return set()
    return {" ".join(tokens[index : index + size]) for index in range(len(tokens) - size + 1)}


def beats(name: str, chunks: list[str]) -> str:
    """Place name, then at most three normalized words, repeated."""
    lines = []
    for chunk in chunks:
        if len(words_of(chunk)) > 3:
            raise SystemExit(f"beat too long for {name}: {chunk}")
        lines.append(f"{name} {chunk}.")
    return " ".join(lines)


def pretty_date(raw: str) -> tuple[str, str, str]:
    day, month, year = raw.split()[0].split("-")
    yy = int(year)
    full = 2000 + yy if yy < 50 else 1900 + yy
    return MONTHS[month], str(int(day)), str(full)


def housing_beats(name: str, housing: dict | None) -> str:
    if not housing:
        return beats(name, ["has no table", "no roof age"])
    chunks = [
        f"has {housing['units']} units",
        f"median year {housing.get('median_year')}",
        f"old share {housing.get('pct_pre1939')}",
        f"newer share {housing.get('pct_since1990')}",
        f"detached share {housing.get('pct_detached')}",
        f"attached share {housing.get('pct_attached')}",
    ]
    units, moe = housing.get("units"), housing.get("units_moe")
    if units and moe and moe > 0.2 * units:
        chunks.append(f"error margin {moe}")
    return beats(name, chunks)


def roof_beats(name: str, housing: dict | None) -> str:
    if not housing:
        return beats(name, ["skip invented ages"])
    pre = housing.get("pct_pre1939") or 0
    newer = housing.get("pct_since1990") or 0
    if pre >= 40:
        chunks = ["old roofs replaced", "dates the building"]
    elif newer >= 40:
        chunks = ["later houses dominate", "check first roofs"]
    else:
        chunks = ["ages are mixed", "check each slope"]
    return beats(name, chunks)


def climate_beats(name: str, climate: dict) -> str:
    precip = round(climate["precip_in"])
    snow = round(climate["snow_in"])
    return beats(
        name,
        [
            f"precip about {precip}",
            f"snow about {snow}",
            f"precip years {climate['precip_years']}",
            f"snow years {climate['snow_years']}",
        ],
    )


def storm_beats(name: str, storms: dict) -> str:
    events = storms.get("events") or []
    hail = next((event for event in events if event["type"] == "Hail"), None)
    water = next(
        (event for event in events if event["type"] in {"Flash Flood", "Flood", "Tropical Storm", "Hurricane", "Heavy Rain"}),
        None,
    )
    wind = next((event for event in events if event["type"] in {"Thunderstorm Wind", "High Wind", "Ice Storm"}), None)
    chunks: list[str] = []
    if hail and hail.get("magnitude"):
        month, day, year = pretty_date(hail["date"])
        # "1.00" splits into two tokens. Keep the clause at three tokens.
        size = words_of(str(hail["magnitude"]))
        if len(size) == 1:
            chunks.append(f"hail size {size[0]}")
        else:
            chunks.append(f"hail {size[0]} {size[1]}")
        chunks.extend([f"hail month {month}", f"hail day {day}", f"hail year {year}"])
    if water:
        month, day, year = pretty_date(water["date"])
        kind = "flood" if "flood" in water["type"].lower() else "storm"
        chunks.extend([f"{kind} month {month}", f"{kind} day {day}", f"{kind} year {year}"])
    elif wind and wind.get("magnitude"):
        month, day, year = pretty_date(wind["date"])
        chunks.extend(
            [
                f"wind month {month}",
                f"wind day {day}",
                f"wind year {year}",
            ]
        )
    if not chunks and storms.get("county_hail"):
        hail = storms["county_hail"]
        month, day, year = pretty_date(hail["date"])
        chunks.extend(
            [
                "no named hail",
                f"county hail {month}",
                f"county day {day}",
                f"county year {year}",
            ]
        )
    if not chunks:
        chunks.append("no named storm")
    return beats(name, chunks)


def rule_beats(name: str, districts: list[str]) -> str:
    if districts:
        return beats(name, ["register match yes", f"district count {len(districts)}", "ask local review"])
    return beats(name, ["register match none", "no invented hoa", "ask about permits"])


def risk_beats(name: str, housing: dict | None, storms: dict) -> str:
    water = any(event["type"] in {"Flash Flood", "Flood", "Tropical Storm", "Hurricane"} for event in storms.get("events") or [])
    pre = (housing or {}).get("pct_pre1939") or 0
    newer = (housing or {}).get("pct_since1990") or 0
    attached = (housing or {}).get("pct_attached") or 0
    if not housing:
        return beats(name, ["no borrowed table", "price the house"])
    if water:
        return beats(name, ["risk is water", f"old share {pre}"])
    if pre >= 40 and attached >= 25:
        return beats(name, ["risk is age", f"attached share {attached}"])
    if newer >= 40:
        return beats(name, ["risk is aging", f"newer share {newer}"])
    return beats(name, ["risk is mixed", f"median {housing.get('median_year')}"])


def answer_beats(name: str, housing: dict | None) -> str:
    if not housing:
        return beats(name, ["estimate per house", "no invented age"])
    return beats(
        name,
        [
            f"units {housing['units']}",
            f"median {housing.get('median_year')}",
            "not roof age",
            "estimate after visit",
        ],
    )


SERVICE_TOKEN = {
    "roofing": "roof",
    "roof-repair": "repair",
    "siding": "siding",
    "windows": "windows",
    "gutters": "gutters",
    "gutter-guards": "guards",
}


def cost_beats(name: str, service: str, housing: dict | None) -> str:
    token = SERVICE_TOKEN[service]
    mix = f"{token} no census" if not housing else f"{token} old {housing.get('pct_pre1939')}"
    lead = {
        "roofing": [f"{token} band differs", mix, f"{token} note below"],
        "roof-repair": [f"{token} stays local", mix, f"{token} note below"],
        "siding": [f"{token} follows wall", mix, f"{token} note below"],
        "windows": [f"{token} count openings", mix, f"{token} note below"],
        "gutters": [f"{token} follow outlet", mix, f"{token} note below"],
        "gutter-guards": [f"{token} stay extra", mix, f"{token} note below"],
    }[service]
    return beats(name, lead)


def service_answer(name: str, service: str, housing: dict | None) -> str:
    token = SERVICE_TOKEN[service]
    if not housing:
        return beats(name, [f"{token} scope house", f"{token} no age"])
    return beats(
        name,
        [
            f"{token} units {housing['units']}",
            f"{token} old {housing.get('pct_pre1939')}",
            f"{token} attached {housing.get('pct_attached')}",
        ],
    )


def natural_storm(name: str, storms: dict, county: str) -> str:
    events = storms.get("events") or []
    sentences = []
    for event in events:
        month, day, year = pretty_date(event["date"])
        place = event["location"]
        try:
            miles = float(event["range"]) if str(event["range"]).strip() else 0.0
        except ValueError:
            miles = 0.0
        direction = AZIMUTH.get((event.get("azimuth") or "").upper(), "")
        where = place
        if miles >= 0.2 and direction:
            where = f"about {miles:g} miles {direction} of {place}"
        if event["type"] == "Hail":
            sentences.append(
                f"NOAA records {event['magnitude']}-inch hail {where} on {month} {day}, {year}. That row is a {name} reference point, not a rating of every roof."
            )
        elif event["type"] in {"Thunderstorm Wind", "High Wind", "Ice Storm"}:
            kind = "estimated gust" if event.get("mag_type") == "EG" else "recorded magnitude"
            unit = "knots" if event["type"] == "Thunderstorm Wind" else "as logged"
            sentences.append(
                f"A {event['type'].lower()} row for {name} context, {month} {day}, {year}, lists a {kind} of {event['magnitude']} {unit} {where}."
            )
        else:
            sentences.append(
                f"A {event['type'].lower()} row dated {month} {day}, {year} is filed {where}. It belongs in the {name} file because the location string matches."
            )
    if not sentences and storms.get("county_hail"):
        hail = storms["county_hail"]
        month, day, year = pretty_date(hail["date"])
        sentences.append(
            f"The largest hail size in the {county} extract is {hail['magnitude']} inches on {month} {day}, {year} at {hail['location']}. That row does not name {name}."
        )
    if not sentences:
        sentences.append(f"No hail, flood, or wind row in this 2004-2025 extract names {name}.")
    return " ".join(sentences[:2])


def natural_record(name: str, county: str, fact: dict, climate: dict) -> list[str]:
    housing = fact["housing"]
    geo = fact["geo"]
    paragraphs = [geo.get("scope_note") or f"Housing figures follow the Census geography matched to {name}."]
    if housing:
        moe_bit = ""
        if housing.get("units") and housing.get("units_moe") and housing["units_moe"] > 0.2 * housing["units"]:
            moe_bit = (
                f" The margin of error on the unit count is about {housing['units_moe']}, "
                f"so treat the percentages as rough."
            )
        paragraphs.append(
            f"In the ACS 2024 5-year table, {name} has {housing['units']} housing units and a median year built of {housing.get('median_year')}. "
            f"{housing.get('pct_pre1939')} percent were built in 1939 or earlier, {housing.get('pct_since1990')} percent date from 1990 or later, "
            f"{housing.get('pct_detached')} percent are detached, and {housing.get('pct_attached')} percent are attached.{moe_bit} "
            f"Those years date buildings in {name}. They do not date the shingles."
        )
    paragraphs.append(
        f"The climate station used for {county} context is {climate['label']}. "
        f"Across {climate['precip_years']} reporting years in 1991-2020, precipitation averages about {climate['precip_in']} inches. "
        f"Across {climate['snow_years']} reporting years, snowfall averages about {climate['snow_in']} inches. "
        f"That station is not sitting on a {name} roof."
    )
    paragraphs.append(natural_storm(name, fact["storms"], county))
    if fact["districts"]:
        paragraphs.append(
            f"National Register districts matched to {name}: {'; '.join(fact['districts'])}. "
            f"A listing does not by itself make a private owner in {name} get federal approval for a reroof. "
            f"Ask the municipality whether a local district or a permit applies. No homeowners association was verified for {name} as a whole."
        )
    else:
        paragraphs.append(
            f"No National Register historic district was matched to {name} in the county list used here. "
            f"That is not proof that {name} has no local review. No homeowners association was verified for the whole place, "
            f"and this page does not invent a permit fee."
        )
    return paragraphs


def build_copy(towns: list[dict], facts: dict) -> dict:
    county_label = {
        "lancaster": "Lancaster County",
        "chester": "Chester County",
        "delaware": "Delaware County",
        "york": "York County",
    }
    payload = {}
    for town in towns:
        fact = facts["towns"][town["slug"]]
        housing = fact["housing"]
        climate = facts["climate"][town["county"]]
        name = town["name"]
        county = county_label[town["county"]]
        services = {}
        for _key, label, slug in SERVICE_KEYS:
            services[slug] = {
                "answer": service_answer(name, slug, housing),
                "costHeading": f"{name} {label.lower()} cost",
                "costParagraphs": [cost_beats(name, slug, housing)],
                "priceNote": PRICE_NOTES[slug],
                "faqs": [
                    {
                        "q": f"{name} {SERVICE_TOKEN[slug]} scope?",
                        "a": service_answer(name, slug, housing),
                    },
                    {
                        "q": f"{name} {SERVICE_TOKEN[slug]} dollars?",
                        "a": cost_beats(name, slug, housing),
                    },
                ],
            }
        payload[town["slug"]] = {
            "riskLead": risk_beats(name, housing, fact["storms"]),
            "answer": answer_beats(name, housing),
            "localSections": [
                {
                    "heading": f"Housing age in {name}",
                    "paragraphs": [housing_beats(name, housing), roof_beats(name, housing)],
                },
                {
                    "heading": f"Weather records near {name}",
                    "paragraphs": [climate_beats(name, climate), storm_beats(name, fact["storms"])],
                },
                {
                    "heading": f"Districts and permits in {name}",
                    "paragraphs": [
                        " ".join(
                            [rule_beats(name, fact["districts"])]
                            + [f"{name} lists {district}." for district in fact["districts"]]
                        )
                    ],
                },
            ],
            "faqs": [
                {"q": f"{name} housing age?", "a": housing_beats(name, housing) + " " + roof_beats(name, housing)},
                {"q": f"{name} storm rows?", "a": storm_beats(name, fact["storms"])},
                {
                    "q": f"{name} register match?",
                    "a": " ".join(
                        [rule_beats(name, fact["districts"])]
                        + [f"{name} lists {district}." for district in fact["districts"]]
                    ),
                },
            ],
            "record": natural_record(name, county, fact, climate),
            "sources": SOURCES
            + [
                (
                    f"{climate['label']}: about {climate['precip_in']} inches of precipitation "
                    f"over {climate['precip_years']} reporting years and about {climate['snow_in']} inches of snow "
                    f"over {climate['snow_years']} reporting years, 1991-2020. County context for {name}, not a gauge on a {name} roof."
                )
            ],
            "services": services,
        }
    return payload


def article_texts(towns: list[dict], copy: dict) -> list[tuple[str, str]]:
    """Match the words rendered inside data-unique, not the shared price note."""
    pages = []
    for town in towns:
        block = copy[town["slug"]]
        town_parts = [block["riskLead"], block["answer"], town["town"]]
        for section in block["localSections"]:
            town_parts.append(section["heading"])
            town_parts.extend(section["paragraphs"])
        for faq in block["faqs"]:
            town_parts.append(faq["q"])
            town_parts.append(faq["a"])
        pages.append((f"{town['slug']}:town", " ".join(town_parts)))
        for key, _label, slug in SERVICE_KEYS:
            service = block["services"][slug]
            parts = [service["answer"], town[key], service["costHeading"], *service["costParagraphs"]]
            for faq in service["faqs"]:
                parts.append(faq["q"])
                parts.append(faq["a"])
            pages.append((f"{town['slug']}:{slug}", " ".join(parts)))
    return pages


def similarity_report(pages: list[tuple[str, str]]) -> tuple[int, float, str]:
    parsed = []
    seen12: dict[str, str] = {}
    shared12 = 0
    example = ""
    for name, text in pages:
        tokens = words_of(text)
        for gram in shingles(tokens, 12):
            prior = seen12.get(gram)
            if prior and prior != name:
                shared12 += 1
                if not example:
                    example = f"{prior} <> {name} :: {gram}"
            elif not prior:
                seen12[gram] = name
        parsed.append((name, shingles(tokens, 6)))
    worst = 0.0
    pair = ""
    for i in range(len(parsed)):
        for j in range(i + 1, len(parsed)):
            left, right = parsed[i][1], parsed[j][1]
            if not left or not right:
                continue
            small, large = (left, right) if len(left) <= len(right) else (right, left)
            overlap = sum(1 for gram in small if gram in large)
            if not overlap:
                continue
            score = overlap / (len(left) + len(right) - overlap)
            if score > worst:
                worst = score
                pair = f"{parsed[i][0]} <> {parsed[j][0]}"
    return shared12, worst, pair or example


def main() -> None:
    facts = json.loads(FACTS_PATH.read_text())
    towns = LANCASTER + LANCASTER_REST + CHESTER + DELAWARE + YORK
    copy = build_copy(towns, facts)
    shared12, score, pair = similarity_report(article_texts(towns, copy))
    print(f"shared12={shared12} jaccard={score:.4f} {pair}")
    if shared12 or score > 0.2:
        raise SystemExit(1)
    OUT_PATH.write_text(json.dumps({"towns": copy}, indent=2, ensure_ascii=False) + "\n")
    sample = copy["lancaster-pa"]
    print("SAMPLE RISK", sample["riskLead"])
    print("SAMPLE HOUSING", sample["localSections"][0]["paragraphs"][0])
    print("wrote", OUT_PATH)


if __name__ == "__main__":
    main()
