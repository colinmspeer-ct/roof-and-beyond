import Link from "next/link";
import { placeholders } from "@/content/brand";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-navy p-2 md:hidden">
      <Link
        href="/contact/"
        className="flex h-12 items-center justify-center border border-white text-xs font-semibold uppercase tracking-[0.12em] text-white"
      >
        Call {placeholders.phone}
      </Link>
      <Link
        href="/contact/#estimate"
        className="flex h-12 items-center justify-center bg-orange text-xs font-semibold uppercase tracking-[0.12em] text-navy"
      >
        Free estimate
      </Link>
    </div>
  );
}
