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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  rowsPerPageOptions?: number[];
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
}: PaginationProps) {
  if ((totalPages <= 1) && !onItemsPerPageChange) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = totalItems
    ? (currentPage - 1) * (itemsPerPage ?? 0) + 1
    : undefined;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : undefined;

  return (
    <div className="flex items-center justify-end gap-3 py-2 px-4 border-t border-gray-100">
      {/* Rows per page selector */}
      {onItemsPerPageChange && itemsPerPage && (
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => onItemsPerPageChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {totalItems !== undefined && startItem !== undefined && endItem !== undefined && (
            <span className="text-sm text-gray-500 ml-2">
              {startItem}–{endItem} of {totalItems}
            </span>
          )}
        </div>
      )}
      {/* Item counter fallback when no rows-per-page */}
      {!onItemsPerPageChange && totalItems !== undefined && startItem !== undefined && endItem !== undefined && (
        <span className="text-sm text-gray-500 mr-auto">
          {startItem}–{endItem} of {totalItems}
        </span>
      )}
      {totalPages > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`dots-${i}`} className="text-sm text-gray-400 px-1">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 text-xs ${
                  page === currentPage
                    ? "bg-camouflage-400 hover:bg-camouflage-500 text-white"
                    : ""
                }`}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

export default Pagination;
