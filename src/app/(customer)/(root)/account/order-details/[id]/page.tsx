"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { Check, ScanQrCode, Upload, X } from "lucide-react";

import PaymentButtons from "@/components/CheckoutPage/Payment Details/PaymentButtons";
import PaymentProcess from "@/components/CheckoutPage/Payment Details/PaymentProcess";
import { icons, images } from "@/constants";
import { FaTruckFast } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import { FcInfo } from "react-icons/fc";

const Page = () => {
  const [orderStatus, setOrderStatus] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentOption, setPaymentOption] = useState("GCash");
  const [receiptFile, setReceiptFile] = useState<any>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");

  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const { register, handleSubmit, formState, trigger, reset, control } =
    useForm();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = () => {
    if (receiptFile) {
      setPaymentConfirmed(true);
      toast.success("Payment receipt uploaded!");
      setDialogOpen(false);
    } else {
      toast.error("Please upload a receipt before confirming payment.");
    }
  };

  const handleClearReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch order details by ID using Apollo Client
  const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    client: apolloClientCustomer,
  });

  const handleCheckoutPayment = async () => {
    if (!receiptFile) {
      toast.error("Please upload a payment receipt.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("date", format(new Date(), "yyyy-MM-dd"));
      //   formData.append("payment", Number(paymentAmount));
      formData.append("payment", String(paymentAmount));
      formData.append("payment_status", "partial");
      formData.append("is_verified", "false");
      formData.append("order_id", orderId);
      formData.append("file", receiptFile);

      await api.post(
        "http://localhost:8000/api/v1/u/transactions/orders",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Payment submitted successfully!");
      router.push("/account");
      setPaymentConfirmed(true);
      setDialogOpen(false);
      // Optionally, refresh or redirect
    } catch (error) {
      toast.error("Failed to submit payment. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    const status = data?.getOrdersById?.orderStatus || "";
    setOrderStatus(status);
    setShowPaymentForm(status.toLowerCase() === "verified");
  }, [data]);
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
    if (orderStatus === "pending") return "Analyzing Order";
    if (orderStatus === "verified") {
      return showPaymentForm ? "Checkout" : "Proceed to Payment";
    }
    if (orderStatus === "completed") return "Order Completed";
    return "Place Order";
  };

  const isButtonDisabled =
    orderStatus === "pending" ||
    orderStatus === "rejected" ||
    orderStatus === "completed";

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

                {/* INTEGRATE ORDER DETAILS PAYMENT HERE */}
                <div>
                  <hr className="my-3" />
                  <div className="flex items-center">
                    <IoIosCheckmark color="transparent" size={40} />
                    <h1 className="text-2xl font-afacad_medium">
                      Payment Details
                    </h1>
                  </div>

                  <div className="bg-[#EFF6FF] w-full h-10 rounded-md flex items-center px-5 mt-2 mb-5">
                    <FcInfo size={20} />
                    <h1 className="text-[#2196F3] font-afacad pl-5">
                      Choose your payment option
                    </h1>
                  </div>

                  <div className="flex gap-x-4 mb-8">
                    <div onClick={() => setPaymentOption("GCash")}>
                      <PaymentButtons
                        text="GCash"
                        image={icons.gcash.src}
                        imageActive={icons.gcashActive.src}
                        isActive={paymentOption === "GCash"}
                      />
                    </div>
                    <div onClick={() => setPaymentOption("COD")}>
                      <PaymentButtons
                        text="Cash on Delivery"
                        image={icons.wallet.src}
                        imageActive={icons.walletActive.src}
                        isActive={paymentOption === "COD"}
                      />
                    </div>
                  </div>

                  {paymentOption === "GCash" && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger className="w-full text-start">
                        <PaymentProcess
                          text="GCash Selected"
                          image={icons.gcashActive.src}
                          description={
                            paymentConfirmed
                              ? `Receipt: ${receiptFile?.name || "receipt.png"}`
                              : "Click to scan the QR code"
                          }
                          icon={
                            paymentConfirmed ? (
                              <Check color="#22C55E" size={35} />
                            ) : (
                              <ScanQrCode color="#6B7280" size={35} />
                            )
                          }
                          isGcash="GCash"
                        />
                      </DialogTrigger>
                      <div className="mt-4 bg-white rounded-md py-5 px-8 border border-[#D2D6DA]">
                        <h3 className="text-[#0066DF] font-bold mb-2 ">
                          Payment Amount <span className="text-red-500">*</span>
                        </h3>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter payment amount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0">
                        <DialogHeader className="">
                          <DialogTitle className="sr-only">
                            GCash Payment
                          </DialogTitle>
                        </DialogHeader>
                        {/* GCash header */}
                        <div className="bg-[#0066DF] text-white text-center py-4 px-6">
                          <div className="flex justify-between items-center">
                            <div className="flex-1 flex justify-center">
                              <h2 className="text-2xl font-bold">
                                GCash Payment
                              </h2>
                            </div>
                          </div>
                        </div>

                        {/* Payment content */}
                        <div className="bg-white p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left side - QR code */}
                            <div className="flex flex-col items-center justify-center">
                              <div className="bg-white border-2 border-[#0066DF] rounded-md p-3 w-full max-w-xs">
                                <div className="text-center mb-2 text-[#0066DF] font-medium">
                                  Scan the QR code to pay
                                </div>
                                <div className="bg-[#E6F2FF] p-4 rounded-md flex justify-center items-center">
                                  <img
                                    src={images.qrCodeSample.src}
                                    alt="QR Code"
                                    className="w-full h-auto max-w-[200px]"
                                  />
                                </div>
                                <div className="text-center mt-3 text-[#0066DF] font-semibold">
                                  SCAN TO PAY
                                </div>
                                <div className="text-center mt-2 bg-[#0066DF] text-white py-2 rounded-md">
                                  Amount: ₱ 500.00
                                </div>
                              </div>
                            </div>

                            {/* Right side - Instructions and upload */}
                            <div className="flex flex-col">
                              <div className="bg-[#E6F2FF] p-4 rounded-md mb-4">
                                <h3 className="text-[#0066DF] font-bold mb-2">
                                  Payment Instructions
                                </h3>
                                <ol className="list-decimal pl-5 text-[#0066DF]">
                                  <li className="mb-1">Open your GCash app</li>
                                  <li className="mb-1">Tap on "Scan QR"</li>
                                  <li className="mb-1">
                                    Point your camera to the QR code
                                  </li>
                                  <li className="mb-1">Confirm the payment</li>
                                </ol>
                              </div>

                              <div className="mt-4">
                                <h3 className="text-[#0066DF] font-bold mb-2">
                                  Upload Receipt
                                </h3>
                                {receiptPreview ? (
                                  <div className="border-2 border-[#0066DF] rounded-md p-2 text-center relative">
                                    <button
                                      onClick={handleClearReceipt}
                                      className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                                      type="button"
                                    >
                                      <X size={16} />
                                    </button>
                                    <div className="flex flex-col items-center">
                                      <div className="w-full pb-2 overflow-hidden">
                                        <img
                                          src={receiptPreview}
                                          alt="Receipt Preview"
                                          className="max-h-40 max-w-full object-contain"
                                        />
                                      </div>
                                      <p className="text-sm text-[#0066DF] font-medium truncate max-w-full">
                                        {receiptFile.name}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-[#0066DF] rounded-md p-4 text-center">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      id="gcash-receipt"
                                      ref={fileInputRef}
                                      onChange={handleFileChange}
                                    />
                                    <label
                                      htmlFor="gcash-receipt"
                                      className="cursor-pointer block w-full"
                                    >
                                      <div className="flex flex-col items-center justify-center py-3">
                                        <Upload size={36} color="#0066DF" />
                                        <span className="mt-2 text-[#0066DF] font-medium">
                                          Choose file or drag & drop
                                        </span>
                                        <span className="mt-1 text-sm text-[#0066DF]/70">
                                          JPEG, PNG or PDF (max. 5MB)
                                        </span>
                                      </div>
                                    </label>
                                  </div>
                                )}
                              </div>

                              <button
                                className={`mt-6 ${
                                  receiptFile
                                    ? "bg-[#0066DF] hover:bg-[#0055c8]"
                                    : "bg-gray-400 cursor-not-allowed"
                                } text-white font-bold py-3 px-6 rounded-md w-full transition-colors`}
                                onClick={handleConfirmPayment}
                                disabled={!receiptFile}
                              >
                                Confirm Payment
                              </button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {paymentOption === "COD" && (
                    <PaymentProcess
                      text="Cash on delivery Selected"
                      image={icons.walletActive.src}
                      description="Payment will be done onsite"
                      icon={<FaTruckFast color="#6B7280" size={35} />}
                      isGcash="COD"
                    />
                  )}
                  <hr className="mt-5" />
                </div>
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
                        Order Schedule
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                      <div className="flex gap-x-3 mt-5">
                        <div>
                          <h1>Date of Order</h1>
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
                          <h1>Time of Order</h1>
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
                <h1>{order.deliveryPrice}</h1>
              </div>
            </div>
            <hr />
            <div className="flex justify-between px-12 py-6">
              <h1>TOTAL</h1>
              <h1>
                PHP {(subtotal + Number(order?.deliveryPrice || 0)).toFixed(2)}
              </h1>
            </div>
            <hr />
            <div className="flex flex-col gap-y-3 px-12 py-6">
              <Button
                onClick={handleCheckoutPayment}
                disabled={isButtonDisabled || !receiptFile}
                className={`rounded-full ${
                  isButtonDisabled ? "bg-gray-400" : "bg-[#0F172A]"
                }`}
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
