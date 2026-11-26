import Link from "next/link";
import { ChevronDown, Clock, MapPin, Menu, Phone } from "lucide-react";
import { brand, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath } from "@/lib/areas";

const navLink =
  "inline-flex h-11 items-center gap-1 rounded-md px-3 text-[15px] font-semibold text-navy hover:bg-paper";

export function TopBar() {
  return (
    <div className="bg-navy-deep text-white/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:text-[13px]">
        <p className="flex min-w-0 items-center gap-1.5">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-orange" />
          <span className="truncate">
            <span className="sm:hidden">Five Pennsylvania counties</span>
            <span className="hidden sm:inline">
              Serving houses in Lancaster, Chester, Delaware, York, Cumberland &amp; Dauphin counties, PA
            </span>
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden items-center gap-1.5 md:flex">
            <Clock aria-hidden="true" className="size-3.5 text-orange" />
            9 AM–8 PM, 7 days
          </span>
          <a href={`tel:${brand.phoneTel}`} className="hidden font-bold text-white hover:text-orange sm:inline">
            {brand.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="shrink-0" aria-label={`${brand.dba} home`}>
          <img
            src="/brand/rb-combined-logo-on-white-600.png"
            srcSet="/brand/rb-combined-logo-on-white-600.png 600w, /brand/rb-combined-logo-on-white.png 4327w"
            sizes="(min-width: 640px) 189px, 150px"
            alt="Roof & Beyond Home Solutions"
            width={600}
            height={152}
            className="h-[38px] w-auto sm:h-12"
          />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          <Link href="/" className={navLink}>
            Home
          </Link>
          <div className="nav-drop relative">
            <Link href="/exterior/" className={navLink} aria-haspopup="true">
              Services <ChevronDown aria-hidden="true" className="size-4 text-muted" />
            </Link>
            <div className="nav-panel absolute left-0 top-full z-30 w-72 pt-2">
              <ul className="rounded-xl border border-line bg-white p-2 shadow-lift">
                {serviceOrder.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/exterior/${slug}/`}
                      className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-navy hover:bg-paper"
                    >
                      {servicePages[slug].label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-line pt-1">
                  <Link href="/exterior/" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-rust hover:bg-paper">
                    All exterior services →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="nav-drop relative">
            <Link href="/where-we-work/" className={navLink} aria-haspopup="true">
              Where We Work <ChevronDown aria-hidden="true" className="size-4 text-muted" />
            </Link>
            <div className="nav-panel absolute left-0 top-full z-30 w-80 pt-2">
              <ul className="rounded-xl border border-line bg-white p-2 shadow-lift">
                {counties.map((county) => (
                  <li key={county.slug}>
                    <Link
                      href={countyPath(county.slug)}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-navy hover:bg-paper"
                    >
                      {county.name}
                      <span className="text-xs font-medium text-muted">{county.towns.length} towns</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-line pt-1">
                  <Link href="/where-we-work/" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-rust hover:bg-paper">
                    All communities →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link href="/about/" className={navLink}>
            About
          </Link>
          <Link href="/contact/" className={navLink}>
            Contact
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <a
            href={`tel:${brand.phoneTel}`}
            className="hidden h-11 items-center gap-2 rounded-lg border-2 border-navy px-4 text-sm font-bold text-navy hover:bg-navy hover:text-white sm:inline-flex"
          >
            <Phone aria-hidden="true" className="size-4" />
            <span className="hidden xl:inline">{brand.phoneDisplay}</span>
            <span className="xl:hidden">Call</span>
          </a>
          <Link
            href="/contact/#estimate"
            className="hidden h-11 items-center rounded-lg bg-orange px-4 text-sm font-bold text-navy shadow-sm hover:bg-orange-dark sm:inline-flex"
          >
            Free Estimate
          </Link>
          <a
            href={`tel:${brand.phoneTel}`}
            aria-label={`Call ${brand.phoneDisplay}`}
            className="grid size-11 place-items-center rounded-lg border-2 border-navy text-navy sm:hidden"
          >
            <Phone aria-hidden="true" className="size-5" />
          </a>
          <details className="relative lg:hidden">
            <summary
              aria-label="Open menu"
              className="grid size-11 cursor-pointer place-items-center rounded-lg bg-navy text-white"
            >
              <Menu aria-hidden="true" className="size-5" />
            </summary>
            <div className="absolute right-0 top-full z-30 mt-2 max-h-[75vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-line bg-white p-3 shadow-lift">
              <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-[0.16em] text-rust">Services</p>
              {serviceOrder.map((slug) => (
                <Link
                  key={slug}
                  href={`/exterior/${slug}/`}
                  className="flex min-h-11 items-center rounded-lg px-2 text-[15px] font-semibold text-navy hover:bg-paper"
                >
                  {servicePages[slug].label}
                </Link>
              ))}
              <p className="mt-2 border-t border-line px-2 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.16em] text-rust">
                Where we work
              </p>
              {counties.map((county) => (
                <Link
                  key={county.slug}
                  href={countyPath(county.slug)}
                  className="flex min-h-11 items-center justify-between rounded-lg px-2 text-[15px] font-semibold text-navy hover:bg-paper"
                >
                  {county.name}
                  <span className="text-xs font-medium text-muted">{county.towns.length} towns</span>
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-1 border-t border-line pt-2">
                <Link href="/about/" className="flex min-h-11 items-center rounded-lg px-2 text-[15px] font-semibold text-navy hover:bg-paper">
                  About
                </Link>
                <Link href="/contact/" className="flex min-h-11 items-center rounded-lg px-2 text-[15px] font-semibold text-navy hover:bg-paper">
                  Contact
                </Link>
              </div>
              <Link
                href="/contact/#estimate"
                className="mt-2 flex h-12 items-center justify-center rounded-lg bg-orange text-base font-bold text-navy"
              >
                Free Estimate
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
