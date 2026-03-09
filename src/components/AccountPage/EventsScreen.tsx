import React, { useState } from "react";
import { Button } from "../ui/button";
import OrderItem from "./OrderItem";
import StatusLabel from "../StatusLabel";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS_CUSTOMER } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const ITEMS_PER_PAGE = 3;

const EventsScreen = () => {
  const router = useRouter();
  const [currentEventsPage, setCurrentEventsPage] = useState(1);
  const [recentEventsPage, setRecentEventsPage] = useState(1);

  // Fetch all events for the current customer
  const { data, loading, error } = useQuery(GET_ALL_EVENTS_CUSTOMER, {
    // variables: { id: customerId },
    client: apolloClientCustomer,
  });

  if (loading) {
    return (
      <div className="font-afacad text-2xl w-full text-center my-10">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-afacad text-2xl w-full text-center my-10 text-red-500">
        Failed to load events.
      </div>
    );
  }

  const events = data?.getEvents || [];

  // Current events: not done/cancelled
  const currentEvents = events.filter(
    (event: any) =>
      event.eventStatus !== "Completed" && event.eventStatus !== "Cancelled"
  );
  // Recent events: completed/cancelled
  const recentEvents = events.filter(
    (event: any) =>
      event.eventStatus === "Completed" || event.eventStatus === "Cancelled"
  );

  const getStatusLabel = (status: string) => {
    if (status === "Verified") return <StatusLabel label="Verified" />;
    if (status === "Completed") return <StatusLabel label="Completed" />;
    if (status === "Cancelled") return <StatusLabel label="Cancelled" />;
    return <StatusLabel label={status} />;
  };

  return (
    <div className="font-afacad text-2xl w-full">
      <h1 className="font-afacad_medium">Events</h1>
      <p className="text-[#6B7280] text-base mb-10">
        View your previous and recent events. You can also customize your event
        by clicking an event item.
      </p>

      {events.length === 0 ? (
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
            <h1 className="text-lg font-poppins_medium">Current Events</h1>
            {Math.ceil(currentEvents.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentEventsPage((p) => Math.max(1, p - 1))}
                  disabled={currentEventsPage === 1}
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &lt;
                </button>
                {Array.from(
                  { length: Math.ceil(currentEvents.length / ITEMS_PER_PAGE) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentEventsPage(i + 1)}
                      className={`px-1.5 py-0.5 rounded text-xs transition-colors duration-150 ${
                        currentEventsPage === i + 1
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
                    setCurrentEventsPage((p) =>
                      Math.min(Math.ceil(currentEvents.length / ITEMS_PER_PAGE), p + 1)
                    )
                  }
                  disabled={
                    currentEventsPage === Math.ceil(currentEvents.length / ITEMS_PER_PAGE)
                  }
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          {currentEvents.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Events
              </h1>
              <hr />
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out">
              {currentEvents
                .slice(
                  (currentEventsPage - 1) * ITEMS_PER_PAGE,
                  currentEventsPage * ITEMS_PER_PAGE
                )
                .map((event: any) => (
                  <OrderItem
                    key={event.id}
                    onClick={() =>
                      router.push(`/account/event-details/${event.id}`)
                    }
                    name={event.name}
                    date={event.eventDate}
                    address={event.eventAddress || event.location}
                  >
                    {getStatusLabel(event.eventStatus)}
                  </OrderItem>
                ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 mb-2">
            <h1 className="text-lg font-poppins_medium">Recent Events</h1>
            {Math.ceil(recentEvents.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRecentEventsPage((p) => Math.max(1, p - 1))}
                  disabled={recentEventsPage === 1}
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &lt;
                </button>
                {Array.from(
                  { length: Math.ceil(recentEvents.length / ITEMS_PER_PAGE) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setRecentEventsPage(i + 1)}
                      className={`px-1.5 py-0.5 rounded text-xs transition-colors duration-150 ${
                        recentEventsPage === i + 1
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
                    setRecentEventsPage((p) =>
                      Math.min(Math.ceil(recentEvents.length / ITEMS_PER_PAGE), p + 1)
                    )
                  }
                  disabled={
                    recentEventsPage === Math.ceil(recentEvents.length / ITEMS_PER_PAGE)
                  }
                  className="px-1.5 py-0.5 text-xs text-[#9CA3AF] disabled:opacity-30 hover:text-[#6B7280] transition-colors duration-150"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          {recentEvents.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Events
              </h1>
              <hr />
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out">
              {recentEvents
                .slice(
                  (recentEventsPage - 1) * ITEMS_PER_PAGE,
                  recentEventsPage * ITEMS_PER_PAGE
                )
                .map((event: any) => (
                  <OrderItem
                    key={event.id}
                    onClick={() =>
                      router.push(`/account/event-details/${event.id}`)
                    }
                    name={event.name}
                    date={event.eventDate}
                    address={event.eventAddress || event.location}
                  >
                    {getStatusLabel(event.eventStatus)}
                  </OrderItem>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsScreen;
