import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { HeroActions, PageHero } from "@/components/page-hero";
import { TrustSignals } from "@/components/trust-signals";
import { brand } from "@/content/brand";
import { photos } from "@/content/media";
import { counties, countyPath, townPath, townsInCounty } from "@/lib/areas";
import { includeTownPages } from "@/content/launch";
import { breadcrumbNode } from "@/lib/schema";
import { shortKind } from "@/components/town-bits";

export const metadata: Metadata = {
  title: "Roofers Serving Lancaster, Chester, Delaware & York Counties | Service Area",
  description:
    "Roof & Beyond Home Solutions lists the communities it covers in Lancaster, Chester, Delaware, and York counties. Town names are on each county page.",
  alternates: { canonical: "/where-we-work/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Where we work", path: "/where-we-work/" },
];

export default function WhereWeWorkPage() {
  const total = counties.reduce((sum, county) => sum + townsInCounty(county.slug).length, 0);
  return (
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <PageHero
        photo={photos.rowHouses}
        crumbs={crumbs}
        compact
        eyebrow={`${total} communities · 4 counties`}
        title={
          <>
            Where we work: <span className="text-orange">Lancaster, Chester, Delaware &amp; York counties</span>
          </>
        }
        sub="Find your county, then your town. Every town page links roofing, roof repair, siding, windows, gutters, and gutter guards for houses there."
        actions={<HeroActions estimateHref="/contact/#estimate" phoneDisplay={brand.phoneDisplay} phoneTel={brand.phoneTel} />}
      />
      <TrustSignals />
      <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <article data-unique="true" className="prose-rb max-w-3xl">
          <h2>Communities, not a vague service area</h2>
          <p>
            The map is four Pennsylvania counties. Lancaster, Chester, and
            Delaware match a specific town list. York County adds the city, the
            townships around it, and the boroughs homeowners actually name.
            Garnet Valley is included as a community name, not as a borough that
            does not exist.
          </p>
          <p>
            Open a county, then a town. Each town page links roofing, roof repair,
            siding, windows, gutters, and gutter guards for houses in that place.
            The figures on a town page are tied to that place: Census housing
            years, NOAA storm rows, and any National Register district that matched.
          </p>
        </article>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {counties.map((county) => {
            const places = townsInCounty(county.slug);
            return (
              <section key={county.slug} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl text-navy">
                    <Link href={countyPath(county.slug)} className="hover:text-rust">
                      {county.name}
                    </Link>
                  </h2>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs font-bold text-rust">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {places.length} towns
                  </span>
                </div>
                {includeTownPages ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {places.map((town) => (
                      <li key={town.slug}>
                        <Link
                          href={townPath(town)}
                          className="inline-flex min-h-11 items-center rounded-full border border-line px-3.5 text-sm font-semibold text-navy hover:border-navy"
                        >
                          {town.name}
                          <span className="ml-1.5 text-xs font-medium text-muted">{shortKind(town.kind)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-ink">
                    {places.map((town) => `${town.name} (${town.kind})`).join("; ")}.
                  </p>
                )}
                <Link
                  href={countyPath(county.slug)}
                  className="mt-5 inline-flex font-bold text-rust underline-offset-4 hover:underline"
                >
                  {county.name} overview →
                </Link>
              </section>
            );
          })}
        </div>
      </section>
      <PageCta />
    </main>
  );
}
