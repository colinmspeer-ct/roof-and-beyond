import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-5xl text-navy">That page is not on this site</h1>
      <p className="mt-4 leading-7">
        The address does not match a service, a county, or a community Roof
        & Beyond Home Solutions has published.
      </p>
      <Link href="/" className="mt-6 inline-block text-orange">
        Back to the home page
      </Link>
    </main>
  );
}
