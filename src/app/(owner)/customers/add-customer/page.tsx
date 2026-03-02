"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { useRouter } from "next/navigation";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";
import { Loader2 } from "lucide-react";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const AddCustomerPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        contact_number: data.contactNumber,
        address: data.address,
        isActive: true,
        bookings: 0,
      };

      await api.post("o/customer", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Customer Added Successfully", {
        description: "New customer is added to the repository",
      });
      router.push("/customers");
    } catch (error) {
      toast.error("Failed to add customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormPageLayout title="Add Customer" status="Active">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Customer Information">
          <div className="space-y-4">
            <FormRow>
              <FormField label="First Name" error={errors.firstName?.message}>
                <Input
                  placeholder="John"
                  className="bg-gray-50 h-11 px-4"
                  {...register("firstName")}
                />
              </FormField>

              <FormField label="Last Name" error={errors.lastName?.message}>
                <Input
                  placeholder="Doe"
                  className="bg-gray-50 h-11 px-4"
                  {...register("lastName")}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="Email" error={errors.email?.message}>
                <Input
                  placeholder="johndoe@gmail.com"
                  type="email"
                  className="bg-gray-50 h-11 px-4"
                  {...register("email")}
                />
              </FormField>

              <FormField
                label="Contact Number"
                error={errors.contactNumber?.message}
              >
                <Input
                  placeholder="09123456789"
                  className="bg-gray-50 h-11 px-4"
                  {...register("contactNumber")}
                />
              </FormField>
            </FormRow>

            <FormField label="Address" error={errors.address?.message}>
              <Input
                placeholder="33 Countryside, Bangkal, D.C"
                className="bg-gray-50 h-11 px-4"
                {...register("address")}
              />
            </FormField>
          </div>
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-500 text-white w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Customer"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default AddCustomerPage;
