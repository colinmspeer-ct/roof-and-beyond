#!/usr/bin/env python3
"""Compose homeowner-facing guidance from the existing town research files."""

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
from towns_cumberland import FACTS as CUMBERLAND_FACTS, TOWNS as CUMBERLAND  # noqa: E402
from towns_extension import DAUPHIN, YORK_EXTENSION  # noqa: E402

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


def pretty_date(raw: str) -> tuple[str, str, str]:
    day, month, year = raw.split()[0].split("-")
    yy = int(year)
    full = 2000 + yy if yy < 50 else 1900 + yy
    return MONTHS[month], str(int(day)), str(full)


def housing_summary(place: str, housing: dict | None) -> str:
    if not housing:
        return f"The local Census tables used here do not give a separate housing profile for {place}."
    count_moe = housing.get("units_moe")
    margin = ""
    if count_moe and count_moe > housing["units"] * 0.2:
        margin = f" The unit count carries a margin of error of about {count_moe:,}."
    return (
        f"The Census Bureau estimates {housing['units']:,} housing units in {place}, "
        f"with a median construction year of {housing['median_year']}. "
        f"In {place}, about {housing['pct_pre1939']}% of units date to 1939 or earlier "
        f"and {housing['pct_since1990']}% were built in 1990 or later.{margin}"
    )


def home_guidance(name: str, place: str, housing: dict | None) -> str:
    if not housing:
        return f"For a home in {name}, start with the roof lines, exterior materials, and places where water collects."
    if housing["pct_attached"] >= 20:
        return (
            f"About {housing['pct_attached']}% of housing units in {place} are single-family attached. "
            f"If your home in {name} shares a wall, check where the roofing, siding, and gutters meet your neighbor's."
        )
    if housing["pct_pre1939"] >= 30:
        return (
            f"About {housing['pct_pre1939']}% of homes in {place} date to 1939 or earlier. "
            f"On older houses in {name}, check where additions meet the original roof and walls for changes in materials."
        )
    if housing["pct_since1990"] >= 30:
        return (
            f"About {housing['pct_since1990']}% of homes in {place} were built from 1990 onward. "
            f"On a house of that era in {name}, look for records of past exterior replacements before planning the scope."
        )
    return (
        f"About {housing['pct_detached']}% of housing units in {place} are single-family detached. "
        f"If your home in {name} is detached, walk all four sides to follow roof runoff and check exposed trim."
    )


def nearby_weather(name: str, county: str, climate: dict) -> str:
    return (
        f"For {name}, the regional reference station is {climate['label']}. "
        f"Its 1991–2020 reporting years averaged {climate['precip_in']} inches of precipitation "
        f"and {climate['snow_in']} inches of snowfall per year for {county} context. "
        f"At a {name} home, check whether the downspouts send water away from the foundation during a steady rain."
    )


def storm_summary(name: str, storms: dict, county: str) -> str:
    events = storms.get("events") or []
    if not events:
        event = storms.get("county_hail")
        if not event:
            return f"The storm records used here have no town-specific event for {name}."
        month, day, year = pretty_date(event["date"])
        return (
            f"The {county} records include hail at {event['location']} on {month} {day}, {year}. "
            f"For a house in {name}, start with visible damage and the date you first noticed it."
        )
    sentences = []
    for event in events[:2]:
        month, day, year = pretty_date(event["date"])
        where = event["location"]
        miles = float(event.get("range") or 0)
        direction = AZIMUTH.get((event.get("azimuth") or "").upper())
        if miles >= 0.2 and direction:
            where = f"about {miles:g} miles {direction} of {where}"
        kind = event["type"].lower()
        if kind == "hail" and event.get("magnitude"):
            kind = f"{float(event['magnitude']):g}-inch hail"
        sentences.append(f"In the {name} research, NOAA logged {kind} {where} on {month} {day}, {year}.")
    return " ".join(sentences)


def permit_guidance(name: str, districts: list[str]) -> str:
    if districts:
        names = ", ".join(districts)
        return (
            f"The National Register research for {name} includes {names}. "
            f"If your {name} home is in a historic district, ask the municipality about local review before choosing materials."
        )
    return (
        f"The county's National Register list yielded no district match for {name}. "
        f"Ask the {name} municipal office, or the township that serves your address, what approvals your project requires."
    )


