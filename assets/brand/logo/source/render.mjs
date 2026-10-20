// Render the logo PNGs and the preview screenshot with headless Chromium.
//
// Uses the playwright-core that is already on the machine (no install):
//   PLAYWRIGHT_CORE=/path/to/playwright-core CHROMIUM=/path/to/chrome \
//     node render.mjs
//
// Equivalent without Playwright, if rsvg-convert is available:
//   rsvg-convert -w 32 -h 32 ../favicon.svg -o ../favicon-32.png
//   rsvg-convert -w 180 -h 180 icon-full-bleed.svg -o ../apple-touch-icon-180.png
//   rsvg-convert -w 512 -h 512 icon-full-bleed.svg -o ../icon-512.png
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? "playwright-core");

const pngs = [
  { src: resolve(out, "favicon.svg"), dest: resolve(out, "favicon-32.png"), size: 32 },
  { src: resolve(here, "icon-full-bleed.svg"), dest: resolve(out, "apple-touch-icon-180.png"), size: 180 },
  { src: resolve(here, "icon-full-bleed.svg"), dest: resolve(out, "icon-512.png"), size: 512 },
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
try {
  for (const { src, dest, size } of pngs) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const svg = readFileSync(src, "utf8");
    const dataUrl = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
    await page.setContent(
      `<html><body style="margin:0;background:transparent"><img src="${dataUrl}" width="${size}" height="${size}" style="display:block"></body></html>`,
    );
    await page.locator("img").evaluate((img) => img.decode());
    await page.screenshot({ path: dest, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    await page.close();
    console.log("wrote", dest);
  }

  const preview = resolve(out, "preview.html");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(pathToFileURL(preview).href);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await page.screenshot({ path: resolve(out, "preview.png"), fullPage: true });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`preview.png written · scrollWidth 1280→${width}, 390→${mobileWidth} · console errors: ${errors.length}`);
  errors.forEach((e) => console.log("  ", e));
} finally {
  await browser.close();
}
