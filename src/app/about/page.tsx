import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { Button } from "@/components/ui/button";
import { brand } from "@/content/brand";
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
        <p className="mt-4 leading-7">{brand.dbaLine}</p>
        <p className="mt-4 leading-7">
          The registration is held by {brand.legalName}. {brand.registration}.
          The logo artwork still reads “Roof and Beyond,” without the ampersand.
          The words on this website use the ampersand.
        </p>
        <p className="mt-4 leading-7">
          The work is exterior only: roofing, roof repair, siding, windows,
          gutters, and gutter guards. Service covers the communities listed
          for Lancaster, Chester, Delaware, and York counties. The public
          location is {brand.locality}. Hours are {brand.hours}.
        </p>
        <p className="mt-4 leading-7">
          Call{" "}
          <a className="underline" href={`tel:${brand.phoneTel}`}>
            {brand.phoneDisplay}
          </a>{" "}
          or email{" "}
          <a className="underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
          . This site does not publish star ratings, review counts, years in
          business, or awards. A storm visit can document the exterior. It
          cannot promise an insurance payment.
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
