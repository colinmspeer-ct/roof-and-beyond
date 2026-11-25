import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { counties, countyPath, townPath, townsInCounty } from "@/lib/areas";
import { includeTownPages } from "@/content/launch";
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
          Open a county, then a town. Each town page links roofing, roof repair,
          siding, windows, gutters, and gutter guards for houses in that place.
          The figures on a town page are tied to that place: Census housing
          years, NOAA storm rows, and any National Register district that matched.
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
              {includeTownPages ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {places.map((town) => (
                    <li key={town.slug}>
                      <Link href={townPath(town)} className="inline-flex min-h-12 items-center border border-line px-3 py-2 text-sm hover:border-orange">
                        {town.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-ink">
                  {places.map((town) => `${town.name} (${town.kind})`).join("; ")}.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
    <PageCta />
    </>
  );
}
