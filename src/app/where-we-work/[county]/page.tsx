import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { countyCopy } from "@/content/county-pages";
import { brand, serviceOrder, socialImage } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, getCounty, townPath, townsInCounty } from "@/lib/areas";
import { includeTownPages } from "@/content/launch";
import { breadcrumbNode, faqNode } from "@/lib/schema";

export function generateStaticParams() {
  return counties.map((county) => ({ county: county.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county: slug } = await params;
  const county = getCounty(slug);
  if (!county) return {};
  const copy = countyCopy[county.key];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      siteName: brand.dba,
      url: `${brand.url}/where-we-work/${county.slug}/`,
      images: [socialImage],
    },
    alternates: { canonical: `/where-we-work/${county.slug}/` },
  };
}

const countyFaqs = {
  lancaster: [
    {
      q: "Are Lancaster city and the boroughs the same kind of roof?",
      a: "No. The city has brick rows and shared eaves. Boroughs such as Lititz and Ephrata keep shorter, older roofs. Farm valleys carry longer planes. The county page lists the names; the estimate is still per house.",
    },
    {
      q: "Does each Lancaster community have its own page?",
      a: "Yes. The list below links a page for each community, and each of those pages links roofing, roof repair, siding, windows, gutters, and gutter guards.",
    },
  ],
  chester: [
    {
      q: "Does Chester County include both boroughs and the Main Line?",
      a: "Yes. The list on this page runs from West Chester, Coatesville, Downingtown, and Phoenixville through Berwyn, Paoli, and the southern boroughs. Older slate and newer suburban roofs are both in that mix.",
    },
    {
      q: "Where do I ask for a Chester County estimate?",
      a: "Open the town page from the list below, or call (717) 804-0990. The estimate form is on the contact page.",
    },
  ],
  delaware: [
    {
      q: "Is every Delaware County town included?",
      a: "No. This page is the western slice only: Media, Radnor, Chadds Ford, Glen Mills, and the other names written below. It is not the rest of the county.",
    },
    {
      q: "Is Garnet Valley a borough?",
      a: "No. It is a community and school-district name. It still has its own page, and that page does not borrow another township's housing table.",
    },
  ],
  york: [
    {
      q: "Is York city the same page as York Township?",
      a: "They are different places, and both names are written on this county page. Hanover, Red Lion, Wrightsville, and the Manchester municipalities are listed separately too.",
    },
    {
      q: "How do I request work in York County?",
      a: "Call (717) 804-0990 or send the address through the contact form. The office is listed as Media, PA, and hours are 9 AM to 8 PM, seven days a week.",
    },
  ],
} as const;

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county: slug } = await params;
  const county = getCounty(slug);
  if (!county) notFound();
  const copy = countyCopy[county.key];
  const places = townsInCounty(county.slug);
  const faqs = [...countyFaqs[county.key]];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: county.name, path: `/where-we-work/${county.slug}/` },
  ];
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <JsonLd data={breadcrumbNode(crumbs)} />
        <JsonLd data={faqNode(faqs)} />
        <Breadcrumbs items={crumbs} />
        <article data-unique="true" className="mt-6 max-w-3xl">
          <h1 className="text-5xl text-navy">{copy.h1}</h1>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-4 leading-7">
              {paragraph}
            </p>
          ))}
          <h2 className="mt-10 text-3xl text-navy">Questions about {county.name}</h2>
          <FaqList faqs={faqs} />
        </article>
        <h2 className="mt-10 text-3xl text-navy">Towns served in {county.name}</h2>
          {includeTownPages ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {places.map((town) => (
                <li key={town.slug}>
                  <Link
                    href={townPath(town)}
                    className="flex min-h-12 items-center justify-between gap-3 border border-line bg-white px-3 py-2 hover:border-orange"
                  >
                    <span className="font-semibold text-navy">{town.name}</span>
                    <span className="text-sm text-muted">{town.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 leading-7">
              {places.map((town) => `${town.name} (${town.kind})`).join("; ")}.
            </p>
          )}
          <h2 className="mt-10 text-3xl text-navy">Services in {county.name}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {serviceOrder.map((service) => (
              <li key={service}>
                <Link
                  href={`/exterior/${service}/`}
                  className="inline-flex min-h-12 items-center border border-line bg-white px-3 py-2 text-sm hover:border-orange"
                >
                  {servicePages[service].label}
                </Link>
              </li>
            ))}
          </ul>
      </main>
      <PageCta heading={`Estimate a house in ${county.name}`} />
    </>
  );
}
