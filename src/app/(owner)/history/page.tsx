"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  History,
  Receipt,
  ShoppingCart,
  PartyPopper,
  Phone,
  Loader2,
  FileText,
} from "lucide-react";
import { PageHeader, StatsCard, StatusBadge } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import {
  GET_TRANSACTIONS,
  GET_ALL_ORDERS,
  GET_ALL_EVENTS_OWNER,
} from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { useRouter } from "next/navigation";

const HistoryPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

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

  const { historyRows, filteredRows, stats } = useMemo(() => {
    if (!transactionsData?.getTransactions)
      return {
        historyRows: [],
        filteredRows: [],
        stats: { total: 0, orders: 0, events: 0 },
      };

    const rows = transactionsData.getTransactions.map((txn: any) => {
      let order = null;
      let event = null;
      if (txn.orderId && ordersData?.getOrders) {
        order = ordersData.getOrders.find((o: any) => o.id === txn.orderId);
      }
      if (txn.eventId && eventsData?.getEvents) {
        event = eventsData.getEvents.find((e: any) => e.id === txn.eventId);
      }

      const customer = order?.customer || event?.customer;
      const category = order ? "Order" : event ? "Event" : "N/A";
      const name = customer
        ? `${customer.firstName} ${customer.lastName}`
        : "N/A";
      const phone = customer?.contactNumber || "N/A";

      return {
        id: txn.id,
        customerName: name,
        phoneNumber: phone,
        category,
        paymentStatus: txn.paymentStatus,
        isVerified: txn.isVerified,
        txn,
        hasReceipt: !!(order || event),
      };
    });

    const filtered = rows.filter(
      (row: any) =>
        row.customerName.toLowerCase().includes(search.toLowerCase()) ||
        row.phoneNumber.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
      total: rows.length,
      orders: rows.filter((r: any) => r.category === "Order").length,
      events: rows.filter((r: any) => r.category === "Event").length,
    };

    return { historyRows: rows, filteredRows: filtered, stats };
  }, [transactionsData, ordersData, eventsData, search]);

  const isLoading = transactionsLoading || ordersLoading || eventsLoading;
  const hasError = transactionsError || ordersError || eventsError;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Transactions"
          value={stats.total}
          icon={<History className="w-5 h-5" />}
        />
        <StatsCard
          title="Order Transactions"
          value={stats.orders}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatsCard
          title="Event Transactions"
          value={stats.events}
          icon={<PartyPopper className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Transaction History"
        description="View all transaction history and receipts"
        searchPlaceholder="Search by customer or phone..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Content */}
      {isLoading ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-camouflage-400 mb-4" />
            <p className="text-gray-500">Loading transaction history...</p>
          </CardContent>
        </Card>
      ) : hasError ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error loading history
            </h3>
            <p className="text-gray-500">Please try again later.</p>
          </CardContent>
        </Card>
      ) : filteredRows.length === 0 ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500">
              {search
                ? "Try adjusting your search criteria."
                : "Transaction history will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-600 text-sm py-4">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 text-sm py-4">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 text-sm py-4">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 text-sm py-4 text-right">
                      Receipt
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((data: any) => (
                    <TableRow
                      key={data.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-camouflage-300 to-camouflage-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {data.customerName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {data.customerName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          {data.phoneNumber}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            data.category === "Order"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {data.category === "Order" ? (
                            <ShoppingCart className="w-3 h-3" />
                          ) : (
                            <PartyPopper className="w-3 h-3" />
                          )}
                          {data.category}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {data.hasReceipt ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-camouflage-50 hover:text-camouflage-700 hover:border-camouflage-300 transition-colors"
                            onClick={() => router.push(`/history/${data.id}`)}
                          >
                            <Receipt className="w-4 h-4 mr-1.5" />
                            View Receipt
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No receipt available
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;
