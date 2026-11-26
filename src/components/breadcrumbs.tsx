import Link from "next/link";

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  tone?: "dark" | "light";
}) {
  const link = tone === "light" ? "text-white/75 underline-offset-4 hover:text-white hover:underline" : "text-muted hover:text-rust";
  const current = tone === "light" ? "font-semibold text-white" : "font-semibold text-navy";
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden="true" className="opacity-50">/</span> : null}
              {last ? (
                <span className={current} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className={link}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
