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
          The estimate form asks for a name, phone number, email address,
          property address, the exterior service you are asking about, a
          message, and an optional text-message consent box. The form sends
          that information by email to {brand.email}. A scheduling embed can
          replace the form later.
        </p>
        <p>
          The company does not sell personal information. It uses estimate
          details to look at a house and reply. Access is limited to people
          who schedule or perform that work.
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
          Questions about this page go to {brand.email} or {brand.phoneDisplay}.
          The published location is {brand.locality}. No street address is
          listed.
        </p>
      </article>
    </main>
    <PageCta />
    </>
  );
}
