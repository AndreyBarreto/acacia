export type Consent = 'granted' | 'denied';

export const CONSENT_KEY = 'cookie_consent';
export const CONSENT_EVENT = 'consent-change';

/** The visitor's saved choice, or null when none was made (or storage is unavailable). */
export function getConsent(storage: Storage = localStorage): Consent | null {
  try {
    const value = storage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Saves the choice and fires `consent-change` (detail = the choice) for the analytics stage. */
export function setConsent(
  value: Consent,
  storage: Storage = localStorage,
  target: EventTarget = window,
): void {
  try {
    storage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the choice only lasts for this page view.
  }
  target.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
