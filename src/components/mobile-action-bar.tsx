import Link from "next/link";
import { brand } from "@/content/brand";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-navy p-2 md:hidden">
      <a
        href={`tel:${brand.phoneTel}`}
        className="flex h-12 items-center justify-center bg-orange text-center text-xs font-semibold uppercase tracking-[0.08em] text-navy"
      >
        {`Call us at ${brand.phoneDisplay}`}
      </a>
      <Link
        href="/contact/#estimate"
        className="flex h-12 items-center justify-center border border-white text-xs font-semibold uppercase tracking-[0.12em] text-white"
      >
        Free estimate
      </Link>
    </div>
  );
}
