"use client";

import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  secondaryAction?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  actionLabel,
  actionIcon,
  onAction,
  secondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6",
        className
      )}
    >
      {/* Title Section */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-afacad_semibold text-gray-900">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-500">{description}</p>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative w-full sm:w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 h-10 bg-white border-gray-200 focus-visible:ring-camouflage-400/50 text-sm"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Secondary Action */}
        {secondaryAction}

        {/* Primary Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-camouflage-400 hover:bg-camouflage-500 text-white font-medium h-10 px-4 shadow-sm shadow-camouflage-400/20 transition-all hover:shadow-md hover:shadow-camouflage-400/30"
          >
            {actionIcon || <Plus className="w-4 h-4" />}
            <span className="ml-2">{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
