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

import { Check, Upload, X } from "lucide-react";

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

  const handleClearReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch order details by ID using Apollo Client
  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    client: apolloClientCustomer,
  });

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    try {
      await api.patch(`http://localhost:8000/api/v1/u/order/${orderId}/cancel`);
      toast.success("Order cancelled successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to cancel order. Please try again.");
      console.error(error);
    }
  };

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
      formData.append("is_verified", "true");
      formData.append("order_id", orderId);
      formData.append("file", receiptFile);

      const res = await api.post(
        "http://localhost:8000/api/v1/u/transactions/orders",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // console.log();

      toast.success("Payment submitted successfully!");
      router.push(
        `/account/order-details/${orderId}/receipt/${res.data.transaction.id}`
      );
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
    <div className="min-h-screen bg-[#FFFBF5] pt-[100px] sm:pt-[120px] flex justify-center">
      <div className="pb-[80px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 w-full max-w-[1280px]">
        <h1 className="text-xl sm:text-2xl font-intermedium py-2 sm:py-4">Order Details</h1>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-x-8 items-start">
          <div className="space-y-6 sm:space-y-10 w-full xl:flex-1 xl:max-w-[750px]">
            <div className="bg-white border border-[#545557] w-full rounded-lg px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
              <div className="font-afacad mb-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-afacad_medium">
                  <span>Basket List </span>
                  {/* <span>(2 item)</span> */}
                </h1>
                <h1 className="text-[#6B7280] text-sm sm:text-base">This is your current order</h1>
              </div>

              <ScrollArea className="max-h-[280px] sm:max-h-[320px] overflow-hidden overflow-y-auto">
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
                  <hr className="my-2 sm:my-3" />
                  <div className="flex items-center">
                    <IoIosCheckmark color="transparent" className="w-8 h-8 sm:w-10 sm:h-10" />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-afacad_medium">
                      Payment Details
                    </h1>
                  </div>

                  <div className="bg-[#EFF6FF] w-full h-auto min-h-[40px] rounded-md flex items-center px-3 sm:px-5 py-2 mt-2 mb-4 sm:mb-5">
                    <FcInfo size={20} className="flex-shrink-0" />
                    <h1 className="text-[#2196F3] font-afacad pl-3 sm:pl-5 text-sm sm:text-base">
                      Choose your payment option
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-x-4 mb-6 sm:mb-8">
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
                    <div className="space-y-5">
                      {/* Step 1: Payment Amount */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-7 h-7 rounded-full bg-[#0066DF] text-white flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <h3 className="font-afacad_semibold text-[#0066DF]">Enter Payment Amount</h3>
                        </div>
                        <div className="ml-10">
                          <Input
                            type="number"
                            min={0}
                            placeholder="₱ 0.00"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full max-w-xs bg-white border-blue-200 focus:border-[#0066DF] text-lg"
                            required
                          />
                          <p className="text-xs text-neutral-500 mt-1.5">
                            Order total: <span className="font-semibold text-[#0066DF]">PHP {(subtotal + Number(order?.deliveryPrice || 0)).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Scan QR */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-7 h-7 rounded-full bg-[#0066DF] text-white flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <h3 className="font-afacad_semibold text-[#0066DF]">Scan QR Code to Pay</h3>
                        </div>
                        <div className="ml-10 flex flex-col sm:flex-row gap-4 items-start">
                          {/* QR Code */}
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex-shrink-0">
                            <img
                              src={images.qrCodeSample.src}
                              alt="GCash QR Code"
                              className="w-36 h-36 object-contain mx-auto"
                            />
                            <div className="mt-3 bg-[#0066DF] text-white text-center py-2 px-4 rounded-lg text-sm font-afacad_semibold">
                              PHP {(subtotal + Number(order?.deliveryPrice || 0)).toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Instructions */}
                          <div className="flex-1">
                            <p className="text-sm text-neutral-600 mb-3">How to pay with GCash:</p>
                            <div className="space-y-2">
                              {[
                                "Open GCash app on your phone",
                                "Tap \"Scan QR\" or the camera icon",
                                "Point camera at the QR code",
                                "Enter amount and confirm payment",
                                "Take a screenshot of the receipt"
                              ].map((step, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0066DF] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                    {i + 1}
                                  </div>
                                  <span className="text-neutral-600">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Upload Receipt */}
                      <div className={`rounded-xl p-4 border transition-all ${
                        receiptFile 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-100'
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            receiptFile 
                              ? 'bg-green-500 text-white' 
                              : 'bg-[#0066DF] text-white'
                          }`}>
                            {receiptFile ? <Check size={16} /> : '3'}
                          </div>
                          <h3 className={`font-afacad_semibold ${receiptFile ? 'text-green-700' : 'text-[#0066DF]'}`}>
                            {receiptFile ? 'Receipt Uploaded!' : 'Upload Payment Receipt'}
                          </h3>
                        </div>
                        
                        <div className="ml-10">
                          {receiptPreview ? (
                            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-green-200">
                              <img
                                src={receiptPreview}
                                alt="Receipt"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-afacad_semibold text-sm text-neutral-800 truncate">
                                  {receiptFile.name}
                                </p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                  <Check size={12} /> Ready to submit
                                </p>
                              </div>
                              <button
                                onClick={handleClearReceipt}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                type="button"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="gcash-receipt-inline"
                              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-xl bg-white/50 hover:bg-white hover:border-[#0066DF] cursor-pointer transition-all group"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="gcash-receipt-inline"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                              />
                              <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-[#0066DF] flex items-center justify-center transition-colors">
                                <Upload size={24} className="text-[#0066DF] group-hover:text-white transition-colors" />
                              </div>
                              <p className="mt-3 font-afacad_semibold text-sm text-neutral-700">
                                Click to upload receipt
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                PNG, JPG up to 5MB
                              </p>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Status Summary */}
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${paymentAmount && receiptFile ? 'bg-green-500' : 'bg-amber-400'}`} />
                          <span className="text-sm text-neutral-600">
                            {paymentAmount && receiptFile 
                              ? 'Ready to checkout' 
                              : `Complete ${!paymentAmount && !receiptFile ? 'steps 1 & 3' : !paymentAmount ? 'step 1' : 'step 3'} to continue`
                            }
                          </span>
                        </div>
                        <img src={icons.gcashActive.src} alt="GCash" className="h-6" />
                      </div>
                    </div>
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
              <div className="bg-white border border-[#545557] w-full h-auto rounded-lg px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:pt-6 sm:pb-12">
                <div className="font-afacad">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-afacad_medium">Order Details</h1>
                  <h1 className="text-[#6B7280] text-sm sm:text-base">
                    To order for approval, enter the following details
                  </h1>
                </div>

                <div className="font-afacad">
                  <div className="pt-4 sm:pt-6 md:pt-8">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-base sm:text-lg md:text-xl font-afacad_medium">
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

                  <div className="pt-8 sm:pt-12 md:pt-16">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-base sm:text-lg md:text-xl font-afacad_medium">
                        Order Schedule
                      </h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <div className="flex-1">
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
                        <div className="flex-1">
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

                  <div className="pt-8 sm:pt-12 md:pt-16">
                    <div className="flex items-center gap-x-3">
                      <h1 className="text-base sm:text-lg md:text-xl font-afacad_medium">
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

                  {/* Show "Proceed to Payment" button when order is verified */}
                  {orderStatus === "verified" && (
                    <div className="pt-8 sm:pt-10">
                      <Button
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full bg-[#0F172A] hover:bg-[#1e293b] rounded-full text-sm sm:text-base h-10 sm:h-11 font-medium transition-colors duration-200"
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ORDER STATUS CARD HERE */}

          <div className="bg-white border border-[#545557] w-full xl:w-[380px] xl:flex-shrink-0 h-fit rounded-lg font-afacad py-3 xl:sticky xl:top-[130px]">
            <div className="flex justify-between items-center px-4 sm:px-8 md:px-12 xl:px-6 py-4 sm:py-6">
              <h1 className="text-sm sm:text-base">Order Status</h1>
              {/* Show the order status from the order data */}
              {order?.orderStatus && (
                <StatusLabel label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)} />
              )}
            </div>
            <hr />
            <div className="py-4 sm:py-6">
              <div className="flex justify-between px-4 sm:px-8 md:px-12 xl:px-6 text-sm sm:text-base">
                <h1>Subtotal</h1>
                <h1>PHP {subtotal.toFixed(2)}</h1>
              </div>
              <div className="flex justify-between px-4 sm:px-8 md:px-12 xl:px-6 text-sm sm:text-base">
                <h1>Delivery Fee</h1>
                <h1>PHP {order.deliveryPrice}</h1>
              </div>
            </div>
            <hr />
            <div className="flex justify-between px-4 sm:px-8 md:px-12 xl:px-6 py-4 sm:py-6 text-sm sm:text-base font-semibold">
              <h1>TOTAL</h1>
              <h1>
                PHP {(subtotal + Number(order?.deliveryPrice || 0)).toFixed(2)}
              </h1>
            </div>
            <hr />
            <div className="flex flex-col gap-y-2 sm:gap-y-3 px-4 sm:px-8 md:px-12 xl:px-6 py-4 sm:py-6">
              <Button
                onClick={handleCheckoutPayment}
                disabled={isButtonDisabled || !receiptFile}
                className="bg-[#0F172A] hover:bg-[#1e293b] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full text-sm sm:text-base h-10 sm:h-11 font-medium transition-colors duration-200"
              >
                {getButtonText()}
              </Button>
              <Button 
                onClick={handleCancelOrder}
                disabled={orderStatus === "cancelled" || orderStatus === "completed"}
                className="bg-transparent text-[#0F172A] hover:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed rounded-full shadow-none border border-[#545557] text-sm sm:text-base h-10 sm:h-11 font-medium transition-colors duration-200"
              >
                {orderStatus === "cancelled" ? "Order Cancelled" : "Cancel Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
