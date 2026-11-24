import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-sm border border-line bg-white px-3 py-2 text-base text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-orange",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
