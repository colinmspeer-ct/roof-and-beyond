import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 leading-7">{brand.dbaLine}</p>
      <article data-unique="true" className="mt-4 space-y-4 leading-7">
        <h1 className="text-5xl text-navy">Terms</h1>
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
        <h2 className="pt-4 text-3xl text-navy">Messages</h2>
        <p>
          Text messages are sent only if you check the optional box on the
          estimate form. The wording of that box is the consent. Leaving it
          empty does not block a request for an estimate.
        </p>
        <p>
          Submitting the estimate form emails the office. It does not by itself
          create a contract to do the work.
        </p>
        <p>
          Questions about these terms go to {brand.email} or {brand.phoneDisplay}.
          The published location is {brand.locality}. Pennsylvania law applies
          to the use of this website.
        </p>
      </article>
    </main>
    <PageCta />
    </>
  );
}
