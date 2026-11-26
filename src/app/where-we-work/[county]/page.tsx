import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EstimateSection, QuickEstimate } from "@/components/estimate-card";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { HeroActions, PageHero } from "@/components/page-hero";
import { ReviewsPlaceholder } from "@/components/placeholders";
import { SectionHeading } from "@/components/section-heading";
import { CountyCards, ServiceCards } from "@/components/sections";
import { CallCard, shortKind } from "@/components/town-bits";
import { TrustSignals } from "@/components/trust-signals";
import { countyCopy } from "@/content/county-pages";
import { brand, socialImage } from "@/content/brand";
import { countyPhoto } from "@/content/media";
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
  const title = `Roofing, Siding & Gutters in ${county.name}, PA | Roofers Serving ${county.towns.length} Towns`;
  return {
    title,
    description: copy.metaDescription,
    openGraph: {
      title,
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
  dauphin: [
    {
      q: "Which page should I use for a house in Hershey?",
      a: "Use Hershey for the Census community’s housing profile and Derry Township for township-wide housing and municipal guidance.",
    },
    {
      q: "What should I photograph after a Dauphin County storm?",
      a: "From the ground, photograph fallen branches, visibly displaced roof materials and where gutter runoff lands. Include new water marks indoors if you can reach them safely.",
    },
  ],
  cumberland: [
    {
      q: "Does the Shippensburg page cover both counties?",
      a: "The Shippensburg Borough page covers the Cumberland County portion. Shippensburg Township has its own page and housing figures.",
    },
    {
      q: "Where do I check which Cumberland County municipality serves my house?",
      a: "Look up the parcel with Cumberland County and confirm the borough or township before asking about permits. Postal names such as Mechanicsburg may apply to properties beyond the borough.",
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
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <JsonLd data={faqNode(faqs)} />
      <PageHero
        photo={countyPhoto[county.key]}
        crumbs={crumbs}
        eyebrow={`${places.length} communities · ${county.name}, PA`}
        title={
          <>
            Roofing, siding &amp; gutters in <span className="text-orange">{county.name}, PA</span>
          </>
        }
        sub={copy.metaDescription}
        actions={<HeroActions phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
        checks={["Free written estimate", `PA HIC #${brand.hic}`, "Houses only"]}
        aside={<QuickEstimate title={`Free estimate in ${county.name}`} />}
      />
      <TrustSignals />

      {includeTownPages ? (
        <section className="mx-auto max-w-7xl px-4 pt-14 lg:pt-20">
          <SectionHeading
            eyebrow={`${places.length} towns`}
            title={`Towns we serve in ${county.name}`}
            intro="Pick your town for local housing figures and links to all six services."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {places.map((town) => (
              <li key={town.slug}>
                <Link
                  href={townPath(town)}
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-card hover:border-navy/40"
                >
                  <span>
                    <span className="block font-bold text-navy">{town.name}</span>
                    <span className="block text-xs text-muted">
                      {shortKind(town.kind)}
                      {town.zips.length ? ` · ${town.zips.slice(0, 3).join(", ")}` : ""}
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-rust transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
        <article data-unique="true" className="prose-rb min-w-0 max-w-3xl">
          <h2>{copy.h1}</h2>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          {includeTownPages ? null : (
            <p>{places.map((town) => `${town.name} (${town.kind})`).join("; ")}.</p>
          )}
          <h2>Questions about {county.name}</h2>
          <FaqList faqs={faqs} openFirst />
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <CallCard />
        </aside>
      </div>

      <ReviewsPlaceholder context={county.slug} />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Services"
            title={`Exterior services in ${county.name}`}
            intro="The same six trades in every town, each with its own written scope."
          />
          <div className="mt-10">
            <ServiceCards />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Other counties" title="We also work in" />
        <div className="mt-8">
          <CountyCards current={county.slug} />
        </div>
      </section>

      <EstimateSection
        heading={`Get a free estimate in ${county.name}`}
        body="Send the address and what you are seeing on the roof, walls, windows, or gutters. The written scope comes first."
      />
      <PageCta heading={`Estimate a house in ${county.name}`} estimateHref="#estimate" />
    </main>
  );
}
