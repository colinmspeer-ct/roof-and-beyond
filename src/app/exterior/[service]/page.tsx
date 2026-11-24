import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand, serviceOrder, type ServiceSlug } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath } from "@/lib/areas";
import { breadcrumbNode, faqNode, serviceNode } from "@/lib/schema";

export function generateStaticParams() {
  return serviceOrder.map((service) => ({ service }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const page = servicePages[service as ServiceSlug];
  if (!page) return {};
  const canonical = `/exterior/${page.slug}/`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: `${page.metaTitle} | ${brand.dba}`,
      description: page.metaDescription,
      siteName: brand.dba,
      url: `${brand.url}${canonical}`,
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
          areaName: "Lancaster, Chester, Delaware, and York counties, Pennsylvania",
        })}
      />
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Breadcrumbs items={crumbs} tone="light" />
          <h1 className="mt-4 text-5xl leading-[0.95] sm:text-6xl">{page.h1}</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/90">{page.lede}</p>
          <Button asChild className="mt-6">
            <Link href="/contact/">Get a free estimate</Link>
          </Button>
        </div>
      </section>
      <article data-unique="true" className="mx-auto max-w-3xl px-4 py-12">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="mb-4 leading-7">
            {paragraph}
          </p>
        ))}
        <h2 className="mt-10 text-3xl text-navy">Questions about {page.label.toLowerCase()}</h2>
        <FaqList faqs={page.faqs} />
        <figure className="mt-10">
          <picture>
            <source srcSet={page.image.src.replace(".webp", ".avif")} type="image/avif" />
            <img
              src={page.image.src}
              alt={page.image.alt}
              width={page.image.width}
              height={page.image.height}
              sizes="(min-width: 768px) 720px, 100vw"
              loading="lazy"
              className="h-auto w-full"
            />
          </picture>
          <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-muted">
            Stock photo. Not a {brand.dba} project.
          </figcaption>
        </figure>
      </article>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-3xl text-navy">Counties</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {counties.map((county) => (
            <li key={county.slug}>
              <Link href={countyPath(county.slug)} className="border border-line bg-white px-3 py-2 text-sm hover:border-orange">
                {county.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <PageCta heading={`Estimate ${page.label.toLowerCase()}`} />
    </main>
  );
}
