"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              <svg
                className={cn("w-3 h-3", !trend.isPositive && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 bg-camouflage-50 rounded-lg text-camouflage-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
