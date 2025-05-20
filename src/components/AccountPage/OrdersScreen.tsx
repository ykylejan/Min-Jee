import React from "react";
import { Button } from "../ui/button";
import StatusLabel from "../StatusLabel";
import OrderItem from "./OrderItem";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const OrdersScreen = () => {
  const router = useRouter();
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

  // Example logic: current orders = not completed/cancelled, recent = completed/cancelled
  const currentOrders = orders.filter(
    (order: any) =>
      order.orderStatus !== "Completed" && order.orderStatus !== "Cancelled"
  );
  const recentOrders = orders.filter(
    (order: any) =>
      order.orderStatus === "Completed" || order.orderStatus === "Cancelled"
  );

  const getStatusLabel = (status: string) => {
    if (status === "Verified") return <StatusLabel label="Verified" />;
    if (status === "Completed") return <StatusLabel label="Completed" />;
    if (status === "Cancelled") return <StatusLabel label="Cancelled" />;
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
          <h1 className="text-lg font-poppins_medium mb-2">Current Orders</h1>
          {currentOrders.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Orders
              </h1>
              <hr />
            </div>
          ) : (
            <>
              {currentOrders.map((order: any) => (
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
            </>
          )}

          <h1 className="text-lg font-poppins_medium mt-8 mb-2">
            Recent Orders
          </h1>
          {recentOrders.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Orders
              </h1>
              <hr />
            </div>
          ) : (
            <>
              {recentOrders.map((order: any) => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
