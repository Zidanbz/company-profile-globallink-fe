import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none"
        >
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              className={cn(
                "peer h-4 w-4 appearance-none rounded-md border border-slate-300 bg-white checked:bg-brand-600 checked:border-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500",
                className
              )}
              {...props}
            />
            <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
          </div>
          {label && <span>{label}</span>}
        </label>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
