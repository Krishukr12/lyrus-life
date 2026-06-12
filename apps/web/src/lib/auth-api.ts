import { clearAccessToken, setAccessToken } from "./token-store";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | null;
  mustChangePassword?: boolean;
}

export interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscriptionPlan: string;
  logoUrl?: string | null;
  email?: string;
  phone?: string | null;
  timezone?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  organization?: AuthOrganization | null;
}

function parseAuthErrorBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const record = body as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  const err = record.error;
  if (typeof err === "string" && err.trim()) {
    return err;
  }

  if (err && typeof err === "object") {
    const flat = err as {
      fieldErrors?: Record<string, string[] | undefined>;
      formErrors?: string[];
    };
    for (const messages of Object.values(flat.fieldErrors ?? {})) {
      if (messages?.[0]) return messages[0];
    }
    if (flat.formErrors?.[0]) return flat.formErrors[0];
  }

  return fallback;
}

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
    let message = response.statusText || "Request failed";
    try {
      const body: unknown = await response.json();
      message = parseAuthErrorBody(body, message);
    } catch {
      // ignore parse errors
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
  setAccessToken(data.token);
  return data;
}

export interface ForgotPasswordResponse {
  ok: boolean;
  message: string;
  resetToken?: string;
  email?: string;
}

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
  return authRequest<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordWithOtp(
  resetToken: string,
  code: string,
  newPassword: string,
  confirmPassword: string,
): Promise<AuthSession> {
  const data = await authRequest<AuthSession>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ resetToken, code, newPassword, confirmPassword }),
  });
  setAccessToken(data.token);
  return data;
}

export interface LoadedSession {
  user: AuthUser;
  organization: AuthOrganization | null;
}

export async function fetchCurrentSession(): Promise<LoadedSession | null> {
  const token = (await import("./token-store.js")).getAccessToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    clearAccessToken();
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  const data = (await response.json()) as {
    user: AuthUser & { firstName?: string; lastName?: string; status?: string };
    organization?: AuthOrganization | null;
  };

  return {
    user: {
      ...data.user,
      organizationId: data.user.organizationId ?? data.organization?.id ?? null,
      mustChangePassword: data.user.mustChangePassword ?? false,
    },
    organization: data.organization ?? null,
  };
}

/** @deprecated Use fetchCurrentSession */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const session = await fetchCurrentSession();
  return session?.user ?? null;
}

export async function setRequiredPassword(
  newPassword: string,
  confirmPassword: string,
): Promise<void> {
  const token = (await import("./token-store.js")).getAccessToken();
  await authRequest<{ ok: boolean }>("/auth/set-required-password", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ newPassword, confirmPassword }),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> {
  const token = (await import("./token-store.js")).getAccessToken();
  await authRequest<{ ok: boolean }>("/auth/change-password", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
}

export interface InvitationDetails {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationName: string;
  invitedBy: string;
  expiresAt: string;
}

export async function fetchInvitationDetails(token: string): Promise<InvitationDetails> {
  return authRequest<InvitationDetails>(`/auth/invitation?token=${encodeURIComponent(token)}`);
}

export async function acceptInvitation(
  token: string,
  password: string,
  confirmPassword: string,
): Promise<AuthSession> {
  const data = await authRequest<AuthSession>("/auth/accept-invitation", {
    method: "POST",
    body: JSON.stringify({ token, password, confirmPassword }),
  });
  setAccessToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  const token = (await import("./token-store.js")).getAccessToken();
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
