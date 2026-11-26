import Link from "next/link";
import { Phone } from "lucide-react";
import { brand } from "@/content/brand";
import type { Town } from "@/lib/areas";
import { countyPath } from "@/lib/areas";

/** "village in East Lampeter Township" -> "village" for compact labels. */
export function shortKind(kind: string) {
  return kind.split(" in ")[0].split(",")[0];
}

/** Splits telegraphic data sentences into a bullet list, keeps prose as <p>. */
export function Prose({ text }: { text: string }) {
  const parts = text.split(/(?<=\.)\s+/).filter(Boolean);
  if (parts.length < 3) return <p>{text}</p>;
  return (
    <ul className="facts">
      {parts.map((part) => (
        <li key={part}>{part}</li>
      ))}
    </ul>
  );
}

const areaCodes: Record<Town["county"], string> = {
  lancaster: "717 / 223",
  york: "717 / 223",
  chester: "610 / 484",
  delaware: "610 / 484",
};

export function LocalDetails({ town }: { town: Town }) {
  const rows: [string, React.ReactNode][] = [
    ["County", <Link key="c" href={countyPath(town.countySlug)} className="font-semibold text-navy underline underline-offset-4">{town.countyName}</Link>],
    ["Type", town.kind.charAt(0).toUpperCase() + town.kind.slice(1)],
    ["ZIP codes", town.zips.length ? town.zips.join(", ") : "n/a"],
    ["Area codes", areaCodes[town.county]],
  ];
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">{town.name} at a glance</p>
      <dl className="mt-3 divide-y divide-line text-[15px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-semibold text-navy">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CallCard() {
  return (
    <div className="rounded-2xl bg-navy p-6 text-white">
      <p className="text-xl font-extrabold tracking-tight">Talk to someone today</p>
      <p className="mt-2 text-[15px] leading-6 text-white/80">{brand.hours}.</p>
      <a
        href={`tel:${brand.phoneTel}`}
        className="mt-4 flex h-13 items-center justify-center gap-2 rounded-lg bg-orange font-bold text-navy hover:bg-orange-dark"
      >
        <Phone aria-hidden="true" className="size-4" />
        {brand.phoneDisplay}
      </a>
      <a
        href="#estimate"
        className="mt-2 flex h-13 items-center justify-center rounded-lg border-2 border-white font-bold text-white hover:bg-white hover:text-navy"
      >
        Request an estimate
      </a>
    </div>
  );
}

export function Sources({ sources }: { sources: string[] }) {
  return (
    <details className="group rounded-2xl border border-line bg-white p-5 text-sm leading-6 text-muted" open>
      <summary className="flex cursor-pointer items-center justify-between text-base font-bold text-navy">
        Sources for the local figures
        <span aria-hidden="true" className="chev text-rust transition-transform">▾</span>
      </summary>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {sources.map((source) => (
          <li key={source.slice(0, 48)}>{source}</li>
        ))}
      </ul>
    </details>
  );
}
