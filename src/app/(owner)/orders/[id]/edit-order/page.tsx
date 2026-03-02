"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";
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

  const orderStatus = data?.getOrdersById?.orderStatus || "pending";

  return (
    <FormPageLayout
      title="Edit Order"
      status={orderStatus}
      isLoading={loading}
      loadingText="Loading order details..."
      error={error ? "Error loading order." : null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <FormSection title="Customer Information">
            <div className="space-y-6">
              <FormRow cols={2}>
                <FormField label="Customer Name">
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                        readOnly
                      />
                    )}
                  />
                </FormField>
                <FormField label="Contact Number">
                  <Controller
                    name="contactNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                      />
                    )}
                  />
                </FormField>
              </FormRow>
              <FormField label="Location">
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                    />
                  )}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Booking Schedule">
            <div className="space-y-6">
              <FormRow cols={2}>
                <FormField label="Date of Booking">
                  <Controller
                    name="orderDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                        type="date"
                      />
                    )}
                  />
                </FormField>
                <FormField label="Time of Booking">
                  <Controller
                    name="orderTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                        type="time"
                      />
                    )}
                  />
                </FormField>
              </FormRow>
              <FormRow cols={2}>
                <FormField label="Date of Return">
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                        type="date"
                      />
                    )}
                  />
                </FormField>
                <FormField label="Time of Return">
                  <Controller
                    name="returnTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-gray-50 h-11 px-4"
                        type="time"
                      />
                    )}
                  />
                </FormField>
              </FormRow>
            </div>
          </FormSection>

          <FormSection title="Delivery Option">
            <div className="space-y-6">
              <FormRow cols={2}>
                <FormField label="Delivery Fee">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      ₱
                    </span>
                    <Controller
                      name="deliveryPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-gray-50 h-11 pl-10 pr-4"
                          type="number"
                          min="0"
                        />
                      )}
                    />
                  </div>
                </FormField>
                <FormField label="Deposit Fee">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      ₱
                    </span>
                    <Controller
                      name="depositPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-gray-50 h-11 pl-10 pr-4"
                          type="number"
                          min="0"
                        />
                      )}
                    />
                  </div>
                </FormField>
              </FormRow>
              <FormField label="Obtainment Method">
                <Controller
                  name="obtainmentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
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
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Order Status">
            <FormField label="Select Status for this order item">
              <Controller
                name="orderStatus"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
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
            </FormField>
          </FormSection>

          <FormActions>
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-8 h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Finalize Order"
              )}
            </Button>
          </FormActions>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default EditOrderPage;