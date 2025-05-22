"use client";

import StatusLabel from "@/components/StatusLabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_EVENT_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
// import { GET_EVENT_BY_ID_OWNER } from "@/graphql/people";


const page = () => {
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_EVENT_BY_ID_OWNER, {
    variables: { id: eventId },
    client: apolloClientPartner,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !data?.getEventsById) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading event booking details.
      </div>
    );
  }

  const event = data.getEventsById;
  const customer = event.customer;

  // For event packages (pax)
  const eventPackage = event.pax?.eventPackages;
  const eventPackageProduct = eventPackage
    ? [
        {
          id: eventPackage.id,
          name: eventPackage.name,
          price: event.pax?.price,
          quantity: event.pax?.name,
          img: eventPackage.img,
          type: "event-package",
        },
      ]
    : [];

  // Addons (if any)
  const addons = Array.isArray(event.addonsList)
    ? event.addonsList.map((addon: any) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        quantity: addon.quantity,
        img: addon.img,
        type: "addon",
      }))
    : [];

  const selectedProducts = [...eventPackageProduct, ...addons];

  // Compute total price
  const totalPrice =
    (Number(event.pax?.price) || 0) +
    (Number(event.customizationsPrice) || 0) +
    addons.reduce((sum: any, addon: any) => sum + Number(addon.price || 0), 0);

  return (
    <div className="bg-white min-h-screen rounded-lg border border-neutral-200 px-12 py-8">
      <div className="flex justify-between">
        <div className="flex flex-row gap-x-6 items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <MoveLeft width={20} height={20} className="text-neutral-600" />
          </button>
          <h1 className="font-afacad_medium text-3xl">Event Booking Details</h1>
          <StatusLabel label={event?.eventStatus || "Pending"} />
        </div>
        <Link href={`/bookings/${eventId}/edit-booking`}>
          <Button className="bg-camouflage-400 w-44 h-12 font-afacad text-white hover:bg-camouflage-400/80">
            Edit Booking
          </Button>
        </Link>
      </div>

      {/* Pretty Customer and Event Details */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
        {/* Customer Details Card */}
        <div className="bg-[#F8FAFC] rounded-xl shadow-sm p-6 border border-neutral-200">
          <h2 className="font-afacad_medium text-xl mb-4 text-camouflage-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-camouflage-400 rounded-full"></span>
            Customer Details
          </h2>
          <div className="font-afacad text-[#334155] space-y-3 text-base">
            <div>
              <span className="font-semibold">Name:</span>
              <span className="ml-2">
                {customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Contact Number:</span>
              <span className="ml-2">{customer?.contactNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{customer?.email || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Address:</span>
              <span className="ml-2">{customer?.address || "N/A"}</span>
            </div>
          </div>
        </div>
        {/* Event Details Card */}
        <div className="bg-[#F8FAFC] rounded-xl shadow-sm p-6 border border-neutral-200">
          <h2 className="font-afacad_medium text-xl mb-4 text-camouflage-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-camouflage-400 rounded-full"></span>
            Event Details
          </h2>
          <div className="font-afacad text-[#334155] space-y-3 text-base">
            <div>
              <span className="font-semibold">Name:</span>
              <span className="ml-2">{event.name || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Event Address:</span>
              <span className="ml-2">
                {event.eventAddress || event.location || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Event Date:</span>
              <span className="ml-2">
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Event Start:</span>
              <span className="ml-2">
                {event.eventStart
                  ? new Date(
                      `1970-01-01T${event.eventStart}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Event End:</span>
              <span className="ml-2">
                {event.eventEnd
                  ? new Date(`1970-01-01T${event.eventEnd}`).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Venue:</span>
              <span className="ml-2">
                {event.minjeeVenue ? "Minjee Venue" : "Other"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-10">
          <div className="font-afacad_medium text-2xl">
            Event Package & Addons
          </div>
        </div>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-x-4 border-b py-4"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-afacad_semibold text-lg">
                  {product.name}
                </div>
                <div className="text-[#6B7280] font-afacad">
                  {product.type === "event-package"
                    ? `Pax: ${product.quantity}`
                    : `Qty: ${product.quantity}`}
                </div>
              </div>
              <div className="font-afacad_semibold text-lg">
                PHP {product.price ? Number(product.price).toFixed(2) : "0.00"}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No event package or addons.
          </div>
        )}
      </div>

      {/* Customizations */}
      <div className="mt-10">
        <div className="font-afacad_medium text-2xl mb-2">Customizations</div>
        <div className="font-afacad text-[#6B7280]">
          {event.customizations || "None"}
        </div>
        <div className="font-afacad text-[#6B7280] mt-2">
          <span className="font-semibold">Customization Price: </span>
          PHP{" "}
          {event.customizationsPrice
            ? Number(event.customizationsPrice).toFixed(2)
            : "0.00"}
        </div>
      </div>

      {/* Total Price */}
      <div className="flex justify-end mt-10 pr-5">
        <div className="font-afacad_medium text-xl">
          Total: PHP {totalPrice.toFixed(2)}
        </div>
      </div>

      <Link href="/bookings">
        <Button className="bg-transparent border border-camouflage-400 text-camouflage-400 hover:bg-camouflage-400 hover:text-white mt-24 w-32">
          Back to Bookings
        </Button>
      </Link>
    </div>
  );
};

export default page;
