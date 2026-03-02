"use client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";

// Define validation schema
const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  service_items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        price: z.number().min(0, "Price must be at least 0"),
        description: z.string().optional(),
      })
    )
    .length(1, "Only one service item is allowed"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const Page = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      service_items: [{ name: "", price: 0, description: "" }],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "service_items",
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      formData.append("service_items", JSON.stringify(data.service_items));

      await api.post("/o/services/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Service Added Successfully", {
        description: "You have added a service successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/services");
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

  return (
    <FormPageLayout title="Add Service">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Service Information */}
        <FormSection title="Service Information">
          <FormField label="Service Name" error={errors.name?.message}>
            <Input
              placeholder="Enter the service name"
              className="bg-gray-50 h-11 px-4"
              {...register("name")}
            />
          </FormField>
        </FormSection>

        {/* Service Items */}
        <FormSection title="Service Items">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-4">
                <FormField
                  label="Item Name"
                  error={errors.service_items?.[index]?.name?.message}
                >
                  <Input
                    placeholder="Enter item name"
                    className="bg-gray-50 h-11 px-4"
                    {...register(`service_items.${index}.name`)}
                  />
                </FormField>

                <FormField
                  label="Price"
                  error={errors.service_items?.[index]?.price?.message}
                >
                  <Input
                    placeholder="Set the price"
                    className="bg-gray-50 h-11 px-4"
                    type="number"
                    step="0.01"
                    {...register(`service_items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                  />
                </FormField>

                <FormField label="Description">
                  <Textarea
                    placeholder="Write the item description here.."
                    className="bg-gray-50 h-20 px-4 py-3"
                    {...register(`service_items.${index}.description`)}
                  />
                </FormField>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Media */}
        <FormSection title="Media">
          <ImageUploader
            onImageSelect={(file) => setSelectedImage(file)}
            supportedFormats={["JPEG", "JPG", "PNG"]}
          />
        </FormSection>

        {/* Submit Button */}
        <FormActions>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Add Service"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default Page;