#!/usr/bin/env python3
"""Pull sourced local facts for town pages.

Outputs scripts/data/local_facts.json. Housing figures come from the
Census Bureau ACS 2024 5-year tables via Census Reporter. Storm rows come
from the NOAA NCEI Storm Events Database. Historic-district names come from
the National Register lists on Wikipedia. Nothing in this file is a roof price.
"""

from __future__ import annotations

import csv
import gzip
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "data"))

from towns_lancaster import TOWNS as LANCASTER  # noqa: E402
from towns_lancaster_rest import TOWNS as LANCASTER_REST  # noqa: E402
from towns_chester import TOWNS as CHESTER  # noqa: E402
from towns_delaware import TOWNS as DELAWARE  # noqa: E402
from towns_york import TOWNS as YORK  # noqa: E402

UA = "RoofBeyondResearch/1.0 (local housing facts; colin@roofnbeyond.com)"
CACHE = ROOT / "scripts" / ".cache"
OUT = ROOT / "scripts" / "data" / "local_facts.json"
GAZ_PLACE = Path("/tmp/gaz/2024_gaz_place_42.txt")
GAZ_SUB = Path("/tmp/gaz/2024_gaz_cousubs_42.txt")

COUNTY_FIPS = {
    "lancaster": "071",
    "chester": "029",
    "delaware": "045",
    "york": "133",
}
COUNTY_NAME = {
    "lancaster": "LANCASTER",
    "chester": "CHESTER",
    "delaware": "DELAWARE",
    "york": "YORK",
}

# Villages and school-district names that are not a 2024 Census place.
# Township GEOIDs are county subdivisions. The scope note is shown on the page.
SURROGATE = {
    "chester-springs-pa": (
        "4202983832",
        "West Pikeland township",
        "Chester Springs is not a 2024 Census place. These housing figures are for West Pikeland Township, the township this village sits in, and they cover the township rather than a village boundary.",
    ),
    "landenberg-pa": (
        "4202944440",
        "London Britain township",
        "Landenberg is not a 2024 Census place. These housing figures are for London Britain Township, and they cover the township rather than the village lanes alone.",
    ),
    "thornton-pa": (
        "4204576576",
        "Thornbury township, Delaware County",
        "Thornton is not a 2024 Census place. These housing figures are for Thornbury Township in Delaware County, not the Chester County township of the same name.",
    ),
    "glen-mills-pa": (
        "4204515488",
        "Concord township",
        "Glen Mills is not a 2024 Census place. These housing figures are for Concord Township, which contains the village, and they are a township count.",
    ),
    "newtown-square-pa": (
        "4204554224",
        "Newtown township, Delaware County",
        "The 2024 Census place list used here has no Newtown Square CDP. These housing figures are for Newtown Township in Delaware County.",
    ),
}

STATIONS = {
    "lancaster": ("USC00364763", "Lancaster 2 NE Filter Plant"),
    "york": ("USC00369933", "York 3 SSW Pump Station"),
    "chester": ("USC00369464", "West Chester 2 NW"),
    "delaware": ("KPHL", "Philadelphia International Airport"),
}

NRHP_PAGES = [
    "National_Register_of_Historic_Places_listings_in_Lancaster_County,_Pennsylvania",
    "National_Register_of_Historic_Places_listings_in_northern_Chester_County,_Pennsylvania",
    "National_Register_of_Historic_Places_listings_in_eastern_Chester_County,_Pennsylvania",
    "National_Register_of_Historic_Places_listings_in_southern_Chester_County,_Pennsylvania",
    "National_Register_of_Historic_Places_listings_in_Delaware_County,_Pennsylvania",
    "National_Register_of_Historic_Places_listings_in_York_County,_Pennsylvania",
]


def fetch(url: str, data: bytes | None = None, timeout: int = 90) -> bytes:
    headers = {"User-Agent": UA}
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.read()


def load_gaz(path: Path) -> list[list[str]]:
    lines = path.read_text().splitlines()
    return [line.split("\t") for line in lines[1:] if line.strip()]


