"use client";

import { MoveLeft, Loader2, AlertCircle, PartyPopper, ShoppingCart } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@apollo/client";
import {
  GET_TRANSACTION_BY_ID,
  GET_ORDER_BY_ID_OWNER,
  GET_EVENT_BY_ID_OWNER,
} from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import OrderReceipt, { OrderReceiptData } from "@/components/ReceiptCard/OrderReceipt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helper: Format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const HistoryReceiptPage = () => {
  const router = useRouter();
  const params = useParams();
  const transactionId = params?.id as string;

  // Fetch transaction first
  const {
    data: txnData,
    loading: txnLoading,
    error: txnError,
  } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { id: transactionId },
    client: apolloClientPartner,
    skip: !transactionId,
  });

  const transaction = txnData?.getTransactionsById;
  const isEvent = transaction?.isEvent || !!transaction?.eventId;
  const orderId = transaction?.orderId;
  const eventId = transaction?.eventId;

  // Fetch order if it's an order
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner,
    skip: !orderId || isEvent,
  });

  // Fetch event if it's an event
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery(GET_EVENT_BY_ID_OWNER, {
    variables: { id: eventId },
    client: apolloClientPartner,
    skip: !eventId,
  });

  const isLoading = txnLoading || orderLoading || eventLoading;
  const hasError = txnError || orderError || eventError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
        <p className="text-gray-500 font-medium">Loading receipt details...</p>
      </div>
    );
  }

  if (hasError || (!orderData?.getOrdersById && !eventData?.getEventsById)) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="border-red-200 bg-red-50 max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to load receipt
            </h3>
            <p className="text-red-600 text-center max-w-md mb-4">
              Unable to retrieve receipt details. Please try again later.
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
      </div>
    );
  }

  // Render Order Receipt
  if (orderData?.getOrdersById) {
    const order = orderData.getOrdersById;
    const customer = order.customer;

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

    const receiptData: OrderReceiptData = {
      orderId: order.id,
      orderStatus: order.orderStatus,
      orderDate: order.orderDate,
      returnDate: order.returnDate,
      location: order.location,
      deliveryPrice: order.deliveryPrice,
      depositPrice: order.depositPrice,
      minjeeVenue: order.minjeeVenue,
      products: allProducts,
      customer: customer
        ? {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            contactNumber: customer.contactNumber,
          }
        : undefined,
      transaction: transaction
        ? {
            id: transaction.id,
            payment: transaction.payment,
            paymentStatus: transaction.paymentStatus,
            date: transaction.date,
            img: transaction.img,
            isVerified: transaction.isVerified,
          }
        : undefined,
    };

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 w-full max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
          >
            <MoveLeft width={20} height={20} />
            <span className="font-medium">Back to History</span>
          </button>
          <OrderReceipt
            data={receiptData}
            variant="compact"
            showHeader={true}
            headerTitle="Order Receipt"
            headerSubtitle="Transaction details for this order"
            actionButton={{
              label: "Back to History",
              href: "/history",
            }}
          />
        </div>
      </div>
    );
  }

  // Render Event Receipt
  if (eventData?.getEventsById) {
    const event = eventData.getEventsById;
    const customer = event.customer;
    const eventPackage = event.pax?.eventPackages;

    // Build items list
    const eventPackageItem = eventPackage
      ? {
          id: eventPackage.id,
          name: eventPackage.name,
          price: event.pax?.price || 0,
          quantity: event.pax?.name || "1",
          img: eventPackage.img,
          type: "Event Package",
        }
      : null;

    const addonItems =
      event.addonsList?.map((addon: any) => ({
        id: addon.id,
        name: addon.addons?.name,
        price: addon.addons?.price || 0,
        quantity: 1,
        type: "Add-on",
      })) || [];

    const allItems = eventPackageItem
      ? [eventPackageItem, ...addonItems]
      : addonItems;

    // Calculate totals
    const packagePrice = Number(event.pax?.price || 0);
    const addonsTotal = addonItems.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0),
      0
    );
    const subtotal = packagePrice + addonsTotal;
    const customizationPrice = Number(event.customizationsPrice || 0);
    const total = subtotal + customizationPrice;

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 w-full max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
          >
            <MoveLeft width={20} height={20} />
            <span className="font-medium">Back to History</span>
          </button>

          {/* Event Receipt Card */}
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="font-poppins_extrabold text-2xl sm:text-3xl">
                Event Receipt
              </h1>
              <p className="text-gray-500 font-afacad text-base mt-2">
                Transaction details for this event booking
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              {/* Items Section */}
              <div className="p-4 space-y-3">
                {allItems.length > 0 ? (
                  allItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center">
                          <PartyPopper className="w-6 h-6 text-purple-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name || "Unnamed Item"}
                        </p>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₱{Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No items found
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 p-4 space-y-2 bg-gray-50/50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                </div>
                {customizationPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Customization Fee</span>
                    <span className="font-medium">
                      ₱{customizationPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-camouflage-600">
                    ₱{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="border-t border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Event Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Event Name</p>
                    <p className="font-medium text-gray-900">
                      {event.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Event Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.eventDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.eventStatus?.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-700"
                          : event.eventStatus?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.eventStatus || "Pending"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Venue</p>
                    <p className="font-medium text-gray-900">
                      {event.minjeeVenue ? "Minjee Venue" : "Customer Venue"}
                    </p>
                  </div>
                </div>
                {event.eventAddress && (
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {event.eventAddress}
                    </p>
                  </div>
                )}
                {event.customizations && (
                  <div>
                    <p className="text-gray-500 text-sm">Customizations</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {event.customizations}
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              {customer && (
                <div className="border-t border-gray-200 p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium text-gray-900">
                        {customer.contactNumber || "N/A"}
                      </p>
                    </div>
                    {customer.email && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {customer.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {transaction && (
                <div className="border-t border-gray-200 p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Amount Paid</p>
                      <p className="font-medium text-gray-900">
                        ₱{Number(transaction.payment || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          transaction.paymentStatus?.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-700"
                            : transaction.paymentStatus?.toLowerCase() ===
                              "partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.paymentStatus || "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">Transaction Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Verified</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          transaction.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {transaction.isVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="border-t border-gray-200 p-4">
                <Button
                  onClick={() => router.push("/history")}
                  className="w-full bg-camouflage-400 hover:bg-camouflage-500 text-white"
                >
                  Back to History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HistoryReceiptPage;
