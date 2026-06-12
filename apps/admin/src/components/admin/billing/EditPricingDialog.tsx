import { useEffect } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const starterSchema = z.object({
  starterMonthlyInr: z.coerce.number().int().min(0),
  starterYearlyInr: z.coerce.number().int().min(0),
});

const growthSchema = z.object({
  growthMonthlyInr: z.coerce.number().int().min(0),
  growthYearlyInr: z.coerce.number().int().min(0),
});

const enterpriseSchema = z.object({
  enterpriseBaseMonthlyInr: z.coerce.number().int().min(0),
  extraUserMonthlyInr: z.coerce.number().int().min(0),
  extraLocationMonthlyInr: z.coerce.number().int().min(0),
});

export type PricingEditTarget = "starter" | "growth" | "enterprise";

type EditPricingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: PricingEditTarget | null;
  values: Record<string, number>;
  onSave: (patch: Record<string, number>) => void;
  saving?: boolean;
};

export function EditPricingDialog({
  open,
  onOpenChange,
  target,
  values,
  onSave,
  saving,
}: EditPricingDialogProps) {
  const schema =
    target === "starter" ? starterSchema : target === "growth" ? growthSchema : enterpriseSchema;

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: values,
  });

  const control = form.control as Control<FieldValues>;

  useEffect(() => {
    if (open && target) {
      if (target === "starter") {
        form.reset({
          starterMonthlyInr: values.starterMonthlyInr,
          starterYearlyInr: values.starterYearlyInr,
        });
      } else if (target === "growth") {
        form.reset({
          growthMonthlyInr: values.growthMonthlyInr,
          growthYearlyInr: values.growthYearlyInr,
        });
      } else {
        form.reset({
          enterpriseBaseMonthlyInr: values.enterpriseBaseMonthlyInr,
          extraUserMonthlyInr: values.extraUserMonthlyInr,
          extraLocationMonthlyInr: values.extraLocationMonthlyInr,
        });
      }
    }
  }, [open, target, values, form]);

  const titles = {
    starter: "Edit Starter pricing",
    growth: "Edit Growth pricing",
    enterprise: "Edit Enterprise & add-ons",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[14px]">
        <DialogHeader>
          <DialogTitle>{target ? titles[target] : "Edit pricing"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => onSave(v as Record<string, number>))}
            className="space-y-4"
            noValidate
          >
            {target === "starter" ? (
              <>
                <FormInput
                  control={control}
                  name="starterMonthlyInr"
                  label="Monthly price (₹)"
                  type="number"
                />
                <FormInput
                  control={control}
                  name="starterYearlyInr"
                  label="Yearly price (₹)"
                  type="number"
                />
              </>
            ) : null}
            {target === "growth" ? (
              <>
                <FormInput
                  control={control}
                  name="growthMonthlyInr"
                  label="Monthly price (₹)"
                  type="number"
                />
                <FormInput
                  control={control}
                  name="growthYearlyInr"
                  label="Yearly price (₹)"
                  type="number"
                />
              </>
            ) : null}
            {target === "enterprise" ? (
              <>
                <FormInput
                  control={control}
                  name="enterpriseBaseMonthlyInr"
                  label="Enterprise base (₹/month)"
                  type="number"
                />
                <FormInput
                  control={control}
                  name="extraUserMonthlyInr"
                  label="Extra user (₹/user/month)"
                  type="number"
                />
                <FormInput
                  control={control}
                  name="extraLocationMonthlyInr"
                  label="Extra location (₹/location/month)"
                  type="number"
                />
              </>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
