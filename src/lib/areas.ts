import raw from "@/content/generated/areas.json";
import type { ServiceSlug } from "@/content/brand";

export type Faq = { q: string; a: string };

export type LocalSection = { heading: string; paragraphs: string[] };

export type ServiceBlock = {
  label: string;
  slug: ServiceSlug;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  paragraphs: string[];
  faqs: Faq[];
  answer: string;
  priceNote: string;
};

export type Town = {
  slug: string;
  name: string;
  county: "lancaster" | "chester" | "delaware" | "york";
  countySlug: string;
  countyName: string;
  kind: string;
  zips: string[];
  neighbors: string[];
  hook: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  paragraphs: string[];
  services: Record<ServiceSlug, ServiceBlock>;
  riskLead: string;
  answer: string;
  localSections: LocalSection[];
  faqs: Faq[];
  sources: string[];
};

export type CountyRecord = {
  key: Town["county"];
  slug: string;
  name: string;
  towns: string[];
};

const data = raw as {
  counties: CountyRecord[];
  towns: Town[];
};

export const counties: CountyRecord[] = data.counties;
export const towns: Town[] = data.towns;

const townBySlug = new Map(towns.map((town) => [town.slug, town]));
const countyBySlug = new Map(counties.map((county) => [county.slug, county]));

export function getCounty(slug: string) {
  return countyBySlug.get(slug);
}

export function getTown(slug: string) {
  return townBySlug.get(slug);
}

export function townsInCounty(countySlug: string) {
  const county = getCounty(countySlug);
  if (!county) return [];
  return county.towns
    .map((slug) => townBySlug.get(slug))
    .filter((town): town is Town => Boolean(town))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function neighborTowns(town: Town) {
  return town.neighbors
    .map((slug) => townBySlug.get(slug))
    .filter((item): item is Town => Boolean(item));
}

export function townPath(town: Town) {
  return `/where-we-work/${town.countySlug}/${town.slug}/`;
}

export function townServicePath(town: Town, service: ServiceSlug) {
  return `/where-we-work/${town.countySlug}/${town.slug}/${service}/`;
}

export function countyPath(slug: string) {
  return `/where-we-work/${slug}/`;
}
