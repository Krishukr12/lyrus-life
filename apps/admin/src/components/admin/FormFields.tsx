import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { ReactNode } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoComplete?: string;
  startIcon?: ReactNode;
  onFocus?: () => void;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  labelClassName,
  inputClassName,
  disabled,
  autoComplete,
  startIcon,
  onFocus,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col gap-1.5", className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <div className={cn("relative w-full", startIcon && "has-icon")}>
            {startIcon ? (
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
                {startIcon}
              </span>
            ) : null}
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={cn(
                  "h-10 w-full rounded-[10px] border-[#e5e7eb] bg-white",
                  "aria-[invalid=true]:border-admin-danger aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-admin-danger/20",
                  startIcon && "pl-9",
                  inputClassName,
                )}
                {...field}
                value={field.value ?? ""}
                onFocus={() => onFocus?.()}
                onChange={(e) => {
                  if (type === "number") {
                    const raw = e.target.value;
                    field.onChange(raw === "" ? "" : Number(raw));
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type SelectOption = { value: string; label: string };

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
};

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select…",
  options,
  className,
  disabled,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value ? String(field.value) : undefined}
          >
            <FormControl>
              <SelectTrigger className="h-10 w-full rounded-[10px] border-[#e5e7eb] bg-white aria-[invalid=true]:border-admin-danger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Consistent two-column form grid with aligned fields. */
export function FormGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "grid w-full gap-x-5 gap-y-5",
        columns === 2 ? "grid-cols-1 md:grid-cols-2 md:items-start" : "grid-cols-1",
      )}
    >
      {children}
    </div>
  );
}

export function FormGridFull({ children }: { children: ReactNode }) {
  return <div className="md:col-span-2 w-full">{children}</div>;
}
