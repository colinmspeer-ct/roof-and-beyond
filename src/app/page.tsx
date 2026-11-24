import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EstimateForm } from "@/components/estimate-form";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { TrustSignals } from "@/components/trust-signals";
import { brand, placeholders, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath } from "@/lib/areas";
import { companyGraph, faqNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    absolute: `Free roof and exterior estimates | ${brand.dba}`,
  },
  description: brand.description,
  openGraph: {
    title: `Free roof and exterior estimates | ${brand.dba}`,
    description: brand.description,
    siteName: brand.dba,
    url: brand.url,
  },
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "What work does Roof & Beyond Home Solutions do?",
    a: "Six exterior services: roofing, roof repair, siding, windows, gutters, and gutter guards. The estimate says which of those the house actually needs.",
  },
  {
    q: "Where do you work?",
    a: "Lancaster, Chester, Delaware, and York counties. Each county page lists the communities by name.",
  },
  {
    q: "How does a free estimate work?",
    a: "You send the address and what you are seeing. Someone looks at the exterior. You get a written scope before any work is scheduled. The form on this preview does not send yet.",
  },
  {
    q: "Are you licensed and insured?",
    a: `That status is not published yet. The placeholders are ${placeholders.licenseStatus} and ${placeholders.hic}.`,
  },
  {
    q: "Is financing available?",
    a: `Financing details are ${placeholders.financing} until the owner confirms an offer. This page does not describe a loan.`,
  },
  {
    q: "What warranty comes with the work?",
    a: `Warranty terms are ${placeholders.warranty} until they are documented.`,
  },
  {
    q: "Can you help after a storm?",
    a: "A visit can photograph the roof, gutters, siding, and windows and can turn into a written estimate. It does not decide whether an insurance carrier pays a claim.",
  },
];

const steps = [
  { n: "01", title: "Tell us the address", body: "Name the service and what you are seeing: a stain, a drip, a soft sill, or a gutter that overflows." },
  { n: "02", title: "We look at the exterior", body: "The visit covers the slope, the walls, the openings, and where water leaves the roof." },
  { n: "03", title: "You get it in writing", body: "The estimate lists what is included and what is left alone." },
  { n: "04", title: "Work follows that scope", body: "Nothing is scheduled until you approve the paper." },
];

export default function HomePage() {
  return (
    <main>
      <JsonLd data={companyGraph()} />
      <JsonLd data={faqNode(faqs)} />
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky">
              Lancaster, Chester, Delaware, and York counties
            </p>
            <h1 className="mt-4 max-w-xl text-5xl leading-[0.95] sm:text-6xl">
              A written estimate for the outside of the house.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">
              {brand.dba} prices roofing, roof repair, siding, windows, gutters,
              and gutter guards before any work is scheduled.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#estimate">Get a free estimate</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact/">Call {placeholders.phone}</Link>
              </Button>
            </div>
          </div>
          <div id="estimate" className="bg-white p-5 text-navy shadow-lg">
            <h2 className="text-3xl">Request the visit</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Name, phone, email, and the trade. Address can wait until the full form.
            </p>
            <div className="mt-4">
              <EstimateForm short idPrefix="home-estimate" />
            </div>
          </div>
        </div>
      </section>
      <TrustSignals />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl text-navy sm:text-5xl">Six services, kept separate</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          A full roof, a leak repair, a wall, a window, a gutter, and a gutter
          cover are different scopes. Pick the one that matches the house.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceOrder.map((slug) => {
            const service = servicePages[slug];
            return (
              <Link
                key={slug}
                href={`/exterior/${slug}/`}
                className="group border border-line bg-white p-5 hover:border-orange"
              >
                <h3 className="text-2xl text-navy group-hover:text-orange">{service.label}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{service.lede}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <picture>
            <source srcSet="/images/shingles.avif" type="image/avif" />
            <img
              src="/images/shingles.webp"
              alt="Close view of gray architectural asphalt shingles."
              width={960}
              height={640}
              sizes="(min-width: 1024px) 480px, 100vw"
              loading="lazy"
              className="h-auto w-full"
            />
          </picture>
          <div>
            <h2 className="text-4xl text-navy">What happens after you ask</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((step) => (
                <li key={step.n}>
                  <p className="text-sm font-semibold text-[#9a3412]">{step.n}</p>
                  <h3 className="text-2xl text-navy">{step.title}</h3>
                  <p className="mt-1 leading-7 text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl text-navy">Counties we cover</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          Open a county to read the town names. This launch build does not
          publish a separate page for each town.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {counties.map((county) => (
            <li key={county.slug}>
              <Link href={countyPath(county.slug)} className="block border border-line bg-white p-4 hover:border-orange">
                <span className="text-2xl text-navy">{county.name}</span>
                <span className="mt-1 block text-sm text-muted">{county.towns.length} communities listed</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-4xl text-navy">Questions before you call</h2>
        <div className="mt-6">
          <FaqList faqs={faqs} />
        </div>
      </section>
      <PageCta />
    </main>
  );
}
