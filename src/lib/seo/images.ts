// Build-time: the photos of a property as JPEG URLs for JSON-LD and the image sitemap.
import { getImage } from 'astro:assets';

const MAX_WIDTH = 1200;

interface WithImages {
  images?: { src: ImageMetadata; cover?: boolean }[];
}

/** Root-relative URLs: the property cover first, then its other photos, then the building's. */
export async function photoUrls(property: WithImages, building?: WithImages): Promise<string[]> {
  const own = property.images ?? [];
  const sorted = [...own.filter((i) => i.cover), ...own.filter((i) => !i.cover)];
  const all = [...sorted, ...(building?.images ?? [])];
  const images = await Promise.all(
    all.map(({ src }) => getImage({ src, width: Math.min(MAX_WIDTH, src.width), format: 'jpeg' })),
  );
  return images.map((image) => image.src);
}
