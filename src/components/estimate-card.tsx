import Link from "next/link";
import { Clock, FileText, Phone, ShieldCheck } from "lucide-react";
import { brand } from "@/content/brand";
import { EstimateForm } from "@/components/estimate-form";
import { cn } from "@/lib/utils";

/** Card that holds the HighLevel form. Only one per page (single iframe id). */
export function EstimateCard({
  title = "Get your free written estimate",
  intro = "Send the address and what you are seeing. Someone looks at the house and writes the scope before anything is scheduled.",
  idPrefix = "estimate-form",
  contained = false,
  eager = false,
  className,
}: {
  title?: string;
  intro?: string;
  idPrefix?: string;
  contained?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white p-5 text-ink shadow-lift sm:p-6", className)}>
      <h2 className="text-2xl leading-tight text-navy">{title}</h2>
      <p className="mt-2 text-[15px] leading-6 text-muted">{intro}</p>
      <div className="mt-4">
        <EstimateForm idPrefix={idPrefix} contained={contained} eager={eager} short />
      </div>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-line pt-3 text-sm text-muted">
        <span>Prefer to talk?</span>
        <a href={`tel:${brand.phoneTel}`} className="font-bold text-navy underline decoration-orange decoration-2 underline-offset-4">
          Call {brand.phoneDisplay}
        </a>
        <Link href="/contact/#estimate" className="underline underline-offset-4">
          Open the full form
        </Link>
      </p>
    </div>
  );
}

/** Lightweight hero card for inner pages: no iframe, jumps to the form lower on the page. */
export function QuickEstimate({
  title = "Free written estimate",
  points,
  estimateHref = "#estimate",
}: {
  title?: string;
  points?: string[];
  estimateHref?: string;
}) {
  const list = points ?? [
    "Someone looks at the house in person",
    "Scope and price in writing first",
    "Nothing scheduled until you approve",
  ];
  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-ink shadow-lift">
      <p className="text-2xl font-extrabold leading-tight tracking-tight text-navy">{title}</p>
      <ul className="mt-4 space-y-3">
        {list.map((point, index) => {
          const Icon = [FileText, ShieldCheck, Clock][index % 3];
          return (
            <li key={point} className="flex items-start gap-3 text-[15px] leading-6">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-rust" />
              {point}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 grid gap-2">
        <a
          href={estimateHref}
          className="flex h-13 items-center justify-center rounded-lg bg-orange text-base font-bold text-navy hover:bg-orange-dark"
        >
          Start my free estimate
        </a>
        <a
          href={`tel:${brand.phoneTel}`}
          className="flex h-13 items-center justify-center gap-2 rounded-lg border-2 border-navy text-base font-bold text-navy hover:bg-navy hover:text-white"
        >
          <Phone aria-hidden="true" className="size-4" />
          {brand.phoneDisplay}
        </a>
      </div>
      <p className="mt-3 text-center text-xs text-muted">{brand.hours} · PA HIC #{brand.hic}</p>
    </div>
  );
}

/** Full-width form section placed low on inner pages (lazy iframe). */
export function EstimateSection({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section id="estimate" className="scroll-mt-24 bg-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">Free estimate</p>
          <h2 className="mt-3 text-3xl leading-tight text-navy sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{body}</p>
          <ol className="mt-6 space-y-4">
            {[
              ["Send the address", "Name the service and what you are seeing."],
              ["We look at the house", "An in-person look at the exterior."],
              ["You get it in writing", "Nothing is scheduled until you approve it."],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="block font-bold text-navy">{title}</span>
                  <span className="block text-[15px] text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <a
            href={`tel:${brand.phoneTel}`}
            className="mt-8 inline-flex h-13 items-center gap-2 rounded-lg border-2 border-navy px-5 font-bold text-navy hover:bg-navy hover:text-white"
          >
            <Phone aria-hidden="true" className="size-4" />
            Or call {brand.phoneDisplay}
          </a>
        </div>
        <EstimateCard idPrefix="estimate-form" title="Request your estimate" />
      </div>
    </section>
  );
}
