"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";

// Define validation schema for event package
const eventPackageSchema = z.object({
  name: z.string().min(1, "Event package name is required"),
  pax_data: z.array(
    z.object({
      name: z.string().min(1, "Package name is required"),
      price: z.number().min(0, "Price must be at least 0"),
      description: z.string().optional(),
    })
  ).length(1, "Only one package is allowed"), // Changed to length(1)
});

type EventPackageFormValues = z.infer<typeof eventPackageSchema>;

const Page = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventPackageFormValues>({
    resolver: zodResolver(eventPackageSchema),
    defaultValues: {
      name: "",
      pax_data: [{ name: "", price: 0, description: "" }],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "pax_data",
  });

  const onSubmit = async (data: EventPackageFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      formData.append("pax_data", JSON.stringify(data.pax_data));

      await api.post("/o/events/event_package", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Event Package Added Successfully", {
        description: "You have added an event package successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/events");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast("Error", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        className: "bg-red-500/80 border border-none text-white",
      });
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
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Add Event Package</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Event Package Name */}
          <div className="mt-12">
            <h1 className="font-afacad text-neutral-500">
              Event Package Information
            </h1>
            <hr />
            <div className="pt-6 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">Event Package Name</h1>
                <Input
                  placeholder="Enter the event package name"
                  className="bg-neutral-100/50 w-full h-12 px-5"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pax Data (Single Package) */}
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Package Details</h1>
            <hr />
            <div className="pt-6 pb-4 space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 border-b pb-4">
                  <div>
                    <h1 className="text-sm text-neutral-500">Pax Name</h1>
                    <Input
                      placeholder="Enter package name"
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      {...register(`pax_data.${index}.name`)}
                    />
                    {errors.pax_data?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pax_data[index].name?.message}
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
                      {...register(`pax_data.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.pax_data?.[index]?.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pax_data[index].price?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <h1 className="text-sm text-neutral-500">Description</h1>
                    <Textarea
                      placeholder="Write the package description here.."
                      className="bg-neutral-100/50 w-full h-20 px-5 py-3"
                      {...register(`pax_data.${index}.description`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Uploader */}
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Event Image</h1>
            <hr />
            <ImageUploader
              onImageSelect={(file) => setSelectedImage(file)}
              supportedFormats={["JPEG", "JPG", "PNG"]}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Event Package"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;