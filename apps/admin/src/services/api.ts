import { getAccessToken } from "@/lib/token-store";
import type { CustomerBillingDetail, CustomerBillingRow, PlatformPricing } from "@/lib/billing-types";
import type { DashboardPayload } from "@/lib/dashboard-types";
import type { OrgAuditItem, OrgEmployee, OrgMeeting, OrganizationDetail } from "@/lib/org-types";
import type { OrganizationSummary, PlatformStats } from "@/lib/types";

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

export const adminApi = {
  getDashboard: () => request<DashboardPayload>("/admin/dashboard"),

  getStats: () => request<PlatformStats>("/admin/stats"),

  listOrganizations: (params?: {
    page?: number;
    search?: string;
    status?: "ACTIVE" | "SUSPENDED" | "PENDING";
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return request<{
      items: OrganizationSummary[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/admin/organizations${qs ? `?${qs}` : ""}`);
  },

  createOrganization: (body: Record<string, unknown>) =>
    request<{
      organization: OrganizationSummary;
      admin: { id: string; email: string; name: string };
      temporaryPassword: string;
    }>("/admin/organizations", { method: "POST", body: JSON.stringify(body) }),

  updateOrganization: (id: string, body: Record<string, unknown>) =>
    request<{ organization: OrganizationSummary }>(`/admin/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  activateOrganization: (id: string) =>
    request<{ organization: OrganizationSummary }>(`/admin/organizations/${id}/activate`, {
      method: "POST",
    }),

  suspendOrganization: (id: string) =>
    request<{ organization: OrganizationSummary }>(`/admin/organizations/${id}/suspend`, {
      method: "POST",
    }),

  getOrganization: (id: string) => request<OrganizationDetail>(`/admin/organizations/${id}`),

  listOrganizationEmployees: (
    organizationId: string,
    params?: { page?: number; search?: string; status?: string; role?: string },
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    if (params?.role) q.set("role", params.role);
    const qs = q.toString();
    return request<{ items: OrgEmployee[]; total: number; page: number; pageSize: number }>(
      `/admin/organizations/${organizationId}/employees${qs ? `?${qs}` : ""}`,
    );
  },

  createOrganizationEmployee: (organizationId: string, body: Record<string, unknown>) =>
    request<{ user: OrgEmployee; temporaryPassword: string }>(
      `/admin/organizations/${organizationId}/employees`,
      { method: "POST", body: JSON.stringify(body) },
    ),

  updateOrganizationEmployee: (
    organizationId: string,
    userId: string,
    body: Record<string, unknown>,
  ) =>
    request<{ user: OrgEmployee }>(`/admin/organizations/${organizationId}/employees/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deactivateOrganizationEmployee: (organizationId: string, userId: string) =>
    request<{ user: OrgEmployee }>(
      `/admin/organizations/${organizationId}/employees/${userId}`,
      { method: "DELETE" },
    ),

  activateOrganizationEmployee: (organizationId: string, userId: string) =>
    request<{ user: OrgEmployee }>(
      `/admin/organizations/${organizationId}/employees/${userId}/activate`,
      { method: "POST" },
    ),

  resetOrganizationEmployeePassword: (organizationId: string, userId: string) =>
    request<{ temporaryPassword: string }>(
      `/admin/organizations/${organizationId}/employees/${userId}/reset-password`,
      { method: "POST" },
    ),

  resendOrganizationEmployeeInvite: (organizationId: string, userId: string) =>
    request<{ ok: boolean }>(
      `/admin/organizations/${organizationId}/employees/${userId}/resend-invite`,
      { method: "POST" },
    ),

  listOrganizationMeetings: (
    organizationId: string,
    params?: { page?: number; search?: string; status?: string },
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return request<{ items: OrgMeeting[]; total: number; page: number; pageSize: number }>(
      `/admin/organizations/${organizationId}/meetings${qs ? `?${qs}` : ""}`,
    );
  },

  listOrganizationAuditLogs: (organizationId: string, params?: { page?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    const qs = q.toString();
    return request<{ items: OrgAuditItem[]; total: number; page: number; pageSize: number }>(
      `/admin/organizations/${organizationId}/audit-logs${qs ? `?${qs}` : ""}`,
    );
  },

  getBillingPricing: () => request<{ pricing: PlatformPricing }>("/admin/billing/pricing"),

  updateBillingPricing: (body: PlatformPricing) =>
    request<{ pricing: PlatformPricing }>("/admin/billing/pricing", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  resetBillingPricing: () =>
    request<{ pricing: PlatformPricing }>("/admin/billing/pricing/reset", { method: "POST" }),

  listCustomerBilling: () =>
    request<{ pricing: PlatformPricing; items: CustomerBillingRow[] }>("/admin/billing/customers"),

  getCustomerBilling: (organizationId: string) =>
    request<{ billing: CustomerBillingDetail }>(`/admin/billing/customers/${organizationId}`),

  updateCustomerBilling: (organizationId: string, body: Record<string, unknown>) =>
    request<{ billing: CustomerBillingDetail }>(`/admin/billing/customers/${organizationId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
