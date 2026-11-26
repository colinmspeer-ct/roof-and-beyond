import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckList({
  items,
  tone = "light",
  className,
}: {
  items: string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            tone === "light" ? "text-white" : "text-navy",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-5 shrink-0 place-items-center rounded-full",
              tone === "light" ? "bg-orange text-navy" : "bg-orange/15 text-rust",
            )}
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
