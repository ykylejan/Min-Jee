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
    <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50/80 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
        <ListFilter className="w-4 h-4" />
        <span>Filters</span>
      </div>
      <div className="w-px h-6 bg-gray-200" />
      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger
            className={`h-8 w-auto min-w-[130px] text-xs gap-1.5 ${
              filter.value !== "all"
                ? "border-camouflage-300 bg-camouflage-50 text-camouflage-700"
                : "bg-white"
            }`}
          >
            <span className="text-gray-500 font-medium">{filter.label}:</span>
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
        <>
          <div className="w-px h-6 bg-gray-200" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 text-xs text-gray-500 hover:text-gray-700 gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </Button>
        </>
      )}
    </div>
  );
}

export default TableFilters;