def norm_name(value: str) -> str:
    value = value.lower().replace("saint ", "st ")
    value = value.replace("-", " ")
    value = re.sub(r"[^a-z0-9\s]", "", value)
    return re.sub(r"\s+", " ", value).strip()


def census_place_id(geoid: str) -> str:
    return f"16000US{geoid}"


def census_sub_id(geoid: str) -> str:
    return f"06000US{geoid}"


def match_geo(town: dict, places: list[list[str]], subs: list[list[str]]) -> dict:
    slug = town["slug"]
    kind = town["kind"].lower()
    name = town["name"]
    county = town["county"]
    fips = COUNTY_FIPS[county]
    if slug == "garnet-valley-pa":
        return {
            "status": "none",
            "scope_note": (
                "Garnet Valley is a school-district and community name, not a borough "
                "or a 2024 Census place. This page does not borrow a neighboring "
                "township's housing table and present it as a Garnet Valley count."
            ),
        }
    if slug in SURROGATE:
        geoid, label, note = SURROGATE[slug]
        return {
            "status": "township",
            "sumlevel": "060",
            "geoid": census_sub_id(geoid),
            "census_name": label,
            "scope_note": note,
        }

    place_hits = []
    for row in places:
        geoid, pname = row[1], row[3]
        if norm_name(pname.split(",")[0]).startswith(norm_name(name) + " ") or norm_name(pname) == norm_name(name):
            # require the base name to match the first token group
            base = norm_name(pname.rsplit(" ", 1)[0]) if pname.split()[-1] in {"borough", "city", "CDP", "municipality"} else norm_name(pname)
            # CDP can be two words before the class: "Willow Street CDP"
            class_word = pname.split()[-1]
            if class_word in {"borough", "city", "CDP", "municipality"}:
                base = norm_name(pname[: pname.rfind(" ")])
            else:
                base = norm_name(pname)
            if base == norm_name(name):
                place_hits.append((geoid, pname, class_word if class_word in {"borough", "city", "CDP"} else ""))

    def pick_place(wanted: str) -> tuple[str, str] | None:
        hits = [hit for hit in place_hits if hit[2] == wanted]
        if len(hits) == 1:
            return hits[0][0], hits[0][1]
        if len(hits) > 1:
            # Prefer the shorter GEOID place record (7-digit) over county-split rows if any slipped in.
            hits.sort(key=lambda item: len(item[0]))
            seven = [hit for hit in hits if len(hit[0]) == 7]
            chosen = seven[0] if seven else hits[0]
            return chosen[0], chosen[1]
        return None

    sub_hits = []
    target_sub = norm_name(name if "township" in name.lower() else f"{name} township")
    for row in subs:
        geoid, sname = row[1], row[3]
        if not geoid.startswith("42" + fips):
            continue
        if norm_name(sname) == target_sub:
            sub_hits.append((geoid, sname))

    is_village = (
        "village" in kind
        or "census-designated" in kind
        or kind.startswith("cdp")
    )
    is_township = "township" in kind and not is_village
    is_city = kind == "city"
    is_borough = "borough" in kind and not is_village

    if is_city:
        found = pick_place("city")
        if not found:
            raise SystemExit(f"no city geo for {slug}")
        return {
            "status": "place",
            "sumlevel": "160",
            "geoid": census_place_id(found[0]),
            "census_name": found[1],
            "scope_note": f"Housing figures are for {found[1]}.",
        }
    if is_borough:
        found = pick_place("borough")
        if not found:
            raise SystemExit(f"no borough geo for {slug} hits={place_hits}")
        note = f"Housing figures are for {found[1]}."
        if slug == "adamstown-pa":
            note = (
                "Adamstown borough is incorporated in both Lancaster County and Berks County. "
                "The ACS place total is the whole borough, not a Lancaster-only slice."
            )
        return {
            "status": "place",
            "sumlevel": "160",
            "geoid": census_place_id(found[0]),
            "census_name": found[1],
            "scope_note": note,
        }
    if is_township:
        if len(sub_hits) != 1:
            raise SystemExit(f"township geo for {slug}: {sub_hits}")
        return {
            "status": "township",
            "sumlevel": "060",
            "geoid": census_sub_id(sub_hits[0][0]),
            "census_name": sub_hits[0][1],
            "scope_note": f"Housing figures are for {sub_hits[0][1]} in {county.title()} County.",
        }
    if is_village:
        found = pick_place("CDP")
        if found:
            municipality = town["kind"]
            return {
                "status": "cdp",
                "sumlevel": "160",
                "geoid": census_place_id(found[0]),
                "census_name": found[1],
                "scope_note": (
                    f"Housing figures are for the Census place {found[1]}, a statistical boundary. "
                    f"The local description of the place is: {municipality}."
                ),
            }
        # Fall back to the township named in the kind string.
        match = re.search(r"in ([A-Z][\w .'-]+Township)", town["kind"])
        if not match or not sub_hits:
            raise SystemExit(f"village without CDP or township for {slug}")
        return {
            "status": "township",
            "sumlevel": "060",
            "geoid": census_sub_id(sub_hits[0][0]),
            "census_name": sub_hits[0][1],
            "scope_note": (
                f"{name} has a township table ({sub_hits[0][1]}) and no CDP was selected. "
                "Figures cover that township."
            ),
        }
    raise SystemExit(f"unclassified kind for {slug}: {kind}")


