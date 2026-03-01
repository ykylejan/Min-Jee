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
import StatusLabel from "@/components/StatusLabel";
import OrderReceiptItem from "./OrderReceiptItem";

export interface OrderReceiptProduct {
  id: string;
  name: string;
  price: number | string;
  quantity: number | string;
  img?: string;
  type?: string; // "Rental" | "Service"
  category?: string;
}

export interface OrderReceiptTransaction {
  id?: string;
  payment?: number | string;
  paymentStatus?: string;
  date?: string;
  img?: string;
  isVerified?: boolean;
}

export interface OrderReceiptCustomer {
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
}

export interface OrderReceiptData {
  orderId: string;
  orderStatus?: string;
  orderDate?: string;
  returnDate?: string;
  location?: string;
  deliveryPrice?: number | string;
  depositPrice?: number | string;
  minjeeVenue?: boolean;
  products: OrderReceiptProduct[];
  customer?: OrderReceiptCustomer;
  transaction?: OrderReceiptTransaction;
}

interface OrderReceiptProps {
  data: OrderReceiptData;
  variant?: "compact" | "full";
  showHeader?: boolean;
  headerTitle?: string;
  headerMainTitle?: string;
  headerSubtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

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

const OrderReceipt: React.FC<OrderReceiptProps> = ({
  data,
  variant = "compact",
  showHeader = true,
  headerTitle = "Order Successful!",
  headerMainTitle = "Thanks for your order!",
  headerSubtitle = "Thank you for your order",
  showBackButton = false,
  onBack,
  actionButton,
  className = "",
}) => {
  const {
    orderId,
    orderStatus,
    orderDate,
    returnDate,
    location,
    deliveryPrice = 0,
    depositPrice = 0,
    minjeeVenue,
    products,
    customer,
    transaction,
  } = data;

  // Calculate totals
  const subtotal = products.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );
  const delivery = Number(deliveryPrice || 0);
  const deposit = Number(depositPrice || 0);
  const total = subtotal + delivery + deposit;

  if (variant === "compact") {
    return (
      <div className={`max-w-lg mx-auto ${className}`}>
        {/* Success Header */}
        {showHeader && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-poppins_extrabold text-xl sm:text-2xl">
              {headerTitle}
            </h1>
            <p className="text-[#6B7280] font-afacad text-sm mt-1">
              {headerSubtitle}
            </p>
          </div>
        )}

        {/* Receipt Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Products Section */}
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-afacad_semibold text-base mb-3">
              Products Ordered
            </h2>
            <div className="space-y-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <OrderReceiptItem
                    key={product.id}
                    variant="compact"
                    {...product}
                  />
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
              <span>PHP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Fee</span>
              <span>PHP {delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Deposit</span>
              <span>PHP {deposit.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Total */}
          <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
            <span className="font-afacad_semibold">Order Total</span>
            <span className="font-afacad_bold text-lg text-primary">
              PHP {total.toFixed(2)}
            </span>
          </div>

          {/* Payment Method */}
          <div className="p-4 border-b border-neutral-100">
            <div className="flex justify-between items-start">
              <span className="font-afacad_semibold text-sm">Payment</span>
              <div className="text-right">
                <p className="font-afacad text-sm">
                  PHP{" "}
                  {transaction?.payment
                    ? Number(transaction.payment).toFixed(2)
                    : "0.00"}
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
              <span className="font-afacad_semibold text-xs">
                {orderId.slice(0, 16)}...
              </span>
            </div>
            {orderStatus && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Order Status</span>
                <StatusLabel
                  label={
                    orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)
                  }
                  size="sm"
                />
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Date</span>
              <span>{orderDate ? formatDate(orderDate) : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Customer</span>
              <span>
                {customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Contact</span>
              <span>{customer?.contactNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-neutral-500">Delivery Address</span>
              <span className="text-right max-w-[60%]">{location || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {actionButton && (
          <div className="mt-6">
            {actionButton.href ? (
              <Link href={actionButton.href}>
                <button className="w-full py-3 bg-primary text-white font-afacad_semibold rounded-lg hover:bg-primary/90 transition-colors">
                  {actionButton.label}
                </button>
              </Link>
            ) : (
              <button
                onClick={actionButton.onClick}
                className="w-full py-3 bg-primary text-white font-afacad_semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {actionButton.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant (desktop/owner view)
  return (
    <div className={className}>
      <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
        {showHeader && (
          <>
            <h1 className="text-[#6B7280] font-afacad_bold">{headerTitle}</h1>
            <h1 className="font-poppins_extrabold text-5xl py-3">
              {headerMainTitle}
            </h1>
            <h1 className="text-[#6B7280] font-afacad pb-8">{headerSubtitle}</h1>
            <hr />
          </>
        )}

        {/* Product Items */}
        {products.length > 0 ? (
          products.map((product) => (
            <OrderReceiptItem key={product.id} variant="full" {...product} />
          ))
        ) : (
          <div className="text-neutral-400 py-6">No products found.</div>
        )}

        <div className="font-afacad py-8 space-y-2">
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Subtotal</span>
            <span className="font-afacad_semibold">
              PHP {subtotal.toFixed(2)}
            </span>
          </h1>
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Delivery Fee</span>
            <span className="font-afacad_semibold">
              PHP {delivery.toFixed(2)}
            </span>
          </h1>
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Deposit Price</span>
            <span className="font-afacad_semibold">
              PHP {deposit.toFixed(2)}
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
                <h1>{location || "N/A"}</h1>
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
              {minjeeVenue ? "Minjee Venue" : "Standard Shipping"}
            </h1>
          </div>
        </div>
        <hr />

        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Date of Use</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {orderDate ? formatDate(orderDate) : "N/A"}
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Date of Return</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {returnDate ? formatDate(returnDate) : "N/A"}
              </h1>
            </div>
          </div>
        </div>
        <hr />

        {actionButton && (
          <div className="pt-16">
            {actionButton.href ? (
              <Link href={actionButton.href}>
                <h1 className="font-afacad text-[#6B7280] underline text-end hover:font-afacad_semibold cursor-pointer">
                  {actionButton.label}
                </h1>
              </Link>
            ) : (
              <h1
                onClick={actionButton.onClick}
                className="font-afacad text-[#6B7280] underline text-end hover:font-afacad_semibold cursor-pointer"
              >
                {actionButton.label}
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReceipt;
