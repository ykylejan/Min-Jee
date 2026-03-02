"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import apolloClient from "@/graphql/apolloClient";
import { useQuery } from "@apollo/client";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import { GET_PARTNER_BY_ID } from "@/graphql/people";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";

const partnerSchema = z.object({
  name: z.string().min(1, "Rental name is required"),
  address: z.string().min(1, "Address is required"),

  contactNumber: z
    .string()
    .min(11, "Contact Number must be 11 digits")
    .max(11, "Contact Number must be 11 digits"),

  categoryId: z.string().min(1, "Category is required"),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const page = () => {
  const router = useRouter();

  const params = useParams();
  const partnerId = params.id as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
      type: string;
    }[]
  >([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      address: "",
      contactNumber: "",
      categoryId: "",
    },
  });

  const watchedCategoryId = watch("categoryId");
  // Use apolloClientPartner for partner query
  const {
    loading: partnerLoading,
    error: partnerError,
    data: partnerData,
  } = useQuery(GET_PARTNER_BY_ID, {
    variables: { id: partnerId },
    client: apolloClientPartner,
    fetchPolicy: "network-only", // Force fresh data
  });

  // Use apolloClient for categories query
  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
    fetchPolicy: "cache-and-network",
  });

  const getPartnerCategories = (
    categories: { id: string; name: string; type: string }[] = []
  ) => {
    return categories.filter((category) => category.type === "Partner");
  };

  useEffect(() => {
    console.log("Partner query status:", {
      loading: partnerLoading,
      error: partnerError,
      data: partnerData,
    });

    if (partnerError) {
      console.error("Partner query error:", partnerError);
      toast.error("Failed to load partner data");
      return;
    }

    if (categoriesError) {
      console.error("Categories query error:", categoriesError);
      toast.error("Failed to load categories");
      return;
    }

    if (categoriesData?.getCategories) {
      const partnerCategories = getPartnerCategories(
        categoriesData.getCategories
      );
      setCategories(partnerCategories);
    }

    if (partnerData?.getPartnerById) {
      const partner = partnerData.getPartnerById;
      console.log("Partner data received:", partner);

      reset({
        name: partner.name || "",
        address: partner.address || "",
        contactNumber: partner.contactNumber || "",
        categoryId: partner.categoryId,
      });
    }
  }, [partnerData, categoriesData, partnerError, categoriesError, reset]);

  const onSubmit = async (data: PartnerFormValues) => {
    console.log("Submitting form data:", data);
    setIsSubmitting(true);
    try {
      const response = await api.patch(
        `o/partners/${partnerId}`,
        {
          name: data.name,
          address: data.address,
          contact_number: data.contactNumber,
          category_id: data.categoryId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update response:", response);
      toast.success("Partner Updated Successfully");
      router.push("/partners");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update partner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`o/partners/${partnerId}`);
      toast.success("Partner deleted successfully");
      router.push("/partners");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete partner. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <FormPageLayout
      title="Edit Partner"
      isLoading={partnerLoading || categoriesLoading}
      loadingText="Loading partner data..."
      error={partnerError?.message || categoriesError?.message}
      showDeleteButton
      onDelete={handleDelete}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteTitle="Delete Partner?"
      deleteDescription="This action cannot be undone. This will permanently delete this partner and all associated data."
    >
      <FormSection title="Partner Information">
        <div className="space-y-6">
          <FormRow>
            <FormField label="Name" error={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Input
                    placeholder="John Doe"
                    className="bg-gray-50 h-11 px-4"
                    {...field}
                  />
                )}
              />
            </FormField>

            <FormField label="Contact Number" error={errors.contactNumber?.message}>
              <Controller
                name="contactNumber"
                control={control}
                rules={{ required: "Contact Number is required" }}
                render={({ field }) => (
                  <Input
                    placeholder="09972736782"
                    className="bg-gray-50 h-11 px-4"
                    {...field}
                    type="number"
                  />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Address" error={errors.address?.message}>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <Input
                    placeholder="Bangkal, Davao City"
                    className="bg-gray-50 h-11 px-4"
                    {...field}
                  />
                )}
              />
            </FormField>

            <FormField label="Category" error={errors.categoryId?.message}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("categoryId", value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray-50 h-11">
                      <SelectValue placeholder="Select their category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            onClick={() => {
                              setValue("categoryId", category.id, {
                                shouldValidate: true,
                              });
                              console.log(
                                "Watched Category ID:",
                                watchedCategoryId
                              );
                              setSelectedCategory(watchedCategoryId);
                              console.log(
                                "Selected category:",
                                selectedCategory
                              );
                            }}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </FormRow>
        </div>
      </FormSection>

      <FormActions>
        <Button
          className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Partner"
          )}
        </Button>
      </FormActions>
    </FormPageLayout>
  );
};

export default page;
