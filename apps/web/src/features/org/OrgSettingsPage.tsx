import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orgApi } from "@/services/tenant-api";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function OrgSettingsPage() {
  const queryClient = useQueryClient();
  const { refreshSession } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["org", "settings"],
    queryFn: async () => (await orgApi.getSettings()).organization,
  });

  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    email: "",
    phone: "",
    address: "",
    timezone: "Asia/Kolkata",
    meetingDefaultDurationMinutes: 60,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        logoUrl: data.logoUrl ?? "",
        email: data.email,
        phone: data.phone ?? "",
        address: data.address ?? "",
        timezone: data.timezone,
        meetingDefaultDurationMinutes: data.meetingDefaultDurationMinutes,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      orgApi.updateSettings({
        name: form.name,
        logoUrl: form.logoUrl || null,
        email: form.email,
        phone: form.phone || null,
        address: form.address || null,
        timezone: form.timezone,
        meetingDefaultDurationMinutes: form.meetingDefaultDurationMinutes,
      }),
    onSuccess: async () => {
      toast.success("Settings saved");
      void queryClient.invalidateQueries({ queryKey: ["org", "settings"] });
      await refreshSession();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-8 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-96 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-7">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Organization</p>
        <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
          <span className="text-gradient">Organization Settings</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage branding and defaults for your organization.
        </p>
      </div>

      <form
        className="space-y-5 rounded-xl border border-border/60 bg-card p-6 shadow-soft animate-fade-in-up"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="text-base font-heading font-semibold flex items-center gap-2 pb-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Settings className="h-3.5 w-3.5" />
          </span>
          Branding & defaults
        </h2>
        <div className="space-y-1">
          <Label>Organization name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label>Logo URL</Label>
          <Input
            value={form.logoUrl}
            onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Contact email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Contact phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Time zone</Label>
            <Input
              value={form.timezone}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Default meeting duration (minutes)</Label>
            <Input
              type="number"
              min={15}
              max={480}
              value={form.meetingDefaultDurationMinutes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  meetingDefaultDurationMinutes: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className="pt-2 border-t border-border/50">
          <Button type="submit" variant="secondary" className="shine" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
