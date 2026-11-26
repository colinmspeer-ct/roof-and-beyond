import { Clock, FileText, House, ShieldCheck } from "lucide-react";
import { brand } from "@/content/brand";

const signals = [
  { icon: ShieldCheck, title: `PA HIC #${brand.hic}`, body: "Registered home improvement contractor" },
  { icon: FileText, title: "Written estimate", body: "Scope on paper before work is scheduled" },
  { icon: Clock, title: "9 AM–8 PM daily", body: "Seven days a week, Media, PA" },
  { icon: House, title: "Houses only", body: "Residential exterior work" },
];

export function TrustSignals() {
  return (
    <section aria-label="Business details" className="border-b border-line bg-paper">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 lg:grid-cols-4">
        {signals.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-center gap-3 sm:items-start">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-rust shadow-card sm:size-11">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block text-[15px] font-bold leading-tight text-navy">{title}</span>
              <span className="mt-0.5 hidden text-[13px] leading-snug text-muted sm:block">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
