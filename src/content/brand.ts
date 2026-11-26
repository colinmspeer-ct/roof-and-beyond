export const brand = {
  dba: "Roof & Beyond Home Solutions",
  legalName: "Pro Tech Brands LLC",
  alternateName: "Roof and Beyond Home Solutions",
  dbaLine:
    "Roof & Beyond Home Solutions is a DBA of Pro Tech Brands LLC. PA HIC #PA240642.",
  domain: "roofnbeyond.com",
  url: "https://roofnbeyond.com",
  description:
    "Request roofing, siding, window, and gutter estimates in six Pennsylvania counties, from Delaware County to the Susquehanna Valley.",
  phoneDisplay: "(717) 804-0990",
  phoneTel: "+17178040990",
  email: "colin@roofnbeyond.com",
  hours: "9 AM to 8 PM, 7 days a week",
  locality: "Media, PA",
  hic: "PA240642",
  registration: "PA Home Improvement Contractor registered (PA240642)",
} as const;

export const socialImage = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: "Roof and Beyond Home Solutions, Media, PA",
} as const;

export const serviceOrder = [
  "roofing",
  "roof-repair",
  "siding",
  "windows",
  "gutters",
  "gutter-guards",
] as const;

export type ServiceSlug = (typeof serviceOrder)[number];
