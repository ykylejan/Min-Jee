"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const page = () => {
  const router = useRouter();

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

      const response = await api.post("o/customer", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast("Customer Added Successfully", {
        description: "New customer is added to the repository",
        className: "bg-green-500/80 border border-none text-white",
      });
      router.push("/customers");
    } catch (error) {
      toast.error("Failed to add customer. Please try again.");
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
              Add Customer
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pt-6 pb-10 space-y-6"
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">First Name</h1>
              <Input
                placeholder="John"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Last Name</h1>
              <Input
                placeholder="Doe"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="text-sm text-neutral-500">Email</h1>
              <Input
                placeholder="johndoe@gmail.com"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <h1 className="text-sm text-neutral-500">Contact Number</h1>
              <Input
                placeholder="09123456789"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("contactNumber")}
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
                placeholder="33 Countryside, Bangkal, D.C"
                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-16 flex justify-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            >
              Add Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
