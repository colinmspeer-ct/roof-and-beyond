import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Roofing, roof repair, siding, windows, gutters, and gutter guards",
  description:
    "Six exterior services from Roof & Beyond Home Solutions: full roofing, roof repair, siding, windows, gutters, and gutter guards.",
  alternates: { canonical: "/exterior/" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Exterior", path: "/exterior/" },
];

export default function ExteriorIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbNode(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <article data-unique="true" className="prose-measure mt-6 max-w-3xl">
        <h1 className="text-5xl text-navy">The six exterior trades</h1>
        <p className="mt-4 leading-7">
          Roof & Beyond Home Solutions keeps roofing, roof repair, siding,
          windows, gutters, and gutter guards on separate pages so a leak
          repair is not described as a new roof, and a gutter cover is not
          slipped into a trough replacement.
        </p>
        <p className="mt-4 leading-7">
          Each service page explains the scope in general. Community pages then
          apply that trade to the houses in that place: a Lancaster row, a
          Chester farmhouse, a Radnor slate slope, a York split-level.
        </p>
        <p className="mt-4 leading-7">
          Open the county lists to reach a single municipality. Townships and
          boroughs that share a familiar name, such as Manheim and Manchester,
          are separate links on purpose.
        </p>
      </article>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {serviceOrder.map((slug) => (
          <li key={slug}>
            <Link href={`/exterior/${slug}/`} className="block border border-line bg-white p-5 hover:border-orange">
              <h2 className="text-3xl text-navy">{servicePages[slug].label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{servicePages[slug].lede}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
