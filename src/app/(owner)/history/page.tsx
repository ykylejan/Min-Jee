"use client";
import React, { useMemo, useState } from "react";
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
import { Search } from "lucide-react";
import PaymentStatus from "@/components/OwnerPage/History/PaymentStatus";
import { useQuery } from "@apollo/client";
import {
  GET_TRANSACTIONS,
  GET_ALL_ORDERS,
  GET_ALL_EVENTS_OWNER,
} from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import ReceiptModal from "@/components/ReceiptCard/ReceiptModal";

const page = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Fetch all transactions, orders, and events
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS, { client: apolloClientPartner });
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery(GET_ALL_ORDERS, { client: apolloClientPartner });
  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
  } = useQuery(GET_ALL_EVENTS_OWNER, { client: apolloClientPartner });

  // Combine all transactions with their related order or event
  const historyRows = useMemo(() => {
    if (!transactionsData?.getTransactions) return [];

    return transactionsData.getTransactions.map((txn: any) => {
      // Try to find the order or event for this transaction
      let order = null;
      let event = null;
      if (txn.orderId && ordersData?.getOrders) {
        order = ordersData.getOrders.find((o: any) => o.id === txn.orderId);
      }
      if (txn.eventId && eventsData?.getEvents) {
        event = eventsData.getEvents.find((e: any) => e.id === txn.eventId);
      }

      // Prefer order if available, else event
      const customer = order?.customer || event?.customer;
      const category = order ? "Order" : event ? "Event" : "N/A";
      const name = customer
        ? `${customer.firstName} ${customer.lastName}`
        : "N/A";
      const phone = customer?.contactNumber || "N/A";

      // Prepare receipt modal props
      let receiptProps = null;
      if (order) {
        // Rentals and Services
        const rentalProducts =
          order.rentalList?.map((item: any) => ({
            id: item.id,
            name: item.rentals?.name,
            price: item.rentalTotal,
            quantity: item.rentalQuantity,
            img: item.rentals?.img,
            category: "Rental",
          })) || [];
        const serviceProducts =
          order.servicesList?.map((item: any) => ({
            id: item.id,
            name: item.servicesItems?.name,
            price: item.serviceTotal,
            quantity: item.serviceQuantity,
            img: item.servicesItems?.services?.img,
            category: "Service",
          })) || [];
        const allProducts = [...rentalProducts, ...serviceProducts];
        const subtotal = allProducts.reduce(
          (sum, item) => sum + Number(item.price || 0),
          0
        );
        const deliveryFee = Number(order.deliveryPrice || 0);
        const depositPrice = Number(order.depositPrice || 0);
        const total = subtotal + deliveryFee + depositPrice;
        receiptProps = {
          type: "order" as const,
          customer: order.customer,
          transaction: txn,
          items: allProducts,
          subtotal,
          deliveryFee,
          depositPrice,
          total,
          address: order.location,
          dateOfUse: order.orderDate,
          dateOfReturn: order.returnDate,
          minjeeVenue: order.minjeeVenue,
        };
      } else if (event) {
        // Event Package
        const eventPackage = event.pax?.eventPackages;
        const eventPackageProduct = eventPackage
          ? [
              {
                id: eventPackage.id,
                name: eventPackage.name,
                price: event.pax?.price,
                quantity: event.pax?.name,
                img: eventPackage.img,
                category: "Event Package",
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
              category: "Addon",
            }))
          : [];
        const items = [...eventPackageProduct, ...addons];
        const subtotal =
          (Number(event.pax?.price) || 0) +
          addons.reduce(
            (sum: any, addon: any) => sum + Number(addon.price || 0),
            0
          );
        const customizationPrice = Number(event.customizationsPrice || 0);
        const total = subtotal + customizationPrice;
        receiptProps = {
          type: "event" as const,
          customer: event.customer,
          transaction: txn,
          items,
          subtotal,
          customizationPrice,
          total,
          address: event.eventAddress || event.location,
          schedule: event.eventDate,
          status: event.eventStatus,
          customizations: event.customizations,
          minjeeVenue: event.minjeeVenue,
        };
      }

      return {
        id: txn.id,
        customerName: name,
        phoneNumber: phone,
        category,
        paymentStatus: txn.paymentStatus,
        isVerified: txn.isVerified,
        txn,
        receiptProps,
      };
    });
  }, [transactionsData, ordersData, eventsData]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              History List
              <CardDescription className="text-base">
                Click a row to expand the transaction's order or event history.
              </CardDescription>
            </div>
            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search by customer or phone"
                  className="w-56 font-light pr-8 "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Category</TableHead>
                {/* <TableHead>Payment Status</TableHead> */}
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(transactionsLoading || ordersLoading || eventsLoading) && (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              )}
              {(transactionsError || ordersError || eventsError) && (
                <TableRow>
                  <TableCell colSpan={5}>Error loading data.</TableCell>
                </TableRow>
              )}
              {historyRows
                .filter(
                  (row: any) =>
                    row.customerName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    row.phoneNumber.toLowerCase().includes(search.toLowerCase())
                )
                .map((data: any) => (
                  <TableRow key={data.id} className="hover:cursor-pointer">
                    <TableCell className="font-medium">
                      {data.customerName}
                    </TableCell>
                    <TableCell>{data.phoneNumber}</TableCell>
                    <TableCell>{data.category}</TableCell>
                    {/* <TableCell>
                      <PaymentStatus status={data.paymentStatus} />
                    </TableCell> */}
                    <TableCell>
                      {data.receiptProps ? (
                        <ReceiptModal
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-afacad"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Receipt
                            </Button>
                          }
                          {...data.receiptProps}
                        />
                      ) : (
                        <span className="text-gray-400">No Receipt</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              {historyRows.length === 0 &&
                !transactionsLoading &&
                !ordersLoading &&
                !eventsLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>No history found.</TableCell>
                  </TableRow>
                )}
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
