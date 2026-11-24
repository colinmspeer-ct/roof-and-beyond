import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { brand, placeholders, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath, towns } from "@/lib/areas";
import { companyGraph, faqNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    absolute: `Roofing, gutters, windows, and siding | ${brand.dba}`,
  },
  description:
    "Roof & Beyond Home Solutions, the DBA of Pro Tech Brands LLC, estimates roofing, roof repair, siding, windows, gutters, and gutter guards in Lancaster, Chester, Delaware, and York counties.",
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "What work does Roof & Beyond Home Solutions do?",
    a: "Six exterior services: roofing, roof repair, siding, windows, gutters, and gutter guards. The estimate says which of those the house actually needs.",
  },
  {
    q: "Where do you work?",
    a: "Lancaster, Chester, and Delaware counties, in the same communities listed for this project, plus York County municipalities from the city and its townships out to Hanover, the river towns, and the southern boroughs.",
  },
  {
    q: "How does a free estimate work?",
    a: "You send the address and what you are seeing. Someone looks at the exterior. You get a written scope before any work is scheduled. The preview form on this site is not connected yet.",
  },
  {
    q: "What is the Pennsylvania registration number?",
    a: `It is not published yet. The placeholder is ${placeholders.hic}. It will be filled in when the owner confirms it.`,
  },
  {
    q: "Which manufacturers do you feature?",
    a: `None are listed yet. The placeholder is ${placeholders.manufacturers}. A specific estimate will name the products proposed for that house.`,
  },
  {
    q: "What warranty comes with the work?",
    a: `Warranty terms are ${placeholders.warranty} until they are documented. This website does not advertise a warranty that has not been written down.`,
  },
  {
    q: "Can you help after a storm?",
    a: "A visit can photograph and describe the roof, gutters, siding, and windows and can turn into a written estimate. It does not decide whether an insurance carrier pays a claim.",
  },
  {
    q: "How do I reach the company?",
    a: `Phone ${placeholders.phone}, email ${placeholders.email}, hours ${placeholders.hours}. The street address is ${placeholders.address}.`,
  },
];

const steps = [
  {
    n: "01",
    title: "Tell us the address",
    body: "Name the service you think you need and what you are seeing: a stain, a drip, a soft sill, a gutter that overflows.",
  },
  {
    n: "02",
    title: "We look at the exterior",
    body: "The visit is about the house in front of us: slope, walls, openings, and where the water goes when it leaves the roof.",
  },
  {
    n: "03",
    title: "You get it in writing",
    body: "The estimate lists the scope, what is included, and what is not. Products are named for that job once a manufacturer list exists.",
  },
  {
    n: "04",
    title: "Work follows the scope",
    body: "Nothing is scheduled until you approve that paper. The scope you approved is the work.",
  },
];

export default function HomePage() {
  const featured = ["lancaster-pa", "west-chester-pa", "media-pa", "york-city-pa"]
    .map((slug) => towns.find((town) => town.slug === slug))
    .filter((town) => town != null);

  return (
    <main>
      <JsonLd data={companyGraph()} />
      <JsonLd data={faqNode(faqs)} />
      <section className="relative overflow-hidden bg-navy text-white">
        <img
          src="/images/shingles.webp"
          alt="Close view of gray architectural asphalt shingles."
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/35" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-20">
          <p className="w-fit border border-sky/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky">
            Four counties in Pennsylvania
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[0.95] text-white sm:text-7xl">
            The roof, the gutters, the windows, and the walls.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
            {brand.dba} is the DBA of {brand.legalName}. We estimate six
            exterior trades for houses in Lancaster, Chester, Delaware, and
            York counties.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/estimate/">Get a free estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/where-we-work/">See the communities</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.14em] text-sky">
            Stock photo of asphalt shingles. Not a project by {brand.dba}.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <ul className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Six exterior services",
            "Written estimates",
            "Four Pennsylvania counties",
            `${brand.legalName}`,
          ].map((item) => (
            <li key={item} className="bg-white px-4 py-5 text-sm font-semibold uppercase tracking-[0.12em] text-navy">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl text-navy sm:text-5xl">Six services, kept separate</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          A full roof, a leak repair, a wall, a window, a gutter, and a gutter
          cover are different scopes. Each one has its own page, and each
          community page links to the local version.
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
                <h3 className="text-2xl text-navy group-hover:text-orange">
                  {service.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{service.lede}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl text-navy sm:text-5xl">What you can count on</h2>
            <div className="prose-measure mt-6 space-y-4 leading-7 text-ink">
              <p>
                The outside of the house is planned together. A roof that dumps
                into a failed gutter is one water problem, not two unrelated sales.
              </p>
              <p>
                You get the scope in writing before work is scheduled. The paper
                says what is included and what is left alone.
              </p>
              <p>
                Unknown facts stay in brackets. Phone, address, hours, the
                Pennsylvania registration, manufacturers, and warranty terms are
                placeholders until the owner fills them. This site does not invent
                ratings, years in business, or awards.
              </p>
              <p>
                {brand.dba} is how the company is known. The legal entity is{" "}
                {brand.legalName}.
              </p>
            </div>
          </div>
          <img
            src="/images/pennsylvania-house.webp"
            alt="A one-story house with light siding and a dark asphalt roof, set back on a lawn."
            className="h-full max-h-[460px] w-full object-cover"
            width={1600}
            height={1200}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl text-navy sm:text-5xl">How an estimate moves</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="border border-line bg-white p-5">
              <p className="text-sm font-semibold text-orange">{step.n}</p>
              <h3 className="mt-2 text-2xl text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-4xl sm:text-5xl">Where the trucks go</h2>
          <p className="mt-4 max-w-3xl leading-7 text-sky">
            Community pages cover Lancaster, Chester, and Delaware counties,
            plus York County. Each town page is about the houses there, and
            each town has a page for every service.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {counties.map((county) => (
              <Link
                key={county.slug}
                href={countyPath(county.slug)}
                className="border border-white/15 p-5 hover:border-orange"
              >
                <h3 className="text-2xl">{county.name}</h3>
                <p className="mt-2 text-sm text-sky">{county.towns.length} communities</p>
              </Link>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm">
            {featured.map((town) => (
              <li key={town.slug}>
                <Link
                  href={`/where-we-work/${town.countySlug}/${town.slug}/`}
                  className="border border-white/20 px-3 py-2 hover:border-orange"
                >
                  {town.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-4xl text-navy">Questions before you call</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-orange text-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-4xl sm:text-5xl">Ready for a look at the outside?</h2>
            <p className="mt-3 max-w-xl leading-7">
              Send the address. The form is a preview until the HighLevel embed
              replaces {placeholders.formAction}.
            </p>
          </div>
          <Button asChild variant="navy" size="lg">
            <Link href="/estimate/">Get a free estimate</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
