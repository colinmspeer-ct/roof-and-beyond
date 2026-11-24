import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { counties, countyPath, townsInCounty } from "@/lib/areas";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Communities in Lancaster, Chester, Delaware, and York counties",
  description:
    "Roof & Beyond Home Solutions lists the communities it covers in Lancaster, Chester, Delaware, and York counties. Town names are on each county page.",
  alternates: { canonical: "/where-we-work/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Where we work", path: "/where-we-work/" },
];

export default function WhereWeWorkPage() {
  return (
    <>
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <article data-unique="true" className="mt-6 max-w-3xl">
        <h1 className="text-5xl text-navy">Communities, not a vague service area</h1>
        <p className="mt-4 leading-7">
          The map is four Pennsylvania counties. Lancaster, Chester, and
          Delaware match a specific town list. York County adds the city, the
          townships around it, and the boroughs homeowners actually name.
          Garnet Valley is included as a community name, not as a borough that
          does not exist.
        </p>
        <p className="mt-4 leading-7">
          Open a county to read the community names. This launch lists those
          towns in plain text. Separate town pages stay in the project and
          turn back on when includeTownPages is true.
        </p>
      </article>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {counties.map((county) => {
          const places = townsInCounty(county.slug);
          return (
            <section key={county.slug} className="border border-line bg-white p-5">
              <h2 className="text-3xl text-navy">
                <Link href={countyPath(county.slug)} className="hover:text-orange">
                  {county.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted">{places.length} communities</p>
              <p className="mt-4 text-sm leading-6 text-ink">
                {places.map((town) => `${town.name} (${town.kind})`).join("; ")}.
              </p>
            </section>
          );
        })}
      </div>
    </main>
    <PageCta />
    </>
  );
}
