import type { ServiceSlug } from "@/content/brand";
import type { Town } from "@/lib/areas";

export type Photo = {
  webp: string;
  avif: string;
  width: number;
  height: number;
  alt: string;
};

const file = (name: string, width: number, height: number, alt: string): Photo => ({
  webp: `/images/gen/${name}.webp`,
  avif: `/images/gen/${name}.avif`,
  width,
  height,
  alt,
});

export const photos = {
  home: file(
    "home-hero-chester-colonial", 1280, 720,
    "A colonial house with a stone facade, white siding and a shingle roof. The front elevation shows where roofing, siding and gutter runs meet.",
  ),
  farmhouse: file(
    "roof-replacement-stone-farmhouse", 1280, 720,
    "A stone farmhouse with dark shingles and a masonry chimney. The roof replacement scene shows the contrast between the chimney and the shingle field.",
  ),
  brickColonial: file(
    "roof-replacement-lancaster-brick-colonial", 1280, 720,
    "A brick colonial with a dark shingle roof over the main house. The roof replacement scene shows the eaves above the upper windows.",
  ),
  crew: file(
    "roof-replacement-harnessed-crew", 1280, 720,
    "Roofers wearing safety harnesses work on a pitched roof. The roof replacement crew is spread across the slope.",
  ),
  tearOff: file(
    "roof-replacement-tear-off", 1280, 720,
    "A roof replacement in progress with shingles pulled back from the deck. The exposed area shows the surface an installer can inspect during tear-off.",
  ),
  flashing: file(
    "roof-repair-chimney-flashing", 1152, 864,
    "Metal flashing meets a masonry chimney on an asphalt shingle roof. Chimney flashing is a roof repair detail where the roof meets the brickwork.",
  ),
  iceDam: file(
    "roof-repair-ice-dam", 1280, 720,
    "Snow and ice collect along the lower edge of a sloped roof. The frozen edge illustrates where backed-up meltwater can lead to roof repair.",
  ),
  storm: file(
    "storm-damage-missing-shingles", 1024, 1024,
    "Several asphalt shingles are missing from a roof slope. The bare patches illustrate a reason to request storm damage roof repair.",
  ),
  twins: file(
    "siding-lancaster-twins", 1280, 720,
    "Two adjoining homes have lap siding above their front porches. The two facades illustrate the trim transitions involved in siding replacement.",
  ),
  splitLevel: file(
    "siding-split-level", 1280, 720,
    "A split-level house has horizontal siding above a lower wall. The change in exterior finish illustrates a transition to detail during siding replacement.",
  ),
  vinyl: file(
    "siding-vinyl-installation", 1280, 720,
    "An installer fits horizontal vinyl siding on an exterior wall. The scene shows vinyl siding installation while part of the wall is still exposed.",
  ),
  brickRanch: file(
    "window-replacement-brick-ranch-pair", 1152, 864,
    "A pair of windows sits side by side in a brick ranch wall. The brick and surrounding trim show the edges to measure for window replacement.",
  ),
  stoneOpening: file(
    "window-replacement-stone-opening", 1152, 864,
    "A white window sits inside an opening in a stone wall. The masonry and sill frame the window replacement detail.",
  ),
  seamless: file(
    "gutter-installation-seamless", 1280, 720,
    "A continuous gutter runs along the roof edge beneath the shingles. The seamless gutter installation illustrates how the trough follows the fascia.",
  ),
  guards: file(
    "gutter-guards-fall-maple", 1280, 720,
    "Maple leaves rest on a guard along the roof edge. The gutter guard screen covers the trough beneath the leaves.",
  ),
} as const;

export const servicePhoto: Record<ServiceSlug, Photo> = {
  roofing: photos.brickColonial,
  "roof-repair": photos.flashing,
  siding: photos.twins,
  windows: photos.stoneOpening,
  gutters: photos.seamless,
  "gutter-guards": photos.guards,
};

export const serviceGallery: Record<ServiceSlug, Photo[]> = {
  roofing: [photos.tearOff, photos.crew, photos.storm],
  "roof-repair": [photos.storm, photos.iceDam],
  siding: [photos.vinyl, photos.splitLevel],
  windows: [photos.brickRanch, photos.home],
  gutters: [photos.guards, photos.iceDam],
  "gutter-guards": [photos.seamless, photos.home],
};

export const countyPhoto: Record<Town["county"], Photo> = {
  lancaster: photos.brickColonial,
  chester: photos.home,
  delaware: photos.twins,
  york: photos.splitLevel,
  cumberland: photos.farmhouse,
};

const exteriorPhotos = [
  photos.home, photos.farmhouse, photos.brickColonial, photos.twins,
  photos.splitLevel,
];

const localServicePhotos: Record<ServiceSlug, Photo[]> = {
  roofing: [photos.brickColonial, photos.farmhouse, photos.crew, photos.tearOff, photos.home],
  "roof-repair": [photos.flashing, photos.iceDam, photos.storm, photos.tearOff, photos.farmhouse],
  siding: [photos.twins, photos.vinyl, photos.splitLevel, photos.home, photos.brickRanch],
  windows: [photos.stoneOpening, photos.brickRanch, photos.home, photos.brickColonial, photos.twins],
  gutters: [photos.seamless, photos.iceDam, photos.guards, photos.home, photos.farmhouse],
  "gutter-guards": [photos.guards, photos.seamless, photos.home, photos.iceDam, photos.brickColonial],
};

export function townPhoto(town: Town, service?: ServiceSlug): Photo {
  const pool = service ? localServicePhotos[service] : exteriorPhotos;
  return pool[town.photoIndex];
}

/** Short card copy for service tiles (outside the unique-content article). */
export const serviceBlurb: Record<ServiceSlug, string> = {
  roofing: "Full tear-off and new roof: decking, flashing, edge metal, and attic ventilation in one written scope.",
  "roof-repair": "Leaks, lifted shingles, failed boots, and wind damage fixed without selling a whole new roof.",
  siding: "Vinyl and other lap siding replaced wall by wall, with trim and wrap called out in writing.",
  windows: "Replacement windows for wood sash, older vinyl, and full-frame openings, counted one by one.",
  gutters: "Gutters, hangers, and downspouts sized so roof water leaves the house instead of the wall.",
  "gutter-guards": "Gutter guards matched to the trees over your roof, not a one-size cover.",
};

/** Keyword variations people use, for titles and H1 support lines. */
export const serviceKeyword: Record<ServiceSlug, { h1: string; variation: string }> = {
  roofing: { h1: "Roofing", variation: "Roof Replacement & Roofers" },
  "roof-repair": { h1: "Roof Repair", variation: "Roof Leak Repair" },
  siding: { h1: "Siding", variation: "Vinyl Siding Replacement" },
  windows: { h1: "Window Replacement", variation: "Replacement Windows" },
  gutters: { h1: "Gutters", variation: "Gutter Installation & Replacement" },
  "gutter-guards": { h1: "Gutter Guards", variation: "Gutter Covers" },
};
