"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageUploader from "@/components/ImageUploader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_RENTAL_BY_ID } from "@/graphql/products";
import { ApolloError } from "@apollo/client";
import apolloClient from "@/graphql/apolloClient";

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
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const { data, loading, error } = useQuery(GET_RENTAL_BY_ID, {
    variables: { id: rentalId },
    client: apolloClient,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
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

  const categoryId = watch("categoryId");

  const onSubmit = async (data: RentalFormValues) => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();

      if (selectedImage) {
        formPayload.append("file", selectedImage);
      }

      await api.patch(`/o/rental/${rentalId}/img`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await api.patch(
        `/o/rental/${rentalId}`,
        {
          name: data.name,
          description: data.description || "",
          currentQuantity: data.currentQuantity,
          totalQuantity: data.totalQuantity,
          price: data.price,
          category_id: data.categoryId,
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading rental data...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading rental: {error.message}
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className="bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
        <div className="flex gap-x-3 items-center mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <MoveLeft width={20} height={20} className="text-neutral-600" />
          </button>
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Edit Rental</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h1 className="font-afacad text-neutral-500">Rental Information</h1>
            <hr />
          </div>

          <div className="pt-6 pb-10 space-y-6">
            <div className="flex justify-between w-full">
              <div>
                <h1 className="text-sm text-neutral-500">Name</h1>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the rental name"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="">
                <div className="flex justify-between w-full">
                  <div>
                    <h1 className="text-sm text-neutral-500">Pricing</h1>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Set the price"
                          className="bg-neutral-100/50 w-80 h-12 px-5"
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-afacad text-neutral-500">Quantity</h1>
            <hr />
            <div className="pt-6 pb-10 space-y-6 ">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Current Quantity</h1>
                  <Controller
                    name="currentQuantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Set the rental's current quantity"
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    )}
                  />
                  {errors.currentQuantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.currentQuantity.message}
                    </p>
                  )}
                </div>

                <div>
                  <h1 className="text-sm text-neutral-500">Total Quantity</h1>
                  <Controller
                    name="totalQuantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Set the rental's total quantity"
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    )}
                  />
                  {errors.totalQuantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.totalQuantity.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-afacad text-neutral-500">Category</h1>
            <hr />
          </div>
          <div className="pt-6 pb-10 space-y-6">
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                const categoryName = field.value
                  ? {
                      "03614735-c12b-484e-871e-3d48fb29f9bb": "Cutlery",
                      "1af9151d-ec1e-4def-9814-8830f7ac4270": "Furniture",
                      "b62f5333-2e7e-4510-ae3d-36fcabfd12ed": "Electronics",
                    }[field.value] || ""
                  : "";

                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Input
                        placeholder="Select the category"
                        value={categoryName}
                        className=" bg-neutral-100/50 w-80 h-12 px-5 flex "
                        readOnly
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-afacad">
                      <DropdownMenuItem
                        onClick={() =>
                          field.onChange("03614735-c12b-484e-871e-3d48fb29f9bb")
                        }
                      >
                        Cutlery
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          field.onChange("1af9151d-ec1e-4def-9814-8830f7ac4270")
                        }
                      >
                        Furniture
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          field.onChange("b62f5333-2e7e-4510-ae3d-36fcabfd12ed")
                        }
                      >
                        Electronics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <h1 className="font-afacad text-neutral-500">Extras</h1>
            <hr />
          </div>
          <div className="pt-6 pb-10 space-y-6">
            <div>
              <h1 className="text-sm text-neutral-500">Description</h1>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Write the product's description here.."
                    className="bg-neutral-100/50 w-full h-28 px-5 py-3"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <h1 className="font-afacad text-neutral-500">Media</h1>
            <hr />
          </div>
          <ImageUploader
            onImageSelect={(file) => setSelectedImage(file)}
            supportedFormats={["JPEG", "JPG", "PNG"]}
            currentImageUrl={currentImageUrl}
          />

          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Rental"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRentalPage;
