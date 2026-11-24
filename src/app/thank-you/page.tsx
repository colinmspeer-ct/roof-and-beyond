import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Estimate request received",
  description: `Your estimate request was sent to ${brand.dba}. Call ${brand.phoneDisplay} if you would rather talk now.`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Thank you", path: "/thank-you/" },
];

export default function ThankYouPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 text-5xl text-navy">We have the request</h1>
      <p className="mt-4 leading-7">
        {brand.dba} received your estimate form. If you would rather talk now,
        call{" "}
        <a className="font-semibold text-navy underline" href={`tel:${brand.phoneTel}`}>
          {brand.phoneDisplay}
        </a>
        .
      </p>
      <Link href="/" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-navy">
        Back to the home page
      </Link>
    </main>
  );
}
