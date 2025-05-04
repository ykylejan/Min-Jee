"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
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

      // const firstCategoryId = partner.partnerCategories?.[0]?.categoryId || "";

      reset({
        name: partner.name || "",
        address: partner.address || "",
        contactNumber: partner.contactNumber || "",
        categoryId: partner.categoryId,
      });

      //   setSelectedCategory(firstCategoryId);
    }
  }, [partnerData, categoriesData, partnerError, categoriesError, reset]);

  const onSubmit = async (data: PartnerFormValues) => {
    console.log("Submitting form data:", data); // Add this line
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
      console.log("Update response:", response); // Add this line
      toast.success("Partner Updated Successfully");
      router.push("/partners");
    } catch (error) {
      console.error("Update error:", error); // Add this line
      toast.error("Failed to update partner. Please try again.");
    }
  };

  //   const populatePartnerCategory = (
  //     categoryId: string,
  //     categories: { id: string; name: string; type: string }[]
  //   ) => {
  //     const matchingCategory = categories.find(
  //       (category) => category.id === categoryId
  //     );
  //     if (matchingCategory) {
  //       setSelectedCategory(matchingCategory.id);
  //     }
  //   };

  return (
    <div className="flex justify-center">
      <div className="bg-white w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
        <div className="flex gap-x-3 items-center mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <MoveLeft width={20} height={20} className="text-neutral-600" />
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
              Edit Partner
            </h1>
          </div>
        </div>

        <div>
          <h1 className="font-afacad text-neutral-500">Partner Information</h1>
          <hr />
        </div>

        <div className="pt-6 pb-10 space-y-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">Name</h1>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="John Doe"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Contact Number</h1>
              <Controller
                name="contactNumber"
                control={control}
                rules={{ required: "Contact Number is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="09972736782"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                      type="number"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">Address</h1>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="Bangkal, Davao City"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="">
              <h1 className="text-sm text-neutral-500">Category</h1>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("categoryId", value); // This updates the form state
                        // console.log("Selected category:", value); // Add this for debugging
                      }}
                      defaultValue={field.value} // Ensure initial value is set
                    >
                      <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
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
                                ); // Add this for debugging

                                setSelectedCategory(watchedCategoryId);
                                console.log(
                                  "Selected category:",
                                  selectedCategory
                                ); // Add this for debugging
                              }}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="pt-16 flex justify-end">
          <Button
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            onClick={handleSubmit(onSubmit)}
          >
            Update Partner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
