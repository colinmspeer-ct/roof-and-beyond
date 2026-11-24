import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { Button } from "@/components/ui/button";
import { brand, placeholders } from "@/content/brand";
import { breadcrumbNode, companyGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: `About ${brand.dba}`,
  description: `${brand.dba} estimates roofing, roof repair, siding, windows, gutters, and gutter guards in four Pennsylvania counties.`,
  openGraph: {
    title: `About ${brand.dba}`,
    description: `${brand.dba} estimates roofing, roof repair, siding, windows, gutters, and gutter guards in four Pennsylvania counties.`,
    siteName: brand.dba,
  },
  alternates: { canonical: "/about/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];

export default function AboutPage() {
  return (
    <>
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <JsonLd data={companyGraph()} />
      <Breadcrumbs items={crumbs} />
      <article data-unique="true" className="mt-6">
        <h1 className="text-5xl text-navy">The company behind the name</h1>
        <p className="mt-4 leading-7">
          {brand.dba} is the name on the work. The logo artwork still reads
          “Roof and Beyond,” without the ampersand. That file stays as approved
          until a revised mark is supplied. The words on this website use the
          ampersand.
        </p>
        <p className="mt-4 leading-7">
          The work is exterior only: roofing, roof repair, siding, windows,
          gutters, and gutter guards. Service is limited to the communities
          listed under Lancaster, Chester, Delaware, and York counties.
        </p>
        <p className="mt-4 leading-7">
          Several facts are intentionally unpublished. The phone is{" "}
          {placeholders.phone}. Email is {placeholders.email}. The street
          address is {placeholders.address}. Hours are {placeholders.hours}.
          The Pennsylvania home-improvement registration is {placeholders.hic}.
          Featured manufacturers are {placeholders.manufacturers}. Warranty
          terms are {placeholders.warranty}. Brackets mean the owner still has
          to fill the fact. They are not claims.
        </p>
        <p className="mt-4 leading-7">
          This website does not show star ratings, review counts, years in
          business, awards, or project totals. Those numbers are not in hand.
          A storm visit can document what the exterior looks like. It cannot
          promise an insurance payment.
        </p>
        <p className="mt-4 leading-7">
          This build is a preview. It has not been deployed, and DNS for{" "}
          {brand.domain} has not been changed.
        </p>
      </article>
      <Button asChild className="mt-8">
        <Link href="/contact/">Request an estimate</Link>
      </Button>
    </main>
    <PageCta />
    </>
  );
}
