import { Picture } from "@/components/picture";
import type { Photo } from "@/content/media";

export function LocalGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-14 sm:grid-cols-2">
      {photos.map((photo) => (
        <figure key={photo.webp}>
          <div className="aspect-video overflow-hidden rounded-xl bg-paper">
            <Picture photo={photo} sizes="(min-width: 1280px) 620px, (min-width: 640px) 50vw, 100vw" className="block h-full" />
          </div>
          <figcaption className="mt-2 text-xs text-muted">Illustrative photo</figcaption>
        </figure>
      ))}
    </div>
  );
}
