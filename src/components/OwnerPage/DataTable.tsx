"use client";

import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2, SearchX, PackageOpen } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
  loadingRows?: number;
  className?: string;
}

function DataTable<T>({
  columns,
  data,
  loading = false,
  error = null,
  emptyTitle = "No data found",
  emptyDescription = "Try adjusting your search or filters",
  emptyIcon,
  onRowClick,
  keyExtractor,
  loadingRows = 5,
  className,
}: DataTableProps<T>) {
  // Loading skeleton
  if (loading) {
    return (
      <Card className={cn("border-gray-200 shadow-sm overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        "font-semibold text-gray-600 text-sm py-4",
                        column.className
                      )}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: loadingRows }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={`${rowIndex}-${colIndex}`} className="py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center gap-2 py-4 text-gray-500 border-t bg-gray-50/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("border-gray-200 shadow-sm", className)}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading data
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {error.message || "An unexpected error occurred. Please try again later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className={cn("border-gray-200 shadow-sm", className)}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            {emptyIcon || <PackageOpen className="w-10 h-10 text-gray-400" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {emptyTitle}
          </h3>
          <p className="text-gray-500 text-center max-w-md">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  // Data table
  return (
    <Card className={cn("border-gray-200 shadow-sm overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "font-semibold text-gray-600 text-sm py-4 whitespace-nowrap",
                      column.className
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "border-b border-gray-100 transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-camouflage-50/50 active:bg-camouflage-100/50"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("py-4 text-sm", column.className)}
                    >
                      {column.render
                        ? column.render(item, index)
                        : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataTable;
