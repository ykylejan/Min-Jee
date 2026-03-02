"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/OwnerPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_EVENT_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { MoveLeft, Loader2, AlertCircle, Calendar, User, MapPin, Clock, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
        <p className="text-gray-500 font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (error || !data?.getEventsById) {
    return (
      <Card className="border-red-200 bg-red-50 max-w-3xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error loading data
          </h3>
          <p className="text-red-600 text-center max-w-md mb-4">
            Error loading event booking details.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <MoveLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
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
    <div className="bg-white min-h-screen rounded-lg border border-neutral-200 p-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-row gap-x-4 items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex-shrink-0"
          >
            <MoveLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-afacad_medium text-2xl sm:text-3xl">Event Booking Details</h1>
          <StatusBadge status={event?.eventStatus || "Pending"} size="lg" />
        </div>
        <Link href={`/bookings/${eventId}/edit-booking`}>
          <Button className="bg-camouflage-400 h-11 px-6 font-afacad text-white hover:bg-camouflage-400/80 flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit Booking
          </Button>
        </Link>
      </div>

      {/* Customer and Event Details */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-afacad_medium text-xl text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-camouflage-400" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="font-afacad text-gray-700 space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Name:</span>
              <span>
                {customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Contact:</span>
              <span>{customer?.contactNumber || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Email:</span>
              <span>{customer?.email || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Address:</span>
              <span>{customer?.address || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Event Details Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-afacad_medium text-xl text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-camouflage-400" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="font-afacad text-gray-700 space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Name:</span>
              <span>{event.name || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-gray-600 min-w-[100px]">Address:</span>
              <span>{event.eventAddress || event.location || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-gray-600 min-w-[100px]">Date:</span>
              <span>
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-gray-600 min-w-[100px]">Start:</span>
              <span>
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
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-gray-600 min-w-[100px]">End:</span>
              <span>
                {event.eventEnd
                  ? new Date(`1970-01-01T${event.eventEnd}`).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 min-w-[120px]">Venue:</span>
              <span>{event.minjeeVenue ? "Minjee Venue" : "Other"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details */}
      <div className="mt-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-afacad_medium text-xl text-gray-900">
              Event Package & Addons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-x-4 border-b border-gray-100 py-4 last:border-b-0"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-afacad_semibold text-lg text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-gray-500 font-afacad">
                      {product.type === "event-package"
                        ? `Pax: ${product.quantity}`
                        : `Qty: ${product.quantity}`}
                    </div>
                  </div>
                  <div className="font-afacad_semibold text-lg text-gray-900">
                    PHP {product.price ? Number(product.price).toFixed(2) : "0.00"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No event package or addons.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customizations */}
      <div className="mt-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-afacad_medium text-xl text-gray-900">
              Customizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-afacad text-gray-600">
              {event.customizations || "None"}
            </div>
            <div className="font-afacad text-gray-600 mt-2">
              <span className="font-semibold">Customization Price: </span>
              PHP{" "}
              {event.customizationsPrice
                ? Number(event.customizationsPrice).toFixed(2)
                : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Price */}
      <div className="flex justify-end mt-8 pr-2">
        <div className="font-afacad_medium text-xl text-gray-900">
          Total: PHP {totalPrice.toFixed(2)}
        </div>
      </div>

      <div className="mt-12">
        <Link href="/bookings">
          <Button variant="outline" className="border-camouflage-400 text-camouflage-400 hover:bg-camouflage-400 hover:text-white">
            <MoveLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
