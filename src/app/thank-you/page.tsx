import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Phone } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PlainHero } from "@/components/plain-hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCards } from "@/components/sections";
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
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <PlainHero crumbs={crumbs}>
        <div className="mt-6 flex items-start gap-4">
          <CircleCheck aria-hidden="true" className="mt-1 size-10 shrink-0 text-orange" />
          <div>
            <h1 className="text-4xl leading-[1.1] sm:text-5xl">We have the request</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
              {brand.dba} received your estimate form. If you would rather talk now,
              call{" "}
              <a className="font-bold text-white underline decoration-orange decoration-2 underline-offset-4" href={`tel:${brand.phoneTel}`}>
                {brand.phoneDisplay}
              </a>
              .
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${brand.phoneTel}`}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-orange px-6 font-bold text-navy hover:bg-orange-dark"
              >
                <Phone aria-hidden="true" className="size-4" />
                Call {brand.phoneDisplay}
              </a>
              <Link
                href="/"
                className="inline-flex h-13 items-center justify-center rounded-lg border-2 border-white px-6 font-bold text-white hover:bg-white hover:text-navy"
              >
                Back to the home page
              </Link>
            </div>
          </div>
        </div>
      </PlainHero>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="While you wait" title="Read about the work on your list" />
        <div className="mt-10">
          <ServiceCards />
        </div>
      </section>
    </main>
  );
}
