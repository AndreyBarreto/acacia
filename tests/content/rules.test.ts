import { describe, expect, it } from 'vitest';
import { invalidFixtures } from '../fixtures/invalid';
import { issuesOf, schemas } from './issues';

// One test per single-file rule of docs/plan/data-model.md §10, each on its invalid fixture.
describe('schema rules', () => {
  it.each(invalidFixtures)('$rule: $case → "$error"', ({ schema, data, error }) => {
    expect(issuesOf(schemas[schema], data)).toContain(error);
  });
});
