import Link from "next/link";
import { brand, placeholders, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-navy-deep text-sky">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs tracking-wide">
          <p>Lancaster, Chester, Delaware, and York counties</p>
          <p className="hidden sm:block">{placeholders.phone}</p>
        </div>
      </div>
      <div className="border-b border-white/10 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="shrink-0" aria-label={`${brand.dba} home`}>
            <img
              src="/brand/logo.svg"
              alt="Roof and Beyond Home Solutions logo"
              width={242}
              height={56}
              className="h-12 w-auto sm:h-14"
            />
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.12em] md:flex">
            <details className="relative">
              <summary className="cursor-pointer list-none hover:text-sky">
                Exterior
              </summary>
              <div className="absolute right-0 z-20 mt-3 w-56 border border-line bg-white p-2 text-navy shadow-lg">
                {serviceOrder.map((slug) => (
                  <Link
                    key={slug}
                    href={`/exterior/${slug}/`}
                    className="block px-3 py-2 text-sm normal-case tracking-normal hover:bg-paper"
                  >
                    {servicePages[slug].label}
                  </Link>
                ))}
              </div>
            </details>
            <Link href="/where-we-work/" className="hover:text-sky">
              Where we work
            </Link>
            <Link href="/about/" className="hover:text-sky">
              About
            </Link>
            <span className="text-sky">{placeholders.phone}</span>
            <Button asChild size="sm">
              <Link href="/contact/">Free estimate</Link>
            </Button>
          </nav>
          <details className="relative ml-auto md:hidden">
            <summary className="cursor-pointer list-none rounded-sm border border-white/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
              Menu
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-64 border border-line bg-white p-3 text-navy shadow-lg">
              {serviceOrder.map((slug) => (
                <Link
                  key={slug}
                  href={`/exterior/${slug}/`}
                  className="block py-2 text-sm"
                >
                  {servicePages[slug].label}
                </Link>
              ))}
              <Link href="/where-we-work/" className="block py-2 text-sm">
                Where we work
              </Link>
              <Link href="/about/" className="block py-2 text-sm">
                About
              </Link>
              <Link href="/contact/" className="mt-2 block bg-orange px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-navy">
                Free estimate
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
