import type { OrganizationSummary } from "@/lib/types";

export type HealthStatus = "healthy" | "monitoring" | "down";

export type DashboardHealthService = {
  name: string;
  status: HealthStatus;
  label: string;
};

export type DashboardActivityItem = {
  id: string;
  action: string;
  detail: string;
  time: string;
  createdAt: string;
};

/** Fixed height for bottom dashboard panels — lists scroll inside. */
export const DASHBOARD_PANEL_HEIGHT = "h-[420px]";

/** Analytics + health row — matched height, scrollable bodies. */
export const DASHBOARD_INSIGHT_HEIGHT = "h-[340px]";

export type DashboardPendingRequest = {
  id: string;
  org: string;
  plan: string;
  email: string;
  submitted: string;
};

export type DashboardChartPoint = {
  label: string;
  count: number;
};

export type DashboardRevenueRow = {
  organizationId: string;
  organizationName: string;
  amountInr: number;
};

export type DashboardPayload = {
  organizations: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    growthPercent: number;
  };
  users: {
    total: number;
    active: number;
    newLast30Days: number;
  };
  meetings: {
    total: number;
    today: number;
    thisMonth: number;
    liveNow: number;
  };
  billing: {
    mrrInr: number;
    activeSubscriptions: number;
    trialAccounts: number;
    upcomingRenewals: number;
  };
  charts: {
    tenantGrowth: DashboardChartPoint[];
    meetingsByMonth: DashboardChartPoint[];
    revenueByCustomer: DashboardRevenueRow[];
  };
  recentOrganizations: OrganizationSummary[];
  recentActivity: DashboardActivityItem[];
  pendingRequests: DashboardPendingRequest[];
  systemHealth: {
    services: DashboardHealthService[];
    allOperational: boolean;
  };
  livekit: {
    configured: boolean;
    status: HealthStatus;
    activeRooms: number;
    activeParticipants: number;
    ongoingMeetings: number;
    webhookConfigured: boolean;
  };
};
