import { useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Edit3,
  PauseCircle,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import { PageContainer } from "@/components/admin/PageContainer";
import { OrganizationAccountCard } from "@/components/admin/OrganizationAccountCard";
import { OrgDetailTabs } from "@/components/admin/organization/OrgDetailTabs";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { adminApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const defaultTab = searchParams.get("tab") ?? "overview";

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "organization", id],
    queryFn: () => adminApi.getOrganization(id!),
    enabled: Boolean(id),
  });

  const suspend = useMutation({
    mutationFn: () => adminApi.suspendOrganization(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Organization suspended");
      setConfirmSuspend(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activate = useMutation({
    mutationFn: () => adminApi.activateOrganization(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Organization activated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function switchTab(tab: string) {
    setSearchParams({ tab }, { replace: true });
    window.requestAnimationFrame(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-[22px]" />
          <Skeleton className="h-64 w-full rounded-[22px]" />
        </div>
      </PageContainer>
    );
  }

  if (!data?.organization) {
    return (
      <PageContainer>
        <EmptyState
          icon={Building2}
          title="Organization not found"
          description="This tenant may have been removed or you may not have access to view it."
          action={
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/organizations">Back to organizations</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const org = data.organization;
  const isSuspended = org.status === "SUSPENDED";

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2 w-fit text-slate-600" asChild>
        <Link to="/organizations">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Organizations
        </Link>
      </Button>

      <div className="mb-6 flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Tenant actions
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{org.name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200/80"
            onClick={() => switchTab("settings")}
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            Edit Organization
          </Button>

          {isSuspended ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => activate.mutate()}
              disabled={activate.isPending}
            >
              Activate Tenant
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
              onClick={() => setConfirmSuspend(true)}
              disabled={suspend.isPending}
            >
              <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
              Suspend Tenant
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50",
              defaultTab === "subscription" && "ring-1 ring-violet-300",
            )}
            onClick={() => switchTab("subscription")}
          >
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            View Billing
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200/80 opacity-60"
            disabled
            title="Coming soon"
          >
            <UserCog className="mr-1.5 h-3.5 w-3.5" />
            Impersonate Admin
          </Button>
        </div>
      </div>

      <OrganizationAccountCard org={org} subscription={data.subscription} />

      <div ref={tabsRef} className="scroll-mt-6">
        <OrgDetailTabs detail={data} organizationId={id!} defaultTab={defaultTab} />
      </div>

      <ConfirmDialog
        open={confirmSuspend}
        onOpenChange={setConfirmSuspend}
        title="Suspend organization?"
        description={`Users at ${org.name} will lose access on their next request until reactivated.`}
        confirmLabel="Suspend"
        variant="danger"
        loading={suspend.isPending}
        onConfirm={() => suspend.mutate()}
      />
    </PageContainer>
  );
}
