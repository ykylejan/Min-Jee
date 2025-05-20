"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GET_EVENT_BY_ID, GET_CUSTOMER_BY_ID } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { format, parse } from "date-fns";
const page = () => {
  const params = useParams();
  const receiptId = params.receiptId as string;

  // Fetch event details
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery(GET_EVENT_BY_ID, {
    variables: { id: receiptId },
    client: apolloClientCustomer,
  });

  // State for event details
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    customizations: "",
    eventDate: "",
    eventAddress: "",
    eventStart: "",
    eventEnd: "",
    paxName: "",
    customerId: "",
  });

  // State for customer details
  const [customerDetails, setCustomerDetails] = useState({
    contactNumber: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  // Lazy query for customer by ID
  //   const [getCustomerById, { data: customerData }] = useLazyQuery(
  //     GET_CUSTOMER_BY_ID,
  //     {
  //       client: apolloClientCustomer,
  //     }
  //   );
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    // Handles "HH:mm:ss.SSS'Z'" or "HH:mm:ss" or "HH:mm"
    const time = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "hh:mm a");
  };
  // Populate event details and trigger customer fetch
  useEffect(() => {
    if (eventData && eventData.getEventsById) {
      const event = eventData.getEventsById;
      setEventDetails({
        name: event.name || "",
        location: event.location || "",
        customizations: event.customizations || "",
        eventDate: event.eventDate || "",
        eventAddress: event.eventAddress || "",
        eventStart: event.eventStart || "",
        eventEnd: event.eventEnd || "",
        paxName: event.pax?.name || "",
        customerId: event.customerId || "",
      });

      // Use customer object from event directly
      if (event.customer) {
        setCustomerDetails({
          contactNumber: event.customer.contactNumber || "",
          email: event.customer.email || "",
          firstName: event.customer.firstName || "",
          lastName: event.customer.lastName || "",
        });
      }
    }
  }, [eventData]);

  //   // Populate customer details
  //   useEffect(() => {
  //     if (customerData && customerData.getCustomersById) {
  //       const customer = customerData.getCustomersById;
  //       setCustomerDetails({
  //         contactNumber: customer.contactNumber || "",
  //         email: customer.email || "",
  //         firstName: customer.firstName || "",
  //         lastName: customer.lastName || "",
  //       });
  //     }
  //   }, [customerData]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center pb-40">
      <div className="bg-white border border-[##D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
        <h1 className="text-[#6B7280] font-afacad_bold">
          Event Booking Successful
        </h1>
        <h1 className="font-poppins_extrabold text-5xl py-3">
          Thanks for booking
        </h1>
        <h1 className="text-[#6B7280] font-afacad pb-8">
          We appreciate your order, we are currently processing it. Hang on
          tight and we’ll send you confirmation soon!
        </h1>
        <hr />

        {/* Booked Event Details */}
        <div className="py-8">
          <h2 className="font-afacad_bold text-2xl mb-6 text-[#22223B] flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#F4A259" />
              <path
                d="M12 7v5l3 3"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Booked Event Details
          </h2>
          {eventLoading ? (
            <div className="flex items-center gap-2 text-[#A3A3A3]">
              <svg
                className="animate-spin"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#F4A259"
                  strokeWidth="4"
                  opacity="0.2"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="#F4A259"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              Loading event details...
            </div>
          ) : eventError ? (
            <p className="text-red-500">Error loading event details.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 bg-[#FFF7ED] rounded-lg p-6 shadow-sm border border-[#F4A259]/30">
              <div>
                <span className="font-afacad_bold text-[#22223B]">Name:</span>
                <div className="text-[#6B7280]">{eventDetails.name}</div>
              </div>
              <div className="col-span-2">
                <span className="font-afacad_bold text-[#22223B]">
                  Location:
                </span>
                <div className="text-[#6B7280]">{eventDetails.location}</div>
              </div>

              <div className="col-span-2">
                <span className="font-afacad_bold text-[#22223B]">
                  Event Date:
                </span>
                <div className="text-[#6B7280]">{eventDetails.eventDate}</div>
              </div>
              <div>
                <span className="font-afacad_bold text-[#22223B]">
                  Event Address:
                </span>
                <div className="text-[#6B7280]">
                  {eventDetails.eventAddress}
                </div>
              </div>
              <div className="col-span-2">
                <span className="font-afacad_bold text-[#22223B]">
                  Pax Name:
                </span>
                <div className="text-[#6B7280]">{eventDetails.paxName}</div>
              </div>
              <div className="col-span-2">
                <span className="font-afacad_bold text-[#22223B] ">
                  Event Start:
                </span>
                <div className="text-[#6B7280]">
                  {eventDetails.eventStart
                    ? formatTime(eventDetails.eventStart)
                    : ""}
                </div>
              </div>
              <div>
                <span className="font-afacad_bold text-[#22223B]">
                  Event End:
                </span>
                <div className="text-[#6B7280]">
                  {eventDetails.eventEnd
                    ? formatTime(eventDetails.eventEnd)
                    : ""}
                </div>
              </div>
              <div className="col-span-2">
                <span className="font-afacad_bold text-[#22223B]">
                  Customizations:
                </span>
                <div className="text-[#6B7280]">
                  {eventDetails.customizations || (
                    <span className="italic text-[#A3A3A3]">None</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="font-afacad py-8 space-y-2">
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">Subtotal</span>
            <span className="font-afacad_semibold">PHP 100 </span>
          </h1>
          <h1 className="flex justify-between">
            <span className="text-[#6B7280] font-afacad_bold">
              Delivery Fee
            </span>
            <span className="font-afacad_semibold">PHP 200 </span>
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
            <span>PHP 200.00</span>
          </h1>
        </div>
        <hr /> */}

        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Customer Details</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>
                  {customerDetails.firstName} {customerDetails.lastName}
                </h1>
                <h1>{customerDetails.email}</h1>
                <h1>{customerDetails.contactNumber}</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Shipping Address</h1>
              <div className="font-afacad text-[#6B7280]">
                <h1>
                  {customerDetails.firstName} {customerDetails.lastName}
                </h1>
                <h1>{customerDetails.email}</h1>
                <h1>{customerDetails.contactNumber}</h1>
                <h1>{eventDetails.eventAddress}</h1>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* <div className="py-8">
          <div className="grid grid-cols-1 gap-4">
            <h1 className="font-afacad_semibold">Shipping Method</h1>
            <h1 className="font-afacad text-[#6B7280]">Standard Shipping</h1>
          </div>
        </div>
        <hr />

        <div className="py-8">
          <div className="flex space-x-20">
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Date of Use</h1>
              <h1 className="font-afacad text-[#6B7280]">Jan. 08, 2025</h1>
            </div>
            <div className="grid grid-cols-1 gap-4 w-[300px]">
              <h1 className="font-afacad_semibold">Date of Return</h1>
              <h1 className="font-afacad text-[#6B7280]">Jan. 09, 2025</h1>
            </div>
          </div>
        </div>
        <hr /> */}

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

export default page;
