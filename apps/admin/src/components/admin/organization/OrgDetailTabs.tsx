import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  CreditCard,
  Globe,
  Mail,
  Phone,
  Settings,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/admin/EmptyState";
import { BillingStatusPill } from "@/components/admin/billing/BillingStatusPill";
import { CustomerBillingDashboardDialog } from "@/components/admin/billing/CustomerBillingDashboardDialog";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { RecordPaymentDialog } from "@/components/admin/billing/RecordPaymentDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInr } from "@/lib/format-inr";
import type { OrganizationDetail } from "@/lib/org-types";
import { adminApi } from "@/services/api";
import { cn } from "@/lib/utils";

const TAB_ITEMS = [
  { value: "overview", label: "Overview", icon: Building2 },
  { value: "employees", label: "Employees", icon: Users },
  { value: "meetings", label: "Meetings", icon: Video },
  { value: "subscription", label: "Subscription", icon: CreditCard },
  { value: "activity", label: "Activity Logs", icon: Activity },
  { value: "settings", label: "Settings", icon: Settings },
] as const;

const overviewCardShell =
  "overflow-hidden rounded-[28px] border border-slate-100/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]";

function OverviewCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: typeof Building2;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(overviewCardShell, className)}>
      <div className="flex items-center justify-between gap-3 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-900">{value || "—"}</span>
    </div>
  );
}

export function OrgOverviewTab({ detail }: { detail: OrganizationDetail }) {
  const { organization: org, usage, admin, subscription } = detail;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <OverviewCard title="Company Profile" icon={Building2}>
        <InfoItem label="Organization name" value={org.name} />
        <InfoItem label="Organization code" value={org.code} />
        <InfoItem label="Legal name" value={org.legalName} />
        <InfoItem label="Industry" value={org.industry} />
        <InfoItem label="Company size" value={org.companySize} />
        <InfoItem label="Website" value={org.website} />
        <InfoItem label="Country" value={org.country} />
        <InfoItem label="Timezone" value={org.timezone} />
      </OverviewCard>

      <OverviewCard title="Subscription Status" icon={CreditCard}>
        <div className="mb-4 flex flex-wrap gap-2">
          <StatusBadge status={org.status} />
          <PlanBadge plan={org.subscriptionPlan} />
          {subscription ? (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
              {subscription.billingStatus}
            </span>
          ) : null}
        </div>
        <InfoItem label="Plan" value={subscription?.planLabel ?? org.subscriptionPlan} />
        <InfoItem label="Billing cycle" value={subscription?.billingCycle} />
        <InfoItem
          label="Renewal date"
          value={
            subscription?.nextBillingDate
              ? format(new Date(subscription.nextBillingDate), "MMM d, yyyy")
              : null
          }
        />
        <InfoItem
          label="Monthly revenue"
          value={subscription ? formatInr(subscription.monthlyAmountInr) : null}
        />
        <InfoItem
          label="Total with GST"
          value={subscription ? formatInr(subscription.totalAmountInr) : null}
        />
      </OverviewCard>

      <OverviewCard title="Usage Analytics" icon={BarChart3}>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <UsageStat label="Employees" value={usage.totalEmployees} />
          <UsageStat label="Active" value={usage.activeEmployees} />
          <UsageStat label="Meetings" value={usage.totalMeetings} />
        </div>
        <InfoItem
          label="Included users"
          value={subscription ? String(subscription.includedUsers) : null}
        />
        <InfoItem
          label="Additional users"
          value={subscription ? String(subscription.additionalUsers) : null}
        />
        <InfoItem label="Current users" value={String(subscription?.activeUsers ?? usage.totalEmployees)} />
        <InfoItem
          label="Meeting usage"
          value={
            subscription
              ? `${subscription.totalMeetings}${subscription.meetingLimit != null ? ` / ${subscription.meetingLimit}` : ""}`
              : String(usage.totalMeetings)
          }
        />
        <InfoItem label="Created" value={format(new Date(org.createdAt), "MMM d, yyyy")} />
      </OverviewCard>

      <OverviewCard title="Admin Information" icon={Shield}>
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-white p-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] text-sm font-bold text-white">
            {(admin?.name ?? org.primaryContactName ?? "A").charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {admin?.name ?? org.primaryContactName ?? "—"}
            </p>
            <p className="text-xs text-slate-500">Organization administrator</p>
          </div>
        </div>
        <InfoItem label="Email" value={admin?.email ?? org.email} />
        <InfoItem label="Phone" value={admin?.phone ?? org.phone} />
        <InfoItem
          label="Last login"
          value={
            admin?.lastLoginAt ? format(new Date(admin.lastLoginAt), "MMM d, yyyy HH:mm") : null
          }
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <Mail className="h-3 w-3" />
            {admin?.email ?? org.email}
          </span>
          {(admin?.phone ?? org.phone) ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <Phone className="h-3 w-3" />
              {admin?.phone ?? org.phone}
            </span>
          ) : null}
          {org.timezone ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <Globe className="h-3 w-3" />
              {org.timezone}
            </span>
          ) : null}
        </div>
      </OverviewCard>
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white px-3 py-3 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <p className="text-[10px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

