import { brand, placeholders } from "@/content/brand";
import { counties } from "@/lib/areas";

export function companyNode() {
  return {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${brand.url}/#company`,
    name: brand.dba,
    legalName: brand.legalName,
    alternateName: brand.alternateName,
    url: brand.url,
    image: `${brand.url}/brand/logo.svg`,
    description: brand.description,
    telephone: placeholders.phone,
    email: placeholders.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: placeholders.address,
      addressRegion: "PA",
      addressCountry: "US",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Pennsylvania Home Improvement Contractor registration",
      value: placeholders.hic,
    },
    areaServed: counties.map((county) => ({
      "@type": "AdministrativeArea",
      name: `${county.name}, Pennsylvania`,
    })),
    knowsAbout: [
      "Roofing",
      "Roof repair",
      "Siding",
      "Windows",
      "Gutters",
      "Gutter guards",
    ],
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
