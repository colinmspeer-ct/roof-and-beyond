import { placeholders } from "@/content/brand";

const signals = [
  { label: "Licensed & insured", value: placeholders.licenseStatus },
  { label: "PA HIC", value: placeholders.hic },
  { label: "Warranties", value: placeholders.warranty },
  { label: "Financing", value: placeholders.financing },
];

export function TrustSignals() {
  return (
    <section aria-label="Unpublished business details" className="border-y border-line bg-white">
      <ul className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
        {signals.map((item) => (
          <li key={item.label} className="border-line px-4 py-5 sm:border-l first:border-l-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a3412]">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl text-navy">{item.value}</p>
            <p className="mt-1 text-xs text-muted">Placeholder until the owner confirms it.</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
