"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/StatusLabel";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { parse, format } from "date-fns";

const obtainmentOptions = [
  { label: "Shipped", value: "true" },
  { label: "Pick-Up", value: "false" },
];

const paymentStatusOptions = [
  { label: "Full", value: "full" },
  { label: "Partial", value: "partial" },
];

const orderStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

// Utility to format time as "HH:mm:ss.SSS'Z'"
function getOrderTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return "";
  try {
    const parsed = parse(
      `${dateStr} ${timeStr}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    return format(parsed, "HH:mm:ss.SSS'Z'");
  } catch {
    return "";
  }
}

const EditOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      customerName: "",
      contactNumber: "",
      location: "",
      orderDate: "",
      orderTime: "",
      returnDate: "",
      returnTime: "",
      deliveryPrice: "",
      depositPrice: "",
      paymentStatus: "",
      orderStatus: "",
      customerNotes: "",
      obtainmentMethod: "",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.getOrdersById) {
      const order = data.getOrdersById;
      // Parse order_time and return_time if available
      let orderTime = "";
      let returnTime = "";
      if (order.orderTime) {
        // Expecting "12:54:27.494Z"
        const [h, m, s] = order.orderTime.split(":");
        orderTime = h && m ? `${h}:${m}` : "";
      }
      if (order.returnTime) {
        const [h, m, s] = order.returnTime.split(":");
        returnTime = h && m ? `${h}:${m}` : "";
      }
      reset({
        customerName: order.customer
          ? `${order.customer.firstName} ${order.customer.lastName}`
          : "",
        contactNumber: order.customer?.contactNumber || "",
        location: order.location || "",
        orderDate: order.orderDate
          ? new Date(order.orderDate).toISOString().split("T")[0]
          : "",
        orderTime,
        returnDate: order.returnDate
          ? new Date(order.returnDate).toISOString().split("T")[0]
          : "",
        returnTime,
        deliveryPrice: order.deliveryPrice || "",
        depositPrice: order.depositPrice || "",
        paymentStatus: order.transactionDetails?.paymentStatus || "",
        orderStatus: order.orderStatus || "",
        customerNotes: order.customerNotes || "",
        obtainmentMethod: order.isShipped ? "true" : "false",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const order_time = getOrderTime(formData.orderDate, formData.orderTime);
      const return_time = getOrderTime(formData.returnDate, formData.returnTime);

      const patchBody = {
        name: formData.customerName,
        location: formData.location,
        order_total: 0, // You may want to calculate this
        order_date: formData.orderDate,
        order_time,
        order_status: formData.orderStatus,
        return_date: formData.returnDate,
        return_time,
        overdue_days: 0, // You may want to calculate this
        is_shipped: formData.obtainmentMethod === "true",
        delivery_price: Number(formData.deliveryPrice) || 0,
        deposit_price: Number(formData.depositPrice) || 0,
      };

      await api.patch(
        `http://localhost:8000/api/v1/o/order/${orderId}`,
        patchBody
      );

      toast.success("Order updated successfully!");
      router.push(`/orders/${orderId}`);
    } catch (err) {
      console.error("Failed to update order:", err);
      toast.error("Failed to update order.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading order.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center">
        <div className="bg-white w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
          <div className="flex gap-x-3 items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <MoveLeft width={20} height={20} className="text-neutral-600" />
            </button>
            <div className="flex justify-between items-center w-full">
              <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
                Edit Order
              </h1>
              <StatusLabel
                label={data?.getOrdersById?.orderStatus || "Pending"}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">
                Customer Information
              </h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Customer Name</h1>
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        readOnly
                      />
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Contact Number</h1>
                  <Controller
                    name="contactNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-sm text-neutral-500">Location</h1>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-neutral-100/50 w-full h-12 px-5"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Booking Schedule */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">Booking Schedule</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Date of Booking</h1>
                  <Controller
                    name="orderDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="date"
                      />
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Time of Booking</h1>
                  <Controller
                    name="orderTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="time"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Date of Return</h1>
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="date"
                      />
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Time of Return</h1>
                  <Controller
                    name="returnTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="time"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Option */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">Delivery Option</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-x-12">
                  <h1 className="text-sm text-neutral-500">Delivery Fee</h1>
                  <div className="relative w-80">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      ₱
                    </span>
                    <Controller
                      name="deliveryPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-neutral-100/50 w-full h-12 pl-10 pr-5"
                          type="number"
                          min="0"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-12">
                  <h1 className="text-sm text-neutral-500">Deposit Fee</h1>
                  <div className="relative w-80">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      ₱
                    </span>
                    <Controller
                      name="depositPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-neutral-100/50 w-full h-12 pl-10 pr-5"
                          type="number"
                          min="0"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Obtainment Method */}
          <div>
            <h1 className="text-sm text-neutral-500">Obtainment Method</h1>
            <Controller
              name="obtainmentMethod"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                    <SelectValue placeholder="Select Obtainment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {obtainmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Order Status */}
          <div className="mt-6">
            <div>
              <h1 className="font-afacad text-neutral-500">Order Status</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">
                  Select Status for this order item
                </h1>
                <Controller
                  name="orderStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="font-afacad">
                          {orderStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              Finalize Order
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditOrderPage;