"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
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
import { GET_RENTAL_BY_ID, GET_ALL_CATEGORIES } from "@/graphql/products";
import { ApolloError } from "@apollo/client";
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

const EditRentalPage = () => {
  const router = useRouter();
  const params = useParams();
  const rentalId = params.id as string;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [categories, setCategories] = useState<
    { id: string; name: string; type: string }[]
  >([]);

  const { data, loading, error } = useQuery(GET_RENTAL_BY_ID, {
    variables: { id: rentalId },
    client: apolloClient,
    fetchPolicy: "network-only",
  });

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
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (data?.getRentalsById) {
      const rental = data.getRentalsById;
      reset({
        name: rental.name,
        currentQuantity: rental.currentQuantity,
        totalQuantity: rental.totalQuantity,
        price: parseFloat(rental.price.toString()),
        categoryId: rental.categoryId,
        description: rental.description || "",
      });
      if (rental.img) {
        setCurrentImageUrl(rental.img);
      }
    }
  }, [data, reset]);

  const onSubmit = async (formData: RentalFormValues) => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();

      if (selectedImage) {
        formPayload.append("file", selectedImage);
        await api.patch(`/o/rental/${rentalId}/img`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await api.patch(
        `/o/rental/${rentalId}`,
        {
          name: formData.name,
          description: formData.description || "",
          current_quantity: formData.currentQuantity,
          total_quantity: formData.totalQuantity,
          price: formData.price,
          category_id: formData.categoryId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Rental Updated Successfully");
      router.push("/rentals");
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof ApolloError) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail?.[0]?.msg === "Field required") {
        errorMessage = "Please fill in all the required fields.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/o/rental/${rentalId}`);
      toast.success("Rental Deleted Successfully");
      router.push("/rentals");
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof ApolloError) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <FormPageLayout
      title="Edit Rental"
      status="Active"
      isLoading={loading}
      loadingText="Loading rental data..."
      error={error?.message}
      showDeleteButton
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteTitle="Delete Rental?"
      deleteDescription="This action cannot be undone. This will permanently delete this rental item and all associated data."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Rental Information">
          <div className="space-y-4">
            <FormRow>
              <FormField label="Name" error={errors.name?.message}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the rental name"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>

              <FormField label="Price" error={errors.price?.message}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Set the price"
                      className="bg-gray-50 h-11 px-4"
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </FormField>
            </FormRow>
          </div>
        </FormSection>

        <FormSection title="Quantity">
          <div className="space-y-4">
            <FormRow>
              <FormField
                label="Current Quantity"
                error={errors.currentQuantity?.message}
              >
                <Controller
                  name="currentQuantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Set the rental's current quantity"
                      className="bg-gray-50 h-11 px-4"
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Total Quantity"
                error={errors.totalQuantity?.message}
              >
                <Controller
                  name="totalQuantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Set the rental's total quantity"
                      className="bg-gray-50 h-11 px-4"
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </FormField>
            </FormRow>
          </div>
        </FormSection>

        <FormSection title="Category">
          <FormField label="Category" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="bg-gray-50 h-11 px-4">
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
                    {categories.length === 0 && !categoriesLoading && (
                      <SelectItem value="" disabled>
                        No categories found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title="Extras">
          <FormField label="Description">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Write the rental's description here..."
                  className="bg-gray-50 min-h-[100px] px-4 py-3"
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
            currentImageUrl={currentImageUrl}
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
                Updating...
              </>
            ) : (
              "Update Rental"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default EditRentalPage;
