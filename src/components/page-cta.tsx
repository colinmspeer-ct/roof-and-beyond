import Link from "next/link";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/button";

export function PageCta({
  heading = "Get a written estimate",
  body = "Tell us the address and which part of the exterior you want looked at. The form is still a preview.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="bg-orange text-navy">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl leading-none">{heading}</h2>
          <p className="mt-3 max-w-xl leading-7">{body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <Button asChild variant="navy" size="lg">
            <a href={`tel:${brand.phoneTel}`}>{`Call us at ${brand.phoneDisplay}`}</a>
          </Button>
          <Link
            href="/contact/"
            className="text-center text-sm font-semibold uppercase tracking-[0.14em] underline"
          >
            Free estimate
          </Link>
        </div>
      </div>
    </section>
  );
}
