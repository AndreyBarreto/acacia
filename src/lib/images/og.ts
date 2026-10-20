import { getConfiguredImageService, getImage } from 'astro:assets';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_MAX_BYTES = 300 * 1024;
const OG_QUALITY = 70;

const ogOptions = {
  width: OG_WIDTH,
  height: OG_HEIGHT,
  fit: 'cover',
  format: 'jpeg',
  quality: OG_QUALITY,
} as const;

/** Build-time: the OG image (cropped from the cover) as an Astro-optimized asset. */
export async function getOgImage(cover: ImageMetadata) {
  return getImage({ src: cover, ...ogOptions });
}

/** Same crop on raw bytes, to check the real output size. */
export async function renderOgImage(source: Uint8Array) {
  const service = await getConfiguredImageService();
  if (!('transform' in service))
    throw new Error('The configured image service cannot transform locally');
  const config = { service: { entrypoint: '', config: {} } };
  return service.transform(source, { src: '', ...ogOptions }, config as never, {} as never);
}
