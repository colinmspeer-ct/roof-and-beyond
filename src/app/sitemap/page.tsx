import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PlainHero } from "@/components/plain-hero";
import { serviceOrder } from "@/content/brand";
import { includeTownPages } from "@/content/launch";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath, townPath, townServicePath, townsInCounty } from "@/lib/areas";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sitemap: every service, county, and town page",
  description:
    "HTML sitemap for Roof & Beyond Home Solutions: all exterior services, the four counties, and every community page with its roofing, siding, window, and gutter pages.",
  alternates: { canonical: "/sitemap/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Sitemap", path: "/sitemap/" },
];

const company = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact & free estimate" },
  { href: "/exterior/", label: "All exterior services" },
  { href: "/where-we-work/", label: "All communities" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
];

const listLink = "inline-flex min-h-10 items-center font-semibold text-navy underline-offset-4 hover:text-rust hover:underline";

export default function SitemapPage() {
  return (
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <PlainHero
        crumbs={crumbs}
        eyebrow="Sitemap"
        title="Every page on roofnbeyond.com"
        sub={
          <>
            Services, counties, and each community page. Machines can use the{" "}
            <a href="/sitemap.xml" className="font-bold text-white underline decoration-orange underline-offset-4">
              XML sitemap
            </a>
            .
          </>
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-xl text-navy">Company</h2>
            <ul className="mt-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={listLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-xl text-navy">Services</h2>
            <ul className="mt-3">
              {serviceOrder.map((slug) => (
                <li key={slug}>
                  <Link href={`/exterior/${slug}/`} className={listLink}>
                    {servicePages[slug].label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-xl text-navy">Counties</h2>
            <ul className="mt-3">
              {counties.map((county) => (
                <li key={county.slug}>
                  <Link href={countyPath(county.slug)} className={listLink}>
                    {county.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {includeTownPages
          ? counties.map((county) => {
              const places = townsInCounty(county.slug);
              return (
                <section key={county.slug} className="mt-14">
                  <h2 className="text-2xl text-navy sm:text-3xl">
                    <Link href={countyPath(county.slug)} className="hover:text-rust">
                      {county.name}
                    </Link>{" "}
                    <span className="text-base font-semibold text-muted">({places.length} towns)</span>
                  </h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {places.map((town) => (
                      <li key={town.slug} className="rounded-xl border border-line bg-white p-4">
                        <h3 className="text-lg text-navy">
                          <Link href={townPath(town)} className="hover:text-rust">
                            {town.name}
                          </Link>
                        </h3>
                        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                          {serviceOrder.map((slug) => (
                            <li key={slug}>
                              <Link
                                href={townServicePath(town, slug)}
                                className="inline-flex min-h-8 items-center text-muted underline-offset-4 hover:text-rust hover:underline"
                              >
                                {servicePages[slug].label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          : null}
      </div>
    </main>
  );
}
