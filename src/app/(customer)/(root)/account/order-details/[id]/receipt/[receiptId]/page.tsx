"use client";
import React from "react";
import ProductDetailsItem from "@/components/OwnerPage/Order/ProductDetailsItem";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID, GET_TRANSACTION_BY_ID } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const Page = () => {
  const params = useParams();
  const orderId = params?.id as string;
  const receiptId = params?.receiptId as string;

  // Fetch order details
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    client: apolloClientCustomer,
  });

  // Fetch transaction details (receipt)
  const {
    data: transactionData,
    loading: transactionLoading,
    error: transactionError,
  } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { id: receiptId },
    client: apolloClientCustomer,
  });

  if (orderLoading || transactionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl">Loading receipt details...</span>
      </div>
    );
  }

  if (
    orderError ||
    !orderData?.getOrdersById ||
    transactionError ||
    !transactionData?.getTransactionsById
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl text-red-500">
          Failed to load receipt details.
        </span>
      </div>
    );
  }

  const order = orderData.getOrdersById;
  const customer = order.customer;
  const transaction = transactionData.getTransactionsById;

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

  // Combine all products (rentals and services) for display
  const rentalProducts =
    order.rentalList?.map((item: any) => ({
      id: item.id,
      name: item.rentals?.name,
      price: item.rentalTotal,
      quantity: item.rentalQuantity,
      img: item.rentals?.img,
      type: "Rental",
    })) || [];

  const serviceProducts =
    order.servicesList?.map((item: any) => ({
      id: item.id,
      name: item.servicesItems?.name,
      price: item.serviceTotal,
      quantity: item.serviceQuantity,
      img: item.servicesItems?.services?.img,
      type: "Service",
    })) || [];

  const allProducts = [...rentalProducts, ...serviceProducts];
  const rentalsTotal = rentalProducts.reduce(
    (sum: any, item: any) => sum + Number(item.price || 0),
    0
  );
  const servicesTotal = serviceProducts.reduce(
    (sum: any, item: any) => sum + Number(item.price || 0),
    0
  );
  const deliveryFee = Number(order.deliveryPrice || 0);
  const depositPrice = Number(order.depositPrice || 0);

  const computedOrderTotal =
    rentalsTotal + servicesTotal + deliveryFee + depositPrice;
  return (
    <div className="flex justify-center items-center min-h-screen pt-[120px] pb-[80px] px-48 bg-[#FFFBF5]">
      <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
        <h1 className="text-[#6B7280] font-afacad_bold">Order Successful</h1>
        <h1 className="font-poppins_extrabold text-5xl py-3">
          Thanks for your order!
        </h1>
        <h1 className="text-[#6B7280] font-afacad pb-8">
          We appreciate your order, we are currently processing it. Hang on
          tight and we’ll send you confirmation soon!
        </h1>
        <hr />

        {/* Product Details */}
        <div className="py-6">
          <h2 className="font-afacad_semibold text-xl mb-4">
            Products Ordered
          </h2>
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductDetailsItem key={product.id} product={product} />
            ))
          ) : (
            <div className="text-neutral-400">No products found.</div>
          )}
        </div>
        <hr />

        {/* Order Summary */}
        <div className="font-afacad py-8 space-y-2">
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">
              Delivery Fee
            </span>
            <span className="font-afacad_semibold">
              PHP{" "}
              {order.deliveryPrice
                ? Number(order.deliveryPrice).toFixed(2)
                : "0.00"}
            </span>
          </h1>
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">
              Deposit Price
            </span>
            <span className="font-afacad_semibold">
              PHP{" "}
              {order.depositPrice
                ? Number(order.depositPrice).toFixed(2)
                : "0.00"}
            </span>
          </h1>
        </div>
        <hr />
        <div className="font-afacad py-8 space-y-2">
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold text-xl">
              TOTAL
            </span>
            <span className="font-afacad_semibold text-xl">
              PHP {computedOrderTotal.toFixed(2)}
            </span>
          </h1>
        </div>
        <hr />
        {/* Customer & Shipping Details */}
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
                <h1>{customer?.email}</h1>
                <h1>{customer?.contactNumber}</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Shipping Address</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>{order.location}</h1>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* Order Details */}
        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Order Details</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>
                  <span className="font-semibold">Order Status: </span>
                  {order.orderStatus}
                </h1>
                <h1>
                  <span className="font-semibold">Order Date: </span>
                  {order.orderDate ? formatDate(order.orderDate) : "N/A"}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Payment Details</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>
                  <span className="font-semibold">Payment: </span>
                  PHP{" "}
                  {transaction?.payment
                    ? Number(transaction.payment).toFixed(2)
                    : "0.00"}
                </h1>
                <h1>
                  <span className="font-semibold">Payment Status: </span>
                  {transaction?.paymentStatus
                    ? transaction.paymentStatus.charAt(0).toUpperCase() +
                      transaction.paymentStatus.slice(1)
                    : "N/A"}
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

        <div className="pt-16">
          <Link href="/shop">
            <h1 className="font-afacad text-[#6B7280] underline text-end hover:font-afacad_semibold cursor-pointer">
              Continue Shopping
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
