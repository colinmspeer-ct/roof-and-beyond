import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { serviceOrder, type ServiceSlug } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { serviceBlurb, servicePhoto } from "@/content/media";
import { Picture } from "@/components/picture";
import { counties, countyPath, townsInCounty } from "@/lib/areas";

export function ServiceCards({
  hrefFor = (slug) => `/exterior/${slug}/`,
  blurbFor = (slug) => serviceBlurb[slug],
  exclude,
  linkLabel = "Explore",
}: {
  hrefFor?: (slug: ServiceSlug) => string;
  blurbFor?: (slug: ServiceSlug) => string;
  exclude?: ServiceSlug;
  linkLabel?: string;
}) {
  const list = serviceOrder.filter((slug) => slug !== exclude);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((slug) => {
        const page = servicePages[slug];
        return (
          <li key={slug}>
            <Link
              href={hrefFor(slug)}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                <Picture
                  photo={servicePhoto[slug]}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0"
                  imgClassName={`transition duration-500 group-hover:scale-105 ${slug === "gutter-guards" ? "object-[30%_80%]" : ""}`}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl text-navy">{page.label}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{blurbFor(slug)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-bold text-rust">
                  {linkLabel} {page.label.toLowerCase()}
                  <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export const estimateSteps = [
  { title: "Tell us the address", body: "Name the service and what you are seeing: a stain, a drip, a soft sill, or a gutter that overflows." },
  { title: "We look at the exterior", body: "The visit covers the slope, the walls, the openings, and where water leaves the roof." },
  { title: "You get it in writing", body: "The estimate lists what is included and what is left alone." },
  { title: "Work follows that scope", body: "Nothing is scheduled until you approve the paper." },
];

export function Steps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {estimateSteps.map((step, index) => (
        <li key={step.title} className="relative rounded-2xl border border-line bg-white p-6 shadow-card">
          <span className="grid size-12 place-items-center rounded-xl bg-navy text-lg font-extrabold text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-xl text-navy">{step.title}</h3>
          <p className="mt-2 text-[15px] leading-6 text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

const countyTagline: Record<string, string> = {
  lancaster: "Brick city rows, river boroughs, and long farmhouse roofs out in the valleys.",
  chester: "Borough twins, Main Line slate, and newer colonials on suburban lots.",
  delaware: "The western slice of the county around the Media county seat.",
  york: "The city, its ring of townships, and the boroughs out toward the river.",
};

export function CountyCards({ current }: { current?: string }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {counties
        .filter((county) => county.slug !== current)
        .map((county) => {
          const places = townsInCounty(county.slug);
          return (
            <li key={county.slug}>
              <Link
                href={countyPath(county.slug)}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lift"
              >
                <span className="flex items-center justify-between">
                  <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-sand text-rust">
                    <MapPin className="size-5" />
                  </span>
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-navy">
                    {places.length} towns
                  </span>
                </span>
                <h3 className="mt-5 text-xl text-navy">{county.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{countyTagline[county.key]}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-bold text-rust">
                  See {county.name.replace(" County", "")} towns
                  <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

/** Quotable fact block high on the page (rulebook AEO: short answer block). */
export function AnswerBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-l-4 border-orange bg-sand p-5 text-[17px] leading-8 text-ink sm:p-6">
      {children}
    </div>
  );
}

export function PillLinks({ links }: { links: { href: string; label: string; note?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-navy hover:border-navy"
          >
            {item.label}
            {item.note ? <span className="ml-1.5 text-xs font-medium text-muted">{item.note}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
