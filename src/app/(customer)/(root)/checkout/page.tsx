"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";
import OrderDetailsSet from "@/components/CheckoutPage/OrderDetailsSet";
import OrderDetailsPayment from "@/components/CheckoutPage/OrderDetailsPayment";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { RootState } from "@/redux/store";
import { parse, format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/slices/cartSlice";

const Page = () => {
  // Possible states: "" (initial), "Pending", "Verified", "Rejected", "Completed"
  const [orderStatus, setOrderStatus] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  // React Hook Form setup
  const { register, handleSubmit, formState, trigger, reset } = useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // POST request handler
  const onSubmit = async (data: any) => {
    try {
      // Separate cart items
      const services = cartItems
        .filter((item) => item.category === "service")
        .map((item) => ({
          service_quantity: item.quantity,
          service_total: Number(item.price) * item.quantity,
          service_items_id: item.id,
        }));

      const rentals = cartItems
        .filter((item) => item.category === "rental")
        .map((item) => ({
          order_item_status: "basket",
          rental_quantity: item.quantity,
          rental_total: Number(item.price) * item.quantity,
          rental_id: item.id,
        }));

      // Calculate order total
      const order_total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      // Format booking and return times
      const order_time =
        data.bookingDate && data.bookingTime
          ? format(
              parse(
                `${data.bookingDate} ${data.bookingTime}`,
                "yyyy-MM-dd HH:mm",
                new Date()
              ),
              "HH:mm:ss.SSS'Z'"
            )
          : "";

      const return_time =
        data.returnDate && data.returnTime
          ? format(
              parse(
                `${data.returnDate} ${data.returnTime}`,
                "yyyy-MM-dd HH:mm",
                new Date()
              ),
              "HH:mm:ss.SSS'Z'"
            )
          : "";

      // Build order_data
      const order_data = {
        name: data.name,
        location: data.address,
        order_total,
        order_date: data.bookingDate,
        order_time, // formatted as "HH:mm:ss.SSS'Z'"
        order_status: "pending",
        return_date: data.returnDate,
        return_time, // formatted as "HH:mm:ss.SSS'Z'"
        overdue_days: 0,
        is_shipped: data.obtainmentMethod === "shipped",
        delivery_price: 250,
        deposit_price: 0,
      };

      // Build request body
      const body = {
        order_data,
        services,
        rentals,
      };

      await api.post("http://localhost:8000/api/v1/u/order/", body);
      //   toast.success("Order placed! Analyzing order...");
      setOrderStatus("Pending");

      toast.success("Ordered Successfully!");
      dispatch(clearCart());
      router.push("/account");
    } catch (error: any) {
      toast.error("Order submission failed. Please try again.");
      console.error("Order submission failed:", error);
    }
  };

  // Handle going back from payment to order details
  const handleBackToOrderDetails = () => {
    setShowPaymentForm(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
      <div className="pb-[80px] px-24">
        <h1 className="text-2xl font-intermedium py-2">Checkout</h1>
        <div className="flex gap-x-10">
          <div className="space-y-10">
            <BasketList />
            {showPaymentForm ? (
              <div>
                <OrderDetailsSet onOrderableChange={handleBackToOrderDetails} />
                <OrderDetailsPayment />
              </div>
            ) : (
              <OrderDetails register={register} errors={formState.errors} />
            )}
          </div>
          <OrderStatus
            orderStatus={orderStatus}
            updateOrderStatus={setOrderStatus}
            showPaymentForm={showPaymentForm}
            setShowPaymentForm={setShowPaymentForm}
            handleSubmit={handleSubmit}
            trigger={trigger}
            onSubmit={onSubmit}
          >
            {orderStatus && <StatusLabel label={orderStatus} />}
          </OrderStatus>
        </div>
      </div>
    </div>
  );
};

export default Page;
