import { describe, expect, it } from 'vitest';
import { CONSENT_EVENT, getConsent, setConsent } from './consent';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  } as Storage;
}

describe('consent', () => {
  it('is null before any choice', () => {
    expect(getConsent(memoryStorage())).toBeNull();
  });

  it('returns what was stored', () => {
    const s = memoryStorage();
    setConsent('granted', s, new EventTarget());
    expect(getConsent(s)).toBe('granted');
    setConsent('denied', s, new EventTarget());
    expect(getConsent(s)).toBe('denied');
  });

  it('ignores unknown stored values', () => {
    const s = memoryStorage();
    s.setItem('cookie_consent', 'maybe');
    expect(getConsent(s)).toBeNull();
  });

  it('dispatches consent-change with the new value', () => {
    const target = new EventTarget();
    let detail: unknown;
    target.addEventListener(CONSENT_EVENT, (e) => (detail = (e as CustomEvent).detail));
    setConsent('granted', memoryStorage(), target);
    expect(CONSENT_EVENT).toBe('consent-change');
    expect(detail).toBe('granted');
  });

  it('returns null when storage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(getConsent(broken)).toBeNull();
  });
});
