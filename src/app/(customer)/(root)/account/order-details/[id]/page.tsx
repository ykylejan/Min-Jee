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
import { useAppSelector } from "@/redux/hooks";
import { parse, format } from "date-fns";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID } from "@/graphql/people";
import { Controller } from "react-hook-form";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";
import { useRouter, useParams } from "next/navigation";
// import { ScrollArea } from "../ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
// import ProductItemCheckout from "./ProductItemCheckout";
import ProductItemCheckout from "@/components/CheckoutPage/ProductItemCheckout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [orderStatus, setOrderStatus] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const { register, handleSubmit, formState, trigger, reset, control } =
    useForm();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  // Fetch order details by ID using Apollo Client
  const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    client: apolloClientCustomer,
  });

  const onSubmit = async (data: any) => {
    try {
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

      const order_total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

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

      const order_data = {
        name: data.name,
        location: data.address,
        order_total,
        order_date: data.bookingDate,
        order_time,
        order_status: "pending",
        return_date: data.returnDate,
        return_time,
        overdue_days: 0,
        is_shipped: data.obtainmentMethod === "shipped",
        delivery_price: 250,
        deposit_price: 0,
      };

      const body = {
        order_data,
        services,
        rentals,
      };

      await api.post("http://localhost:8000/api/v1/u/order/", body);
      setOrderStatus("Pending");

      toast.success("Ordered Successfully!");
      router.push("/account");
    } catch (error: any) {
      toast.error("Order submission failed. Please try again.");
      console.error("Order submission failed:", error);
    }
  };

  const handleBackToOrderDetails = () => {
    setShowPaymentForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <span className="text-xl">Failed to load order details.</span>
      </div>
    );
  }

  const order = data?.getOrdersById;
  const subtotal =
    (order?.rentalList?.reduce(
      (sum: number, item: any) => sum + Number(item.rentalTotal || 0),
      0
    ) || 0) +
    (order?.servicesList?.reduce(
      (sum: number, item: any) => sum + Number(item.serviceTotal || 0),
      0
    ) || 0);

  const getButtonText = () => {
    if (orderStatus === "") return "Place Order";
    if (orderStatus === "Pending") return "Analyzing Order";
    if (orderStatus === "Verified") {
      return showPaymentForm ? "Checkout" : "Proceed to Payment";
    }
    if (orderStatus === "Completed") return "Order Completed";
    return "Place Order";
  };

  const isButtonDisabled =
    orderStatus === "Pending" ||
    orderStatus === "Rejected" ||
    orderStatus === "Completed";

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
      <div className="pb-[80px] px-24">
        <h1 className="text-2xl font-intermedium py-2">Checkout</h1>
        <div className="flex gap-x-10">
          <div className="space-y-10">
            <div className="bg-white border border-[#D2D6DA] w-[750px] h-[350px] rounded-lg px-12 pt-6">
              <div className="font-afacad">
                <h1 className="text-2xl font-afacad_medium">
                  <span>Basket List </span>
                  {/* <span>(2 item)</span> */}
                </h1>
                <h1 className="text-[#6B7280]">This is your current order</h1>
              </div>

              <ScrollArea className="h-60 overflow-hidden overflow-y-scroll">
                <div>
                  {!order?.rentalList?.length &&
                  !order?.servicesList?.length ? (
                    <p className="text-gray-500">No items in this order.</p>
                  ) : (
                    <>
                      {/* Rentals */}
                      {order?.rentalList?.map((item: any) => (
                        <ProductItemCheckout
                          key={`rental-${item.id}`}
                          id={item.rentalId}
                          name={item.rentals?.name}
                          price={item.rentalTotal}
                          quantity={item.rentalQuantity}
                          image={item.rentals?.img}
                          // No onIncrease/onDecrease/onRemove for order details
                          //   category="rental"
                        />
                      ))}
                      {/* Services */}
                      {order?.servicesList?.map((item: any) => (
                        <ProductItemCheckout
                          key={`service-${item.id}`}
                          id={item.serviceItemsId}
                          name={item.servicesItems?.name}
                          price={item.serviceTotal}
                          quantity={item.serviceQuantity}
                          image={item.servicesItems?.services?.img}
                          //   category="service"
                        />
                      ))}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
            {showPaymentForm ? (
              <div>
                <OrderDetailsSet onOrderableChange={handleBackToOrderDetails} />
                <OrderDetailsPayment />
              </div>
            ) : (
              // INTEGRATE THIS PART, POPULATE THE DETAILS WITH THE ORDER DATA
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
                      <h1 className="text-xl font-afacad_medium">
                        Personal Information
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                      <div className="mt-5">
                        <h1>Name</h1>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue={order?.name}
                          render={({ field }) => (
                            <Input {...field} placeholder="John Doe" disabled />
                          )}
                          rules={{ required: "Name is required" }}
                        />
                      </div>

                      <div>
                        <h1>Location Address</h1>
                        <Controller
                          name="address"
                          control={control}
                          defaultValue={order?.location || ""}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="03 Red Stone, Calinan, Davao City"
                              disabled
                            />
                          )}
                          rules={{ required: "Address is required" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-16">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-xl font-afacad_medium">
                        Booking Schedule
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                      <div className="flex gap-x-3 mt-5">
                        <div>
                          <h1>Date of Booking</h1>
                          <Controller
                            name="bookingDate"
                            control={control}
                            defaultValue={order?.orderDate || ""}
                            render={({ field }) => (
                              <Input {...field} type="date" disabled />
                            )}
                            rules={{ required: "Booking date is required" }}
                          />
                        </div>
                        <div>
                          <h1>Time of Booking</h1>
                          <Controller
                            name="bookingTime"
                            control={control}
                            defaultValue={order?.orderTime || ""}
                            render={({ field }) => (
                              <Input {...field} type="time" disabled />
                            )}
                            rules={{ required: "Booking time is required" }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-x-3 ">
                        <div>
                          <h1>Return Date</h1>
                          <Controller
                            name="returnDate"
                            control={control}
                            defaultValue={order?.returnDate || ""}
                            render={({ field }) => (
                              <Input {...field} type="date" disabled />
                            )}
                            rules={{ required: "Return date is required" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-16">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-xl font-afacad_medium">
                        Delivery Option
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3 mt-5">
                      <div className="space-y-2">
                        <h1>Order Obtainment Method</h1>
                        <Controller
                          name="obtainmentMethod"
                          control={control}
                          defaultValue={order?.isShipped ? "shipped" : "pickup"}
                          render={({ field }) => (
                            <RadioGroup
                              className="flex gap-x-10"
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="pickup"
                                  id="option-one"
                                  className="border border-[#D2D6DA]"
                                  disabled
                                />
                                <Label htmlFor="option-one">Pick Up</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="shipped"
                                  id="option-two"
                                  className="border border-[#D2D6DA]"
                                  disabled
                                />
                                <Label htmlFor="option-two">Shipped</Label>
                              </div>
                            </RadioGroup>
                          )}
                          rules={{ required: "Select a method" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ORDER STATUS CARD HERE */}

          <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
            <div className="flex justify-between px-12 py-6">
              <h1>Order Status</h1>
              {/* Show the order status from the order data */}
              {order?.orderStatus && (
                <span className="px-2 py-1 rounded bg-gray-200">
                  {order.orderStatus.toUpperCase()}
                </span>
              )}
            </div>
            <hr />
            <div className="py-6">
              <div className="flex justify-between px-12">
                <h1>Subtotal</h1>
                <h1>PHP {subtotal.toFixed(2)}</h1>
              </div>
              <div className="flex justify-between px-12">
                <h1>Delivery Fee</h1>
                <h1>PHP 250.00</h1>
              </div>
            </div>
            <hr />
            <div className="flex justify-between px-12 py-6">
              <h1>TOTAL</h1>
              <h1>PHP {(subtotal + 250).toFixed(2)}</h1>
            </div>
            <hr />
            <div className="flex flex-col gap-y-3 px-12 py-6">
              <Button
                // onClick={handleButtonClick}
                disabled={isButtonDisabled}
                className="bg-[#0F172A] rounded-full"
              >
                {getButtonText()}
              </Button>
              <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                Cancel Order
              </Button>
              <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                Empty Basket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
