/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // The on-disk module cache keeps stale import.meta.glob results (e.g. a new src/i18n/*.json
    // file is not picked up), so tests would fail locally until the cache was cleared.
    fsModuleCache: false,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'infra/**/*.test.ts'],
  },
});
