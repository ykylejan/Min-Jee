"use client";

import OrderDetailsSection from "@/components/OwnerPage/Order/OrderDetailsSection";
import PaymentDetailsItem from "@/components/OwnerPage/Order/PaymentDetailsItem";
import ProductDetailsItem from "@/components/OwnerPage/Order/ProductDetailsItem";
import StatusLabel from "@/components/StatusLabel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading order details.
      </div>
    );
  }

  const order = data?.getOrdersById;

  // Example: Extract products and total price from order.rentalList and order.servicesList
  const rentalProducts = order?.rentalList || [];
  const serviceProducts = order?.servicesList || [];
  const selectedProducts = [
    ...rentalProducts.map((item: any) => ({
      id: item.rentals?.id,
      name: item.rentals?.name,
      price: item.rentals?.price,
      quantity: item.rentalQuantity,
      img: item.rentals?.img,
      type: "rental",
    })),
    ...serviceProducts.map((item: any) => ({
      id: item.servicesItems?.id,
      name: item.servicesItems?.name,
      price: item.servicesItems?.price,
      quantity: item.serviceQuantity,
      img: item.servicesItems?.services?.img,
      type: "service",
    })),
  ];

  const totalPrice = selectedProducts.reduce((total, product) => {
    return total + (product.price || 0) * (product.quantity || 0);
  }, 0);

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
          <h1 className="font-afacad_medium text-3xl">Order Details</h1>
          <StatusLabel label={order?.orderStatus || "Pending"} />
        </div>
        <Link href={`/orders/${order?.id}/edit-order`}>
          <Button className="bg-camouflage-400 w-44 h-12 font-afacad text-white hover:bg-camouflage-400/80">
            Edit Order
          </Button>
        </Link>
      </div>

      {/* You may want to pass order as prop to OrderDetailsSection */}
      <OrderDetailsSection order={order} />

      <div className="mt-10">
        <div className="flex items-center justify-between mb-10">
          <div className="font-afacad_medium text-2xl">Product Details</div>
          <Link href={`/orders/order-item/add-product?id=${order?.id}`}>
            <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad">
              Add Product
            </Button>
          </Link>
        </div>

        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <ProductDetailsItem key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products added yet. Click "Add Product" to add some.
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="font-afacad_medium text-2xl">Payment Details</div>
        <PaymentDetailsItem order={order} />
        {selectedProducts.length > 0 && (
          <div className="flex justify-end mt-4 pr-5">
            <div className="font-afacad_medium text-xl">
              Total: PHP {totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* <div className="mt-10">
        <div className="font-afacad_medium text-2xl">Customer Notes</div>
        <Textarea
          placeholder="Customer's notes seems empty..."
          className="min-h-32 mt-5"
          value={order?.customerNotes || ""}
          readOnly={true}
        />
      </div> */}

      <Link href={`/orders/${order?.id}/receipt/`}>
        <Button className="bg-transparent border border-camouflage-400 text-camouflage-400 hover:bg-camouflage-400 hover:text-white mt-24 w-32">
          View Receipt
        </Button>
      </Link>
    </div>
  );
};

export default page;
