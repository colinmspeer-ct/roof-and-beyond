import Link from "next/link";
import { PlainHero } from "@/components/plain-hero";
import { SectionHeading } from "@/components/section-heading";
import { CountyCards, ServiceCards } from "@/components/sections";

export default function NotFound() {
  return (
    <main>
      <PlainHero
        eyebrow="404"
        title="That page is not on this site"
        sub="The address does not match a service, a county, or a community Roof & Beyond Home Solutions has published."
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-13 items-center justify-center rounded-lg bg-orange px-6 font-bold text-navy hover:bg-orange-dark"
          >
            Back to the home page
          </Link>
          <Link
            href="/sitemap/"
            className="inline-flex h-13 items-center justify-center rounded-lg border-2 border-white px-6 font-bold text-white hover:bg-white hover:text-navy"
          >
            Browse the sitemap
          </Link>
        </div>
      </PlainHero>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Services" title="Exterior services" />
        <div className="mt-10">
          <ServiceCards />
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading eyebrow="Where we work" title="Counties we serve" />
          <div className="mt-8">
            <CountyCards />
          </div>
        </div>
      </section>
    </main>
  );
}
