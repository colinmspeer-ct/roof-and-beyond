import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FactKey } from "@/components/fact-key";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand, serviceOrder, socialImage, type ServiceSlug } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import {
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
  return towns.flatMap((town) =>
    serviceOrder.map((service) => ({
      county: town.countySlug,
      town: town.slug,
      service,
    })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string; town: string; service: string }>;
}): Promise<Metadata> {
  const { county, town: townSlug, service } = await params;
  const town = getTown(townSlug);
  if (!town || town.countySlug !== county) return {};
  const block = town.services[service as ServiceSlug];
  if (!block) return {};
  const canonical = townServicePath(town, block.slug);
  return {
    title: block.metaTitle,
    description: block.metaDescription,
    openGraph: {
      title: block.metaTitle,
      description: block.metaDescription,
      url: canonical,
      images: [socialImage],
    },
    alternates: { canonical },
  };
}

export default async function TownServicePage({
  params,
}: {
  params: Promise<{ county: string; town: string; service: string }>;
}) {
  const { county, town: townSlug, service } = await params;
  const town = getTown(townSlug);
  if (!town || town.countySlug !== county) notFound();
  const block = town.services[service as ServiceSlug];
  if (!block) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: town.countyName, path: `/where-we-work/${town.countySlug}/` },
    { name: town.name, path: townPath(town) },
    { name: block.label, path: townServicePath(town, block.slug) },
  ];
  const nearby = neighborTowns(town).slice(0, 4);
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
  const queryHeading = {
    roofing: `Roof replacement cost in ${town.name}, PA`,
    "roof-repair": `Roof repair cost in ${town.name}, PA`,
    siding: `Siding cost in ${town.name}, PA`,
    windows: `Window replacement cost in ${town.name}, PA`,
    gutters: `Gutter cost in ${town.name}, PA`,
    "gutter-guards": `Gutter guard cost in ${town.name}, PA`,
  }[block.slug];

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <JsonLd data={breadcrumbNode(crumbs)} />
        <JsonLd data={companyGraph()} />
        <JsonLd data={faqNode(block.faqs)} />
        <JsonLd
          data={serviceNode({
            name: `${block.label} in ${town.name}, Pennsylvania`,
            serviceType: block.label,
            url: `${brand.url}${townServicePath(town, block.slug)}`,
            description: block.metaDescription,
            areaName: `${town.name}, ${town.countyName}, Pennsylvania`,
          })}
        />
        <Breadcrumbs items={crumbs} />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#9a3412]">
          {block.label} · {town.name}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[0.95] text-navy sm:text-5xl">{block.h1}</h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={`tel:${brand.phoneTel}`}>{`Call us at ${brand.phoneDisplay}`}</a>
          </Button>
          <Button asChild size="lg" variant="outlineNavy">
            <Link href="/contact/#estimate">Free estimate</Link>
          </Button>
        </div>
        <FactKey />
        <article data-unique="true" className="mt-8 max-w-3xl">
          {prose(block.answer)}
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 60)} className="mt-4 leading-7">
              {paragraph}
            </p>
          ))}
          <h2 className="mt-8 text-3xl text-navy">{block.costHeading}</h2>
          {block.costParagraphs.map((paragraph) => (
            <div key={paragraph.slice(0, 40)}>{prose(paragraph)}</div>
          ))}
          <FaqList faqs={block.faqs} />
        </article>
        <section className="mt-8 max-w-3xl border border-line bg-white p-4" aria-label={queryHeading}>
          <h2 className="text-2xl text-navy">{queryHeading}</h2>
          <p className="mt-3 leading-7">{block.priceNote}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Houses only. The written estimate for this {town.name} house is the price.
          </p>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outlineNavy">
            <Link href={`/exterior/${block.slug}/`}>All {block.label.toLowerCase()}</Link>
          </Button>
          <Button asChild variant="outlineNavy">
            <Link href={townPath(town)}>{town.name} overview</Link>
          </Button>
        </div>
        <h2 className="mt-10 text-2xl text-navy">Other work in {town.name}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {serviceOrder
            .filter((item) => item !== block.slug)
            .map((item) => (
              <li key={item}>
                <Link
                  href={townServicePath(town, item)}
                  className="inline-flex min-h-12 items-center border border-line bg-white px-3 py-2 text-sm hover:border-orange"
                >
                  {servicePages[item].label}
                </Link>
              </li>
            ))}
        </ul>
        {nearby.length ? (
          <>
            <h2 className="mt-8 text-2xl text-navy">{block.label} nearby</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {nearby.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={townServicePath(item, block.slug)}
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
      <PageCta
        heading={`Free ${block.label.toLowerCase()} estimate in ${town.name}`}
        body={`Call ${brand.phoneDisplay} or use the form. Residential houses only.`}
      />
    </>
  );
}
