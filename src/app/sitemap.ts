import type { MetadataRoute } from "next";
import { brand, serviceOrder } from "@/content/brand";
import { includeTownPages } from "@/content/launch";
import { counties, towns, townPath, townServicePath } from "@/lib/areas";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about/", "/contact/", "/privacy/", "/terms/", "/exterior/", "/where-we-work/", "/sitemap/"];
  const urls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${brand.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
  for (const service of serviceOrder) {
    urls.push({
      url: `${brand.url}/exterior/${service}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  for (const county of counties) {
    urls.push({
      url: `${brand.url}/where-we-work/${county.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  if (includeTownPages) {
    for (const town of towns) {
      urls.push({
        url: `${brand.url}${townPath(town)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      for (const service of serviceOrder) {
        urls.push({
          url: `${brand.url}${townServicePath(town, service)}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  }
  return urls;
}
