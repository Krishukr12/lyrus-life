/**
 * Access token is kept in memory only (not localStorage) to reduce XSS exposure.
 * Session restore uses httpOnly cookie via /auth/me on load.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}
