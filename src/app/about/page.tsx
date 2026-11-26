import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { HeroActions, PageHero } from "@/components/page-hero";
import { OwnerBioPlaceholder, ReviewsPlaceholder } from "@/components/placeholders";
import { SectionHeading } from "@/components/section-heading";
import { CountyCards, ServiceCards } from "@/components/sections";
import { TrustSignals } from "@/components/trust-signals";
import { brand, socialImage } from "@/content/brand";
import { photos } from "@/content/media";
import { breadcrumbNode, companyGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "About Roof & Beyond Home Solutions | Roofing Contractor in Media, PA" },
  description: `${brand.dba} estimates roofing, roof repair, siding, windows, gutters, and gutter guards in five Pennsylvania counties.`,
  openGraph: {
    title: "About the company",
    description: `${brand.dba} estimates roofing, roof repair, siding, windows, gutters, and gutter guards in five Pennsylvania counties.`,
    siteName: brand.dba,
    images: [socialImage],
  },
  alternates: { canonical: "/about/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];

const facts: [string, string][] = [
  ["Business name", brand.dba],
  ["Legal entity", brand.legalName],
  ["PA HIC registration", `#${brand.hic}`],
  ["Based in", brand.locality],
  ["Hours", brand.hours],
  ["Work", "Residential houses only"],
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <JsonLd data={companyGraph()} />
      <PageHero
        photo={photos.home}
        crumbs={crumbs}
        compact
        eyebrow={`PA HIC #${brand.hic} · ${brand.locality}`}
        title={
          <>
            About <span className="text-orange">{brand.dba}</span>
          </>
        }
        sub="A residential roofing and exterior contractor for houses in Lancaster, Chester, Delaware, York, and Cumberland counties."
        actions={<HeroActions estimateHref="/contact/#estimate" phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
      />
      <TrustSignals />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-20">
        <article data-unique="true" className="prose-rb min-w-0 max-w-3xl [&_a]:font-semibold [&_a]:text-navy">
          <h2>The company behind the name</h2>
          <p>{brand.dbaLine}</p>
          <p>
            The registration is held by {brand.legalName}. {brand.registration}.
            The words on this website use the ampersand.
          </p>
          <p>
            The work is exterior only: roofing, roof repair, siding, windows,
            gutters, and gutter guards. Service covers the communities listed
            for Lancaster, Chester, Delaware, York, and Cumberland counties. The public
            location is {brand.locality}. Hours are {brand.hours}.
          </p>
          <p>
            Call{" "}
            <a className="underline" href={`tel:${brand.phoneTel}`}>
              {brand.phoneDisplay}
            </a>{" "}
            or email{" "}
            <a className="underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
            . This site does not publish star ratings, review counts, years in
            business, or awards. A storm visit can document the exterior. It
            cannot promise an insurance payment.
          </p>
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">Company facts</p>
            <dl className="mt-3 divide-y divide-line text-[15px]">
              {facts.map(([label, value]) => (
                <div key={label} className="py-3">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="font-semibold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
      <OwnerBioPlaceholder />
      <ReviewsPlaceholder context="about" />
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading eyebrow="What we do" title="Six exterior services for houses" />
          <div className="mt-10">
            <ServiceCards />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Where we work" title="Five Pennsylvania counties" />
        <div className="mt-8">
          <CountyCards />
        </div>
      </section>
      <PageCta />
    </main>
  );
}
