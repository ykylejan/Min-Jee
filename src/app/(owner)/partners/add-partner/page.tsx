"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
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
      //   setCategory(data.getCategories);
      const partnerCategories = getPartnerCategories(data.getCategories);
      setCategories(partnerCategories);
      console.log("Categories:", partnerCategories);
    }
  }, [data, loading, error]);

  const onSubmit = async (data: PartnerFormValues) => {
    try {
      const response = await api.post(
        "o/partners",
        {
          name: data.name,
          address: data.address,
          contact_number: data.contactNumber,
          categories: [selectedCategory],
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
    }
  };

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
              Add Partner
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
              <Input
                placeholder="John Doe"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Contact Number</h1>
              <Input
                placeholder="09123456789"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("contactNumber")}
                type="number"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">Address</h1>
              <Input
                placeholder="Bangkal, Davao City"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="">
              <h1 className="text-sm text-neutral-500">Category</h1>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCategory(value);
                      }}
                    >
                      <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
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
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </>
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
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
