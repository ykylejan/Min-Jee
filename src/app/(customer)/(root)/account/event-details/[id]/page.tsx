"use client";
import React from "react";
import ReceiptItem from "@/components/ReceiptCard/ReceiptItem";
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
import { GET_EVENT_BY_ID } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const Page = () => {
  const params = useParams();
  const eventId = params?.id as string;

  const { data, loading, error } = useQuery(GET_EVENT_BY_ID, {
    variables: { id: eventId },
    client: apolloClientCustomer,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl">Loading event details...</span>
      </div>
    );
  }

  if (error || !data?.getEventsById) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl text-red-500">
          Failed to load event details.
        </span>
      </div>
    );
  }

  const event = data.getEventsById;
  const customer = event.customer;
  const transaction = event.transactionDetails?.[0]; // Show the first transaction for simplicity

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
    <div className="flex justify-center items-center min-h-screen pt-[120px] pb-[80px] px-48 bg-[#FFFBF5]">
      <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
        <h1 className="text-[#6B7280] font-afacad_bold">
          Event Booking Successful
        </h1>
        <h1 className="font-poppins_extrabold text-5xl py-3">
          Thanks for booking!
        </h1>
        <h1 className="text-[#6B7280] font-afacad pb-8">
          We appreciate your booking, we are currently processing it. Hang on
          tight and we’ll send you confirmation soon!
        </h1>
        <hr />
        
        {/* Populated Receipt Item */}
        <ReceiptItem
          img={event.pax?.eventPackages?.img}
          name={event.pax?.eventPackages?.name}
          price={event.pax?.price}
          category="Event Package"
          quantity={1}
        />

        <div className="font-afacad py-8 space-y-2">
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Subtotal</span>
            <span className="font-afacad_semibold">
              PHP{" "}
              {event.pax?.price ? Number(event.pax.price).toFixed(2) : "0.00"}
            </span>
          </h1>
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">
              Customization Price
            </span>
            <span className="font-afacad_semibold">
              {event.customizationsPrice
                ? Number(event.customizationsPrice).toFixed(2)
                : "0.00"}
            </span>
          </h1>
          {/* <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Delivery Fee</span>
            <span className="font-afacad_semibold">
              PHP {event.customizationsPrice ? Number(event.customizationsPrice).toFixed(2) : "0.00"}
            </span>
          </h1> */}
        </div>
        <hr />

        <div className="py-8">
          <h1 className="flex justify-between font-afacad_semibold">
            <span>TOTAL</span>
            <span>
              PHP{" "}
              {(
                Number(event.pax?.price || 0) +
                Number(event.customizationsPrice || 0)
              ).toFixed(2)}
            </span>
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
                <h1>{customer?.email}</h1>
                <h1>{customer?.contactNumber}</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Shipping Address</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>{event.eventAddress || event.location}</h1>
                <h1>{event.minjeeVenue ? "Minjee Venue" : ""}</h1>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Payment Details</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>Ref No. {transaction?.id || "N/A"}</h1>
                <h1>{transaction?.date ? formatDate(transaction.date) : ""}</h1>
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

        <div className="py-8">
          <div className="grid grid-cols-1 gap-4">
            <h1 className="font-afacad_semibold">Shipping Method</h1>
            <h1 className="font-afacad text-[#6B7280]">
              {event.minjeeVenue ? "Minjee Venue" : "Standard Shipping"}
            </h1>
          </div>
        </div>
        <hr /> */}

        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Schedule</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {event.eventDate ? formatDate(event.eventDate) : ""}
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Status</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {event.eventStatus.toUpperCase()}
              </h1>
            </div>
          </div>
        </div>
        <hr />

        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Customization</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {event.customizations}
              </h1>
            </div>
            {/* <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Status</h1>
              <h1 className="font-afacad text-[#6B7280]">
                {event.eventStatus.toUpperCase()}
              </h1>
            </div> */}
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
