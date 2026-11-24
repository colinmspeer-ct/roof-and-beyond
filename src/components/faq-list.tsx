export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.q} className="group py-1">
          <summary className="cursor-pointer list-none py-3 font-display text-xl text-navy marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-4">
              {faq.q}
              <span aria-hidden="true" className="text-orange group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <p className="pb-4 leading-7 text-muted">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
