import { Breadcrumbs } from "@/components/breadcrumbs";

/** Compact navy band for utility pages (contact, legal, sitemap, 404). */
export function PlainHero({
  crumbs,
  eyebrow,
  title,
  sub,
  children,
}: {
  crumbs?: { name: string; path: string }[];
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-orange/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {crumbs ? <Breadcrumbs items={crumbs} tone="light" /> : null}
        {eyebrow ? (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[13px] font-semibold">
            <span aria-hidden="true" className="size-2 rounded-full bg-orange" />
            {eyebrow}
          </p>
        ) : null}
        {title ? <h1 className="mt-4 max-w-4xl text-4xl leading-[1.1] sm:text-5xl">{title}</h1> : null}
        {sub ? <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">{sub}</p> : null}
        {children}
      </div>
    </section>
  );
}
