import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { orgApi } from "@/services/tenant-api";
import type { OrgEmployee } from "@/lib/tenant-types";

const ROLE_OPTIONS = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "MANAGER", label: "Manager" },
  { value: "ORG_ADMIN", label: "Organization Admin" },
];

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<OrgEmployee | null>(null);
  const [historyUser, setHistoryUser] = useState<OrgEmployee | null>(null);

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

  const { data: loginHistory } = useQuery({
    queryKey: ["org", "login-history", historyUser?.id],
    queryFn: () => orgApi.getLoginHistory(historyUser!.id),
    enabled: Boolean(historyUser?.id),
  });

  const createUser = useMutation({
    mutationFn: orgApi.createUser,
    onSuccess: (result) => {
      toast.success("Employee invited", {
        description: `Temporary password: ${result.temporaryPassword}`,
        duration: 12000,
      });
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["org", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["org", "plan-usage"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      orgApi.updateUser(id, body),
    onSuccess: () => {
      toast.success("Employee updated");
      setEditUser(null);
      void queryClient.invalidateQueries({ queryKey: ["org", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivate = useMutation({
    mutationFn: orgApi.deactivateUser,
    onSuccess: () => {
      toast.success("Employee deactivated");
      void queryClient.invalidateQueries({ queryKey: ["org", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["org", "plan-usage"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activate = useMutation({
    mutationFn: orgApi.activateUser,
    onSuccess: () => {
      toast.success("Employee enabled");
      void queryClient.invalidateQueries({ queryKey: ["org", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["org", "plan-usage"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetPassword = useMutation({
    mutationFn: orgApi.resetPassword,
    onSuccess: (result) => {
      toast.success("Password reset", {
        description: `New password: ${result.temporaryPassword}`,
        duration: 12000,
      });
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

  const forcePasswordChange = useMutation({
    mutationFn: orgApi.forcePasswordChange,
    onSuccess: () => toast.success("User must change password on next login"),
    onError: (e: Error) => toast.error(e.message),
  });

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

  const atLimit = planUsage && !planUsage.canAddUser;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your organization users.</p>
          {planUsage ? (
            <p className="text-xs text-muted-foreground mt-1">
              {planUsage.activeUsers}
              {planUsage.maxUsers !== null ? ` / ${planUsage.maxUsers}` : ""} active users (
              {planUsage.subscriptionPlan})
            </p>
          ) : null}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={atLimit}>
              <Plus className="h-4 w-4 mr-2" />
              Invite employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite employee</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                createUser.mutate(form);
              }}
            >
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
              <Button type="submit" disabled={createUser.isPending} className="w-full">
                Send invite
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {atLimit ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          You have reached the user limit for your plan. Upgrade to add more employees.
        </p>
      ) : null}

      <div className="rounded-md border bg-card">
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
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile?.department ?? "—"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Actions
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
                          Resend invite
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

      <Dialog open={Boolean(editUser)} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit employee</DialogTitle>
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
                <Label>Mobile</Label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input
                    value={editForm.department}
                    onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Designation</Label>
                  <Input
                    value={editForm.designation}
                    onChange={(e) => setEditForm((f) => ({ ...f, designation: e.target.value }))}
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
    </div>
  );
}
