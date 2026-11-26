import { preload } from "react-dom";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * <picture> with AVIF + WebP. next/image is unavailable in static export.
 * `priority` preloads the AVIF and loads eagerly for the LCP hero.
 */
export function Picture({
  photo,
  className,
  imgClassName,
  sizes = "100vw",
  priority = false,
  alt,
}: {
  photo: Photo;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
}) {
  if (priority) {
    preload(photo.avif, { as: "image", type: "image/avif", fetchPriority: "high" });
  }
  return (
    <picture className={className}>
      <source srcSet={photo.avif} type="image/avif" />
      <img
        src={photo.webp}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
