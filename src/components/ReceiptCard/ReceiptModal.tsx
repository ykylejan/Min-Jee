"use client";

import React from "react";
import ReceiptItem from "./ReceiptItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomerType {
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
}

interface TransactionType {
  id?: string;
  date?: string;
  payment?: number | string;
  paymentStatus?: string;
  isVerified?: boolean;
  img?: string;
}

interface ReceiptModalProps {
  trigger: React.ReactNode;
  type: "order" | "event";
  customer: CustomerType;
  transaction: TransactionType;
  items: Array<{
    id: string;
    img?: string;
    name?: string;
    price?: number | string;
    category?: string;
    quantity?: number | string;
  }>;
  subtotal: number;
  deliveryFee?: number;
  depositPrice?: number;
  customizationPrice?: number;
  total: number;
  address?: string;
  schedule?: string;
  status?: string;
  customizations?: string;
  dateOfUse?: string;
  dateOfReturn?: string;
  minjeeVenue?: boolean;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  trigger,
  type,
  customer,
  transaction,
  items,
  subtotal,
  deliveryFee,
  depositPrice,
  customizationPrice,
  total,
  address,
  schedule,
  status,
  customizations,
  dateOfUse,
  dateOfReturn,
  minjeeVenue,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl my-10">
        <DialogHeader>
          <DialogTitle>
            {type === "order" ? "Order Receipt" : "Event Booking Receipt"}
          </DialogTitle>
          <DialogDescription>
            {type === "order"
              ? "Here is your order receipt and payment details."
              : "Here is your event booking receipt and payment details."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 max-h-[700px] overflow-y-scroll">
          {/* Product/Event Package Items */}
          {items.length > 0 ? (
            items.map((item) => <ReceiptItem key={item.id} {...item} />)
          ) : (
            <div className="text-neutral-400 py-6">No items found.</div>
          )}

          {/* Totals */}
          <div className="font-afacad py-4 space-y-2">
            <h1 className="flex justify-between">
              <span className="text-[#6B7280] font-afacad_bold">Subtotal</span>
              <span className="font-afacad_semibold">
                PHP {subtotal.toFixed(2)}
              </span>
            </h1>
            {type === "order" && (
              <>
                <h1 className="flex justify-between">
                  <span className="text-[#6B7280] font-afacad_bold">
                    Delivery Fee
                  </span>
                  <span className="font-afacad_semibold">
                    PHP {deliveryFee ? deliveryFee.toFixed(2) : "0.00"}
                  </span>
                </h1>
                <h1 className="flex justify-between">
                  <span className="text-[#6B7280] font-afacad_bold">
                    Deposit Price
                  </span>
                  <span className="font-afacad_semibold">
                    PHP {depositPrice ? depositPrice.toFixed(2) : "0.00"}
                  </span>
                </h1>
              </>
            )}
            {type === "event" && (
              <h1 className="flex justify-between">
                <span className="text-[#6B7280] font-afacad_bold">
                  Customization Price
                </span>
                <span className="font-afacad_semibold">
                  PHP {customizationPrice ? customizationPrice.toFixed(2) : "0.00"}
                </span>
              </h1>
            )}
          </div>
          <hr />
          <div className="py-4">
            <h1 className="flex justify-between font-afacad_semibold">
              <span>TOTAL</span>
              <span>PHP {total.toFixed(2)}</span>
            </h1>
          </div>
          <hr />

          {/* Customer & Address */}
          <div className="py-4">
            <div className="flex space-x-20">
              <div className="grid grid-cols-1 gap-2 w-[250px]">
                <h1 className="font-afacad_semibold">Customer Details</h1>
                <div className="font-afacad text-[#6B7280]">
                  <h1>
                    {customer?.firstName || customer?.lastName
                      ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`
                      : "N/A"}
                  </h1>
                  <h1>{customer?.email || "N/A"}</h1>
                  <h1>{customer?.contactNumber || "N/A"}</h1>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 w-[250px]">
                <h1 className="font-afacad_semibold">
                  {type === "order" ? "Shipping Address" : "Event Address"}
                </h1>
                <div className="font-afacad text-[#6B7280]">
                  <h1>{address || "N/A"}</h1>
                  {type === "event" && minjeeVenue && (
                    <h1>Minjee Venue</h1>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />

          {/* Payment Details */}
          <div className="py-4">
            <div className="flex space-x-20">
              <div className="grid grid-cols-1 gap-2 w-[250px]">
                <h1 className="font-afacad_semibold">Payment Details</h1>
                <div className="font-afacad text-[#6B7280]">
                  <h1>Ref No. {transaction?.id || "N/A"}</h1>
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
              <div className="grid grid-cols-1 gap-2 w-[250px]">
                <h1 className="font-afacad_semibold">Status</h1>
                <div className="font-afacad text-[#6B7280]">
                  <h1>
                    {transaction?.paymentStatus
                      ? transaction.paymentStatus.charAt(0).toUpperCase() +
                        transaction.paymentStatus.slice(1)
                      : "N/A"}
                  </h1>
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

          {/* Schedule, Status, Customizations, Dates */}
          <div className="py-4">
            <div className="flex space-x-20">
              {type === "event" ? (
                <>
                  <div className="grid grid-cols-1 gap-2 w-[250px]">
                    <h1 className="font-afacad_semibold">Schedule</h1>
                    <h1 className="font-afacad text-[#6B7280]">
                      {schedule || ""}
                    </h1>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-[250px]">
                    <h1 className="font-afacad_semibold">Status</h1>
                    <h1 className="font-afacad text-[#6B7280]">
                      {status?.toUpperCase() || ""}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-2 w-[250px]">
                    <h1 className="font-afacad_semibold">Date of Use</h1>
                    <h1 className="font-afacad text-[#6B7280]">
                      {dateOfUse ? formatDate(dateOfUse) : "N/A"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-[250px]">
                    <h1 className="font-afacad_semibold">Date of Return</h1>
                    <h1 className="font-afacad text-[#6B7280]">
                      {dateOfReturn ? formatDate(dateOfReturn) : "N/A"}
                    </h1>
                  </div>
                </>
              )}
            </div>
          </div>
          <hr />

          {/* Customizations for event */}
          {type === "event" && (
            <div className="py-4">
              <div className="grid grid-cols-1 gap-2 w-[250px]">
                <h1 className="font-afacad_semibold">Customization</h1>
                <h1 className="font-afacad text-[#6B7280]">
                  {customizations || "None"}
                </h1>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;