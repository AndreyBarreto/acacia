import { describe, expect, it } from 'vitest';
import { invalidFixtures } from '../fixtures/invalid';
import * as valid from '../fixtures/valid';
import { issuesOf, schemas } from './issues';

// One test per single-file rule of docs/plan/data-model.md §10, each on its invalid fixture.
describe('schema rules', () => {
  it.each(invalidFixtures)('$rule: $case → "$error"', ({ schema, data, error }) => {
    expect(issuesOf(schemas[schema], data)).toContain(error);
  });

  it('V30: a placeholder coordinate reports only the format error', () => {
    const data = { ...valid.building, geo: { latitude: '-27.4xxxx', longitude: '-48.49587' } };
    expect(issuesOf(schemas.building, data)).toEqual([
      'geo.latitude must be a quoted number with 5 to 7 decimals, like "-27.43812"',
    ]);
  });
});
