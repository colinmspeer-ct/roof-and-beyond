import Link from "next/link";
import { Phone } from "lucide-react";
import { brand } from "@/content/brand";
import { CheckList } from "@/components/check-list";

export function PageCta({
  heading = "Get a written estimate for your house",
  body = "Call or send the address. Someone looks at the exterior and puts the scope in writing before any work is scheduled.",
  estimateHref = "/contact/#estimate",
}: {
  heading?: string;
  body?: string;
  estimateHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-orange/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-20">
        <div>
          <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">{heading}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{body}</p>
          <CheckList
            className="mt-6"
            items={["Free estimate", `PA HIC #${brand.hic}`, "Open 9 AM–8 PM, 7 days"]}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href={estimateHref}
            className="flex h-14 flex-1 items-center justify-center rounded-lg bg-orange px-6 text-lg font-bold text-navy shadow-sm hover:bg-orange-dark"
          >
            Get my free estimate
          </Link>
          <a
            href={`tel:${brand.phoneTel}`}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white px-6 text-lg font-bold text-white hover:bg-white hover:text-navy"
          >
            <Phone aria-hidden="true" className="size-5" />
            Call {brand.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
