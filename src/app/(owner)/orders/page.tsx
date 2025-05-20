"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PackagePlus, Search } from "lucide-react";
import OrderStatusTable from "@/components/OwnerPage/Order/OrderStatusTable";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

const page = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_ORDERS_OWNER, {
    client: apolloClientPartner,
  });

  const handleRowClick = (id: string) => {
    router.push(`/orders/${id}`);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Order List
              <CardDescription className="text-base">
                Click an order row to view its details.
              </CardDescription>
            </div>
            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search an order item"
                  className="w-fit font-light pr-8"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <Button
                onClick={() => router.push("/orders/add-order")}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              >
                <PackagePlus />
                New Order
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[150px]">Order ID</TableHead> */}
                <TableHead>Customer Name</TableHead>
                <TableHead>Date Ordered</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5}>Error loading orders.</TableCell>
                </TableRow>
              )}
              {data?.getOrders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No orders found.</TableCell>
                </TableRow>
              )}
              {data?.getOrders?.map((order: any) => (
                <TableRow
                  key={order.id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                >
                  {/* <TableCell className="font-medium">{order.id}</TableCell> */}
                  <TableCell>
                    {order.customer
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {order.rentalList
                      ? order.rentalList.reduce(
                          (sum: number, item: any) =>
                            sum + (item.rentalQuantity || 0),
                          0
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <OrderStatusTable label={order.orderStatus || "N/A"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default page;
