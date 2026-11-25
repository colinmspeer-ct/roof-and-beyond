import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EstimateForm } from "@/components/estimate-form";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand, socialImage } from "@/content/brand";
import { breadcrumbNode, faqNode } from "@/lib/schema";

const description = `Contact ${brand.dba} for a written estimate on roofing, roof repair, siding, windows, gutters, or gutter guards. Call ${brand.phoneDisplay}.`;

export const metadata: Metadata = {
  title: "Contact and free estimate",
  description,
  openGraph: {
    title: "Contact and free estimate",
    description,
    siteName: brand.dba,
    url: `${brand.url}/contact/`,
    images: [socialImage],
  },
  alternates: { canonical: "/contact/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
];

const faqs = [
  {
    q: "Does this form send my message?",
    a: "Yes. The form on this page is the Roofing Services Registration form. Submitting it sends the inquiry to the company. You may also call (717) 804-0990.",
  },
  {
    q: "What should I include?",
    a: "The street address, the trade, and what you are seeing. A written scope comes after someone looks at the house.",
  },
];

export default function ContactPage() {
  return (
    <>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2">
        <JsonLd data={breadcrumbNode(crumbs)} />
        <JsonLd data={faqNode(faqs)} />
        <div>
          <Breadcrumbs items={crumbs} />
          <article data-unique="true" className="mt-6">
            <h1 className="text-5xl text-navy">Contact {brand.dba}</h1>
            <p className="mt-4 leading-7">
              Send the address, the trade you think you need, and a short note
              about the exterior. Someone looks at the house and writes a
              scope. Work is not scheduled from this form.
            </p>
            <p className="mt-4 leading-7">
              Call{" "}
              <a className="underline" href={`tel:${brand.phoneTel}`}>
                {brand.phoneDisplay}
              </a>
              . Email {brand.email}. Hours {brand.hours}. {brand.locality}.
            </p>
            <h2 className="mt-8 text-3xl text-navy">Before you write</h2>
            <FaqList faqs={faqs} />
          </article>
        </div>
        <div id="estimate" className="border border-line bg-white p-5">
          <h2 className="mb-4 text-3xl text-navy">Free estimate</h2>
          <EstimateForm idPrefix="contact-estimate" />
        </div>
      </main>
      <PageCta
        heading="Prefer to talk it through?"
        body={`Call ${brand.phoneDisplay} or send the form. Both reach the same estimate desk.`}
      />
    </>
  );
}
