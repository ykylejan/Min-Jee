"use client";

import ReceiptItem from "@/components/ReceiptCard/ReceiptItem";
import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import apolloClientPartner from "@/graphql/apolloClientPartners";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner, // set your apolloClientPartner if needed
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl">Loading receipt details...</span>
      </div>
    );
  }

  if (error || !data?.getOrdersById) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load receipt details.
      </div>
    );
  }

  const order = data.getOrdersById;
  const customer = order.customer;

  // Rentals and Services
  const rentalProducts =
    order.rentalList?.map((item: any) => ({
      id: item.id,
      name: item.rentals?.name,
      price: item.rentalTotal,
      quantity: item.rentalQuantity,
      img: item.rentals?.img,
      category: "Rental",
    })) || [];

  const serviceProducts =
    order.servicesList?.map((item: any) => ({
      id: item.id,
      name: item.servicesItems?.name,
      price: item.serviceTotal,
      quantity: item.serviceQuantity,
      img: item.servicesItems?.services?.img,
      category: "Service",
    })) || [];

  const allProducts = [...rentalProducts, ...serviceProducts];

  // Totals
  const subtotal = allProducts.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );
  const deliveryFee = Number(order.deliveryPrice || 0);
  const depositPrice = Number(order.depositPrice || 0);
  const total = subtotal + deliveryFee + depositPrice;

  // Transaction/Receipt
  const transaction = order.transactionDetails?.[0];

  // Helper: Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
        >
          <MoveLeft width={20} height={20} />
        </button>
        <div className="">
          <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
            <h1 className="text-[#6B7280] font-afacad_bold">
              Order Successful
            </h1>
            <h1 className="font-poppins_extrabold text-5xl py-3">
              Thanks for your order!
            </h1>
            <h1 className="text-[#6B7280] font-afacad pb-8">
              We appreciate your order, we are currently processing it. Hang on
              tight and we’ll send you confirmation soon!
            </h1>
            <hr />

            {/* Product Items */}
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <ReceiptItem key={product.id} {...product} />
              ))
            ) : (
              <div className="text-neutral-400 py-6">No products found.</div>
            )}

            <div className="font-afacad py-8 space-y-2">
              <h1 className="flex justify-between">
                <span className="text-[#6B7280] font-afacad_bold">
                  Subtotal
                </span>
                <span className="font-afacad_semibold">
                  PHP {subtotal.toFixed(2)}
                </span>
              </h1>
              <h1 className="flex justify-between">
                <span className="text-[#6B7280] font-afacad_bold">
                  Delivery Fee
                </span>
                <span className="font-afacad_semibold">
                  PHP {deliveryFee.toFixed(2)}
                </span>
              </h1>
              <h1 className="flex justify-between">
                <span className="text-[#6B7280] font-afacad_bold">
                  Deposit Price
                </span>
                <span className="font-afacad_semibold">
                  PHP {depositPrice.toFixed(2)}
                </span>
              </h1>
              <h1 className="flex justify-between">
                <span className="text-[#6B7280] font-afacad_bold">Taxes</span>
                <span className="font-afacad_semibold">PHP 0.00</span>
              </h1>
            </div>
            <hr />

            <div className="py-8">
              <h1 className="flex justify-between font-afacad_semibold">
                <span>TOTAL</span>
                <span>PHP {total.toFixed(2)}</span>
              </h1>
            </div>
            <hr />

            <div className="py-8">
              <div className="flex space-x-20">
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Customer Details</h1>
                  <div className="font-afacad text-[#6B7280]">
                    <h1>
                      {customer
                        ? `${customer.firstName} ${customer.lastName}`
                        : "N/A"}
                    </h1>
                    <h1>{customer?.email || "N/A"}</h1>
                    <h1>{customer?.contactNumber || "N/A"}</h1>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Shipping Address</h1>
                  <div className="font-afacad text-[#6B7280]">
                    <h1>{order.location || "N/A"}</h1>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="py-8">
              <div className="flex space-x-20">
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Payment Details</h1>
                  <div className="font-afacad text-[#6B7280]">
                    {/* <h1>Ref No. {transaction?.id || "N/A"}</h1> */}
                    <h1>
                      {transaction?.date ? formatDate(transaction.date) : ""}
                    </h1>
                    <h1>
                      Amount: PHP{" "}
                      {transaction?.payment
                        ? Number(transaction.payment).toFixed(2)
                        : "0.00"}
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Status</h1>
                  <div className="font-afacad text-[#6B7280]">
                    {/* <h1>
                      {transaction?.paymentStatus
                        ? transaction.paymentStatus.charAt(0).toUpperCase() +
                          transaction.paymentStatus.slice(1)
                        : "N/A"}
                    </h1> */}
                    <h1>
                      {transaction?.isVerified ? "Verified" : "Not Verified"}
                    </h1>
                    {transaction?.img && (
                      <Dialog>
                        <DialogTrigger>
                          <h1 className="underline">Receipt.png</h1>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Receipt</DialogTitle>
                            <DialogDescription className="max-h-[70vh] overflow-y-auto">
                              <img
                                src={transaction.img}
                                alt="Receipt"
                                className="h-auto w-auto object-cover"
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="py-8">
              <div className="grid grid-cols-1 gap-4">
                <h1 className="font-afacad_semibold">Shipping Method</h1>
                <h1 className="font-afacad text-[#6B7280]">
                  {order.minjeeVenue ? "Minjee Venue" : "Standard Shipping"}
                </h1>
              </div>
            </div>
            <hr />

            <div className="py-8">
              <div className="flex space-x-20">
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Date of Use</h1>
                  <h1 className="font-afacad text-[#6B7280]">
                    {order.orderDate ? formatDate(order.orderDate) : "N/A"}
                  </h1>
                </div>
                <div className="grid grid-cols-1 gap-4 w-[300px]">
                  <h1 className="font-afacad_semibold">Date of Return</h1>
                  <h1 className="font-afacad text-[#6B7280]">
                    {order.returnDate ? formatDate(order.returnDate) : "N/A"}
                  </h1>
                </div>
              </div>
            </div>
            <hr />

            <div className="pt-16">
              <Link href="/shop">
                <h1 className="font-afacad text-[#6B7280] underline text-end hover:font-afacad_semibold cursor-pointer">
                  Continue Shopping
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
