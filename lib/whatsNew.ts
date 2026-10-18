/** Client helpers for Synapse What’s New (versioned changelog via /api/whats-new). */

export type WhatsNewEntry = {
  version: string;
  date?: string | null;
  title?: string;
  items: string[];
};

export type WhatsNewPayload = {
  currentVersion: string;
  lastSeenAppVersion: string | null;
  entries: WhatsNewEntry[];
};

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiFailure = { success: false; message?: string };

function dismissKey(version: string): string {
  return `synapse.whatsNew.dismissed.${version}`;
}

export function wasWhatsNewDismissedThisSession(version: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(dismissKey(version)) === '1';
  } catch {
    return false;
  }
}

export function markWhatsNewDismissedThisSession(version: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(dismissKey(version), '1');
  } catch {
    /* ignore */
  }
}

export async function fetchWhatsNew(
  options: { full?: boolean; since?: string } = {}
): Promise<WhatsNewPayload> {
  const params = new URLSearchParams();
  if (options.full) params.set('full', '1');
  if (options.since) params.set('since', options.since);
  const qs = params.toString();
  const res = await fetch(`/api/whats-new${qs ? `?${qs}` : ''}`, {
    credentials: 'include',
  });
  const data = (await res.json()) as ApiSuccess<WhatsNewPayload> | ApiFailure;
  if (!res.ok || !data.success) {
    throw new Error((!data.success && data.message) || 'Failed to load What’s New');
  }
  return data.data;
}

export async function acknowledgeWhatsNewSeen(): Promise<string> {
  const res = await fetch('/api/whats-new/seen', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = (await res.json()) as
    | ApiSuccess<{ lastSeenAppVersion: string }>
    | ApiFailure;
  if (!res.ok || !data.success) {
    throw new Error((!data.success && data.message) || 'Failed to acknowledge What’s New');
  }
  return data.data.lastSeenAppVersion;
}
