"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_BY_ID } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

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

    console.log("Customer data:", data);
    
    if (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to load customer data");
      return;
    }

    if (data?.getCustomersById) {
      const customer = data.getCustomersById;
      reset({
        firstName: customer.firstName || "Loading...",
        lastName: customer.lastName || "Loading...",
        email: customer.email || "Loading...",
        contactNumber: customer.contactNumber || "Loading...",
        address: customer.address || "Loading...",
      });
    }
  }, [data, error, reset]);

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        contact_number: data.contactNumber,
        address: data.address,
      };

      const response = await api.patch(`o/customer/${customerId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Customer Updated Successfully");
      router.push("/customers");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update customer. Please try again.");
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
              Edit Customer
            </h1>
            <div className="flex items-center gap-x-3">
              <div className="rounded-full bg-[#A6E7D8] border border-[#008767] w-2 h-2" />
              <h1 className="font-afacad pr-5">Active</h1>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-afacad text-neutral-500">Customer Information</h1>
          <hr />
        </div>

        <div className="pt-6 pb-10 space-y-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">First Name</h1>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="John"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Last Name</h1>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="Doe"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">Email</h1>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="johndoe@example.com"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Contact Number</h1>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="09123456789"
                      className="bg-neutral-100/50 min-w-80 h-12 px-5"
                      {...field}
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full">
              <h1 className="text-sm text-neutral-500">Address</h1>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      placeholder="33 Countryside, Bangkal, D.C"
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      {...field}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="pt-16 flex justify-end items-center gap-x-4">
          <Button
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            onClick={handleSubmit(onSubmit)}
          >
            Update Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
