import type { Metadata } from "next";
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
import { CallCard, LocalDetails, Sources, shortKind } from "@/components/town-bits";
import { TrustSignals } from "@/components/trust-signals";
import { brand, socialImage } from "@/content/brand";
import { countyPhoto } from "@/content/media";
import {
  getCounty,
  getTown,
  neighborTowns,
  townPath,
  townServicePath,
  towns,
  townsInCounty,
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
  const title = `Roofing, Siding & Gutters in ${town.name}, PA | Roofers in ${town.countyName}`;
  return {
    title,
    description: town.metaDescription,
    openGraph: {
      title,
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
  const sameCounty = townsInCounty(town.countySlug).filter(
    (item) => item.slug !== town.slug && !town.neighbors.includes(item.slug),
  );

  return (
    <main>
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
      <PageHero
        photo={countyPhoto[town.county]}
        crumbs={crumbs}
        eyebrow={`${town.countyName} · ${shortKind(town.kind)}${town.zips.length ? ` · ${town.zips.join(", ")}` : ""}`}
        title={
          <>
            Roofing, siding &amp; gutters in <span className="text-orange">{town.name}, PA</span>
          </>
        }
        sub={`Roofing, roof repair, siding, windows, gutters, and gutter guards for houses in ${town.name}, ${town.countyName}. You get the scope in writing before any work is scheduled.`}
        actions={<HeroActions phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
        checks={["Free written estimate", `PA HIC #${brand.hic}`, "Houses only"]}
        aside={<QuickEstimate title={`Free estimate in ${town.name}`} />}
      />
      <TrustSignals />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
        <div className="min-w-0 max-w-3xl">
          <article data-unique="true" className="prose-rb">
            <h2>{town.h1}</h2>
            {town.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)}>{paragraph}</p>
            ))}
          </article>
          <div className="prose-rb mt-10">
            <h2>Housing and exterior work in {town.name}</h2>
            <p>{town.answer}</p>
            <p>{town.riskLead}</p>
            {town.localSections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            <h2>{town.name} questions</h2>
            <FaqList faqs={town.faqs} />
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

      <ReviewsPlaceholder context={town.slug} />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow={`Services in ${town.name}`}
            title={`Roofing and exterior services in ${town.name}`}
            intro={`Each page applies the trade to houses in ${town.name}: local housing age, storm records, and what goes into the estimate.`}
          />
          <div className="mt-10">
            <ServiceCards
              hrefFor={(slug) => townServicePath(town, slug)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {nearby.length ? (
          <>
            <SectionHeading eyebrow="Nearby" title={`Communities near ${town.name}`} />
            <div className="mt-6">
              <PillLinks links={nearby.map((item) => ({ href: townPath(item), label: item.name, note: shortKind(item.kind) }))} />
            </div>
          </>
        ) : null}
        {sameCounty.length ? (
          <>
            <h2 className="mt-12 text-2xl text-navy">More towns in {town.countyName}</h2>
            <div className="mt-5">
              <PillLinks links={sameCounty.map((item) => ({ href: townPath(item), label: item.name, note: shortKind(item.kind) }))} />
            </div>
          </>
        ) : null}
        <div className="mt-12 max-w-3xl">
          <Sources sources={town.sources} />
        </div>
      </section>

      <EstimateSection
        heading={`Free roofing and exterior estimate in ${town.name}`}
        body={`Send the ${town.name} address and what you are seeing. The written scope comes before anything is scheduled.`}
      />
      <PageCta
        heading={`Free estimate in ${town.name}`}
        body={`Call ${brand.phoneDisplay} or send the address. Houses only. The written estimate is the price.`}
        estimateHref="#estimate"
      />
    </main>
  );
}
