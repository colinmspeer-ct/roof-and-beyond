import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { brand, serviceOrder, type ServiceSlug } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import {
  getTown,
  neighborTowns,
  townPath,
  townServicePath,
  towns,
} from "@/lib/areas";
import { breadcrumbNode, faqNode, serviceNode } from "@/lib/schema";

export function generateStaticParams() {
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
  return {
    title: block.metaTitle,
    description: block.metaDescription,
    alternates: { canonical: townServicePath(town, block.slug) },
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
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
      <article data-unique="true" className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">
          {block.label} · {town.name}
        </p>
        <h1 className="mt-2 text-5xl leading-[0.95] text-navy">{block.h1}</h1>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 60)} className="mt-4 leading-7">
            {paragraph}
          </p>
        ))}
      </article>
      <section className="mt-10 max-w-3xl" aria-label="Questions">
        <h2 className="text-3xl text-navy">Questions about this house</h2>
        <Accordion type="single" collapsible className="mt-2">
          {block.faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/estimate/">Estimate this {town.name} house</Link>
        </Button>
        <Button asChild variant="outlineNavy">
          <Link href={`/exterior/${block.slug}/`}>All {block.label.toLowerCase()}</Link>
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
                className="border border-line bg-white px-3 py-2 text-sm hover:border-orange"
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
                  className="border border-line bg-white px-3 py-2 text-sm hover:border-orange"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
