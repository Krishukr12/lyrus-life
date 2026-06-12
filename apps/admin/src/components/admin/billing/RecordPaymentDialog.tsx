import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { adminApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/admin/FormFields";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

const schema = z.object({
  amountInr: z.coerce.number().int().min(1, "Amount must be at least ₹1"),
  method: z.string().max(80).optional(),
  reference: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export function RecordPaymentDialog({
  open,
  onOpenChange,
  organizationId,
  organizationName,
  suggestedAmountInr,
  invoiceId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName: string;
  suggestedAmountInr?: number;
  invoiceId?: string;
  onSaved: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountInr: suggestedAmountInr ?? 0,
      method: "bank_transfer",
      reference: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      amountInr: suggestedAmountInr ?? 0,
      method: "bank_transfer",
      reference: "",
      notes: "",
    });
  }, [open, suggestedAmountInr, form]);

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      adminApi.recordPayment(organizationId, {
        ...values,
        invoiceId,
      }),
    onSuccess: () => {
      toast.success("Payment recorded");
      onSaved();
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[14px]">
        <DialogHeader>
          <DialogTitle>Record payment — {organizationName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => save.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <FormInput
              control={form.control}
              name="amountInr"
              label="Amount (INR)"
              type="number"
            />
            <FormInput control={form.control} name="method" label="Payment method" />
            <FormInput control={form.control} name="reference" label="Reference / transaction ID" />
            <FormInput control={form.control} name="notes" label="Notes" />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={save.isPending}
              >
                {save.isPending ? "Saving…" : "Record payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
