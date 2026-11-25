import { brand } from "@/content/brand";

const signals = [
  { label: "PA HIC", value: `#${brand.hic}` },
  { label: "Hours", value: "9 AM–8 PM daily" },
  { label: "Based in", value: "Media, PA" },
  { label: "Work", value: "Houses only" },
];

export function TrustSignals() {
  return (
    <section aria-label="Business details" className="border-y border-line bg-white">
      <ul className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
        {signals.map((item) => (
          <li key={item.label} className="border-line px-4 py-5 sm:border-l first:border-l-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a3412]">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl text-navy">{item.value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
