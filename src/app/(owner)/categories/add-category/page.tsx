"use client";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";
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
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

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
    <FormPageLayout title="Add Category">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="Category Information">
          <FormRow>
            <FormField label="Name" error={errors.name?.message}>
              <Input
                placeholder="Enter the category name"
                className="bg-gray-50 h-11 px-4"
                {...register("name")}
              />
            </FormField>

            <FormField label="Type" error={errors.type?.message}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-gray-50 h-11 px-4">
                      <SelectValue placeholder="Select the type" />
                    </SelectTrigger>
                    <SelectContent className="font-afacad">
                      {categoryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormActions>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Category"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default Page;
