// The one way pages read content: all collections, checked by the cross-file rules (the build
// fails listing every problem), with drafts left out of the production build.
import { getCollection } from 'astro:content';
import { publicOnly } from './pages';
import { contentIssues } from './rules';

async function load() {
  const [site, cities, neighborhoods, buildings, properties] = await Promise.all([
    getCollection('site'),
    getCollection('cities'),
    getCollection('neighborhoods'),
    getCollection('buildings'),
    getCollection('properties'),
  ]);
  const issues = contentIssues({ site, cities, neighborhoods, buildings, properties });
  if (issues.length > 0) {
    throw new Error(`content/ has ${issues.length} problem(s):\n- ${issues.join('\n- ')}`);
  }
  return {
    site: site[0].data,
    cities,
    neighborhoods,
    buildings,
    properties: publicOnly(properties, import.meta.env.PROD),
  };
}

let loaded: ReturnType<typeof load> | undefined;

export function loadContent() {
  loaded ??= load();
  return loaded;
}
