import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstimateSection, QuickEstimate } from "@/components/estimate-card";
import { FactKey } from "@/components/fact-key";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { HeroActions, PageHero } from "@/components/page-hero";
import { ReviewsPlaceholder } from "@/components/placeholders";
import { SectionHeading } from "@/components/section-heading";
import { PillLinks, ServiceCards } from "@/components/sections";
import { CallCard, LocalDetails, Prose, Sources } from "@/components/town-bits";
import { serviceBlurb } from "@/content/media";
import { TrustSignals } from "@/components/trust-signals";
import { brand, serviceOrder, socialImage, type ServiceSlug } from "@/content/brand";
import { serviceKeyword, servicePhoto } from "@/content/media";
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
  const kw = serviceKeyword[block.slug];
  const title = `${kw.h1} in ${town.name}, PA | ${kw.variation} in ${town.countyName}`;
  return {
    title,
    description: block.metaDescription,
    openGraph: {
      title,
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
  const kw = serviceKeyword[block.slug];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: town.countyName, path: `/where-we-work/${town.countySlug}/` },
    { name: town.name, path: townPath(town) },
    { name: block.label, path: townServicePath(town, block.slug) },
  ];
  const nearby = neighborTowns(town).slice(0, 4);
  const queryHeading = {
    roofing: `Roof replacement cost in ${town.name}, PA`,
    "roof-repair": `Roof repair cost in ${town.name}, PA`,
    siding: `Siding cost in ${town.name}, PA`,
    windows: `Window replacement cost in ${town.name}, PA`,
    gutters: `Gutter cost in ${town.name}, PA`,
    "gutter-guards": `Gutter guard cost in ${town.name}, PA`,
  }[block.slug];

  return (
    <main>
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
      <PageHero
        photo={servicePhoto[block.slug]}
        crumbs={crumbs}
        eyebrow={`${kw.variation} · ${town.countyName}`}
        title={
          <>
            {kw.h1} in <span className="text-orange">{town.name}, PA</span>
          </>
        }
        sub={`${block.label} for houses in ${town.name}, ${town.countyName}. ${serviceBlurb[block.slug]}`}
        actions={<HeroActions phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
        checks={["Free written estimate", `PA HIC #${brand.hic}`, "Houses only"]}
        aside={<QuickEstimate title={`Free ${block.label.toLowerCase()} estimate in ${town.name}`} />}
      />
      <TrustSignals />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
        <div className="min-w-0 max-w-3xl">
          <article data-unique="true" className="prose-rb">
            <h2>{block.h1}</h2>
            <Prose text={block.answer} />
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)}>{paragraph}</p>
            ))}
            <h2>{block.costHeading}</h2>
            {block.costParagraphs.map((paragraph) => (
              <Prose key={paragraph.slice(0, 40)} text={paragraph} />
            ))}
            <h2>{block.label} questions in {town.name}</h2>
            <FaqList faqs={block.faqs} />
          </article>
          <section
            className="mt-10 rounded-2xl border border-line border-l-4 border-l-orange bg-white p-6 shadow-card"
            aria-label={queryHeading}
          >
            <h2 className="text-2xl text-navy">{queryHeading}</h2>
            <p className="mt-3 text-base leading-7">{block.priceNote}</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Houses only. The written estimate for this {town.name} house is the price.
            </p>
          </section>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/exterior/${block.slug}/`}
              className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-navy px-5 font-bold text-navy hover:bg-navy hover:text-white"
            >
              All {block.label.toLowerCase()}
            </Link>
            <Link
              href={townPath(town)}
              className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-navy px-5 font-bold text-navy hover:bg-navy hover:text-white"
            >
              {town.name} overview
            </Link>
          </div>
          <div className="mt-10">
            <FactKey />
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <CallCard />
          <LocalDetails town={town} />
        </aside>
      </div>

      <ReviewsPlaceholder context={`${town.slug}-${block.slug}`} />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading eyebrow={`More in ${town.name}`} title={`Other work on houses in ${town.name}`} />
          <div className="mt-10">
            <ServiceCards
              exclude={block.slug}
              hrefFor={(slug) => townServicePath(town, slug)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {nearby.length ? (
          <>
            <SectionHeading eyebrow="Nearby" title={`${block.label} near ${town.name}`} />
            <div className="mt-6">
              <PillLinks
                links={nearby.map((item) => ({
                  href: townServicePath(item, block.slug),
                  label: `${block.label} in ${item.name}`,
                }))}
              />
            </div>
          </>
        ) : null}
        <div className="mt-12 max-w-3xl">
          <Sources sources={town.sources} />
        </div>
      </section>

      <EstimateSection
        heading={`Free ${block.label.toLowerCase()} estimate in ${town.name}`}
        body={`Send the ${town.name} address and what you are seeing. The ${block.label.toLowerCase()} scope goes on paper before anything is scheduled.`}
      />
      <PageCta
        heading={`Free ${block.label.toLowerCase()} estimate in ${town.name}`}
        body={`Call ${brand.phoneDisplay} or use the form. Residential houses only.`}
        estimateHref="#estimate"
      />
    </main>
  );
}
