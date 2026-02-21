"use client";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.string().min(1, "Category type is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const categoryTypes = ["Rental", "Partner", "Service", "Event"];

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post(
        "/o/category/",
        {
          name: data.name,
          type: data.type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Category Added Successfully", {
        description: "You have added a category successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/categories");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail;
      toast("Error adding category", {
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

  return (
    <div className="flex justify-center">
      <div className="bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
        <div className="flex gap-x-3 items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <MoveLeft width={20} height={20} className="text-neutral-600" />
          </button>
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Add Category</h1>
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
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
