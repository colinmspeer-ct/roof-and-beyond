import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { brand, serviceOrder, type ServiceSlug } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath, towns, townServicePath } from "@/lib/areas";
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
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/exterior/${page.slug}/` },
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
  const examples = towns.filter((town) =>
    ["lititz-pa", "west-chester-pa", "media-pa", "york-city-pa", "hanover-pa", "columbia-pa"].includes(
      town.slug,
    ),
  );

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
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <Breadcrumbs items={crumbs} tone="light" />
            <h1 className="mt-4 text-5xl leading-[0.95] sm:text-6xl">{page.h1}</h1>
            <p className="mt-4 text-lg leading-8 text-white/90">{page.lede}</p>
            <Button asChild className="mt-6">
              <Link href="/estimate/">Get a free estimate</Link>
            </Button>
          </div>
          <figure>
            <img
              src={page.image.src}
              alt={page.image.alt}
              width={page.image.width}
              height={page.image.height}
              className="h-72 w-full object-cover sm:h-96"
            />
            <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-sky">
              Stock photo. Not a {brand.dba} project.
            </figcaption>
          </figure>
        </div>
      </section>
      <article data-unique="true" className="mx-auto max-w-3xl px-4 py-12">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="mb-4 leading-7">
            {paragraph}
          </p>
        ))}
        <h2 className="mt-10 text-3xl text-navy">Questions about {page.label.toLowerCase()}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {page.faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
        <h2 className="mt-8 text-3xl text-navy">{page.label} in a few communities</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((town) => (
            <li key={town.slug}>
              <Link href={townServicePath(town, page.slug)} className="block border border-line bg-white p-4 hover:border-orange">
                {page.label} in {town.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
