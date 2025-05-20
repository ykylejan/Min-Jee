
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
import { GET_ALL_EVENTS_BY_ID } from "@/graphql/people";
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
  const { data, loading, error } = useQuery(GET_ALL_EVENTS_BY_ID, {
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

  const events = data?.getEventsById;
  console.log(events)

  const subtotal: number = parseFloat(events.pax?.price || 0 + events?.customizationsPrice || 0)

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
                  <span>Events</span>
                  {/* <span>(2 item)</span> */}
                </h1>
                <h1 className="text-[#6B7280]">This is your current Event</h1>
              </div>

              <ScrollArea className="h-60 overflow-hidden overflow-y-scroll">
                <div>
                    <>
                      {/* Rentals */}
                        <ProductItemCheckout
                          key={`${events.pax.id}`}
                          id={events.pax.id}
                          name={events.pax.eventPackages.name + " " + events.pax.name}
                          price={events.pax.price}
                          quantity={1}
                          image={events.pax.eventPackages.img}
                          // No onIncrease/onDecrease/onRemove for order details
                          //   category="rental"
                        />
                    </>
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
                  <h1 className="text-2xl font-afacad_medium">Event Details</h1>
                  <h1 className="text-[#6B7280]">
                    To order for approval, enter the following details
                  </h1>
                </div>

                <div className="font-afacad">
                    <div className="space-y-3">
                      <div className="mt-5">
                        <h1>Event is Done</h1>
                        <Controller
                          name="eventAddress"
                          control={control}
                          defaultValue={events?.eventAddress}
                          render={({ field }) => (
                            <Input {...field} type="checkbox" defaultChecked={events?.eventAddress}  disabled />
                          )}
                          rules={{ required: "event address is required" }}
                        />
                      </div>

                      <div className="mt-5">
                        <h1>Event Address</h1>
                        <Controller
                          name="eventAddress"
                          control={control}
                          defaultValue={events?.eventAddress}
                          render={({ field }) => (
                            <Input {...field} placeholder="John Doe" disabled />
                          )}
                          rules={{ required: "event address is required" }}
                        />
                      </div>
                    </div>
                  <div className="pt-8">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-xl font-afacad_medium">
                        Customization
                      </h1>
                    </div>
                      <div className="mt-5">
                        <h1>Details</h1>
                        <Controller
                          name="customizations"
                          control={control}
                          defaultValue={events?.customizations}
                          render={({ field }) => (
                            <Input {...field} placeholder="John Doe" disabled />
                          )}
                          rules={{ required: "event address is required" }}
                        />
                      </div>
                      <div className="mt-5">
                        <h1>Price</h1>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue={events?.customizationsPrice}
                          render={({ field }) => (
                            <Input {...field} placeholder="John Doe" disabled />
                          )}
                          rules={{ required: "event address is required" }}
                        />
                      </div>
                    <hr />
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-xl font-afacad_medium">
                        Personal Information
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                      <div className="mt-5 mb-5">
                        <h1>Name</h1>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue={events?.name}
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
                          defaultValue={events?.location || ""}
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
                            defaultValue={events?.eventDate || ""}
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
                            defaultValue={events?.eventStart|| ""}
                            render={({ field }) => (
                              <Input {...field} type="time" disabled />
                            )}
                            rules={{ required: "Booking time is required" }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-x-3 ">
                        <div>
                          <h1>End of event</h1>
                          <Controller
                            name="returnDate"
                            control={control}
                            defaultValue={events?.eventEnd|| ""}
                            render={({ field }) => (
                              <Input {...field} type="time" disabled />
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
                        Transactions
                      </h1>
                    </div>
                    <hr />
                    {events.transactionDetails.map((trans)=>(
                        <div key={trans.id}>
                            <h3>Date</h3>
                            <Input type="date" value={trans.date}></Input>
                            <h3>payment</h3>
                            <Input value={trans.payment}></Input>
                            <h3>payment status</h3>
                            <Input value={trans.paymentStatus}></Input>
                            <a href={trans.img} className="text-blue-400">verification image</a>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ORDER STATUS CARD HERE */}

          <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
            <div className="flex justify-between px-12 py-6">
              <h1>Event Status</h1>
              {/* Show the order status from the order data */}
              {events?.eventStatus&& (
                <span className="px-2 py-1 rounded bg-gray-200">
                  {events.eventStatus.toUpperCase()}
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
