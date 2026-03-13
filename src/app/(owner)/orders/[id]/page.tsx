"use client";

import OrderDetailsSection from "@/components/OwnerPage/Order/OrderDetailsSection";
import PaymentDetailsItem from "@/components/OwnerPage/Order/PaymentDetailsItem";
import ProductDetailsItem from "@/components/OwnerPage/Order/ProductDetailsItem";
import { StatusBadge } from "@/components/OwnerPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import {
  MoveLeft,
  Pencil,
  Receipt,
  PackagePlus,
  Loader2,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/api";
import { toast } from "sonner";

type OrderProduct = {
  listId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  img?: string;
  type: "rental" | "service";
};

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_ORDER_BY_ID_OWNER, {
    variables: { id: orderId },
    client: apolloClientPartner,
  });
  const [updatingItemKey, setUpdatingItemKey] = React.useState<string | null>(
    null
  );
  const [removingItemKey, setRemovingItemKey] = React.useState<string | null>(
    null
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
        <p className="text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error loading order
          </h3>
          <p className="text-red-600 text-center max-w-md mb-4">
            We couldn't load the order details. Please try again.
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

  const order = data?.getOrdersById;

  const rentalProducts = order?.rentalList || [];
  const serviceProducts = order?.servicesList || [];
  const selectedProducts: OrderProduct[] = [
    ...rentalProducts.map((item: any) => ({
      listId: item.id,
      productId: item.rentals?.id,
      name: item.rentals?.name,
      price: Number(item.rentals?.price || 0),
      quantity: item.rentalQuantity,
      img: item.rentals?.img,
      type: "rental",
    })),
    ...serviceProducts.map((item: any) => ({
      listId: item.id,
      productId: item.servicesItems?.id,
      name: item.servicesItems?.name,
      price: Number(item.servicesItems?.price || 0),
      quantity: item.serviceQuantity,
      img: item.servicesItems?.services?.img,
      type: "service",
    })),
  ];

  const totalPrice = selectedProducts.reduce((total, product) => {
    return total + (product.price || 0) * (product.quantity || 0);
  }, 0);

  const getItemKey = (product: OrderProduct) =>
    `${product.type}-${product.listId}`;

  const handleQuantityChange = async (
    product: OrderProduct,
    nextQuantity: number
  ) => {
    if (nextQuantity < 1) return;

    const itemKey = getItemKey(product);
    setUpdatingItemKey(itemKey);

    try {
      if (product.type === "rental") {
        await api.patch(`/o/order/${orderId}/rentals/${product.listId}`, {
          rental_quantity: nextQuantity,
          rental_total: product.price * nextQuantity,
        });
      } else {
        await api.patch(`/o/order/${orderId}/services/${product.listId}`, {
          service_quantity: nextQuantity,
          service_total: product.price * nextQuantity,
        });
      }

      await refetch();
    } catch (mutationError: any) {
      toast.error(
        mutationError?.response?.data?.detail ||
          "Failed to update product quantity."
      );
    } finally {
      setUpdatingItemKey(null);
    }
  };

  const handleRemoveProduct = async (product: OrderProduct) => {
    const itemKey = getItemKey(product);
    setRemovingItemKey(itemKey);

    try {
      if (product.type === "rental") {
        await api.delete(`/o/order/${orderId}/rentals/${product.listId}`);
      } else {
        await api.delete(`/o/order/${orderId}/services/${product.listId}`);
      }

      await refetch();
      toast.success(`${product.name} removed from order.`);
    } catch (mutationError: any) {
      toast.error(
        mutationError?.response?.data?.detail ||
          "Failed to remove product from order."
      );
    } finally {
      setRemovingItemKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side - Back button & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <MoveLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-afacad_bold text-gray-900">
                    Order Details
                  </h1>
                  <StatusBadge
                    status={order?.orderStatus || "Pending"}
                    size="lg"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Order ID: {order?.id?.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/orders/${order?.id}/receipt/`}>
                <Button
                  variant="outline"
                  className="border-camouflage-300 text-camouflage-700 hover:bg-camouflage-50"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
              </Link>
              <Link href={`/orders/${order?.id}/edit-order`}>
                <Button className="bg-camouflage-400 hover:bg-camouflage-500 text-white shadow-sm shadow-camouflage-400/25">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-afacad_semibold text-gray-900">
            Customer & Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderDetailsSection order={order} />
        </CardContent>
      </Card>

      {/* Product Details Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-afacad_semibold text-gray-900">
              Product Details
            </CardTitle>
            <Link href={`/orders/${order?.id}/add-product`}>
              <Button
                size="sm"
                className="bg-camouflage-400 hover:bg-camouflage-500"
              >
                <PackagePlus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {selectedProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {selectedProducts.map((product) => (
                <ProductDetailsItem
                  key={`${product.type}-${product.listId}`}
                  product={{
                    id: product.productId,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    img: product.img,
                    type: product.type,
                  }}
                  editable
                  isUpdating={updatingItemKey === getItemKey(product)}
                  isRemoving={removingItemKey === getItemKey(product)}
                  onIncrement={() =>
                    handleQuantityChange(product, product.quantity + 1)
                  }
                  onDecrement={() =>
                    handleQuantityChange(product, product.quantity - 1)
                  }
                  onRemove={() => handleRemoveProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products yet
              </h3>
              <p className="text-gray-500 max-w-sm mb-4">
                Click "Add Product" to start adding items to this order.
              </p>
              <Link href={`/orders/${order?.id}/add-product`}>
                <Button
                  variant="outline"
                  className="border-camouflage-300 text-camouflage-700 hover:bg-camouflage-50"
                >
                  <PackagePlus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-afacad_semibold text-gray-900">
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentDetailsItem order={order} />
          {selectedProducts.length > 0 && (
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-camouflage-600">
                  ₱{totalPrice.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
