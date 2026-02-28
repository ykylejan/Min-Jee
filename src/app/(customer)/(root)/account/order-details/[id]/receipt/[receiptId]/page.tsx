"use client";
import React from "react";
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
    <div className="min-h-screen bg-[#FFFBF5] pt-[100px] pb-20">
      <div className="max-w-lg mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-poppins_extrabold text-xl sm:text-2xl">Order Successful!</h1>
          <p className="text-[#6B7280] font-afacad text-sm mt-1">
            Thank you for your order
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Products Section */}
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-afacad_semibold text-base mb-3">Products Ordered</h2>
            <div className="space-y-3">
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-afacad_semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">{product.type}</p>
                      <p className="text-xs text-neutral-500">x{product.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-afacad_semibold text-sm text-primary">
                        PHP {Number(product.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-400 text-sm">No products found.</p>
              )}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 border-b border-neutral-100 space-y-2 font-afacad text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span>PHP {(rentalsTotal + servicesTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Fee</span>
              <span>PHP {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Deposit</span>
              <span>PHP {depositPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Total */}
          <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
            <span className="font-afacad_semibold">Order Total</span>
            <span className="font-afacad_bold text-lg text-primary">
              PHP {computedOrderTotal.toFixed(2)}
            </span>
          </div>

          {/* Payment Method */}
          <div className="p-4 border-b border-neutral-100">
            <div className="flex justify-between items-start">
              <span className="font-afacad_semibold text-sm">Payment</span>
              <div className="text-right">
                <p className="font-afacad text-sm">
                  PHP {transaction?.payment ? Number(transaction.payment).toFixed(2) : "0.00"}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {transaction?.paymentStatus || "Pending"}
                </p>
                {transaction?.img && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-xs text-primary underline mt-1">
                        View Receipt
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Payment Receipt</DialogTitle>
                        <DialogDescription className="max-h-[60vh] overflow-y-auto mt-2">
                          <img
                            src={transaction.img}
                            alt="Receipt"
                            className="w-full h-auto object-contain rounded"
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Order Info Section */}
          <div className="p-4 space-y-3 text-sm font-afacad">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order ID</span>
              <span className="font-afacad_semibold text-xs">{orderId.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Status</span>
              <span className="capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Date</span>
              <span>{order.orderDate ? formatDate(order.orderDate) : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Customer</span>
              <span>{customer ? `${customer.firstName} ${customer.lastName}` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Contact</span>
              <span>{customer?.contactNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-neutral-500">Delivery Address</span>
              <span className="text-right max-w-[60%]">{order.location || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link href="/shop">
            <button className="w-full py-3 bg-primary text-white font-afacad_semibold rounded-lg hover:bg-primary/90 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