def pct(part: float, whole: float) -> int | None:
    if not whole:
        return None
    return int(round(100.0 * part / whole))


def housing_from_acs(geo_id: str, payload: dict) -> dict:
    data = payload["data"][geo_id]
    year = data["B25034"]["estimate"]
    year_moe = data["B25034"]["error"]
    units_est = data["B25024"]["estimate"]
    median = data["B25035"]["estimate"]["B25035001"]
    median_moe = data["B25035"]["error"]["B25035001"]
    total = year["B25034001"]
    moe = year_moe["B25034001"]
    thin = bool(total and moe and moe > 0.3 * total)

    def val(bucket: dict, key: str) -> float:
        number = bucket.get(key)
        if number is None or number < 0:
            return 0.0
        return float(number)

    pre1939 = val(year, "B25034011")
    pre1970 = sum(val(year, key) for key in ("B25034008", "B25034009", "B25034010", "B25034011"))
    since1990 = sum(val(year, key) for key in ("B25034002", "B25034003", "B25034004", "B25034005"))
    since2010 = sum(val(year, key) for key in ("B25034002", "B25034003"))
    struct_total = val(units_est, "B25024001")
    median_year = None if median is None or median < 0 else int(round(median))
    return {
        "units": None if total is None or total < 0 else int(round(total)),
        "units_moe": None if moe is None or moe < 0 else int(round(moe)),
        "thin": thin,
        "median_year": median_year,
        "median_moe": None if median_moe is None or median_moe < 0 else int(round(median_moe)),
        "pct_pre1939": pct(pre1939, total),
        "pct_pre1970": pct(pre1970, total),
        "pct_since1990": pct(since1990, total),
        "pct_since2010": pct(since2010, total),
        "pct_detached": pct(val(units_est, "B25024002"), struct_total),
        "pct_attached": pct(val(units_est, "B25024003"), struct_total),
        "pct_mobile": pct(val(units_est, "B25024010"), struct_total),
    }


def pull_acs(geo_ids: list[str]) -> dict[str, dict]:
    found: dict[str, dict] = {}
    tables = "B25034,B25024,B25035"
    for start in range(0, len(geo_ids), 12):
        batch = geo_ids[start : start + 12]
        url = (
            "https://api.censusreporter.org/1.0/data/show/latest?table_ids="
            + tables
            + "&geo_ids="
            + ",".join(batch)
        )
        raw = json.loads(fetch(url))
        release = raw.get("release", {})
        for geo_id in batch:
            if geo_id not in raw.get("data", {}):
                raise SystemExit(f"ACS miss {geo_id}")
            housing = housing_from_acs(geo_id, raw)
            housing["release_id"] = release.get("id")
            housing["release_name"] = release.get("name")
            housing["release_years"] = release.get("years")
            found[geo_id] = housing
        time.sleep(0.2)
    return found


