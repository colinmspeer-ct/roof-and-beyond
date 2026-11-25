import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notes for ${brand.dba}, including the estimate form and optional text messages.`,
  alternates: { canonical: "/privacy/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy/" },
];

export default function PrivacyPage() {
  return (
    <>
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 leading-7">{brand.dbaLine}</p>
      <article data-unique="true" className="mt-4 space-y-4 leading-7">
        <h1 className="text-5xl text-navy">Privacy</h1>
        <p>
          This page describes how {brand.dba} handles the details you send
          from {brand.domain}.
        </p>
        <p>
          The estimate form is the embedded Roofing Services Registration form.
          It collects the contact and property details printed on that form.
          {brand.dba} uses the submission to answer the inquiry. A text-message
          choice, if the form shows one, is optional.
        </p>
        <p>
          The company does not sell personal information. It uses estimate
          details to look at a house and reply. Access is limited to people
          who schedule or perform that work.
        </p>
        <h2 className="pt-4 text-3xl text-navy">Mobile information</h2>
        <p>
          No mobile information will be shared with third parties or affiliates
          for marketing or promotional purposes. All the above categories exclude
          text messaging originator opt-in data and consent; this information
          will not be shared with any third parties.
        </p>
        <h2 className="pt-4 text-3xl text-navy">Text messages</h2>
        <p>
          The optional checkbox says: By checking this box, you agree to receive
          text messages from Roof & Beyond Home Solutions about your inquiry.
          Message and data rates may apply. Message frequency varies. Reply STOP
          to opt out, HELP for help. Consent is not a condition of purchase.
          Leaving the box unchecked does not block an estimate.
        </p>
        <p>
          For a privacy question, email {brand.email} or call {brand.phoneDisplay}.
          Media, PA is the published city. No street address is listed.
        </p>
      </article>
    </main>
    <PageCta />
    </>
  );
}
