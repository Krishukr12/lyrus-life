export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function loginWithPassword(email: string, password: string): Promise<AuthSession> {
  const data = await authRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const { setAccessToken } = await import("./token-store.js");
  setAccessToken(data.token);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const { getAccessToken, clearAccessToken } = await import("./token-store.js");
  const token = getAccessToken();
  const response = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 401) {
    clearAccessToken();
    return null;
  }
  if (!response.ok) throw new Error("Failed to load session");

  const data = (await response.json()) as { user: AuthUser };
  return data.user;
}

export async function logout(): Promise<void> {
  const { getAccessToken, clearAccessToken } = await import("./token-store.js");
  const token = getAccessToken();
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } finally {
    clearAccessToken();
  }
}