def acis_normals(sid: str) -> dict:
    """Mean of reported annual precipitation and snowfall totals, 1991-2020.

    Years marked missing by ACIS are left out. The year count is part of the fact.
    """

    def yearly(element: str) -> list[float]:
        body = json.dumps(
            {
                "sid": sid,
                "sdate": "1991-01-01",
                "edate": "2020-12-31",
                "elems": [
                    {
                        "name": element,
                        "interval": "yly",
                        "duration": "yly",
                        "reduce": "sum",
                    }
                ],
            }
        ).encode()
        raw = json.loads(
            fetch(
                "https://data.rcc-acis.org/StnData",
                data=body,
                timeout=60,
            )
        )
        values = []
        for row in raw.get("data", []):
            try:
                values.append(float(row[1]))
            except (TypeError, ValueError, IndexError):
                continue
        return values

    precip = yearly("pcpn")
    snow = yearly("snow")
    if len(precip) < 15 or len(snow) < 15 or (sum(snow) / len(snow)) < 1:
        raise SystemExit(f"unusable climate series for {sid}: precip {len(precip)} snow {len(snow)}")
    return {
        "station": sid,
        "precip_in": round(sum(precip) / len(precip), 1),
        "precip_years": len(precip),
        "snow_in": round(sum(snow) / len(snow), 1),
        "snow_years": len(snow),
        "period": "1991-2020",
        "source": (
            "NOAA Regional Climate Center ACIS. Means of annual precipitation and snowfall "
            "for the years from 1991 through 2020 that the station reported. Missing years are excluded."
        ),
    }


def storm_files() -> list[str]:
    html = fetch("https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/").decode(
        "utf-8", "replace"
    )
    found = re.findall(r"StormEvents_details-ftp_v1\.0_d(\d{4})_c(\d{8})\.csv\.gz", html)
    best: dict[str, tuple[str, str]] = {}
    for year, stamp in found:
        if year < "2004" or year > "2025":
            continue
        if year not in best or stamp > best[year][0]:
            best[year] = (stamp, f"StormEvents_details-ftp_v1.0_d{year}_c{stamp}.csv.gz")
    return [item[1] for _, item in sorted(best.items())]


def wanted_event(row: dict) -> bool:
    if row.get("STATE") != "PENNSYLVANIA":
        return False
    if row.get("EVENT_TYPE") not in {
        "Hail",
        "Thunderstorm Wind",
        "Flash Flood",
        "Flood",
        "Tropical Storm",
        "Hurricane",
        "Tropical Depression",
        "High Wind",
        "Ice Storm",
        "Heavy Rain",
    }:
        return False
    name = (row.get("CZ_NAME") or "").upper()
    fips = (row.get("CZ_FIPS") or "").zfill(3)
    if row.get("CZ_TYPE") == "C" and fips in set(COUNTY_FIPS.values()) and any(
        county in name for county in COUNTY_NAME.values()
    ):
        return True
    return False


def load_storms() -> list[dict]:
    CACHE.mkdir(parents=True, exist_ok=True)
    kept_path = CACHE / "pa-storms.json"
    events: list[dict] = []
    base = "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/"
    for name in storm_files():
        print("storm", name, flush=True)
        blob = fetch(base + name, timeout=180)
        with gzip.GzipFile(fileobj=io.BytesIO(blob)) as handle:
            text = io.TextIOWrapper(handle, encoding="utf-8", errors="replace", newline="")
            reader = csv.DictReader(text)
            for row in reader:
                if not wanted_event(row):
                    continue
                events.append(
                    {
                        "county_fips": (row.get("CZ_FIPS") or "").zfill(3),
                        "county": (row.get("CZ_NAME") or "").title(),
                        "type": row.get("EVENT_TYPE") or "",
                        "date": (row.get("BEGIN_DATE_TIME") or "")[:16],
                        "magnitude": row.get("MAGNITUDE") or "",
                        "mag_type": row.get("MAGNITUDE_TYPE") or "",
                        "location": row.get("BEGIN_LOCATION") or "",
                        "range": row.get("BEGIN_RANGE") or "",
                        "azimuth": row.get("BEGIN_AZIMUTH") or "",
                    }
                )
    kept_path.write_text(json.dumps(events))
    print("storms", len(events))
    return events


