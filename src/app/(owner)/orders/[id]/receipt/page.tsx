"use client";

import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import OrderReceipt, { OrderReceiptData } from "@/components/ReceiptCard/OrderReceipt";

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
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl">Loading receipt details...</span>
      </div>
    );
  }

  if (error || !data?.getOrdersById) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load receipt details.
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
    <div className="flex justify-center">
      <div className="space-y-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
        >
          <MoveLeft width={20} height={20} />
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
