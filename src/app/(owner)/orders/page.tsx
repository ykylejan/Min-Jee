"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatsCard, TableFilters } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

const OrdersPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, loading, error } = useQuery(GET_ALL_ORDERS_OWNER, {
    client: apolloClientPartner,
  });

  const { filteredOrders, stats } = useMemo(() => {
    if (!data?.getOrders) return { filteredOrders: [], stats: { pending: 0, verified: 0, completed: 0, rejected: 0 } };

    const orders = data.getOrders;
    
    // Calculate stats
    const stats = orders.reduce(
      (acc: any, order: any) => {
        const status = order.orderStatus?.toLowerCase() || "pending";
        if (status in acc) acc[status]++;
        return acc;
      },
      { pending: 0, verified: 0, completed: 0, rejected: 0 }
    );

    // Filter by search (customer name) and status
    let filtered = orders.filter((order: any) => {
      const customerName = order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase()
        : order.name?.toLowerCase() || "";
      const matchesSearch = customerName.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (order.orderStatus || "pending").toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort: verified first, then pending, then completed/rejected at the bottom, then by most recent orderDate
    filtered.sort((a: any, b: any) => {
      const statusPriority = (status: string) => {
        if (status === "verified") return 1;
        if (status === "pending") return 0;
        if (status === "completed" || status === "rejected") return 2;
        return 3;
      };
      const aPriority = statusPriority(a.orderStatus);
      const bPriority = statusPriority(b.orderStatus);
      if (aPriority !== bPriority) return aPriority - bPriority;
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return dateB - dateA;
    });

    return { filteredOrders: filtered, stats };
  }, [data, search, statusFilter]);

  const columns = [
    {
      key: "name",
      header: "Customer Name",
      render: (order: any) => (
        <div className="font-medium text-gray-900">{order.name || "N/A"}</div>
      ),
    },
    {
      key: "orderDate",
      header: "Date Ordered",
      render: (order: any) => (
        <span className="text-gray-600">
          {order.orderDate
            ? new Date(order.orderDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Items",
      render: (order: any) => {
        const quantity = order.rentalList
          ? order.rentalList.reduce(
              (sum: number, item: any) => sum + (item.rentalQuantity || 0),
              0
            )
          : 0;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {quantity} {quantity === 1 ? "item" : "items"}
          </span>
        );
      },
    },
    {
      key: "orderStatus",
      header: "Status",
      className: "text-center",
      render: (order: any) => (
        <div className="flex justify-center">
          <StatusBadge status={order.orderStatus || "Pending"} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Pending Orders"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Verified Orders"
          value={stats.verified}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Order List"
        description="Click an order row to view its details"
        searchPlaceholder="Search by customer name..."
        searchValue={search}
        onSearchChange={setSearch}
        actionLabel="New Order"
        actionIcon={<PackagePlus className="w-4 h-4" />}
        onAction={() => router.push("/orders/add-order")}
      />

      {/* Filters */}
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Verified", value: "verified" },
              { label: "Completed", value: "completed" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
        onClearAll={() => setStatusFilter("all")}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        error={error || null}
        emptyTitle="No orders found"
        emptyDescription="No orders match your search criteria. Try adjusting your search or create a new order."
        onRowClick={(order: any) => router.push(`/orders/${order.id}`)}
        keyExtractor={(order: any) => order.id}
      />
    </div>
  );
};

export default OrdersPage;
