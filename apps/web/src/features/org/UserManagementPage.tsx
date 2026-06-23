import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MoreHorizontal, Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orgApi, type SeatBillingPreview } from "@/services/tenant-api";
import type { OrgEmployee } from "@/lib/tenant-types";
import { SeatUsageDashboard } from "./components/SeatUsageDashboard";
import { BillingImpactDialog } from "./components/BillingImpactDialog";

const ROLE_OPTIONS = [
  { value: "EMPLOYEE", label: "Member" },
  { value: "VIEWER", label: "Viewer" },
  { value: "MANAGER", label: "Manager" },
  { value: "ORG_ADMIN", label: "Organization Admin" },
];

const ROLE_LABELS: Record<string, string> = {
  ORG_ADMIN: "Organization Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Member",
  VIEWER: "Viewer",
};

type InviteMode = "invite" | "manual";

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("users");
  const [open, setOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState<InviteMode>("invite");
  const [editUser, setEditUser] = useState<OrgEmployee | null>(null);
  const [historyUser, setHistoryUser] = useState<OrgEmployee | null>(null);
  const [billingPreview, setBillingPreview] = useState<SeatBillingPreview | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    role: "EMPLOYEE",
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    department: "",
    designation: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
  });

  const { data: planUsage } = useQuery({
    queryKey: ["org", "plan-usage"],
    queryFn: orgApi.getPlanUsage,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["org", "users"],
    queryFn: () => orgApi.listUsers(),
  });

  const { data: invitations } = useQuery({
    queryKey: ["org", "invitations"],
    queryFn: orgApi.listInvitations,
  });

  const { data: loginHistory } = useQuery({
    queryKey: ["org", "login-history", historyUser?.id],
    queryFn: () => orgApi.getLoginHistory(historyUser!.id),
    enabled: Boolean(historyUser?.id),
  });

  function invalidateAll() {
    void queryClient.invalidateQueries({ queryKey: ["org", "users"] });
    void queryClient.invalidateQueries({ queryKey: ["org", "invitations"] });
    void queryClient.invalidateQueries({ queryKey: ["org", "plan-usage"] });
  }

  function handleBillingError(err: unknown, retry: (confirm: boolean) => void) {
    const error = err as Error & { code?: string; billingPreview?: SeatBillingPreview };
    if (error.code === "seat_limit_confirmation_required" && error.billingPreview) {
      setBillingPreview(error.billingPreview);
      setPendingAction(() => () => retry(true));
      return;
    }
    toast.error(error.message);
  }

  const inviteUser = useMutation({
    mutationFn: (body: Record<string, unknown>) => orgApi.inviteUser(body),
    onSuccess: () => {
      toast.success("Invitation sent");
      setOpen(false);
      resetForm();
      invalidateAll();
    },
    onError: (e) =>
      handleBillingError(e, (confirm) =>
        inviteUser.mutate({ ...form, confirmAdditionalSeats: confirm }),
      ),
  });

  const createUser = useMutation({
    mutationFn: (body: Record<string, unknown>) => orgApi.createUser(body),
    onSuccess: (result) => {
      toast.success("User created", {
        description: `Temporary password: ${result.temporaryPassword}`,
        duration: 12000,
      });
      setOpen(false);
      resetForm();
      invalidateAll();
    },
    onError: (e) =>
      handleBillingError(e, (confirm) =>
        createUser.mutate({ ...form, confirmAdditionalSeats: confirm }),
      ),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      orgApi.updateUser(id, body),
    onSuccess: () => {
      toast.success("User updated");
      setEditUser(null);
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivate = useMutation({
    mutationFn: orgApi.deactivateUser,
    onSuccess: () => {
      toast.success("User disabled");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activate = useMutation({
    mutationFn: orgApi.activateUser,
    onSuccess: () => {
      toast.success("User enabled");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetPassword = useMutation({
    mutationFn: orgApi.resetPassword,
    onSuccess: (result) => {
      if ("emailSent" in result && result.emailSent) {
        toast.success(`Password reset email sent to ${result.email}`);
      } else {
        toast.success("Password reset", {
          description: `New password: ${result.temporaryPassword}`,
          duration: 12000,
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resendInvite = useMutation({
    mutationFn: orgApi.resendInvite,
    onSuccess: (result) => {
      toast.success("Invite resent", {
        description: `Temporary password: ${result.temporaryPassword}`,
        duration: 12000,
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resendInvitation = useMutation({
    mutationFn: orgApi.resendInvitation,
    onSuccess: () => toast.success("Invitation resent"),
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelInvitation = useMutation({
    mutationFn: orgApi.cancelInvitation,
    onSuccess: () => {
      toast.success("Invitation cancelled");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const forcePasswordChange = useMutation({
    mutationFn: orgApi.forcePasswordChange,
    onSuccess: () => toast.success("User must change password on next login"),
    onError: (e: Error) => toast.error(e.message),
  });

  function resetForm() {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      department: "",
      designation: "",
      role: "EMPLOYEE",
    });
  }

  function openEdit(user: OrgEmployee) {
    setEditUser(user);
    setEditForm({
      firstName: user.firstName ?? user.name.split(" ")[0] ?? "",
      lastName: user.lastName ?? "",
      mobile: user.mobile ?? "",
      department: user.profile?.department ?? "",
      designation: user.profile?.designation ?? "",
      role: user.role,
      status: user.status,
    });
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (inviteMode === "invite") {
      inviteUser.mutate(form);
    } else {
      createUser.mutate(form);
    }
  }

  const billingBlocked = planUsage && !planUsage.canAddUser;

  return (
    <div className="space-y-7 max-w-6xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Organization</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            <span className="text-gradient">User Management</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Invite team members, manage roles, and monitor seat usage.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="gap-1.5 shine" disabled={billingBlocked}>
              <Plus className="h-4 w-4" />
              Add user
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add user</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                size="sm"
                variant={inviteMode === "invite" ? "default" : "outline"}
                onClick={() => setInviteMode("invite")}
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Send invitation
              </Button>
              <Button
                type="button"
                size="sm"
                variant={inviteMode === "manual" ? "default" : "outline"}
                onClick={() => setInviteMode("manual")}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Add manually
              </Button>
            </div>
            <form className="space-y-3" onSubmit={submitForm}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>First name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Last name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Mobile</Label>
                <Input
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Designation</Label>
                  <Input
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(role) => setForm((f) => ({ ...f, role }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {inviteMode === "manual" ? (
                <p className="text-xs text-muted-foreground">
                  A temporary password will be generated and emailed to the user.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  An invitation email with a secure link will be sent. The user sets their own
                  password.
                </p>
              )}
              <Button
                type="submit"
                disabled={inviteUser.isPending || createUser.isPending}
                className="w-full"
              >
                {inviteMode === "invite" ? "Send invitation" : "Create user"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {planUsage ? <SeatUsageDashboard usage={planUsage} /> : null}

      {billingBlocked ? (
        <p className="text-sm text-destructive bg-destructive/[0.07] border border-destructive/20 rounded-xl px-4 py-3">
          Billing is inactive. Resolve billing issues before adding users.
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">
            Active users ({data?.total ?? 0})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Pending invitations ({invitations?.pending.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                            {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                          {user.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{user.profile?.department ?? "—"}</TableCell>
                      <TableCell>{ROLE_LABELS[user.role] ?? user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "ACTIVE" ? "success" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(user)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setHistoryUser(user)}>
                              Login history
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resetPassword.mutate(user.id)}>
                              Reset password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resendInvite.mutate(user.id)}>
                              Resend credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => forcePasswordChange.mutate(user.id)}>
                              Force password change
                            </DropdownMenuItem>
                            {user.status === "ACTIVE" ? (
                              <DropdownMenuItem onClick={() => deactivate.mutate(user.id)}>
                                Disable
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => activate.mutate(user.id)}>
                                Enable
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations?.pending.length ? (
                  invitations.pending.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {inv.firstName} {inv.lastName}
                      </TableCell>
                      <TableCell>{inv.email}</TableCell>
                      <TableCell>{ROLE_LABELS[inv.role] ?? inv.role}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(inv.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => resendInvitation.mutate(inv.id)}>
                              Resend invitation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => cancelInvitation.mutate(inv.id)}>
                              Cancel invitation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No pending invitations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(editUser)} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {editUser ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateUser.mutate({
                  id: editUser.id,
                  body: {
                    ...editForm,
                    department: editForm.department || null,
                    designation: editForm.designation || null,
                    mobile: editForm.mobile || null,
                  },
                });
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>First name</Label>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Last name</Label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(role) => setEditForm((f) => ({ ...f, role }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={updateUser.isPending} className="w-full">
                Save changes
              </Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(historyUser)} onOpenChange={(o) => !o && setHistoryUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Login history — {historyUser?.name}</DialogTitle>
          </DialogHeader>
          <ul className="text-sm space-y-2 max-h-80 overflow-auto">
            {loginHistory?.items.length ? (
              loginHistory.items.map((item) => (
                <li key={item.id} className="border-b pb-2">
                  <span className="font-medium">{item.action}</span>
                  <span className="text-muted-foreground ml-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No login events recorded yet.</li>
            )}
          </ul>
        </DialogContent>
      </Dialog>

      <BillingImpactDialog
        open={Boolean(billingPreview)}
        preview={billingPreview}
        onConfirm={() => {
          pendingAction?.();
          setBillingPreview(null);
          setPendingAction(null);
        }}
        onCancel={() => {
          setBillingPreview(null);
          setPendingAction(null);
        }}
        isPending={inviteUser.isPending || createUser.isPending}
      />
    </div>
  );
}
