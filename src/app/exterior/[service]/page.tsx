import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { EstimateSection, QuickEstimate } from "@/components/estimate-card";
import { HeroActions, PageHero } from "@/components/page-hero";
import { Picture } from "@/components/picture";
import { ReviewsPlaceholder, VideoPlaceholder } from "@/components/placeholders";
import { SectionHeading } from "@/components/section-heading";
import { CountyCards, ServiceCards } from "@/components/sections";
import { TrustSignals } from "@/components/trust-signals";
import { brand, serviceOrder, socialImage, type ServiceSlug } from "@/content/brand";
import { serviceGallery, serviceKeyword, servicePhoto } from "@/content/media";
import { servicePages } from "@/content/service-pages";
import { breadcrumbNode, faqNode, serviceNode } from "@/lib/schema";

export function generateStaticParams() {
  return serviceOrder.map((service) => ({ service }));
}

export const dynamicParams = false;

const AREA = "Lancaster, Chester, Delaware, York, Cumberland & Dauphin Counties, PA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const page = servicePages[service as ServiceSlug];
  if (!page) return {};
  const canonical = `/exterior/${page.slug}/`;
  const kw = serviceKeyword[page.slug];
  const title = `${kw.h1} in ${AREA} | ${kw.variation}`;
  return {
    title,
    description: page.metaDescription,
    openGraph: {
      title,
      description: page.metaDescription,
      siteName: brand.dba,
      url: `${brand.url}${canonical}`,
      images: [socialImage],
    },
    alternates: { canonical },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const page = servicePages[service as ServiceSlug];
  if (!page) notFound();
  const kw = serviceKeyword[page.slug];
  const photo = servicePhoto[page.slug];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Exterior", path: "/exterior/" },
    { name: page.label, path: `/exterior/${page.slug}/` },
  ];
  return (
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <JsonLd data={faqNode(page.faqs)} />
      <JsonLd
        data={serviceNode({
          name: page.label,
          serviceType: page.label,
          url: `${brand.url}/exterior/${page.slug}/`,
          description: page.metaDescription,
          areaName: "Lancaster, Chester, Delaware, York, Cumberland, and Dauphin counties, Pennsylvania",
        })}
      />
      <PageHero
        photo={photo}
        crumbs={crumbs}
        eyebrow={`${kw.variation} · houses only`}
        title={
          <>
            {kw.h1} in <span className="text-orange">{AREA}</span>
          </>
        }
        sub={page.lede}
        actions={<HeroActions phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
        checks={["Free written estimate", `PA HIC #${brand.hic}`, "9 AM–8 PM daily"]}
        aside={<QuickEstimate title={`Free ${page.label.toLowerCase()} estimate`} />}
      />
      <TrustSignals />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
        <article data-unique="true" className="prose-rb min-w-0 max-w-3xl">
          <h2>{page.h1}</h2>
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <h2>Questions about {page.label.toLowerCase()}</h2>
          <FaqList faqs={page.faqs} openFirst />
          {page.slug === "roofing" ? (
            <>
              <h2>When storm damage affects a roof replacement</h2>
              <p>
                Strong winds can leave a roof with exposed underlayment or loose shingles along several edges.
                Photograph what you can see from the ground. The roof inspection should show which slopes are
                affected and whether the remaining shingles and decking can support a repair.
              </p>
            </>
          ) : null}
          {page.slug === "roof-repair" ? (
            <>
              <h2>Leaks and missing shingles after a storm</h2>
              <p>
                Note where the first indoor stain appeared and when the rain began. A repair visit traces
                moisture from that spot to possible entry points, including loose flashing, a torn shingle,
                or damage around a vent.
              </p>
            </>
          ) : null}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {serviceGallery[page.slug].map((image) => (
              <figure key={image.webp} className="m-0 min-w-0">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-card">
                  <Picture photo={image} sizes="(min-width: 640px) 360px, 100vw" className="block h-full" />
                </div>
                <figcaption className="mt-2 text-xs text-muted">Illustrative photo</figcaption>
              </figure>
            ))}
          </div>
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-navy p-6 text-white">
            <p className="text-xl font-extrabold tracking-tight">Talk to someone today</p>
            <p className="mt-2 text-[15px] leading-6 text-white/80">{brand.hours}.</p>
            <a
              href={`tel:${brand.phoneTel}`}
              className="mt-4 flex h-13 items-center justify-center gap-2 rounded-lg bg-orange font-bold text-navy hover:bg-orange-dark"
            >
              <Phone aria-hidden="true" className="size-4" />
              {brand.phoneDisplay}
            </a>
            <a
              href="#estimate"
              className="mt-2 flex h-13 items-center justify-center rounded-lg border-2 border-white font-bold text-white hover:bg-white hover:text-navy"
            >
              Request an estimate
            </a>
          </div>
          <nav aria-label="Other services" className="mt-6 rounded-2xl border border-line bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">All services</p>
            <ul className="mt-3 space-y-1">
              {serviceOrder.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/exterior/${slug}/`}
                    aria-current={slug === page.slug ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold ${
                      slug === page.slug ? "bg-paper text-rust" : "text-navy hover:bg-paper"
                    }`}
                  >
                    {servicePages[slug].label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <ReviewsPlaceholder context={page.slug} />
      <VideoPlaceholder topic={page.slug} />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Where we work"
            title={`${page.label} across six Pennsylvania counties`}
            intro="Each county page lists the towns we serve. Town pages show local housing figures and explain the scope of each service."
          />
          <div className="mt-10">
            <CountyCards />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="More exterior work" title="Other services for your house" />
        <div className="mt-10">
          <ServiceCards exclude={page.slug} />
        </div>
      </section>

      <EstimateSection
        heading={`Get a free ${page.label.toLowerCase()} estimate`}
        body={`Tell us the address and what you are seeing. The ${page.label.toLowerCase()} scope goes on paper before anything is scheduled.`}
      />
      <PageCta heading={`Need ${page.label.toLowerCase()} on your house?`} estimateHref="#estimate" />
    </main>
  );
}
