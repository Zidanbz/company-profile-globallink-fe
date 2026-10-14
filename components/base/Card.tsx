import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glassDark" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card rounded-2xl text-slate-900 dark:text-slate-100",
      glass:
        "glass-panel rounded-2xl shadow-glass border border-white/80 dark:border-slate-800/80",
      glassDark:
        "glass-panel-dark text-white rounded-2xl shadow-2xl border border-white/10 dark:border-slate-700/50",
      interactive:
        "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-cardHover hover:-translate-y-1.5 transition-all duration-300 rounded-2xl cursor-pointer text-slate-900 dark:text-slate-100",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
