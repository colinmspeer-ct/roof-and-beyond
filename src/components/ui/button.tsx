import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-orange text-navy shadow-sm hover:bg-orange-dark",
        navy: "bg-navy text-white hover:bg-navy-deep",
        outline:
          "border-2 border-white bg-transparent text-white hover:bg-white hover:text-navy",
        outlineNavy:
          "border-2 border-navy bg-transparent text-navy hover:bg-navy hover:text-white",
        ghostLight:
          "border border-line bg-white text-navy hover:border-navy",
        sky: "bg-sky text-navy hover:bg-white",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