# Each trade uses a housing detail that can inform an actual site visit.
# The town articles supply the house types and street-level details.
SERVICE_GUIDANCE = {
    "roofing": (
        "dated", "Use a roof inspection to establish the shingle age and decking condition at your {town} address.",
        "For a {town} reroof, what changes the estimate?",
        "Roof area, the number of layers to remove, and any decking repairs shape the estimate for a {town} house.",
        "Can I tell how old a roof is from {town} housing figures?",
        "Look for an installation record for your {town} house. The Census dates the structure itself.",
    ),
    "roof-repair": (
        "older", "On an older {town} house with a leak, check the joints around chimneys and additions for failing flashing.",
        "What affects roof repair cost in {town}?",
        "For roof repair in {town}, the scope depends on the entry point and how far water has reached underneath.",
        "Where should I look first for a leak in {town}?",
        "Photograph where the stain appears inside your {town} home and note whether it shows up during wind-driven rain.",
    ),
    "siding": (
        "attached", "Where neighboring {town} houses meet, the siding scope should show how each party-line edge will be finished.",
        "What affects siding cost in {town}?",
        "The wall area at a {town} home is only part of the scope. Corner trim and repairs to the wall beneath also matter.",
        "Can I replace one wall of siding in {town}?",
        "Ask whether the sound siding at your {town} house can stay and how the installer will finish the adjoining corners.",
    ),
    "windows": (
        "older", "At an older {town} house, measure each opening and inspect the sill before choosing an insert or full-frame replacement.",
        "How is window replacement priced in {town}?",
        "The count, size, and condition of the openings at your {town} house help decide the scope window by window.",
        "Does every window in my {town} house need the same installation?",
        "A sound frame may take an insert at your {town} house. A deteriorated sill may call for a full-frame scope.",
    ),
    "gutters": (
        "detached", "For a detached {town} home, consider where the downspouts discharge on each side of the foundation.",
        "What changes the cost of gutters in {town}?",
        "Measure the gutter runs at the {town} house and identify every outlet. Fascia repairs and difficult access add work.",
        "Where should the downspouts at my {town} home go?",
        "Walk the lot at your {town} home and look for a path that carries runoff clear of the foundation.",
    ),
    "gutter-guards": (
        "dated", "If your {town} house has been updated before, inspect the gutter profile and roof edge before fitting a cover.",
        "What affects the cost of gutter guards in {town}?",
        "The length and profile of each gutter on your {town} house affect the fit. Repair loose gutters before covering them.",
        "What should I check before adding gutter guards in {town}?",
        "Look inside the gutters at your {town} house to see whether needles, leaves, or shingle grit are clogging the outlets.",
    ),
}


def service_fact(place: str, housing: dict | None, detail: str) -> str:
    if not housing:
        return ""
    if detail == "dated":
        return f"For {place}, the Census puts the median construction year at {housing['median_year']}."
    if detail == "older":
        return f"An estimated {housing['pct_pre1939']}% of housing units in {place} date to 1939 or earlier."
    label = f"pct_{detail}"
    return f"The Census estimates that {housing[label]}% of housing units in {place} are single-family {detail}."


