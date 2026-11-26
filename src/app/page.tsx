import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { EstimateCard } from "@/components/estimate-card";
import { HeroActions, PageHero } from "@/components/page-hero";
import { Picture } from "@/components/picture";
import { ReviewsPlaceholder, VideoPlaceholder } from "@/components/placeholders";
import { SectionHeading } from "@/components/section-heading";
import { AnswerBlock, CountyCards, ServiceCards, Steps } from "@/components/sections";
import { TrustSignals } from "@/components/trust-signals";
import { brand, socialImage } from "@/content/brand";
import { photos } from "@/content/media";
import { companyGraph, faqNode } from "@/lib/schema";

const title = `Roofing Contractor & Roofers in Lancaster, Chester, Delaware, York, Cumberland & Dauphin Counties, PA | ${brand.dba}`;
const description =
  "Get a free roofing, siding, window, or gutter estimate in Lancaster, Chester, Delaware, York, Cumberland, or Dauphin County, PA.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    siteName: brand.dba,
    url: brand.url,
    images: [socialImage],
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
    a: "Lancaster, Chester, Delaware, York, Cumberland, and Dauphin counties. Each county page lists the communities by name.",
  },
  {
    q: "How does a free estimate work?",
    a: "You send the address and what you are seeing through the estimate form, or you call. Someone looks at the exterior. You get a written scope before any work is scheduled.",
  },
  {
    q: "Are you a registered Pennsylvania contractor?",
    a: `${brand.dba} is a DBA of ${brand.legalName}. ${brand.registration}.`,
  },
  {
    q: "Can you help after a storm?",
    a: "A visit can photograph the roof, gutters, siding, and windows and can turn into a written estimate. It does not decide whether an insurance carrier pays a claim.",
  },
  {
    q: "Do you work on commercial buildings?",
    a: "No. The company works on houses only, from row homes and twins to detached houses and farmhouses.",
  },
  {
    q: "When can I reach someone?",
    a: `Phones are answered ${brand.hours}. Call ${brand.phoneDisplay} or send the estimate form at any hour.`,
  },
];

export default function HomePage() {
  return (
    <main>
      <JsonLd data={companyGraph()} />
      <JsonLd data={faqNode(faqs)} />
      <PageHero
        photo={photos.home}
        eyebrow="Roofing & exterior contractor · Five PA counties"
        title={
          <>
            Roofing, siding &amp; gutters for houses in{" "}
            <span className="text-orange">Lancaster, Chester, Delaware, York, Cumberland &amp; Dauphin counties</span>
          </>
        }
        sub="Roof replacement, roof repair, siding, windows, gutters, and gutter guards. A free written estimate comes first, so you know the scope and the price before anything is scheduled."
        actions={<HeroActions phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
        checks={["Free written estimate", `PA HIC #${brand.hic}`, "Open 9 AM–8 PM, 7 days"]}
        aside={
          <div id="estimate" className="scroll-mt-24">
            <EstimateCard contained eager idPrefix="home-estimate" />
          </div>
        }
      />
      <TrustSignals />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="A roofing company that keeps every exterior job separate"
            />
            <div className="mt-6">
              <AnswerBlock>
                <strong>{brand.dba}</strong> is a residential <strong>roofing</strong> and exterior
                contractor based in {brand.locality} (PA HIC #{brand.hic}). We estimate{" "}
                <strong>roof replacement</strong>, <strong>roof repair</strong>, <strong>siding</strong>,{" "}
                <strong>windows</strong>, <strong>gutters</strong>, and <strong>gutter guards</strong> for
                houses in Lancaster, Chester, Delaware, York, Cumberland, and Dauphin counties. Call{" "}
                <a className="font-bold text-navy underline" href={`tel:${brand.phoneTel}`}>
                  {brand.phoneDisplay}
                </a>
                , {brand.hours}.
              </AnswerBlock>
            </div>
            <p className="mt-6 text-lg leading-8 text-muted">
              A full roof, a leak repair, a wall, a window, a gutter, and a gutter
              cover are different scopes. A roofer who prices a lifted shingle as a
              new roof wastes your money; one who calls a rotted deck a patch wastes
              your roof. The written estimate names which of the six the house needs
              and which it does not.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/exterior/"
                className="inline-flex h-13 items-center justify-center rounded-lg bg-navy px-6 font-bold text-white hover:bg-navy-deep"
              >
                See all services
              </Link>
              <Link
                href="/about/"
                className="inline-flex h-13 items-center justify-center rounded-lg border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white"
              >
                About the company
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lift">
              <Picture
                photo={photos.storm}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="block h-full"
              />
            </div>
            <p className="mt-2 text-xs text-muted">Illustrative photo</p>
          </div>
        </div>
      </section>

      <ReviewsPlaceholder context="home" />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="Exterior services"
            title="Roofing and exterior services for your house"
            intro="Pick the job that matches what you are seeing. Each page explains the scope, the common problems, and what goes into the estimate."
          />
          <div className="mt-10">
            <ServiceCards />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From first call to written estimate in four steps"
          intro="No pressure and no surprise line items. The scope is on paper before anyone sets a date."
        />
        <div className="mt-10">
          <Steps />
        </div>
        <div className="mt-10 text-center">
          <a
            href="#estimate"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-orange px-8 text-lg font-bold text-navy hover:bg-orange-dark"
          >
            Start step one: get a free estimate
          </a>
        </div>
      </section>

      <VideoPlaceholder topic="home" />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHeading
            eyebrow="Where we work"
            title="Roofers serving six Pennsylvania counties"
            intro="Open a county to see every community by name. Each town page links roofing, roof repair, siding, windows, gutters, and gutter guards for houses there."
          />
          <div className="mt-10">
            <CountyCards />
          </div>
          <p className="mt-8 text-[15px] text-muted">
            Looking for a specific town?{" "}
            <Link href="/sitemap/" className="font-bold text-navy underline underline-offset-4">
              Browse the full sitemap
            </Link>{" "}
            or{" "}
            <Link href="/where-we-work/" className="font-bold text-navy underline underline-offset-4">
              see all communities
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 lg:py-20">
        <SectionHeading align="center" eyebrow="FAQ" title="Roofing and exterior questions, answered" />
        <FaqList faqs={faqs} openFirst />
      </section>

      <PageCta
        heading="Ready for a straight answer on your roof?"
        body="Send the address or call. You get a written scope for the roof, walls, windows, or gutters before any work is scheduled."
        estimateHref="#estimate"
      />
    </main>
  );
}
