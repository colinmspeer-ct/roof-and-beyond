import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EstimateCard } from "@/components/estimate-card";
import { PlainHero } from "@/components/plain-hero";
import { Steps } from "@/components/sections";
import { SectionHeading } from "@/components/section-heading";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageCta } from "@/components/page-cta";
import { brand, socialImage } from "@/content/brand";
import { breadcrumbNode, faqNode } from "@/lib/schema";

const description = `Contact ${brand.dba} for a written estimate on roofing, roof repair, siding, windows, gutters, or gutter guards. Call ${brand.phoneDisplay}.`;

export const metadata: Metadata = {
  title: "Contact & Free Roofing Estimate",
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
    <main>
      <JsonLd data={breadcrumbNode(crumbs)} />
      <JsonLd data={faqNode(faqs)} />
      <PlainHero
        crumbs={crumbs}
        eyebrow="Free written estimates"
        title={`Contact ${brand.dba}`}
        sub={`Call ${brand.phoneDisplay} or send the form. Roofing, roof repair, siding, windows, gutters, and gutter guards for houses.`}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-16">
        <div className="min-w-0">
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <a href={`tel:${brand.phoneTel}`} className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-card hover:border-navy/40">
                <Phone aria-hidden="true" className="mt-0.5 size-5 text-rust" />
                <span>
                  <span className="block text-sm text-muted">Call</span>
                  <span className="block text-lg font-bold text-navy">{brand.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-card hover:border-navy/40">
                <Mail aria-hidden="true" className="mt-0.5 size-5 text-rust" />
                <span className="min-w-0">
                  <span className="block text-sm text-muted">Email</span>
                  <span className="block break-words font-bold text-navy">{brand.email}</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-card">
              <Clock aria-hidden="true" className="mt-0.5 size-5 text-rust" />
              <span>
                <span className="block text-sm text-muted">Hours</span>
                <span className="block font-bold text-navy">{brand.hours}</span>
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-card">
              <MapPin aria-hidden="true" className="mt-0.5 size-5 text-rust" />
              <span>
                <span className="block text-sm text-muted">Based in</span>
                <span className="block font-bold text-navy">{brand.locality}</span>
              </span>
            </li>
          </ul>
          <article data-unique="true" className="prose-rb mt-10 [&_a]:font-semibold [&_a]:text-navy">
            <p>
              Send the address, the trade you think you need, and a short note
              about the exterior. Someone looks at the house and writes a
              scope. Work is not scheduled from this form.
            </p>
            <p>
              Call{" "}
              <a className="underline" href={`tel:${brand.phoneTel}`}>
                {brand.phoneDisplay}
              </a>
              . Email {brand.email}. Hours {brand.hours}. {brand.locality}.
            </p>
            <h2>Before you write</h2>
            <FaqList faqs={faqs} openFirst />
          </article>
        </div>
        <div id="estimate" className="scroll-mt-24">
          <EstimateCard idPrefix="contact-estimate" title="Request your free estimate" eager />
        </div>
      </div>
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading align="center" eyebrow="What happens next" title="After you send the form" />
          <div className="mt-10">
            <Steps />
          </div>
        </div>
      </section>
      <PageCta
        heading="Prefer to talk it through?"
        body={`Call ${brand.phoneDisplay} or send the form. Both reach the same estimate desk.`}
        estimateHref="#estimate"
      />
    </main>
  );
}
