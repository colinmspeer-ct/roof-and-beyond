import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { brand, placeholders } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for using the ${brand.dba} preview website, including estimate and SMS placeholders.`,
  alternates: { canonical: "/terms/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms/" },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <article data-unique="true" className="mt-6 space-y-4 leading-7">
        <h1 className="text-5xl text-navy">Terms</h1>
        <p>
          These terms govern use of this preview website for {brand.legalName},
          doing business as {brand.dba}. They are a draft. A lawyer should
          revise them before anyone relies on them at {brand.domain}.
        </p>
        <p>
          Pages describe roofing, roof repair, siding, windows, gutters, and
          gutter guards in the listed Pennsylvania communities. They are
          information, not an offer to do a specific job. An estimate becomes
          a scope only when it is in writing and you approve it. Browsing the
          site does not schedule work.
        </p>
        <p>
          Warranty language is {placeholders.warranty}. Manufacturer names are{" "}
          {placeholders.manufacturers}. The Pennsylvania registration placeholder
          is {placeholders.hic}. None of those brackets is a promise.
        </p>
        <h2 className="pt-4 text-3xl text-navy">Messages</h2>
        <p>
          If you later opt in to texts, the consent sentence must be the
          approved placeholder replacement: {placeholders.sms}. Until that
          sentence exists, this preview does not enroll anyone in SMS.
        </p>
        <p>
          The estimate form action is {placeholders.formAction}. Submitting the
          preview form does not create a contract and does not send the
          contents to the company.
        </p>
        <p>
          Disputes about the published site, once it is actually launched, are
          intended to be handled under Pennsylvania law. That sentence is part
          of the draft, not a completed forum clause. Reach{" "}
          {placeholders.email} or {placeholders.phone} at {placeholders.address}.
        </p>
      </article>
    </main>
  );
}
