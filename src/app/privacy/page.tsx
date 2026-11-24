import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand, placeholders } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notes for the ${brand.dba} preview site, including an SMS consent placeholder for counsel to replace.`,
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
      <p className="mt-6 leading-7">{brand.dbaLine}.</p>
      <article data-unique="true" className="mt-4 space-y-4 leading-7">
        <h1 className="text-5xl text-navy">Privacy</h1>
        <p>
          This privacy draft is for the {brand.dba} preview. Counsel should
          replace it before anyone treats {brand.domain} as the live site.
        </p>
        <p>
          The estimate form asks for a name, phone number, email address,
          property address, the exterior service you are asking about, and a
          message. In this preview the form does not transmit those fields.
          Its action is the placeholder {placeholders.formAction}. When a
          HighLevel form replaces it, the fields will go to that system under
          whatever terms HighLevel and the owner agree.
        </p>
        <p>
          The company does not sell personal information. It uses estimate
          details to look at a house and reply. Access is limited to people
          who schedule or perform that work.
        </p>
        <h2 className="pt-4 text-3xl text-navy">Text messages</h2>
        <p>
          SMS consent language is not approved yet. The placeholder, which must
          be replaced with the exact sentence counsel signs off on, is:{" "}
          {placeholders.sms}. Do not treat this paragraph as consent language.
          Frequency, message-and-data-rate language, and the opt-out instruction
          belong in that replacement sentence, not in a guess on this page.
        </p>
        <p>
          Questions about this draft go to {placeholders.email} or{" "}
          {placeholders.phone}. The business address on file is{" "}
          {placeholders.address}.
        </p>
      </article>
    </main>
    <PageCta />
    </>
  );
}
