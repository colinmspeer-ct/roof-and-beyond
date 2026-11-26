import type { Metadata } from "next";
import { PlainHero } from "@/components/plain-hero";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for using the ${brand.dba} website, including the estimate form and optional text messages.`,
  alternates: { canonical: "/terms/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms/" },
];

export default function TermsPage() {
  return (
    <>
    <PlainHero crumbs={crumbs} eyebrow="Legal" />
    <main className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <p className="text-sm leading-6 text-muted">{brand.dbaLine}</p>
      <article data-unique="true" className="prose-rb mt-6 space-y-4 [&_a]:font-semibold [&_a]:text-navy [&_a]:underline">
        <h1 className="!mt-0 text-4xl text-navy sm:text-5xl">Terms</h1>
        <p>
          These terms govern use of the {brand.dba} website at {brand.domain}.
        </p>
        <p>
          Pages describe roofing, roof repair, siding, windows, gutters, and
          gutter guards in the listed Pennsylvania communities. They are
          information, not an offer to do a specific job. An estimate becomes
          a scope only when it is in writing and you approve it. Browsing the
          site does not schedule work.
        </p>
        <p>
          {brand.registration}, under {brand.legalName}. This site does not
          publish manufacturer lists or warranty terms.
        </p>
        <h2 className="pt-4">SMS Terms</h2>
        <p>
          Program name: Roof & Beyond Home Solutions Customer Texts.
        </p>
        <p>
          Texts are not sent unless you opt in on the estimate form. If you
          check a box, the office may text you about that inquiry or estimate,
          and, if you also choose marketing messages, occasional offers. How
          often those texts arrive will vary. Your wireless carrier may charge
          for messages and data. Text STOP if you want the messages to stop.
          Text HELP if you need help with the program. You can still request
          an estimate, and you can still buy work, if you leave the boxes
          empty. Agreeing to texts is optional and is not required to purchase
          anything.
        </p>
        <p>
          Wireless carriers are not responsible if a message is late or never
          arrives. The Privacy page explains how mobile numbers and opt-in
          records are used.
        </p>
        <p>
          Sending the form does not create a contract. Work starts only after a
          written scope is approved.
        </p>
        <p>
          Term questions reach {brand.email} and {brand.phoneDisplay}. Pennsylvania
          law applies to use of this website.
        </p>
      </article>
    </main>
    <PageCta />
    </>
  );
}
