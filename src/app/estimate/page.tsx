import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EstimateForm } from "@/components/estimate-form";
import { JsonLd } from "@/components/json-ld";
import { brand, placeholders } from "@/content/brand";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Request a free exterior estimate",
  description:
    "Ask Roof & Beyond Home Solutions for a written estimate on roofing, roof repair, siding, windows, gutters, or gutter guards. The form is a HighLevel placeholder in this preview.",
  alternates: { canonical: "/estimate/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Free estimate", path: "/estimate/" },
];

export default function EstimatePage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <div>
        <Breadcrumbs items={crumbs} />
        <article data-unique="true" className="mt-6">
          <h1 className="text-5xl text-navy">Tell us about the house</h1>
          <p className="mt-4 leading-7">
            {brand.dba} will want the address, the trade you think you need,
            and a short description of what you are seeing. Someone then looks
            at the exterior and writes a scope. Work is not scheduled from this
            form.
          </p>
          <p className="mt-4 leading-7">
            This preview does not deliver messages. The form action is the
            placeholder {placeholders.formAction}, waiting for a HighLevel
            embed. Phone {placeholders.phone}. Email {placeholders.email}.
          </p>
          <p className="mt-4 leading-7">
            Include the street if you know which slope is leaking, which wall
            is soft, or which downspout is dumping against the foundation. A
            written scope comes after someone sees the house, not from this
            form alone.
          </p>
        </article>
      </div>
      <div className="border border-line bg-white p-5">
        <EstimateForm />
      </div>
    </main>
  );
}
