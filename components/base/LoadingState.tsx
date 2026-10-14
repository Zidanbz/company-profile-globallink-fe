import React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Memuat data...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="mt-4 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};
