import { getApiAuthHandlers } from "@/lib/auth-handlers";
import { getAccessToken } from "@/lib/token-store";
import type { OrgEmployee } from "@/lib/tenant-types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    let message = response.statusText;
    let code: string | undefined;
    let billingPreview: SeatBillingPreview | undefined;
    try {
      const body = (await response.json()) as {
        message?: string;
        error?: string;
        billingPreview?: SeatBillingPreview;
      };
      if (typeof body.error === "string") code = body.error;
      if (body.message) message = body.message;
      if (body.billingPreview) billingPreview = body.billingPreview;
    } catch {
      // ignore
    }
    if (response.status === 403 && (code === "organization_suspended" || code === "organization_pending")) {
      getApiAuthHandlers().onOrganizationBlocked?.(message);
    }
    const err = new Error(message) as Error & {
      code?: string;
      billingPreview?: SeatBillingPreview;
      status?: number;
    };
    err.code = code;
    err.billingPreview = billingPreview;
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<T>;
}

export interface OrgDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  meetingsThisMonth: number;
  recentAudit: Array<{
    id: string;
    action: string;
    createdAt: string;
    user: { id: string; email: string; name: string } | null;
  }>;
}

export interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  logoUrl: string | null;
  address: string | null;
  timezone: string;
  meetingDefaultDurationMinutes: number;
  status: string;
  subscriptionPlan: string;
}

export interface SeatBillingPreview {
  subscriptionPlan: string;
  planLabel: string;
  billingCycle: "monthly" | "yearly";
  includedSeats: number;
  activeSeats: number;
  pendingInvitations: number;
  usedSeats: number;
  availableSeats: number;
  additionalSeatsCurrent: number;
  additionalSeatsAfter: number;
  extraSeatPriceMonthlyInr: number;
  currentMonthlySubtotalInr: number;
  currentTotalInr: number;
  projectedMonthlySubtotalInr: number;
  projectedAnnualCostInr: number;
  projectedTotalInr: number;
  additionalMonthlyCostInr: number;
  additionalAnnualCostInr: number;
  requiresConfirmation: boolean;
  gstPercent: number;
}

export interface PlanUsage {
  subscriptionPlan: string;
  planLabel?: string;
  activeUsers: number;
  includedUsers: number;
  pendingInvitations?: number;
  usedSeats?: number;
  availableSeats?: number;
  additionalUsers: number;
  extraSeatPriceMonthlyInr?: number;
  maxUsers: number | null;
  canAddUser: boolean;
  billingCycle?: string;
  monthlyAmountInr: number;
  totalAmountInr: number;
  projectedAnnualCostInr?: number;
}

export interface OrgInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedBy?: { id: string; name: string; email: string };
}

export interface LoginHistoryItem {
  id: string;
  action: string;
  createdAt: string;
  metadata: unknown;
}

export const orgApi = {
  getDashboard: () => request<OrgDashboardStats>("/organizations/dashboard"),

  getPlanUsage: () => request<PlanUsage>("/organizations/plan-usage"),

  getSeatUsage: () => request<PlanUsage>("/organizations/seats"),

  getSeatBillingPreview: (seatsToAdd = 1) =>
    request<SeatBillingPreview>(`/organizations/billing/seat-preview?seatsToAdd=${seatsToAdd}`),

  getSettings: () =>
    request<{ organization: OrgSettings }>("/organizations/settings"),

  updateSettings: (body: Record<string, unknown>) =>
    request<{ organization: OrgSettings }>("/organizations/settings", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  listUsers: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return request<{ items: OrgEmployee[]; total: number; page: number; pageSize: number }>(
      `/organizations/users${qs ? `?${qs}` : ""}`,
    );
  },

  listInvitations: () =>
    request<{ pending: OrgInvitation[]; accepted: OrgInvitation[] }>("/organizations/invitations"),

  inviteUser: (body: Record<string, unknown>) =>
    request<{ invitation: OrgInvitation; billingPreview: SeatBillingPreview }>(
      "/organizations/invitations",
      { method: "POST", body: JSON.stringify(body) },
    ),

  resendInvitation: (id: string) =>
    request<{ ok: boolean }>(`/organizations/invitations/${id}/resend`, { method: "POST" }),

  cancelInvitation: (id: string) =>
    request<{ ok: boolean }>(`/organizations/invitations/${id}`, { method: "DELETE" }),

  createUser: (body: Record<string, unknown>) =>
    request<{ user: OrgEmployee; temporaryPassword: string }>("/organizations/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateUser: (id: string, body: Record<string, unknown>) =>
    request<{ user: OrgEmployee }>(`/organizations/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deactivateUser: (id: string) =>
    request<{ user: OrgEmployee }>(`/organizations/users/${id}`, { method: "DELETE" }),

  activateUser: (id: string) =>
    request<{ user: OrgEmployee }>(`/organizations/users/${id}/activate`, { method: "POST" }),

  resetPassword: (id: string) =>
    request<{ temporaryPassword: string; email: string; emailSent?: boolean }>(
      `/organizations/users/${id}/reset-password`,
      { method: "POST" },
    ),

  resendInvite: (id: string) =>
    request<{ temporaryPassword: string; email: string }>(
      `/organizations/users/${id}/resend-invite`,
      { method: "POST" },
    ),

  forcePasswordChange: (id: string) =>
    request<{ ok: boolean }>(`/organizations/users/${id}/force-password-change`, {
      method: "POST",
    }),

  getLoginHistory: (id: string) =>
    request<{ items: LoginHistoryItem[] }>(`/organizations/users/${id}/login-history`),
};
