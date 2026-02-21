"use client";
import { Input } from "@/components/ui/input";
import { MoveLeft, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_BY_ID } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.string().min(1, "Category type is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const categoryTypes = ["Rental", "Partner", "Service", "Event"];

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_CATEGORY_BY_ID, {
    client: apolloClient,
    variables: { id: categoryId },
    skip: !categoryId,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  useEffect(() => {
    if (data?.getCategoriesById) {
      const category = data.getCategoriesById;
      reset({
        name: category.name,
        type: category.type,
      });
    }
  }, [data, reset]);

  const selectedType = watch("type");

  const onSubmit = async (formData: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await api.patch(
        `/o/category/${categoryId}`,
        {
          name: formData.name,
          type: formData.type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Category Updated Successfully", {
        description: "You have updated the category successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/categories");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail;
      toast("Error updating category", {
        description:
          typeof errorMsg === "string"
            ? errorMsg
            : "Something went wrong. Please try again.",
        className: "bg-red-500/80 border border-none text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/o/category/${categoryId}`);
      toast("Category Deleted Successfully", {
        description: "The category has been deleted.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/categories");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail;
      toast("Error deleting category", {
        description:
          typeof errorMsg === "string"
            ? errorMsg
            : "Something went wrong. Please try again.",
        className: "bg-red-500/80 border border-none text-white",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8">Error: {error.message}</p>;

  return (
    <div className="flex justify-center">
      <div className="bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
        <div className="flex gap-x-3 items-center justify-between">
          <div className="flex gap-x-3 items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <MoveLeft width={20} height={20} className="text-neutral-600" />
            </button>
            <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Edit Category</h1>
          </div>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center gap-x-2"
              >
                <Trash2 width={16} height={16} />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  category.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
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
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Category Information</h1>
            <hr />
          </div>

          <div className="pt-6 pb-10 space-y-6">
            <div className="flex justify-between w-full">
              <div>
                <h1 className="text-sm text-neutral-500">Name</h1>
                <Input
                  placeholder="Enter the category name"
                  className="bg-neutral-100/50 w-80 h-12 px-5"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <h1 className="text-sm text-neutral-500">Type</h1>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Input
                          placeholder="Select the type"
                          value={selectedType}
                          className="bg-neutral-100/50 w-80 h-12 px-5 cursor-pointer"
                          readOnly
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-afacad w-80">
                        {categoryTypes.map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => field.onChange(type)}
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
