import { ChevronDown } from "lucide-react";

/**
 * FAQ accordion on native <details>: every answer is in the server HTML,
 * so crawlers and no-JS visitors get the full text.
 */
export function FaqList({
  faqs,
  openFirst = false,
}: {
  faqs: { q: string; a: string }[];
  openFirst?: boolean;
}) {
  return (
    <div className="mt-6 space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={faq.q}
          open={openFirst && index === 0}
          className="group rounded-xl border border-line bg-white shadow-card open:border-navy/30"
        >
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-bold leading-snug text-navy">
            <span>{faq.q}</span>
            <span aria-hidden="true" className="chev grid size-8 shrink-0 place-items-center rounded-full bg-paper text-rust transition-transform">
              <ChevronDown className="size-4" />
            </span>
          </summary>
          <p className="px-5 pb-5 text-base leading-7 text-muted">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
