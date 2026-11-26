import type { ServiceSlug } from "@/content/brand";
import type { Town } from "@/lib/areas";

/**
 * Photo library. Every file is free-licensed stock (see CREDITS.md), so alt
 * text says so instead of implying these are Roof & Beyond projects.
 * Swap in real job photos (renamed after the service) when Colin supplies them.
 */
export type Photo = {
  webp: string;
  avif: string;
  width: number;
  height: number;
  alt: string;
};

const file = (name: string, width: number, height: number, alt: string): Photo => ({
  webp: `/images/${name}.webp`,
  avif: `/images/${name}.avif`,
  width,
  height,
  alt,
});

export const photos = {
  clapboard: file(
    "clapboard-house",
    1000,
    750,
    "White clapboard house with black shutters, a gray shingle porch roof, and a white picket fence. Painted lap siding, double-hung windows, and an asphalt roof are the parts of a house exterior a written estimate covers. Stock photo from Massachusetts, not a Roof & Beyond project.",
  ),
  paHouse: file(
    "pennsylvania-house",
    1000,
    750,
    "Small white Cape Cod style house with a brown asphalt shingle roof on a wide green lawn. A simple gable roof like this is a common roof replacement on Pennsylvania houses. Stock photo of a house in Centre County, Pennsylvania, outside the service area.",
  ),
  shingles: file(
    "shingles",
    960,
    640,
    "Close view of gray architectural asphalt shingles with pine needles caught in the laps. Worn granules, lifted tabs, and debris at the seams are what a roof repair visit looks for. Stock photo, not a Roof & Beyond project.",
  ),
  rowHouses: file(
    "row-houses",
    900,
    967,
    "A row of attached houses with lap siding and covered front porches along a narrow street. Shared walls and connected eaves change how siding and gutters are replaced on row homes. Stock photo from Hagerstown, Maryland, outside the service area.",
  ),
  window: file(
    "window-detail",
    1000,
    750,
    "Close view of a light-colored window frame with a muntin bar and an insect screen. The sash, frame, and trim around each opening are listed separately in a window replacement estimate. Stock photo, not a Roof & Beyond project.",
  ),
  gutterRain: file(
    "gutter-rain",
    1000,
    750,
    "Rainwater pouring off a roof edge into a white aluminum rain gutter during a storm. A gutter that overflows or pulls away from the fascia sends water down the wall toward the foundation. Stock photo, not a Roof & Beyond project.",
  ),
} as const;

const gutterGuardPhoto: Photo = {
  ...photos.gutterRain,
  alt: "An open white gutter filling with rain, with no gutter guard over the trough. A gutter guard or gutter cover changes what can collect in the trough under trees. Stock photo, not a Roof & Beyond project.",
};

export const servicePhoto: Record<ServiceSlug, Photo> = {
  roofing: photos.paHouse,
  "roof-repair": photos.shingles,
  siding: photos.rowHouses,
  windows: photos.window,
  gutters: photos.gutterRain,
  "gutter-guards": gutterGuardPhoto,
};

export const countyPhoto: Record<Town["county"], Photo> = {
  lancaster: photos.rowHouses,
  chester: photos.paHouse,
  delaware: photos.clapboard,
  york: photos.shingles,
};

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
