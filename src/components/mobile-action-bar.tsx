import Link from "next/link";
import { FileText, Phone } from "lucide-react";
import { brand } from "@/content/brand";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(2_31_77/0.35)] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${brand.phoneTel}`}
          className="flex h-13 items-center justify-center gap-2 rounded-lg border-2 border-navy text-[15px] font-bold text-navy"
        >
          <Phone aria-hidden="true" className="size-5" />
          Call now
        </a>
        <Link
          href="/contact/#estimate"
          className="flex h-13 items-center justify-center gap-2 rounded-lg bg-orange text-[15px] font-bold text-navy"
        >
          <FileText aria-hidden="true" className="size-5" />
          Free Estimate
        </Link>
      </div>
    </div>
  );
}
