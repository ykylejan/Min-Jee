"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  verified: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  completed: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
  cancelled: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
    border: "border-gray-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
    border: "border-gray-200",
  },
  "in stock": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  "out of stock": {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
  "low stock": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs",
  default: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const dotSizeConfig = {
  sm: "w-1.5 h-1.5",
  default: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "default",
  className,
}) => {
  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border",
        config.bg,
        config.text,
        config.border,
        sizeConfig[size],
        className
      )}
    >
      <span className={cn("rounded-full", config.dot, dotSizeConfig[size])} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge;
