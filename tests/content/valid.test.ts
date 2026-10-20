import { describe, expect, it } from 'vitest';
import * as valid from '../fixtures/valid';
import { issuesOf, schemas } from './issues';

describe('valid fixtures', () => {
  it.each(Object.keys(schemas) as (keyof typeof schemas)[])('%s passes its schema', (name) => {
    expect(issuesOf(schemas[name], valid[name])).toEqual([]);
  });
});