export function OrgEmployeesTab({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newEmp, setNewEmp] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "EMPLOYEE",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "org", organizationId, "employees", page, search],
    queryFn: () =>
      adminApi.listOrganizationEmployees(organizationId, {
        page,
        search: search || undefined,
      }),
  });

  const activate = useMutation({
    mutationFn: (userId: string) => adminApi.activateOrganizationEmployee(organizationId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "org", organizationId] });
      toast.success("Employee activated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivate = useMutation({
    mutationFn: (userId: string) => adminApi.deactivateOrganizationEmployee(organizationId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "org", organizationId] });
      toast.success("Employee disabled");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createEmp = useMutation({
    mutationFn: () => adminApi.createOrganizationEmployee(organizationId, newEmp),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "org", organizationId] });
      setShowAdd(false);
      setNewEmp({ firstName: "", lastName: "", email: "", role: "EMPLOYEE" });
      toast.success(`Employee created. Temp password: ${res.temporaryPassword}`, { duration: 20000 });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetPw = useMutation({
    mutationFn: (userId: string) => adminApi.resetOrganizationEmployeePassword(organizationId, userId),
    onSuccess: (res) => {
      if (res.emailSent) {
        toast.success(`Password reset email sent to ${res.email}`);
      } else {
        toast.success(`Password reset. Temporary password: ${res.temporaryPassword}`, {
          duration: 20000,
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isLoading && data?.items.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Invite organization admins and employees from the organization portal or create them here."
      />
    );
  }

  return (
    <div className={overviewCardShell}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <Input
          placeholder="Search employees…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm rounded-xl"
        />
        <Button size="sm" className="rounded-xl" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : "Add employee"}
        </Button>
      </div>
      {showAdd ? (
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="First name"
            value={newEmp.firstName}
            onChange={(e) => setNewEmp((f) => ({ ...f, firstName: e.target.value }))}
          />
          <Input
            placeholder="Last name"
            value={newEmp.lastName}
            onChange={(e) => setNewEmp((f) => ({ ...f, lastName: e.target.value }))}
          />
          <Input
            placeholder="Email"
            type="email"
            value={newEmp.email}
            onChange={(e) => setNewEmp((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            placeholder="Role (EMPLOYEE)"
            value={newEmp.role}
            onChange={(e) => setNewEmp((f) => ({ ...f, role: e.target.value }))}
          />
          <Button onClick={() => createEmp.mutate()} disabled={createEmp.isPending}>
            Create
          </Button>
        </div>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500">
                Loading…
              </TableCell>
            </TableRow>
          ) : (
            data?.items.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp.profile?.department ?? "—"}</TableCell>
                <TableCell>{emp.status}</TableCell>
                <TableCell>
                  {emp.lastLoginAt ? format(new Date(emp.lastLoginAt), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="space-x-1 text-right">
                  {emp.status !== "ACTIVE" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => activate.mutate(emp.id)}
                      disabled={activate.isPending}
                    >
                      Enable
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deactivate.mutate(emp.id)}
                      disabled={deactivate.isPending}
                    >
                      Disable
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resetPw.mutate(emp.id)}
                    disabled={resetPw.isPending}
                  >
                    Reset password
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {data && data.total > data.pageSize ? (
        <div className="flex justify-end gap-2 border-t border-slate-100 p-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page * data.pageSize >= data.total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function OrgMeetingsTab({ organizationId }: { organizationId: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "org", organizationId, "meetings", page, search],
    queryFn: () =>
      adminApi.listOrganizationMeetings(organizationId, {
        page,
        search: search || undefined,
      }),
  });

  if (!isLoading && data?.items.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No meetings found"
        description="Meetings scheduled by this organization will appear here."
      />
    );
  }

  return (
    <div className={overviewCardShell}>
      <div className="border-b border-slate-100 px-6 py-5">
        <Input
          placeholder="Search meetings…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm rounded-xl"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-500">
                Loading…
              </TableCell>
            </TableRow>
          ) : (
            data?.items.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell>{m.organizerName ?? "—"}</TableCell>
                <TableCell>{format(new Date(m.scheduledAt), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell>{m.durationMinutes} min</TableCell>
                <TableCell>{m.participantCount}</TableCell>
                <TableCell>{m.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function OrgSubscriptionTab({ detail }: { detail: OrganizationDetail }) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const org = detail.organization;
  const sub = detail.subscription;

  const sendInvoice = useMutation({
    mutationFn: () => adminApi.sendLatestInvoice(org.id),
    onSuccess: () => {
      toast.success("Invoice generated and sent");
      void queryClient.invalidateQueries({ queryKey: ["admin", "organization", org.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!sub) {
    return (
      <EmptyState
        icon={Building2}
        title="No subscription data"
        description="Billing profile has not been set up for this organization yet."
      />
    );
  }

  const billingRow = {
    organizationId: org.id,
    organizationName: org.name,
    slug: org.slug,
    currentPlan: sub.plan,
    currentPlanLabel: sub.planLabel,
    activeUsers: sub.activeUsers,
    activeLocations: 0,
    billingCycle: sub.billingCycle,
    monthlyAmountInr: sub.monthlyAmountInr,
    gstInr: sub.totalAmountInr - sub.monthlyAmountInr,
    totalAmountInr: sub.totalAmountInr,
    billingStatus: sub.billingStatus,
    nextBillingDate: sub.nextBillingDate,
    breakdown: {
      basePlanInr: 0,
      extraUsers: sub.additionalUsers,
      extraUsersCostInr: 0,
      extraLocations: 0,
      extraLocationsCostInr: 0,
      monthlySubtotalInr: sub.monthlyAmountInr,
      gstInr: sub.totalAmountInr - sub.monthlyAmountInr,
      totalInr: sub.totalAmountInr,
    },
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={sendInvoice.isPending}
          onClick={() => sendInvoice.mutate()}
        >
          <Mail className="h-4 w-4 mr-2" />
          {sendInvoice.isPending ? "Sending…" : "Send invoice"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setDashboardOpen(true)}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Billing dashboard
        </Button>
        <Button type="button" variant="outline" onClick={() => setPaymentOpen(true)}>
          Record payment
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <OverviewCard title="Billing Overview" icon={CreditCard}>
          <div className="mb-4 flex flex-wrap gap-2">
            <PlanBadge plan={sub.plan} />
            <BillingStatusPill status={sub.billingStatus} />
          </div>
          <InfoItem label="Current plan" value={sub.planLabel} />
          <InfoItem label="Billing cycle" value={sub.billingCycle} />
          <InfoItem
            label="Renewal date"
            value={sub.nextBillingDate ? format(new Date(sub.nextBillingDate), "MMM d, yyyy") : null}
          />
          {sub.trialEndsAt ? (
            <InfoItem
              label="Trial ends"
              value={format(new Date(sub.trialEndsAt), "MMM d, yyyy")}
            />
          ) : null}
        </OverviewCard>
        <OverviewCard title="Revenue & Seats" icon={BarChart3}>
          <InfoItem label="Monthly amount (INR)" value={formatInr(sub.monthlyAmountInr)} />
          <InfoItem label="Annual cost (INR)" value={formatInr(sub.annualCostInr)} />
          <InfoItem label="Total with GST (INR)" value={formatInr(sub.totalAmountInr)} />
          <InfoItem label="Included users" value={String(sub.includedUsers)} />
          <InfoItem label="Active users" value={String(sub.activeUsers)} />
          <InfoItem label="Additional users" value={String(sub.additionalUsers)} />
          <InfoItem
            label="Meetings"
            value={
              sub.meetingLimit != null
                ? `${sub.totalMeetings} / ${sub.meetingLimit}`
                : String(sub.totalMeetings)
            }
          />
        </OverviewCard>
      </div>

      <CustomerBillingDashboardDialog
        open={dashboardOpen}
        onOpenChange={setDashboardOpen}
        row={billingRow}
      />

      <RecordPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        organizationId={org.id}
        organizationName={org.name}
        suggestedAmountInr={sub.totalAmountInr}
        onSaved={() =>
          void queryClient.invalidateQueries({ queryKey: ["admin", "organization", org.id] })
        }
      />
    </>
  );
}

export function OrgActivityTab({ organizationId }: { organizationId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "org", organizationId, "audit"],
    queryFn: () => adminApi.listOrganizationAuditLogs(organizationId, { page: 1 }),
  });

  if (!isLoading && data?.items.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No activity logs available"
        description="Organization events will be recorded here as users interact with the platform."
      />
    );
  }

  return (
    <div className={cn("divide-y divide-slate-100", overviewCardShell)}>
      {isLoading ? (
        <p className="p-6 text-sm text-slate-500">Loading activity…</p>
      ) : (
        data?.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/50">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.detail}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {item.actor?.name ?? "System"} · {item.action}
              </p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
          </div>
        ))
      )}
    </div>
  );
}

export function OrgSettingsTab({
  detail,
  organizationId,
}: {
  detail: OrganizationDetail;
  organizationId: string;
}) {
  const queryClient = useQueryClient();
  const org = detail.organization;
  const [form, setForm] = useState({
    name: org.name,
    industry: org.industry ?? "",
    website: org.website ?? "",
    companySize: org.companySize ?? "",
    country: org.country ?? "",
    state: org.state ?? "",
    city: org.city ?? "",
    timezone: org.timezone ?? "Asia/Kolkata",
    email: org.email,
    phone: org.phone ?? "",
    primaryContactName: org.primaryContactName ?? "",
  });

  const save = useMutation({
    mutationFn: () => adminApi.updateOrganization(organizationId, form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "organization", organizationId] });
      toast.success("Organization updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const field = (key: keyof typeof form, label: string) => (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <Input
        className="rounded-xl"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </label>
  );

  return (
    <div className={cn("max-w-2xl space-y-4 p-6", overviewCardShell)}>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Organization name")}
        {field("industry", "Industry")}
        {field("website", "Website")}
        {field("companySize", "Company size")}
        {field("country", "Country")}
        {field("state", "State")}
        {field("city", "City")}
        {field("timezone", "Timezone")}
        {field("primaryContactName", "Primary contact name")}
        {field("email", "Contact email")}
        {field("phone", "Contact phone")}
      </div>
      <Button className="rounded-xl" onClick={() => save.mutate()} disabled={save.isPending}>
        Save changes
      </Button>
    </div>
  );
}

const TAB_VALUES = new Set(TAB_ITEMS.map((t) => t.value));

export function OrgDetailTabs({
  detail,
  organizationId,
  defaultTab = "overview",
}: {
  detail: OrganizationDetail;
  organizationId: string;
  defaultTab?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam && TAB_VALUES.has(tabParam as (typeof TAB_ITEMS)[number]["value"])
      ? tabParam
      : defaultTab;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setSearchParams({ tab: value }, { replace: true })}
      className="space-y-6"
    >
      <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-[18px] border border-slate-200/80 bg-slate-100/60 p-1.5 shadow-inner">
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold",
              "text-slate-500 transition-all duration-200",
              "data-[state=active]:bg-white data-[state=active]:text-slate-900",
              "data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-slate-200/80",
              "hover:text-slate-700",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
        <OrgOverviewTab detail={detail} />
      </TabsContent>
      <TabsContent value="employees" className="mt-0 focus-visible:outline-none">
        <OrgEmployeesTab organizationId={organizationId} />
      </TabsContent>
      <TabsContent value="meetings" className="mt-0 focus-visible:outline-none">
        <OrgMeetingsTab organizationId={organizationId} />
      </TabsContent>
      <TabsContent value="subscription" className="mt-0 focus-visible:outline-none">
        <OrgSubscriptionTab detail={detail} />
      </TabsContent>
      <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
        <OrgActivityTab organizationId={organizationId} />
      </TabsContent>
      <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
        <OrgSettingsTab detail={detail} organizationId={organizationId} />
      </TabsContent>
    </Tabs>
  );
}
