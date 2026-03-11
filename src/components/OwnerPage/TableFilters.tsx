"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter, X } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface TableFiltersProps {
  filters: FilterConfig[];
  onClearAll?: () => void;
}

function TableFilters({ filters, onClearAll }: TableFiltersProps) {
  const hasActiveFilters = filters.some((f) => f.value !== "all");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger
            className={`h-7 w-auto min-w-0 text-xs gap-1 px-2.5 rounded-full border ${
              filter.value !== "all"
                ? "border-camouflage-300 bg-camouflage-50 text-camouflage-700"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            <ListFilter className="w-3 h-3 shrink-0" />
            <span className="font-medium">{filter.label}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {hasActiveFilters && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs text-gray-400 hover:text-gray-600 gap-1 rounded-full"
        >
          <X className="w-3 h-3" />
          Clear
        </Button>
      )}
    </div>
  );
}

export default TableFilters;