def location_matches(town_name: str, location: str) -> bool:
    loc = norm_name(location)
    name = norm_name(town_name)
    if not loc or not name:
        return False
    if loc == name:
        return True
    aliases = {
        "bird in hand": {"bird in hand"},
        "east petersburg": {"east petersburg"},
        "mount joy": {"mount joy", "mt joy"},
        "new holland": {"new holland"},
        "west chester": {"west chester"},
        "kennett square": {"kennett square"},
        "chester springs": {"chester springs"},
        "honey brook": {"honey brook"},
        "spring city": {"spring city"},
        "west grove": {"west grove"},
        "glenmoore": {"glenmoore", "glen moore"},
        "chadds ford": {"chadds ford"},
        "chester heights": {"chester heights"},
        "newtown square": {"newtown square"},
        "glen mills": {"glen mills"},
        "willow street": {"willow street"},
        "landisville": {"landisville"},
        "mount wolf": {"mount wolf", "mt wolf"},
        "red lion": {"red lion"},
        "spring grove": {"spring grove"},
        "west york": {"west york"},
        "north york": {"north york"},
        "new freedom": {"new freedom"},
        "glen rock": {"glen rock"},
        "york": {"york"},
    }
    accepted = aliases.get(name, {name})
    return loc in accepted


def attach_storms(town: dict, events: list[dict]) -> dict:
    fips = COUNTY_FIPS[town["county"]]
    own = []
    county_hail = []
    for event in events:
        if event["county_fips"] != fips:
            continue
        if location_matches(town["name"], event["location"]):
            own.append(event)
        if event["type"] == "Hail" and event["magnitude"]:
            county_hail.append(event)
    own.sort(key=lambda item: item["date"], reverse=True)
    hail = [event for event in own if event["type"] == "Hail"]
    water = [event for event in own if event["type"] in {"Flash Flood", "Flood", "Tropical Storm", "Hurricane", "Heavy Rain"}]
    wind = [event for event in own if event["type"] in {"Thunderstorm Wind", "High Wind", "Ice Storm"}]

    def compact(event: dict, attributed: bool) -> dict:
        return {
            "type": event["type"],
            "date": event["date"],
            "magnitude": event["magnitude"],
            "mag_type": event["mag_type"],
            "location": event["location"].title(),
            "range": event["range"],
            "azimuth": event["azimuth"],
            "attributed": attributed,
        }

    chosen = []
    if hail:
        chosen.append(compact(hail[0], True))
    if water:
        chosen.append(compact(water[0], True))
    elif wind:
        chosen.append(compact(wind[0], True))
    context = None
    if county_hail:
        county_hail.sort(key=lambda item: (float(item["magnitude"] or 0), item["date"]), reverse=True)
        top = county_hail[0]
        if not any(item["type"] == "Hail" and item["attributed"] for item in chosen):
            context = compact(top, False)
    return {"events": chosen[:3], "county_hail": context}


def strip_wiki(value: str) -> str:
    value = re.sub(r"\[\[(?:[^|\]]+\|)?([^\]]+)\]\]", r"\1", value)
    value = re.sub(r"\{\{[^}]+\}\}", "", value)
    value = re.sub(r"<[^>]+>", "", value)
    value = value.replace("''", "")
    return re.sub(r"\s+", " ", value).strip()


