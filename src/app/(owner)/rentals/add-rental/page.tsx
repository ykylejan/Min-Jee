"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

// Define validation schema
const rentalSchema = z.object({
  name: z.string().min(1, "Rental name is required"),
  description: z.string().optional(),
  currentQuantity: z.number().min(1, "Quantity must be at least 1"),
  totalQuantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price must be at least 1 Pesos"),
  categoryId: z.string().min(1, "Category is required"),
});

type RentalFormValues = z.infer<typeof rentalSchema>;

const page = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
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

  const category = watch("categoryId")
    ? {
        "03614735-c12b-484e-871e-3d48fb29f9bb": "Cutlery",
        "1af9151d-ec1e-4def-9814-8830f7ac4270": "Furniture",
        "b62f5333-2e7e-4510-ae3d-36fcabfd12ed": "Electronics",
      }[watch("categoryId")]
    : "";

  const onSubmit = async (data: RentalFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add form data
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("current_quantity", data.currentQuantity.toString());
      formData.append("total_quantity", data.totalQuantity.toString());
      formData.append("price", data.price.toString());
      formData.append("category_id", data.categoryId);

      // Add image if selected
      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      // Make API call
      const response = await api.post("/o/rental", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Rental Added Successfuly", {
        description: "You have added a rental item successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/rentals"); // Redirect to rentals page
    } catch (error: any) {
      // console.log("ERROR:", error.response.data.detail[0].msg);
      if (error.response.data.detail[0].msg == "Field required") {
        toast("All fields are required", {
          description: "Please fill in all the required fields.",
          className: "bg-red-500/80 border border-none text-white",
        });
      } else {
        let errorMessage = "Something went wrong. Please try again.";
        toast("All fields are required", {
          description: errorMessage,
          className: "bg-red-500/80 border border-none text-white",
        });
      }
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
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Rental</h1>
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
                <Input
                  placeholder="Enter the rental name"
                  className="bg-neutral-100/50 min-w-80 h-12 px-5"
                  {...register("name")}
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
                    <Input
                      placeholder="Set the price"
                      className="bg-neutral-100/50 w-80 h-12 px-5"
                      type="number"
                      {...register("price", {
                        valueAsNumber: true,
                      })}
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
                  <Input
                    placeholder="Set the current quantity"
                    className="bg-neutral-100/50 w-80 h-12 px-5"
                    type="number"
                    {...register("currentQuantity", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.currentQuantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.currentQuantity.message}
                    </p>
                  )}
                </div>

                <div>
                  <h1 className="text-sm text-neutral-500">Total Quantity</h1>
                  <Input
                    placeholder="Set the total quantity"
                    className="bg-neutral-100/50 w-80 h-12 px-5"
                    type="number"
                    {...register("totalQuantity", {
                      valueAsNumber: true,
                    })}
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
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Input
                      placeholder="Select the category"
                      value={category}
                      className="bg-neutral-100/50 w-80 h-12 px-5"
                      readOnly
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-afacad">
                    <DropdownMenuItem
                      onClick={() => {
                        field.onChange("03614735-c12b-484e-871e-3d48fb29f9bb");
                      }}
                    >
                      Cutlery
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        field.onChange("1af9151d-ec1e-4def-9814-8830f7ac4270");
                      }}
                    >
                      Furniture
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        field.onChange("b62f5333-2e7e-4510-ae3d-36fcabfd12ed");
                      }}
                    >
                      Electronics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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

export default page;
