"use client";
import React from "react";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface OrderDetailsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const OrderDetails = ({ register, errors }: OrderDetailsProps) => {
  return (
    <div className="bg-white border border-[#545557] w-[750px] h-auto rounded-lg px-12 pt-6 pb-12">
      <div className="font-afacad">
        <h1 className="text-2xl font-afacad_medium">Order Details</h1>
        <h1 className="text-[#6B7280]">
          To order for approval, enter the following details
        </h1>
      </div>

      <div className="font-afacad">
        <div className="pt-8">
          <div className="flex items-center gap-x-3">
            <h1 className="text-xl font-afacad_medium">Personal Information</h1>
          </div>
          <hr />

          <div className="space-y-3">
            <div className="mt-5">
              <h1>Name</h1>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <h1>Location Address</h1>
              <Input
                {...register("address", { required: "Address is required" })}
                placeholder="03 Red Stone, Calinan, Davao City"
              />
              {errors.address && (
                <span className="text-red-500 text-xs">
                  {errors.address.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16">
          <div className="flex items-center gap-x-3">
            <h1 className="text-xl font-afacad_medium">Booking Schedule</h1>
          </div>
          <hr />

          <div className="space-y-3">
            <div className="flex gap-x-3 mt-5">
              <div>
                <h1>Date of Order</h1>
                <Input
                  type="date"
                  {...register("bookingDate", {
                    required: "Booking date is required",
                  })}
                />
                {errors.bookingDate && (
                  <span className="text-red-500 text-xs">
                    {errors.bookingDate.message}
                  </span>
                )}
              </div>
              <div>
                <h1>Time of Order</h1>
                <Input
                  type="time"
                  {...register("bookingTime", {
                    required: "Booking time is required",
                  })}
                />
                {errors.bookingTime && (
                  <span className="text-red-500 text-xs">
                    {errors.bookingTime.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-x-3 ">
              <div>
                <h1>Return Date</h1>
                <Input
                  type="date"
                  {...register("returnDate", {
                    required: "Return date is required",
                  })}
                />
                {errors.returnDate && (
                  <span className="text-red-500 text-xs">
                    {errors.returnDate.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16">
          <div className="flex items-center gap-x-3">
            <h1 className="text-xl font-afacad_medium">Delivery Option</h1>
          </div>
          <hr />

          <div className="space-y-3 mt-5">
            <div className="space-y-2">
              <h1>Order Obtainment Method</h1>
              <RadioGroup
                className="flex gap-x-10"
                {...register("obtainmentMethod", {
                  required: "Select a method",
                })}
                // React Hook Form doesn't support RadioGroup directly, so use Controller if needed
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="pickup"
                    id="option-one"
                    className="border border-[#D2D6DA]"
                    {...register("obtainmentMethod")}
                  />
                  <Label htmlFor="option-one">Pick Up</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="shipped"
                    id="option-two"
                    className="border border-[#D2D6DA]"
                    {...register("obtainmentMethod")}
                  />
                  <Label htmlFor="option-two">Shipped</Label>
                </div>
              </RadioGroup>
              {errors.obtainmentMethod && (
                <span className="text-red-500 text-xs">
                  {errors.obtainmentMethod.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