def load_districts() -> list[dict]:
    districts = []
    for page in NRHP_PAGES:
        url = (
            "https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&page="
            + urllib.parse.quote(page)
        )
        data = json.loads(fetch(url))
        text = data["parse"]["wikitext"]["*"]
        county = "lancaster"
        if "Chester" in page:
            county = "chester"
        elif "Delaware" in page:
            county = "delaware"
        elif "York" in page:
            county = "york"
        for block in re.findall(r"\{\{NRHP row(.*?)\n\}\}", text, flags=re.S):
            name_match = re.search(r"\|\s*name\s*=\s*(.+)", block)
            city_match = re.search(r"\|\s*city\s*=\s*(.+)", block)
            type_match = re.search(r"\|\s*type\s*=\s*(.+)", block)
            if not name_match:
                continue
            name = strip_wiki(name_match.group(1))
            location = strip_wiki(city_match.group(1)) if city_match else ""
            nr_type = strip_wiki(type_match.group(1)).lower() if type_match else ""
            is_district = "historic district" in name.lower() or nr_type == "hd"
            if not is_district:
                continue
            districts.append({"name": name, "location": location, "county": county})
        time.sleep(0.2)
    # De-duplicate by name + county.
    seen = set()
    unique = []
    for district in districts:
        key = (district["county"], district["name"].lower())
        if key in seen:
            continue
        seen.add(key)
        unique.append(district)
    print("districts", len(unique))
    return unique


BOROUGH_AND_TOWNSHIP = {"york", "manheim", "dover", "manchester", "shrewsbury", "windsor"}


def districts_for(town: dict, districts: list[dict]) -> list[str]:
    name = norm_name(town["name"])
    found = []
    for district in districts:
        if district["county"] != town["county"]:
            continue
        loc = norm_name(district["location"])
        title = norm_name(district["name"])
        title_hit = bool(name) and (title.startswith(name + " ") or title.startswith(name + " historic"))
        city_hit = bool(name) and (loc == name or loc.startswith(name + " "))
        if not title_hit and not city_hit:
            continue
        # A township location does not belong on the city or borough page.
        if city_hit and not title_hit and "township" in loc and "township" not in town["kind"]:
            continue
        if name in BOROUGH_AND_TOWNSHIP and "township" in loc:
            continue
        if "township" in name and "township" not in loc and "township" not in title:
            continue
        found.append(district["name"])
    # National Register districts only. This is not a local-ordinance determination.
    unique = []
    for item in found:
        if item not in unique:
            unique.append(item)
    return unique[:8]


def main() -> None:
    towns = LANCASTER + LANCASTER_REST + CHESTER + DELAWARE + YORK
    places = load_gaz(GAZ_PLACE)
    subs = load_gaz(GAZ_SUB)
    geos = {}
    for town in towns:
        geos[town["slug"]] = match_geo(town, places, subs)
        print("geo", town["slug"], geos[town["slug"]].get("census_name") or geos[town["slug"]]["status"])

    geo_ids = sorted({item["geoid"] for item in geos.values() if item.get("geoid")})
    acs = pull_acs(geo_ids)
    climate = {}
    for county, (sid, label) in STATIONS.items():
        row = acis_normals(sid)
        row["label"] = label
        climate[county] = row
        print("climate", county, row["precip_in"], row["snow_in"])

    storms = load_storms()
    districts = load_districts()
    payload_towns = {}
    for town in towns:
        geo = geos[town["slug"]]
        housing = acs.get(geo["geoid"]) if geo.get("geoid") else None
        payload_towns[town["slug"]] = {
            "slug": town["slug"],
            "name": town["name"],
            "county": town["county"],
            "kind": town["kind"],
            "geo": geo,
            "housing": housing,
            "storms": attach_storms(town, storms),
            "districts": districts_for(town, districts),
        }
    payload = {
        "generated": "2026-11-25",
        "housing_source": (
            "U.S. Census Bureau, American Community Survey 2024 5-year estimates, "
            "tables B25034 (year structure built), B25024 (units in structure), and B25035 "
            "(median year structure built), retrieved through Census Reporter."
        ),
        "storm_source": (
            "NOAA National Centers for Environmental Information, Storm Events Database, "
            "county-level details for Pennsylvania, files dated 2004 through 2025."
        ),
        "district_source": (
            "National Register of Historic Places listings for Lancaster, Chester, Delaware, "
            "and York counties as published on the English Wikipedia list pages. "
            "A National Register district is not the same thing as a local historic-district ordinance."
        ),
        "climate": climate,
        "towns": payload_towns,
    }
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
