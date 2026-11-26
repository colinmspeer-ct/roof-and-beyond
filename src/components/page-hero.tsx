import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckList } from "@/components/check-list";
import { Picture } from "@/components/picture";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * Full-bleed photo hero with a dark navy overlay. `aside` sits beside the copy
 * on desktop and right below the hero on mobile (see .hero-grid in globals.css).
 */
export function PageHero({
  photo,
  eyebrow,
  title,
  sub,
  actions,
  checks,
  aside,
  crumbs,
  meta,
  compact = false,
}: {
  photo: Photo;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  checks?: string[];
  aside?: React.ReactNode;
  crumbs?: { name: string; path: string }[];
  meta?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={cn("hero-grid bg-paper", !aside && "hero-solo")}>
      <div className="hero-media relative overflow-hidden bg-navy">
        <Picture
          photo={photo}
          priority
          sizes="100vw"
          className="absolute inset-0"
          imgClassName="opacity-90"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,rgb(1_20_51/0.94)_0%,rgb(2_31_77/0.86)_45%,rgb(2_31_77/0.55)_100%)]"
        />
        <span className="absolute bottom-2 left-4 rounded bg-navy-deep/85 px-2 py-1 text-xs text-white">
          Illustrative photo
        </span>
      </div>
      <div
        className={cn(
          "hero-copy relative z-10 text-white",
          compact ? "py-10 sm:py-14" : "py-12 sm:py-16 lg:py-24",
        )}
      >
        {crumbs ? (
          <div className="mb-5">
            <Breadcrumbs items={crumbs} tone="light" />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[13px] font-semibold text-white">
            <span aria-hidden="true" className="size-2 rounded-full bg-orange" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 text-[2.15rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">{title}</h1>
        {sub ? <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{sub}</p> : null}
        {actions ? <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        {checks ? <CheckList className="mt-7" items={checks} /> : null}
        {meta ? <div className="mt-6 text-sm text-white/70">{meta}</div> : null}
      </div>
      {aside ? <div className="hero-aside relative z-10 py-6 lg:py-16">{aside}</div> : null}
    </section>
  );
}

export function HeroActions({
  estimateHref = "#estimate",
  estimateLabel = "Get a Free Estimate",
  phoneDisplay,
  phoneTel,
}: {
  estimateHref?: string;
  estimateLabel?: string;
  phoneDisplay: string;
  phoneTel: string;
}) {
  return (
    <>
      <a
        href={estimateHref}
        className="flex h-14 items-center justify-center rounded-lg bg-orange px-7 text-lg font-bold text-navy shadow-sm hover:bg-orange-dark"
      >
        {estimateLabel}
      </a>
      <a
        href={`tel:${phoneTel}`}
        className="flex h-14 items-center justify-center rounded-lg border-2 border-white bg-white/5 px-7 text-lg font-bold text-white hover:bg-white hover:text-navy"
      >
        Call {phoneDisplay}
      </a>
    </>
  );
}