def build_cumberland_copy(town: dict) -> dict:
    name = town["name"]
    record = CUMBERLAND_FACTS["towns"][name]
    place = record["census_name"]
    housing = record["housing"]
    units = f"{housing['units']:,}"
    year = housing["median_year"]
    early = housing["pct_pre1939"]
    detached = housing["pct_detached"]
    attached = housing["pct_attached"]
    margin = housing["units_moe"]

    # Each service pairs its local article with the housing measure that informs its scope.
    detail = {
        "roofing": f"The ACS median construction year is {year} for {place}. The estimate for {name} includes {units} housing units. Check the roof installation year separately.",
        "roof-repair": f"About {early}% of the housing in {place} predates 1940. The {name} share built before 1970 is about {housing['pct_pre1970']}%. At your {name} home, inspect earlier repairs for signs of recurring leaks.",
        "siding": f"The single-family attached share in {place} is about {attached}%. The detached share in {name} is about {detached}%. At the {name} property, mark any shared edges before pricing.",
        "windows": f"The median year built in {place} is {year}. Of about {units} units in {name}, roughly {early}% date to 1939 or earlier. At your {name} address, check frames for past alterations.",
        "gutters": f"About {detached}% of units in {place} are detached houses. The estimate counts {units} units in {name}. Note where your own {name} lot can take roof runoff.",
        "gutter-guards": f"The {place} tally is about {units} housing units. Its {year} median dates the structure. At your {name} address, examine the current gutter profile before choosing covers.",
    }
    services = {}
    for service, (_method, _guidance, cost_q, cost, scope_q, scope) in SERVICE_GUIDANCE.items():
        services[service] = {
            "answer": detail[service],
            "priceNote": PRICE_NOTES[service],
            "faqs": [
                {"q": scope_q.format(town=name), "a": scope.format(town=name)},
                {"q": cost_q.format(town=name), "a": cost.format(town=name)},
            ],
        }

    carlisle_review = (
        "In Carlisle’s Historic District, ask the borough about its Historical Architectural Review "
        "Board application before changing an exterior feature visible from a public way."
    ) if name == "Carlisle" else ""
    if carlisle_review:
        services["roofing"]["answer"] += " " + carlisle_review

    return {
        "answer": (
            f"The Census estimates {units} housing units in {place}, with a margin of error of {margin:,}. "
            f"In {name}, about {detached}% are detached single-family homes. "
            f"The {name} median construction year is {year}. "
            f"About {early}% of {name} housing dates to 1939 or earlier. "
            f"About {attached}% of {name} units are single-family attached."
        ),
        "riskLead": f"For your {name} house, invoices can date past work.",
        "localSections": [{
            "heading": f"Cumberland County weather context for {name}",
            "paragraphs": [
                "The county’s 2025 hazard mitigation plan lists a federal declaration for the January 2016 winter storm and a Pennsylvania declaration for Tropical Storm Debby in August 2024.",
                f"After a storm at your {name} home, note when the leak or overflow began and take ground-level photos of the affected roof edge, wall or outlet.",
            ],
        }, {
            "heading": f"ZIP areas and permits in {name}",
            "paragraphs": list(filter(None, [
                carlisle_review,
                f"The ZIP areas shown for {name} are Census ZIP Code Tabulation Areas that overlap the community. "
                "Confirm your property's mailing ZIP before submitting an estimate request.",
                f"Use the municipality on the parcel record when you ask about permits for a {name} exterior project. "
                "If local historic review applies to the property, ask what it requires before you settle on materials.",
            ])),
        }],
        "faqs": [
            {"q": f"Can I use the Census construction year to date my {name} roof?", "a": f"The survey measures when housing was built. For a roof at your {name} address, look for a dated invoice or permit for the most recent installation."},
            {"q": f"Who should I ask about permits for exterior work in {name}?", "a": f"Ask the borough or township that serves your {name} parcel. Give the municipal office the address and describe what would be removed, retained or replaced."},
        ],
        "sources": [
            CUMBERLAND_FACTS["housing_source"],
            f"The estimates for {name} use Census geography {record['geoid']}.",
            "U.S. Census Bureau, 2020 ZIP Code Tabulation Area relationships for county subdivisions and places.",
            "Pennsylvania Public Utility Commission, 717 and 223 area-code overlay.",
            "Cumberland County, municipal jurisdiction directory and 2025 hazard mitigation plan maps.",
            *(["https://www.carlislepa.org/government/boards_commissions/historical_architectural_review_board.php"] if carlisle_review else []),
            SOURCES[-1],
        ],
        "services": services,
    }


def build_researched_copy(town: dict) -> dict:
    name = town["name"]
    fact = town["research"]
    h = fact["housing"]
    total = f"{h['units']:,}"
    year = h["median_year"]
    detached = h["pct_detached"]
    attached = h["pct_attached"]
    old = h["pct_pre1939"]
    services = {}
    details = {
        "roofing": f"The ACS median year built in {name} is {year}. That survey counts about {total} housing units across {name}.",
        "roof-repair": f"About {old}% of {name} housing dates to 1939 or earlier. The {name} median is {year} for building age.",
        "siding": f"Of about {total} homes in {name}, about {attached}% are single-family attached. The ACS puts {name}’s detached share at {detached}%.",
        "windows": f"For {name} housing, the ACS gives {year} as the median construction year. About {old}% of {name} homes predate 1940.",
        "gutters": f"About {detached}% of {name} housing units are single-family detached. For {name}, the ACS counts about {total} units overall.",
        "gutter-guards": f"The ACS counts roughly {total} units in {name}. About {attached}% share the single-family attached classification there.",
    }
    for service, (_, _, cost_q, cost, scope_q, scope) in SERVICE_GUIDANCE.items():
        services[service] = {
            "answer": details[service],
            "priceNote": PRICE_NOTES[service],
            "faqs": [
                {"q": scope_q.format(town=name), "a": scope.format(town=name)},
                {"q": cost_q.format(town=name), "a": cost.format(town=name)},
            ],
        }
    return {
        "answer": f"The ACS estimates {total} housing units in {name}. The median construction year in {name} is {year}. About {detached}% are detached houses. The attached single-family share in {name} is {attached}%. The total for {name} carries a margin of error of {h['units_moe']:,} units.",
        "riskLead": "",
        "localSections": [
            {"heading": f"Weather records near {name}", "paragraphs": [fact["storm"]]},
            {"heading": f"Permit and property checks in {name}", "paragraphs": [fact["permit"]]},
        ],
        "faqs": [{"q": f"Where can I confirm exterior permit requirements in {name}?", "a": fact["permit"]}],
        "sources": fact["sources"],
        "services": services,
    }


