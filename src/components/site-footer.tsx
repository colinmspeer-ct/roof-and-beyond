import Link from "next/link";
import { brand, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { counties, countyPath } from "@/lib/areas";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <img
            src="/brand/logo.svg"
            alt="Roof and Beyond Home Solutions logo"
            width={242}
            height={56}
            className="h-14 w-auto"
          />
          <p className="mt-4 text-sm leading-6 text-sky">{brand.dbaLine}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Exterior
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {serviceOrder.map((slug) => (
              <li key={slug}>
                <Link href={`/exterior/${slug}/`} className="hover:text-sky">
                  {servicePages[slug].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Counties
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {counties.map((county) => (
              <li key={county.slug}>
                <Link href={countyPath(county.slug)} className="hover:text-sky">
                  {county.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Contact
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-sky">
            <li>
              <a href={`tel:${brand.phoneTel}`}>{`Call us at ${brand.phoneDisplay}`}</a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li>{brand.locality}</li>
            <li>{brand.hours}</li>
          </ul>
          <Link
            href="/contact/"
            className="mt-4 inline-block bg-orange px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy"
          >
            Free estimate
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-sky sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.dba}.
          </p>
          <p className="flex gap-4">
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
