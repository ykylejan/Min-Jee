import React, { useState } from "react";
import { Button } from "../ui/button";
import StatusLabel from "../StatusLabel";
import OrderItem from "./OrderItem";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const ITEMS_PER_PAGE = 3;

const OrdersScreen = () => {
  const router = useRouter();
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [recentOrdersPage, setRecentOrdersPage] = useState(1);
  // Use Apollo Client Customer via context override
  const { data, loading, error } = useQuery(GET_ALL_ORDERS, {
    client: apolloClientCustomer,
  });

  if (loading) {
    return (
      <div className="font-afacad text-2xl w-full text-center my-10">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-afacad text-2xl w-full text-center my-10 text-red-500">
        Failed to load orders.
      </div>
    );
  }

  const orders = data?.getOrders || [];

  // Current orders = not completed/cancelled, recent = completed/cancelled (case-insensitive)
  const currentOrders = orders.filter(
    (order: any) => {
      const status = order.orderStatus?.toLowerCase();
      return status !== "completed" && status !== "cancelled";
    }
  );
  const recentOrders = orders.filter(
    (order: any) => {
      const status = order.orderStatus?.toLowerCase();
      return status === "completed" || status === "cancelled";
    }
  );

  const getStatusLabel = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "verified") return <StatusLabel label="Verified" />;
    if (lowerStatus === "completed") return <StatusLabel label="Completed" />;
    if (lowerStatus === "cancelled") return <StatusLabel label="Cancelled" />;
    return <StatusLabel label={status} />;
  };

  return (
    <div className="font-afacad text-2xl w-full">
      <h1 className="font-afacad_medium">Orders</h1>
      <p className="text-[#6B7280] text-base mb-10">
        View your previous and current orders. You can also create returns or
        cancel your orders if needed.
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-poppins_medium text-base mb-5">
            Nothing to see here
          </h1>
          <h1 className="text-[#6B7280] font-afacad text-base mb-10">
            Nothing to see here yet. Let us change that :)
          </h1>
          <a href="/shop">
            <Button className="bg-[#0F172A] font-poppins_medium text-xs h-12 w-48 rounded-full mb-16">
              Browse Catalog
            </Button>
          </a>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-poppins_medium">Current Orders</h1>
            {Math.ceil(currentOrders.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentOrdersPage((p) => Math.max(1, p - 1))}
                  disabled={currentOrdersPage === 1}
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &lt;
                </button>
                {Array.from(
                  { length: Math.ceil(currentOrders.length / ITEMS_PER_PAGE) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentOrdersPage(i + 1)}
                      className={`px-1.5 py-0.5 rounded text-xs transition-colors duration-150 ${
                        currentOrdersPage === i + 1
                          ? "text-[#0F172A] font-semibold"
                          : "text-[#9CA3AF] hover:text-[#6B7280]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentOrdersPage((p) =>
                      Math.min(Math.ceil(currentOrders.length / ITEMS_PER_PAGE), p + 1)
                    )
                  }
                  disabled={
                    currentOrdersPage === Math.ceil(currentOrders.length / ITEMS_PER_PAGE)
                  }
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          {currentOrders.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Orders
              </h1>
              <hr />
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out">
              {currentOrders
                .slice(
                  (currentOrdersPage - 1) * ITEMS_PER_PAGE,
                  currentOrdersPage * ITEMS_PER_PAGE
                )
                .map((order: any) => (
                  <OrderItem
                    key={order.id}
                    onClick={() =>
                      router.push(`/account/order-details/${order.id}`)
                    }
                    name={
                      order.name ||
                      `${order.customer?.firstName} ${order.customer?.lastName}`
                    }
                    date={order.orderDate}
                    address={order.location}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </OrderItem>
                ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 mb-2">
            <h1 className="text-lg font-poppins_medium">Recent Orders</h1>
            {Math.ceil(recentOrders.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRecentOrdersPage((p) => Math.max(1, p - 1))}
                  disabled={recentOrdersPage === 1}
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &lt;
                </button>
                {Array.from(
                  { length: Math.ceil(recentOrders.length / ITEMS_PER_PAGE) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setRecentOrdersPage(i + 1)}
                      className={`px-1.5 py-0.5 rounded text-xs transition-colors duration-150 ${
                        recentOrdersPage === i + 1
                          ? "text-[#0F172A] font-semibold"
                          : "text-[#9CA3AF] hover:text-[#6B7280]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setRecentOrdersPage((p) =>
                      Math.min(Math.ceil(recentOrders.length / ITEMS_PER_PAGE), p + 1)
                    )
                  }
                  disabled={
                    recentOrdersPage === Math.ceil(recentOrders.length / ITEMS_PER_PAGE)
                  }
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          {recentOrders.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Orders
              </h1>
              <hr />
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out">
              {recentOrders
                .slice(
                  (recentOrdersPage - 1) * ITEMS_PER_PAGE,
                  recentOrdersPage * ITEMS_PER_PAGE
                )
                .map((order: any) => (
                  <OrderItem
                    key={order.id}
                    name={
                      order.name ||
                      `${order.customer?.firstName} ${order.customer?.lastName}`
                    }
                    onClick={() =>
                      router.push(`/account/order-details/${order.id}`)
                    }
                    date={order.orderDate}
                    address={order.customer?.address}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </OrderItem>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
