import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import {
  getCounty,
  getTown,
  neighborTowns,
  townPath,
  townServicePath,
  towns,
} from "@/lib/areas";
import { includeTownPages } from "@/content/launch";
import { breadcrumbNode } from "@/lib/schema";

export function generateStaticParams() {
  if (!includeTownPages) return [];
  return towns.map((town) => ({
    county: town.countySlug,
    town: town.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string; town: string }>;
}): Promise<Metadata> {
  const { county, town: townSlug } = await params;
  const town = getTown(townSlug);
  if (!town || town.countySlug !== county) return {};
  return {
    title: town.metaTitle,
    description: town.metaDescription,
    alternates: { canonical: townPath(town) },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ county: string; town: string }>;
}) {
  const { county, town: townSlug } = await params;
  const town = getTown(townSlug);
  const countyRecord = getCounty(county);
  if (!town || !countyRecord || town.countySlug !== county) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/where-we-work/" },
    { name: town.countyName, path: `/where-we-work/${town.countySlug}/` },
    { name: town.name, path: townPath(town) },
  ];
  const nearby = neighborTowns(town);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-orange">
        {town.countyName} · {town.kind}
        {town.zips.length ? ` · ${town.zips.join(", ")}` : ""}
      </p>
      <article data-unique="true" className="mt-3 max-w-3xl">
        <h1 className="text-5xl leading-[0.95] text-navy">{town.h1}</h1>
        {town.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 60)} className="mt-4 leading-7">
            {paragraph}
          </p>
        ))}
      </article>
      <h2 className="mt-10 text-3xl text-navy">Services on houses in {town.name}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOrder.map((service) => (
          <li key={service}>
            <Link
              href={townServicePath(town, service)}
              className="block h-full border border-line bg-white p-4 hover:border-orange"
            >
              <span className="text-xl text-navy">{servicePages[service].label}</span>
              <span className="mt-2 block text-sm leading-6 text-muted">
                {town.services[service].metaDescription}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {nearby.length ? (
        <>
          <h2 className="mt-10 text-3xl text-navy">Nearby communities</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {nearby.map((item) => (
              <li key={item.slug}>
                <Link href={townPath(item)} className="border border-line bg-white px-3 py-2 text-sm hover:border-orange">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="mt-10">
        <Button asChild>
          <Link href="/contact/">Get a free estimate in {town.name}</Link>
        </Button>
      </div>
    </main>
  );
}
