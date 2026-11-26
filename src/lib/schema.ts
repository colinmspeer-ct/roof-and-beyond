import { brand } from "@/content/brand";
import { counties } from "@/lib/areas";

/**
 * Niche entities for knowsAbout. Wikipedia + Wikidata IDs were resolved from
 * the Wikipedia API on 2026-11-26. "Roofing" on Wikipedia is a disambiguation
 * page, so the roofer (trade) article stands in for it. Gutter guards have no
 * standalone article; the Rain gutter section is the canonical reference.
 */
export const knowsAbout = [
  { name: "Roofing", sameAs: ["https://en.wikipedia.org/wiki/Roofer", "https://www.wikidata.org/wiki/Q552378"] },
  { name: "Roof repair", sameAs: ["https://en.wikipedia.org/wiki/Domestic_roof_construction", "https://www.wikidata.org/wiki/Q1156728"] },
  { name: "Asphalt shingle", sameAs: ["https://en.wikipedia.org/wiki/Asphalt_shingle", "https://www.wikidata.org/wiki/Q2108753"] },
  { name: "Siding", sameAs: ["https://en.wikipedia.org/wiki/Siding", "https://www.wikidata.org/wiki/Q15874788"] },
  { name: "Vinyl siding", sameAs: ["https://en.wikipedia.org/wiki/Vinyl_siding", "https://www.wikidata.org/wiki/Q7932947"] },
  { name: "Windows", sameAs: ["https://en.wikipedia.org/wiki/Window", "https://www.wikidata.org/wiki/Q35473"] },
  { name: "Rain gutter", sameAs: ["https://en.wikipedia.org/wiki/Rain_gutter", "https://www.wikidata.org/wiki/Q152833"] },
  { name: "Gutter guard", sameAs: ["https://en.wikipedia.org/wiki/Rain_gutter#Gutter_guards"] },
  { name: "Flashing", sameAs: ["https://en.wikipedia.org/wiki/Flashing_(weatherproofing)", "https://www.wikidata.org/wiki/Q647584"] },
  { name: "Soffit", sameAs: ["https://en.wikipedia.org/wiki/Soffit", "https://www.wikidata.org/wiki/Q3488818"] },
] as const;

export function companyNode() {
  return {
    "@type": ["RoofingContractor", "LocalBusiness"],
    "@id": `${brand.url}/#company`,
    name: brand.dba,
    legalName: brand.legalName,
    alternateName: brand.alternateName,
    url: brand.url,
    image: `${brand.url}/brand/logo.svg`,
    description: brand.description,
    telephone: brand.phoneTel,
    email: brand.email,
    openingHours: "Mo-Su 09:00-20:00",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Media",
      addressRegion: "PA",
      postalCode: brand.postalCode,
      addressCountry: "US",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Pennsylvania Home Improvement Contractor registration",
      value: brand.hic,
    },
    areaServed: counties.map((county) => ({
      "@type": "AdministrativeArea",
      name: `${county.name}, Pennsylvania`,
    })),
    knowsAbout: knowsAbout.map((entity) => ({
      "@type": "Thing",
      name: entity.name,
      sameAs: entity.sameAs,
    })),
  };
}

export function companyGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [companyNode()],
  };
}

export function breadcrumbNode(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${brand.url}${item.path}`,
    })),
  };
}

export function faqNode(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function serviceNode(input: {
  name: string;
  serviceType: string;
  url: string;
  description: string;
  areaName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    url: input.url,
    description: input.description,
    provider: { "@id": `${brand.url}/#company` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: input.areaName,
    },
  };
}
