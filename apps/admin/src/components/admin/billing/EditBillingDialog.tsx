import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CustomerBillingRow } from "@/lib/billing-types";
import { editBillingSchema, type EditBillingFormValues } from "@/lib/billing-schemas";
import { adminApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/admin/FormFields";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

const PLAN_OPTIONS = [
  { value: "STARTER", label: "Starter" },
  { value: "PROFESSIONAL", label: "Growth" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "FOREVER_FREE", label: "Forever Free" },
];

const CYCLE_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "TRIAL", label: "Trial" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function EditBillingDialog({
  open,
  onOpenChange,
  row,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CustomerBillingRow | null;
  onSaved: () => void;
}) {
  const form = useForm<EditBillingFormValues>({
    resolver: zodResolver(editBillingSchema),
    defaultValues: {
      subscriptionPlan: "STARTER",
      billingCycle: "monthly",
      billingStatus: "PENDING",
      activeLocations: 0,
      discountPercent: 0,
      billingEmail: "",
      nextBillingDate: "",
    },
  });

  useEffect(() => {
    if (!row || !open) return;
    form.reset({
      subscriptionPlan: row.currentPlan as EditBillingFormValues["subscriptionPlan"],
      billingCycle: row.billingCycle as EditBillingFormValues["billingCycle"],
      billingStatus: row.billingStatus as EditBillingFormValues["billingStatus"],
      activeLocations: row.activeLocations,
      discountPercent: 0,
      billingEmail: "",
      nextBillingDate: row.nextBillingDate
        ? row.nextBillingDate.slice(0, 10)
        : "",
    });
  }, [row, open, form]);

  const save = useMutation({
    mutationFn: (values: EditBillingFormValues) =>
      adminApi.updateCustomerBilling(row!.organizationId, {
        subscriptionPlan: values.subscriptionPlan,
        billingCycle: values.billingCycle,
        billingStatus: values.billingStatus,
        activeLocations: values.activeLocations,
        discountPercent: values.discountPercent,
        billingEmail: values.billingEmail || null,
        nextBillingDate: values.nextBillingDate || null,
      }),
    onSuccess: () => {
      toast.success("Billing updated");
      onSaved();
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[14px]">
        <DialogHeader>
          <DialogTitle>Edit plan — {row?.organizationName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => save.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <FormSelect
              control={form.control}
              name="subscriptionPlan"
              label="Plan"
              options={PLAN_OPTIONS}
            />
            <FormSelect
              control={form.control}
              name="billingCycle"
              label="Billing cycle"
              options={CYCLE_OPTIONS}
            />
            <FormSelect
              control={form.control}
              name="billingStatus"
              label="Billing status"
              options={STATUS_OPTIONS}
            />
            <FormInput
              control={form.control}
              name="activeLocations"
              label="Active parking locations"
              type="number"
            />
            <FormInput
              control={form.control}
              name="discountPercent"
              label="Discount (%)"
              type="number"
            />
            <FormInput
              control={form.control}
              name="billingEmail"
              label="Billing email"
              type="email"
            />
            <FormInput
              control={form.control}
              name="nextBillingDate"
              label="Next billing date"
              type="date"
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={save.isPending}
              >
                {save.isPending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
