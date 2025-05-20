import React from "react";
import { Button } from "../ui/button";
import OrderItem from "./OrderItem";
import StatusLabel from "../StatusLabel";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS_CUSTOMER } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";

const EventsScreen = () => {
  const router = useRouter();

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
          <h1 className="text-lg font-poppins_medium mb-2">Current Events</h1>
          {currentEvents.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Events
              </h1>
              <hr />
            </div>
          ) : (
            <>
              {currentEvents.map((event: any) => (
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
            </>
          )}

          <h1 className="text-lg font-poppins_medium mt-8 mb-2">
            Recent Events
          </h1>
          {recentEvents.length === 0 ? (
            <div>
              <h1 className="text-base text-neutral-500 text-center my-5">
                No Events
              </h1>
              <hr />
            </div>
          ) : (
            <>
              {recentEvents.map((event: any) => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsScreen;
