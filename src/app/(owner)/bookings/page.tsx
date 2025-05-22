"use client";
import React, { useState, useMemo } from "react";
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
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import StatusLabel from "@/components/StatusLabel";

const page = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(GET_ALL_EVENTS_OWNER, {
    client: apolloClientPartner,
  });

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    if (!data?.getEvents) return [];

    // Filter by search (customer name or event name)
    let filtered = data.getEvents.filter((event: any) => {
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

    return filtered;
  }, [data, search]);

  const handleRowClick = (id: string) => {
    router.push(`/bookings/${id}`);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Event Bookings
              <CardDescription className="text-base">
                Click an event booking row to view its details.
              </CardDescription>
            </div>
            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search by customer or event name"
                  className="w-fit font-light pr-8"
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
                <TableHead>Name</TableHead>
                <TableHead>Event Package</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={4}>Error loading events.</TableCell>
                </TableRow>
              )}
              {filteredAndSortedEvents.length === 0 && !loading && !error && (
                <TableRow>
                  <TableCell colSpan={4}>No event bookings found.</TableCell>
                </TableRow>
              )}
              {filteredAndSortedEvents.map((event: any) => (
                <TableRow
                  key={event.id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRowClick(event.id)}
                >
                  <TableCell>{event.name || "N/A"}</TableCell>
                  <TableCell>{event.pax?.eventPackages?.name || "N/A"}</TableCell>
                  <TableCell>
                    {event.pax?.name ? event.pax.name : "N/A"}
                  </TableCell>
                  <TableCell>
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {/* Use your StatusLabel component if available */}
                    {event.eventStatus ? (
                      <StatusLabel label={event.eventStatus} />
                    ) : (
                      "N/A"
                    )}
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
