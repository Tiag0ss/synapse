/**
 * Client helpers for Synapse cookie-session expiry.
 * When APIs return 401, send the user to `/` (login) with a safe `?next=` return path.
 */

export function isUnauthorizedResponse(res: Response): boolean {
  return res.status === 401;
}

/** Only same-origin relative app paths (never //… or /api…). */
export function safeNextPath(raw: string | null | undefined): string | null {
  if (raw == null || raw === '') return null;
  let decoded = String(raw);
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null;
  if (decoded.startsWith('/api')) return null;
  return decoded;
}

export function currentAppPath(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}`;
}

export function loginUrlWithReturn(returnPath?: string): string {
  const path = safeNextPath(returnPath ?? currentAppPath());
  if (!path || path === '/') return '/';
  return `/?next=${encodeURIComponent(path)}`;
}

/** Full navigation to the sign-in screen (preserves return path). */
export function redirectToLogin(returnPath?: string): void {
  if (typeof window === 'undefined') return;
  const url = loginUrlWithReturn(returnPath);
  // Already on home without a next target — let the login form show.
  if (window.location.pathname === '/' && !returnPath && !window.location.search.includes('next=')) {
    return;
  }
  window.location.assign(url);
}
