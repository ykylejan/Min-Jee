"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserRoundPlus, Users, UserCheck, Mail, Phone } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatsCard, TableFilters } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";
import { GET_ALL_CUSTOMERS } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

interface CustomerTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  bookings: number;
  isActive: boolean;
}

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");

  const {
    loading: customersLoading,
    error: customersError,
    data: customersData,
  } = useQuery(GET_ALL_CUSTOMERS, {
    client: apolloClientPartner,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    try {
      if (customersData?.getCustomers) {
        setCustomers(customersData.getCustomers);
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching customer data. Please try again later."
      );
    }
  }, [customersData, customersLoading]);

  const { filteredCustomers, stats } = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactNumber.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && customer.isActive) ||
        (statusFilter === "inactive" && !customer.isActive);

      const matchesBooking =
        bookingFilter === "all" ||
        (bookingFilter === "with-bookings" && customer.bookings > 0) ||
        (bookingFilter === "no-bookings" && customer.bookings === 0);

      return matchesSearch && matchesStatus && matchesBooking;
    });

    const stats = {
      total: customers.length,
      active: customers.filter((c) => c.isActive).length,
      withBookings: customers.filter((c) => c.bookings > 0).length,
    };

    return { filteredCustomers: filtered, stats };
  }, [customers, searchTerm, statusFilter, bookingFilter]);

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (customer: CustomerTypes) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-camouflage-300 to-camouflage-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              {customer.firstName.charAt(0)}
              {customer.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3" />
              {customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contactNumber",
      header: "Phone",
      render: (customer: CustomerTypes) => (
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <Phone className="w-3.5 h-3.5" />
          {customer.contactNumber}
        </span>
      ),
    },
    {
      key: "bookings",
      header: "Bookings",
      render: (customer: CustomerTypes) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-camouflage-50 text-camouflage-700">
          {customer.bookings} {customer.bookings === 1 ? "booking" : "bookings"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (customer: CustomerTypes) => (
        <StatusBadge status={customer.isActive ? "Active" : "Inactive"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Customers"
          value={stats.total}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Active Customers"
          value={stats.active}
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatsCard
          title="With Bookings"
          value={stats.withBookings}
          description="Customers who have booked"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Customer List"
        description="Click a customer row to view/edit customer details"
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Customer"
        actionIcon={<UserRoundPlus className="w-4 h-4" />}
        onAction={() => router.push("/customers/add-customer")}
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
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
          {
            key: "bookings",
            label: "Bookings",
            value: bookingFilter,
            onChange: setBookingFilter,
            options: [
              { label: "All Customers", value: "all" },
              { label: "With Bookings", value: "with-bookings" },
              { label: "No Bookings", value: "no-bookings" },
            ],
          },
        ]}
        onClearAll={() => {
          setStatusFilter("all");
          setBookingFilter("all");
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        loading={customersLoading}
        error={customersError || null}
        emptyTitle="No customers found"
        emptyDescription="No customers match your search criteria. Try adjusting your search or add a new customer."
        emptyIcon={<Users className="w-10 h-10 text-gray-400" />}
        onRowClick={(customer: CustomerTypes) =>
          router.push(`/customers/${customer.id}`)
        }
        keyExtractor={(customer: CustomerTypes) => customer.id}
      />
    </div>
  );
};

export default CustomersPage;
