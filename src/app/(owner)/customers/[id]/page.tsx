"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_BY_ID } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const EditCustomerPage = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
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

  const { loading, error, data } = useQuery(GET_CUSTOMER_BY_ID, {
    variables: { id: customerId },
    client: apolloClientPartner,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching customer:", error);
      return;
    }

    if (data?.getCustomersById) {
      const customer = data.getCustomersById;
      reset({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        contactNumber: customer.contactNumber || "",
        address: customer.address || "",
      });
    }
  }, [data, error, reset]);

  const onSubmit = async (formData: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contact_number: formData.contactNumber,
        address: formData.address,
      };

      await api.patch(`o/customer/${customerId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Customer Updated Successfully");
      router.push("/customers");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`o/customer/${customerId}`);
      toast.success("Customer Deleted Successfully");
      router.push("/customers");
    } catch (error) {
      toast.error("Failed to delete customer. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <FormPageLayout
      title="Edit Customer"
      status="Active"
      isLoading={loading}
      loadingText="Loading customer data..."
      error={error?.message}
      showDeleteButton
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteTitle="Delete Customer?"
      deleteDescription="This action cannot be undone. This will permanently delete this customer and all associated data."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Customer Information">
          <div className="space-y-4">
            <FormRow>
              <FormField label="First Name" error={errors.firstName?.message}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="John"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>

              <FormField label="Last Name" error={errors.lastName?.message}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Doe"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="Email" error={errors.email?.message}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="johndoe@example.com"
                      type="email"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Contact Number"
                error={errors.contactNumber?.message}
              >
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="09123456789"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>
            </FormRow>

            <FormField label="Address" error={errors.address?.message}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="33 Countryside, Bangkal, D.C"
                    className="bg-gray-50 h-11 px-4"
                    {...field}
                  />
                )}
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
                Updating...
              </>
            ) : (
              "Update Customer"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default EditCustomerPage;
