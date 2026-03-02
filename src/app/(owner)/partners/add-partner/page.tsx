"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { GET_ALL_CATEGORIES } from "@/graphql/products";
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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
      type: string;
    }[]
  >([]);

  const {
    register,
    control,
    handleSubmit,
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

  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
  });

  const getPartnerCategories = (
    categories: { id: string; name: string; type: string }[]
  ) => {
    return categories.filter((category) => category.type === "Partner");
  };

  useEffect(() => {
    if (data?.getCategories) {
      const partnerCategories = getPartnerCategories(data.getCategories);
      setCategories(partnerCategories);
      console.log("Categories:", partnerCategories);
    }
  }, [data, loading, error]);

  const onSubmit = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(
        "o/partners",
        {
          name: data.name,
          address: data.address,
          contact_number: data.contactNumber,
          category_id: selectedCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Partner Added Successfully", {
        description: "New partner is added to the repository",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/partners");
    } catch (error) {
      toast.error("Failed to add partner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormPageLayout title="Add Partner">
      <FormSection title="Partner Information">
        <div className="space-y-6">
          <FormRow>
            <FormField label="Name" error={errors.name?.message}>
              <Input
                placeholder="John Doe"
                className="bg-gray-50 h-11 px-4"
                {...register("name")}
              />
            </FormField>

            <FormField label="Contact Number" error={errors.contactNumber?.message}>
              <Input
                placeholder="09123456789"
                className="bg-gray-50 h-11 px-4"
                {...register("contactNumber")}
                type="number"
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Address" error={errors.address?.message}>
              <Input
                placeholder="Bangkal, Davao City"
                className="bg-gray-50 h-11 px-4"
                {...register("address")}
              />
            </FormField>

            <FormField label="Category" error={errors.categoryId?.message}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                    }}
                  >
                    <SelectTrigger className="bg-gray-50 h-11">
                      <SelectValue
                        placeholder="Select their category type"
                        className="text-gray-500"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
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
              Adding...
            </>
          ) : (
            "Add Partner"
          )}
        </Button>
      </FormActions>
    </FormPageLayout>
  );
};

export default page;
