"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_SERVICE_BY_ID } from "@/graphql/people";
import apolloClient from "@/graphql/apolloClient";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  service_items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        price: z.number().min(1, "Price must be at least 0"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one service item is required"),
  add_service_items: z
    .array(
      z.object({
        addName: z.string().min(1, "Item name is required"),
        addPrice: z.number().min(1, "Price must be at least 1"),
        addDescription: z.string().optional(),
      })
    )
    .min(1, "At least one service item is required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const EditServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    resetField,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      service_items: [{ name: "", price: 0, description: "" }],
      add_service_items: [{ addName: "", addPrice: 0, addDescription: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "service_items",
  });

  const {
    fields: addFields,
    append: addAppend,
    remove: addRemove,
  } = useFieldArray({
    control,
    name: "add_service_items",
  });

  const { data, loading, error } = useQuery(GET_SERVICE_BY_ID, {
    variables: { id: serviceId },
    fetchPolicy: "network-only",

    client: apolloClient,
  });

  useEffect(() => {
    console.log("ID:", serviceId);
    // console.log("DATA:", data.getServiceById);
    if (data && data.getServiceById) {
      console.log("DATA:", data.getServiceById);

      const rental = data.getServiceById;

      reset({
        name: rental.name || "",
        service_items: rental.serviceItems.map((item: any) => ({
          name: item.name,
          price: parseFloat(item.price),
          description: item.description || "",
        })),
      });

      if (rental.img) {
        setCurrentImageUrl(rental.img);
      }
    }
  }, [data, reset, loading]);

  const onItemSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      //   JSON.stringify(data.service_items);

      const { addName, addPrice, addDescription } = data.add_service_items[0];

      // Send the data directly
      await api.post(
        `/o/services/${serviceId}/service_item`,
        {
          name: addName,
          price: addPrice,
          description: addDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Service Item Added Successfully", {
        description: "You have added a service successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      //   router.push("/services");

      data.add_service_items.forEach((_, index) => {
        resetField(`add_service_items.${index}.addName`);
        resetField(`add_service_items.${index}.addPrice`);
        resetField(`add_service_items.${index}.addDescription`);
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast("Error", {
        description: "Something went wrong. Please try again.",
        className: "bg-red-500/80 border border-none text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (selectedImage) {
        formData.append("file", selectedImage);

        await api.patch(`/o/service/${serviceId}/img`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      await api.patch(
        `/o/service/${serviceId}`,
        {
          name: data.name,
          service_items: data.service_items,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Service updated successfully.");
      router.push("/services");
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong. Please try again.");
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
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
            Edit Service
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Service Name */}
          <div className="mt-12">
            <h1 className="font-afacad text-neutral-500">
              Service Information
            </h1>
            <hr />
            <div className="pt-6 pb-10 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">Service Name</h1>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the service name"
                      className="bg-neutral-100/50 w-full h-12 px-5"
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
            </div>
          </div>

          {/* Service Items */}
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Service Items</h1>
            <hr />
            <div className="pt-6 pb-4 space-y-6">
              {addFields.map((field, index) => (
                <div key={field.id} className="space-y-4 border-b pb-4">
                  <div>
                    <h1 className="text-sm text-neutral-500">Item Name</h1>
                    <Input
                      placeholder="Enter item name"
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      {...register(`add_service_items.${index}.addName`)}
                    />
                    {errors.add_service_items?.[index]?.addName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.add_service_items?.[index]?.addName?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <h1 className="text-sm text-neutral-500">Price</h1>
                    <Input
                      placeholder="Set the price"
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      type="number"
                      step="0.01"
                      {...register(`add_service_items.${index}.addPrice`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.add_service_items?.[index]?.addPrice && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.add_service_items?.[index]?.addPrice?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <h1 className="text-sm text-neutral-500">Description</h1>
                    <Textarea
                      placeholder="Write the item description here.."
                      className="bg-neutral-100/50 w-full h-20 px-5 py-3"
                      {...register(`add_service_items.${index}.addDescription`)}
                    />
                  </div>

                  <div className="flex w-full items-end justify-end">
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onItemSubmit)}
                      className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      {isSubmitting ? "Adding..." : "Add Service Item"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Uploader */}
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Media</h1>
            <hr />
            <ImageUploader
              onImageSelect={(file) => setSelectedImage(file)}
              supportedFormats={["JPEG", "JPG", "PNG"]}
              currentImageUrl={currentImageUrl}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServicePage;
