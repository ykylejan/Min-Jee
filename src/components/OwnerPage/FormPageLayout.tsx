"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveLeft, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/OwnerPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  status?: string;
  isLoading?: boolean;
  loadingText?: string;
  error?: string | null;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  deleteDialogOpen?: boolean;
  setDeleteDialogOpen?: (open: boolean) => void;
  deleteTitle?: string;
  deleteDescription?: string;
}

export const FormPageLayout = ({
  children,
  title,
  description,
  status,
  isLoading = false,
  loadingText = "Loading...",
  error = null,
  showDeleteButton = false,
  onDelete,
  isDeleting = false,
  deleteDialogOpen = false,
  setDeleteDialogOpen,
  deleteTitle = "Are you sure?",
  deleteDescription = "This action cannot be undone. This will permanently delete this item.",
}: FormPageLayoutProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
        <p className="text-gray-500 font-medium">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 max-w-3xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error loading data
          </h3>
          <p className="text-red-600 text-center max-w-md mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <MoveLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side - Back button & Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex-shrink-0"
              >
                <MoveLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-afacad_bold text-gray-900">
                    {title}
                  </h1>
                  {status && <StatusBadge status={status} size="lg" />}
                </div>
                {description && (
                  <p className="text-gray-500 text-sm mt-1">{description}</p>
                )}
              </div>
            </div>

            {/* Right side - Delete button */}
            {showDeleteButton && onDelete && setDeleteDialogOpen && (
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{deleteTitle}</DialogTitle>
                    <DialogDescription>{deleteDescription}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">{children}</CardContent>
      </Card>
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-afacad text-gray-500 text-sm uppercase tracking-wide">
          {title}
        </h2>
        <hr className="mt-1 border-gray-200" />
      </div>
      <div className="pt-2 pb-6">{children}</div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormField = ({
  label,
  children,
  error,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-600 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

interface FormRowProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}

export const FormRow = ({ children, cols = 2 }: FormRowProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-4 sm:gap-6`}>{children}</div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
}

export const FormActions = ({ children }: FormActionsProps) => {
  return (
    <div className="pt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
      {children}
    </div>
  );
};

export default FormPageLayout;
