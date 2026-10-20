import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OG_HEIGHT, OG_MAX_BYTES, OG_WIDTH, renderOgImage } from './og';

const photos = ['varanda/01-118090581.jpg', 'terreo/01-345300662.jpg', 'comum/01-118090621.jpg'];

function jpegSize(data: Uint8Array): { width: number; height: number } {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let offset = 2;
  while (offset < data.length) {
    const marker = view.getUint16(offset);
    const length = view.getUint16(offset + 2);
    if (
      marker >= 0xffc0 &&
      marker <= 0xffcf &&
      marker !== 0xffc4 &&
      marker !== 0xffc8 &&
      marker !== 0xffcc
    ) {
      return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error('no SOF marker');
}

describe('renderOgImage', () => {
  it.each(photos)('crops %s to a 1200x630 JPEG under 300 KB', async (photo) => {
    const source = readFileSync(`assets/booking/photos/${photo}`);
    const { data } = await renderOgImage(source);

    expect([data[0], data[1]]).toEqual([0xff, 0xd8]);
    expect(jpegSize(data)).toEqual({ width: OG_WIDTH, height: OG_HEIGHT });
    expect(data.byteLength).toBeLessThan(OG_MAX_BYTES);
  });
});
