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

// Define validation schema for event package
const eventPackageSchema = z.object({
  name: z.string().min(1, "Event package name is required"),
  pax_data: z.array(
    z.object({
      name: z.string().min(1, "Package name is required"),
      price: z.number().min(0, "Price must be at least 0"),
      description: z.string().optional(),
    })
  ).length(1, "Only one package is allowed"),
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
    <FormPageLayout title="Add Event Package">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Event Package Name */}
        <FormSection title="Event Package Information">
          <FormField label="Event Package Name" error={errors.name?.message}>
            <Input
              placeholder="Enter the event package name"
              className="bg-gray-50 w-full h-11 px-4"
              {...register("name")}
            />
          </FormField>
        </FormSection>

        {/* Pax Data (Single Package) */}
        <FormSection title="Package Details">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-4">
                <FormRow>
                  <FormField label="Pax Name" error={errors.pax_data?.[index]?.name?.message}>
                    <Input
                      placeholder="Enter package name"
                      className="bg-gray-50 w-full h-11 px-4"
                      {...register(`pax_data.${index}.name`)}
                    />
                  </FormField>

                  <FormField label="Price" error={errors.pax_data?.[index]?.price?.message}>
                    <Input
                      placeholder="Set the price"
                      className="bg-gray-50 w-full h-11 px-4"
                      type="number"
                      step="0.01"
                      {...register(`pax_data.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormField>
                </FormRow>

                <FormField label="Description">
                  <Textarea
                    placeholder="Write the package description here.."
                    className="bg-gray-50 w-full h-20 px-4 py-3"
                    {...register(`pax_data.${index}.description`)}
                  />
                </FormField>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Image Uploader */}
        <FormSection title="Event Image">
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
              "Add Event Package"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default Page;