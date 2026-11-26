import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { HeroActions, PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CountyCards, ServiceCards, Steps } from "@/components/sections";
import { TrustSignals } from "@/components/trust-signals";
import { brand } from "@/content/brand";
import { photos } from "@/content/media";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Roofing, Roof Repair, Siding, Windows, Gutters & Gutter Guards | Exterior Services",
  description:
    "Six exterior services from Roof & Beyond Home Solutions: full roofing, roof repair, siding, windows, gutters, and gutter guards.",
  alternates: { canonical: "/exterior/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Exterior", path: "/exterior/" },
];

export default function ExteriorIndexPage() {
  return (
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <PageHero
        photo={photos.farmhouse}
        crumbs={crumbs}
        compact
        eyebrow="Six exterior services"
        title={
          <>
            Roofing &amp; exterior services <span className="text-orange">for houses</span>
          </>
        }
        sub="Roofing, roof repair, siding, windows, gutters, and gutter guards, each priced as its own scope."
        actions={<HeroActions estimateHref="/contact/#estimate" phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
      />
      <TrustSignals />
      <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <article data-unique="true" className="prose-rb max-w-3xl">
          <h2>The six exterior trades</h2>
          <p>
            Roof & Beyond Home Solutions keeps roofing, roof repair, siding,
            windows, gutters, and gutter guards on separate pages so a leak
            repair is not described as a new roof, and a gutter cover is not
            slipped into a trough replacement.
          </p>
          <p>
            Each service page explains the scope in general. Community pages then
            apply that trade to the houses in that place: a Lancaster row, a
            Chester farmhouse, a Radnor slate slope, a York split-level.
          </p>
          <p>
            County pages name each community in text. Townships and boroughs
            that share a familiar name, such as Manheim and Manchester, are
            written separately so they are not treated as one place.
          </p>
        </article>
        <div className="mt-12">
          <ServiceCards />
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading align="center" eyebrow="How it works" title="How a free estimate works" />
          <div className="mt-10">
            <Steps />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Where we work" title="Counties we serve" />
        <div className="mt-8">
          <CountyCards />
        </div>
      </section>
      <PageCta />
    </main>
  );
}
