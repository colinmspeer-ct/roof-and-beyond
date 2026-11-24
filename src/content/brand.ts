export const brand = {
  dba: "Roof & Beyond Home Solutions",
  legalName: "Pro Tech Brands LLC",
  alternateName: "Roof and Beyond Home Solutions",
  dbaLine:
    "Roof & Beyond Home Solutions is a DBA of Pro Tech Brands LLC",
  domain: "roofnbeyond.com",
  url: "https://roofnbeyond.com",
  description:
    "Roof & Beyond Home Solutions estimates roofing, roof repair, siding, windows, gutters, and gutter guards for houses in Lancaster, Chester, Delaware, and York counties, Pennsylvania.",
} as const;

export const placeholders = {
  phone: "[PHONE]",
  email: "[EMAIL]",
  address: "[BUSINESS ADDRESS]",
  hic: "[PA HIC #]",
  hours: "[BUSINESS HOURS]",
  manufacturers: "[FEATURED MANUFACTURERS]",
  warranty: "[WARRANTY TERMS]",
  sms: "[SMS CONSENT LANGUAGE]",
  formAction: "[HIGHLEVEL FORM EMBED]",
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
