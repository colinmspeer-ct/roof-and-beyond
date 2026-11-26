import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { brand, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath } from "@/lib/areas";
import {
  GbpMapPlaceholder,
  InsuranceStatusPlaceholder,
  SocialLinksPlaceholder,
} from "@/components/placeholders";

const heading = "text-xs font-bold uppercase tracking-[0.18em] text-orange";
const link = "inline-flex min-h-9 items-center text-[15px] text-white/80 hover:text-white";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img
            src="/brand/rb-combined-logo-on-navy-transparent.png"
            alt="Roof & Beyond Home Solutions"
            width={3875}
            height={646}
            loading="lazy"
            className="h-auto w-64 max-w-full"
          />
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/75">
            Roofing, roof repair, siding, windows, gutters, and gutter guards
            for houses in Lancaster, Chester, Delaware, York, Cumberland, and Dauphin counties.
          </p>
          <ul className="mt-5 space-y-2 text-[15px] text-white/85">
            <li>
              <a href={`tel:${brand.phoneTel}`} className="inline-flex min-h-9 items-center gap-2 font-bold text-white hover:text-orange">
                <Phone aria-hidden="true" className="size-4 text-orange" />
                {brand.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className="inline-flex min-h-9 items-center gap-2 hover:text-white">
                <Mail aria-hidden="true" className="size-4 text-orange" />
                {brand.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4 text-orange" />
              {brand.hours}
            </li>
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-orange" />
              Based in {brand.locality}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-4 text-orange" />
              PA HIC #{brand.hic}
            </li>
          </ul>
          <InsuranceStatusPlaceholder />
          <SocialLinksPlaceholder />
        </div>
        <nav aria-label="Services">
          <h2 className={heading}>Services</h2>
          <ul className="mt-4 space-y-1">
            {serviceOrder.map((slug) => (
              <li key={slug}>
                <Link href={`/exterior/${slug}/`} className={link}>
                  {servicePages[slug].label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/exterior/" className={link}>
                All services
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Service area">
          <h2 className={heading}>Where we work</h2>
          <ul className="mt-4 space-y-1">
            {counties.map((county) => (
              <li key={county.slug}>
                <Link href={countyPath(county.slug)} className={link}>
                  {county.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/where-we-work/" className={link}>
                All communities
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className={heading}>Company</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/about/" className={link}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact/" className={link}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/contact/#estimate" className={link}>
                Free estimate
              </Link>
            </li>
            <li>
              <Link href="/sitemap/" className={link}>
                Sitemap
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className={link}>
                XML sitemap
              </a>
            </li>
            <li>
              <Link href="/privacy/" className={link}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms/" className={link}>
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <GbpMapPlaceholder />
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-[13px] leading-6 text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.dbaLine}
          </p>
          <p className="flex flex-wrap gap-x-4">
            <Link href="/sitemap/" className="hover:text-white">
              Sitemap
            </Link>
            <a href="/sitemap.xml" className="hover:text-white">
              sitemap.xml
            </a>
            <Link href="/privacy/" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms/" className="hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