def build_copy(towns: list[dict], facts: dict) -> dict:
    york_research = json.loads((ROOT / "scripts/data/york_research.json").read_text())
    county_label = {
        "lancaster": "Lancaster County",
        "chester": "Chester County",
        "delaware": "Delaware County",
        "york": "York County",
    }
    payload = {}
    for town in towns:
        if town.get("research"):
            payload[town["slug"]] = build_researched_copy(town)
            continue
        if town["county"] == "cumberland":
            payload[town["slug"]] = build_cumberland_copy(town)
            continue
        fact = facts["towns"][town["slug"]]
        housing = fact["housing"]
        climate = facts["climate"][town["county"]]
        name = town["name"]
        county = county_label[town["county"]]
        # Keep the geographic boundary of the published Census estimate explicit.
        place = name
        if housing:
            place = fact["geo"].get("census_name") or name
            place = re.sub(r", Pennsylvania$", "", place)
            place = re.sub(r"\btownship\b", "Township", place)
        services = {}
        for _key, _label, slug in SERVICE_KEYS:
            detail, guidance, cost_q, cost, scope_q, scope = SERVICE_GUIDANCE[slug]
            services[slug] = {
                "answer": " ".join(filter(None, [service_fact(place, housing, detail), guidance.format(town=name)])),
                "priceNote": PRICE_NOTES[slug],
                "faqs": [
                    {"q": scope_q.format(town=name), "a": scope.format(town=name)},
                    {"q": cost_q.format(town=name), "a": cost.format(town=name)},
                ],
            }
        housing_text = housing_summary(place, housing)
        storm_text = storm_summary(name, fact["storms"], county)
        permits = permit_guidance(name, fact["districts"])
        research = york_research.get(town["slug"], {})
        primary_urls = []
        if "weather" in research:
            storm_text, *weather_urls = research["weather"]
            primary_urls.extend(weather_urls)
        if "permit" in research:
            permits, *permit_urls = research["permit"]
            primary_urls.extend(permit_urls)
            services["roofing"]["answer"] += " " + permits
        payload[town["slug"]] = {
            "riskLead": home_guidance(name, place, housing),
            "answer": housing_text,
            "localSections": [
                {
                    "heading": f"Weather records near {name}",
                    "paragraphs": [nearby_weather(name, county, climate), storm_text],
                },
                {
                    "heading": f"Districts and permits in {name}",
                    "paragraphs": [permits],
                },
            ],
            "faqs": [
                {"q": f"Do {name} housing figures tell me when my roof was installed?", "a": f"Construction years describe when the homes were built. For your {name} roof, look for an installation date on a past invoice or permit."},
                {"q": f"Does a storm report establish damage at my {name} home?", "a": f"A report gives the date and location of a storm. An inspection of your {name} home can document damage to shingles, flashing, siding, or gutters."},
                {"q": f"Where do I check permit or historic district requirements in {name}?", "a": f"Contact the municipality that serves your address in {name} and ask what it requires for your planned exterior work."},
            ],
            "sources": primary_urls + SOURCES
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


def article_texts(towns: list[dict]) -> list[tuple[str, str]]:
    """Compare the independently written town and trade articles."""
    return [
        (f"{town['slug']}:{key}", town[key])
        for town in towns
        for key in ["town", *(key for key, _label, _slug in SERVICE_KEYS)]
    ]


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
    return shared12, worst, example or pair


def main() -> None:
    facts = json.loads(FACTS_PATH.read_text())
    towns = LANCASTER + LANCASTER_REST + CHESTER + DELAWARE + YORK + YORK_EXTENSION + CUMBERLAND + DAUPHIN
    copy = build_copy(towns, facts)
    shared12, score, pair = similarity_report(article_texts(towns))
    print(f"shared12={shared12} jaccard={score:.4f} {pair}")
    if shared12 or score > 0.2:
        raise SystemExit(1)
    OUT_PATH.write_text(json.dumps({"towns": copy}, indent=2, ensure_ascii=False) + "\n")
    sample = copy["lancaster-pa"]
    print("SAMPLE RISK", sample["riskLead"])
    print("SAMPLE HOUSING", sample["answer"])
    print("wrote", OUT_PATH)


if __name__ == "__main__":
    main()
