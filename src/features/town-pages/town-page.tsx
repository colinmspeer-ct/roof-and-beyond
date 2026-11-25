import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FactKey } from "@/components/fact-key";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { TrustSignals } from "@/components/trust-signals";
import { brand, serviceOrder, socialImage } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import {
  getCounty,
  getTown,
  neighborTowns,
  townPath,
  townServicePath,
  towns,
} from "@/lib/areas";
import { includeTownPages } from "@/content/launch";
import { breadcrumbNode, companyGraph, faqNode, serviceNode } from "@/lib/schema";

export function generateStaticParams() {
  if (!includeTownPages) return [];
  return towns.map((town) => ({
    county: town.countySlug,
    town: town.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string; town: string }>;
}): Promise<Metadata> {
  const { county, town: townSlug } = await params;
  const town = getTown(townSlug);
  if (!town || town.countySlug !== county) return {};
  const canonical = townPath(town);
  return {
    title: town.metaTitle,
    description: town.metaDescription,
    openGraph: {
      title: town.metaTitle,
      description: town.metaDescription,
      url: canonical,
      images: [socialImage],
    },
    alternates: { canonical },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ county: string; town: string }>;
}) {
  const { county, town: townSlug } = await params;
  const town = getTown(townSlug);
  const countyRecord = getCounty(county);
  if (!town || !countyRecord || town.countySlug !== county) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: town.countyName, path: `/where-we-work/${town.countySlug}/` },
    { name: town.name, path: townPath(town) },
  ];
  const nearby = neighborTowns(town);
  const prose = (text: string) => {
    const parts = text.split(/(?<=\.)\s+/).filter(Boolean);
    if (parts.length < 3) {
      return <p className="mt-4 leading-7">{text}</p>;
    }
    return (
      <ul className="mt-4 list-disc space-y-1 pl-5 leading-7">
        {parts.map((part) => (
          <li key={part}>{part}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <JsonLd data={breadcrumbNode(crumbs)} />
        <JsonLd data={companyGraph()} />
        <JsonLd data={faqNode(town.faqs)} />
        <JsonLd
          data={serviceNode({
            name: `Exterior work in ${town.name}, Pennsylvania`,
            serviceType: "Residential exterior work",
            url: `${brand.url}${townPath(town)}`,
            description: town.metaDescription,
            areaName: `${town.name}, ${town.countyName}, Pennsylvania`,
          })}
        />
        <Breadcrumbs items={crumbs} />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#9a3412]">
          {town.countyName} · {town.kind}
          {town.zips.length ? ` · ${town.zips.join(", ")}` : ""}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[0.95] text-navy sm:text-5xl">{town.h1}</h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={`tel:${brand.phoneTel}`}>{`Call us at ${brand.phoneDisplay}`}</a>
          </Button>
          <Button asChild size="lg" variant="outlineNavy">
            <Link href="/contact/#estimate">Free estimate</Link>
          </Button>
        </div>
        <TrustSignals />
        <FactKey />
        <article data-unique="true" className="mt-8 max-w-3xl">
          {prose(town.riskLead)}
          {prose(town.answer)}
          {town.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 60)} className="mt-4 leading-7">
              {paragraph}
            </p>
          ))}
          {town.localSections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-3xl text-navy">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <div key={paragraph.slice(0, 60)}>{prose(paragraph)}</div>
              ))}
            </section>
          ))}
          <FaqList faqs={town.faqs} />
        </article>
        <h2 className="mt-10 text-3xl text-navy">Services on houses in {town.name}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceOrder.map((service) => (
            <li key={service}>
              <Link
                href={townServicePath(town, service)}
                className="block h-full min-h-12 border border-line bg-white p-4 hover:border-orange"
              >
                <span className="text-xl text-navy">{servicePages[service].label}</span>
                <span className="mt-2 block text-sm leading-6 text-muted">
                  {town.services[service].metaDescription}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {nearby.length ? (
          <>
            <h2 className="mt-10 text-3xl text-navy">Nearby communities</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {nearby.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={townPath(item)}
                    className="inline-flex min-h-12 items-center border border-line bg-white px-3 py-2 text-sm hover:border-orange"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <aside className="mt-10 max-w-3xl text-sm leading-6 text-muted" aria-label="Sources">
          <h2 className="text-xl text-navy">Sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {town.sources.map((source) => (
              <li key={source.slice(0, 48)}>{source}</li>
            ))}
          </ul>
        </aside>
      </main>
      <PageCta heading={`Free estimate in ${town.name}`} body={`Call ${brand.phoneDisplay} or send the address. Houses only. The written estimate is the price.`} />
    </>
  );
}
