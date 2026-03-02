"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/ImageUploader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";

const rentalSchema = z.object({
  name: z.string().min(1, "Rental name is required"),
  description: z.string().optional(),
  currentQuantity: z.number().min(1, "Quantity must be at least 1"),
  totalQuantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price must be at least 1 Pesos"),
  categoryId: z.string().min(1, "Category is required"),
});

type RentalFormValues = z.infer<typeof rentalSchema>;

const AddRentalPage = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    { id: string; name: string; type: string }[]
  >([]);

  const { loading: categoriesLoading, data: categoriesData } = useQuery(
    GET_ALL_CATEGORIES,
    { client: apolloClient }
  );

  useEffect(() => {
    if (categoriesData?.getCategories) {
      const rentalCategories = categoriesData.getCategories.filter(
        (cat: { type: string }) => cat.type.toLowerCase() === "rental"
      );
      setCategories(rentalCategories);
    }
  }, [categoriesData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      name: "",
      currentQuantity: 0,
      totalQuantity: 0,
      price: 0,
      categoryId: "",
      description: "",
    },
  });

  const onSubmit = async (data: RentalFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("current_quantity", data.currentQuantity.toString());
      formData.append("total_quantity", data.totalQuantity.toString());
      formData.append("price", data.price.toString());
      formData.append("category_id", data.categoryId);

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      await api.post("/o/rental/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Rental Added Successfully", {
        description: "You have added a rental item successfully.",
      });
      router.push("/rentals");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail?.[0]?.msg;
      toast.error(errorMsg || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormPageLayout title="Add Rental">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Rental Information">
          <div className="space-y-4">
            <FormRow>
              <FormField label="Name" error={errors.name?.message}>
                <Input
                  placeholder="Enter the rental name"
                  className="bg-gray-50 h-11 px-4"
                  {...register("name")}
                />
              </FormField>

              <FormField label="Price (₱)" error={errors.price?.message}>
                <Input
                  placeholder="Set the price"
                  className="bg-gray-50 h-11 px-4"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
              </FormField>
            </FormRow>
          </div>
        </FormSection>

        <FormSection title="Quantity">
          <FormRow>
            <FormField
              label="Current Quantity"
              error={errors.currentQuantity?.message}
            >
              <Input
                placeholder="Set the current quantity"
                className="bg-gray-50 h-11 px-4"
                type="number"
                {...register("currentQuantity", { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              label="Total Quantity"
              error={errors.totalQuantity?.message}
            >
              <Input
                placeholder="Set the total quantity"
                className="bg-gray-50 h-11 px-4"
                type="number"
                {...register("totalQuantity", { valueAsNumber: true })}
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Category">
          <FormField label="Category" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray-50 h-11">
                    <SelectValue
                      placeholder={
                        categoriesLoading ? "Loading..." : "Select a category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title="Description">
          <FormField label="Description (Optional)">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Write the product's description here..."
                  className="bg-gray-50 min-h-24 px-4 py-3"
                  {...field}
                />
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title="Media">
          <ImageUploader
            onImageSelect={(file) => setSelectedImage(file)}
            supportedFormats={["JPEG", "JPG", "PNG"]}
          />
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-500 text-white w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Rental"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default AddRentalPage;
