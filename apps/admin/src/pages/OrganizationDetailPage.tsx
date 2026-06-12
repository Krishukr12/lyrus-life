import { useState } from "react";
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

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
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

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
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

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Button variant="ghost" size="sm" className="-ml-2 w-fit text-slate-600" asChild>
          <Link to="/organizations">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Organizations
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200/80"
            asChild
          >
            <Link to={`/organizations/${id}?tab=settings`}>
              <Edit3 className="mr-1.5 h-3.5 w-3.5" />
              Edit Organization
            </Link>
          </Button>
          {org.status === "SUSPENDED" ? (
            <Button
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
              variant="outline"
              size="sm"
              className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
              onClick={() => setConfirmSuspend(true)}
            >
              <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
              Suspend Tenant
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50"
            asChild
          >
            <Link to={`/organizations/${id}?tab=subscription`}>
              <CreditCard className="mr-1.5 h-3.5 w-3.5" />
              View Billing
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200/80"
            onClick={() =>
              toast.info("Admin impersonation is not available in this environment yet.")
            }
          >
            <UserCog className="mr-1.5 h-3.5 w-3.5" />
            Impersonate Admin
          </Button>
        </div>
      </div>

      <OrganizationAccountCard
        org={org}
        usage={data.usage}
        subscription={data.subscription}
      />

      <OrgDetailTabs detail={data} organizationId={id!} defaultTab={defaultTab} />

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
