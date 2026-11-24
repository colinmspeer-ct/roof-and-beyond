import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { countyCopy } from "@/content/county-pages";
import { serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, getCounty, townsInCounty } from "@/lib/areas";
import { breadcrumbNode } from "@/lib/schema";

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
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: `/where-we-work/${county.slug}/` },
  };
}

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
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: county.name, path: `/where-we-work/${county.slug}/` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <article data-unique="true" className="mt-6 max-w-3xl">
        <h1 className="text-5xl text-navy">{copy.h1}</h1>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="mt-4 leading-7">
            {paragraph}
          </p>
        ))}
      </article>
      <h2 className="mt-10 text-3xl text-navy">Services in {county.name}</h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {serviceOrder.map((service) => (
          <li key={service}>
            <Link href={`/exterior/${service}/`} className="border border-line bg-white px-3 py-2 text-sm hover:border-orange">
              {servicePages[service].label}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-3xl text-navy">Communities</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((town) => (
          <li key={town.slug}>
            <Link
              href={`/where-we-work/${county.slug}/${town.slug}/`}
              className="block border border-line bg-white p-4 hover:border-orange"
            >
              <span className="text-lg text-navy">{town.name}</span>
              <span className="mt-1 block text-sm text-muted">{town.kind}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
