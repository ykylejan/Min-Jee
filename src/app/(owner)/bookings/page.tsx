"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, PartyPopper } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatsCard } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

const BookingsPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(GET_ALL_EVENTS_OWNER, {
    client: apolloClientPartner,
  });

  const { filteredEvents, stats } = useMemo(() => {
    if (!data?.getEvents)
      return {
        filteredEvents: [],
        stats: { total: 0, upcoming: 0, thisMonth: 0 },
      };

    const events = data.getEvents;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate stats
    const stats = {
      total: events.length,
      upcoming: events.filter((e: any) => new Date(e.eventDate) > now).length,
      thisMonth: events.filter((e: any) => {
        const eventDate = new Date(e.eventDate);
        return (
          eventDate.getMonth() === thisMonth &&
          eventDate.getFullYear() === thisYear
        );
      }).length,
    };

    // Filter by search (customer name or event name)
    let filtered = events.filter((event: any) => {
      const customerName = event.customer
        ? `${event.customer.firstName} ${event.customer.lastName}`.toLowerCase()
        : "";
      const eventName = event.name ? event.name.toLowerCase() : "";
      return (
        customerName.includes(search.toLowerCase()) ||
        eventName.includes(search.toLowerCase())
      );
    });

    // Sort: nearest eventDate first (ascending)
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.eventDate).getTime();
      const dateB = new Date(b.eventDate).getTime();
      return dateA - dateB;
    });

    return { filteredEvents: filtered, stats };
  }, [data, search]);

  const columns = [
    {
      key: "name",
      header: "Customer Name",
      render: (event: any) => (
        <div className="font-medium text-gray-900">{event.name || "N/A"}</div>
      ),
    },
    {
      key: "package",
      header: "Event Package",
      render: (event: any) => (
        <span className="text-gray-600">
          {event.pax?.eventPackages?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "pax",
      header: "Pax",
      render: (event: any) => (
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <Users className="w-3.5 h-3.5" />
          {event.pax?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "eventDate",
      header: "Event Date",
      render: (event: any) => {
        const eventDate = event.eventDate ? new Date(event.eventDate) : null;
        const isUpcoming = eventDate && eventDate > new Date();
        return (
          <div className="flex items-center gap-2">
            <Calendar
              className={`w-3.5 h-3.5 ${isUpcoming ? "text-camouflage-500" : "text-gray-400"}`}
            />
            <span className={isUpcoming ? "text-gray-900 font-medium" : "text-gray-500"}>
              {eventDate
                ? eventDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      key: "eventStatus",
      header: "Status",
      render: (event: any) => (
        <StatusBadge status={event.eventStatus || "Pending"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Bookings"
          value={stats.total}
          icon={<PartyPopper className="w-5 h-5" />}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcoming}
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatsCard
          title="This Month"
          value={stats.thisMonth}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Event Bookings"
        description="Click an event booking row to view its details"
        searchPlaceholder="Search by customer or event name..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredEvents}
        loading={loading}
        error={error || null}
        emptyTitle="No bookings found"
        emptyDescription="No event bookings match your search criteria."
        emptyIcon={<PartyPopper className="w-10 h-10 text-gray-400" />}
        onRowClick={(event: any) => router.push(`/bookings/${event.id}`)}
        keyExtractor={(event: any) => event.id}
      />
    </div>
  );
};

export default BookingsPage;
