"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID, GET_TRANSACTION_BY_ID } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";
import OrderReceipt, { OrderReceiptData } from "@/components/ReceiptCard/OrderReceipt";

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
    <div className="min-h-screen bg-[#FFFBF5] pt-[100px] pb-20 px-4">
      <OrderReceipt
        data={receiptData}
        variant="compact"
        showHeader={true}
        headerTitle="Order Successful!"
        headerSubtitle="Thank you for your order"
        actionButton={{
          label: "Continue Shopping",
          href: "/shop",
        }}
      />
    </div>
  );
};

export default Page;
