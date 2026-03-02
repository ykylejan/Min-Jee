"use client";

import { MoveLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import OrderReceipt, { OrderReceiptData } from "@/components/ReceiptCard/OrderReceipt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
        <p className="text-gray-500 font-medium">Loading receipt details...</p>
      </div>
    );
  }

  if (error || !data?.getOrdersById) {
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

  // Transaction/Receipt
  const transaction = order.transactionDetails?.[0];

  // Prepare data for the OrderReceipt component
  const receiptData: OrderReceiptData = {
    orderId,
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
          <span className="font-medium">Back</span>
        </button>
        <OrderReceipt
          data={receiptData}
          variant="compact"
          showHeader={true}
          headerTitle="Order Successful!"
          headerSubtitle="Thank you for your order"
          actionButton={{
            label: "Back to Orders",
            href: "/orders",
          }}
        />
      </div>
    </div>
  );
};

export default Page;
