import React, { useState } from "react";
import { Button } from "../ui/button";
import OrderItem from "./OrderItem";
import StatusLabel from "../StatusLabel";
import { GET_ALL_EVENTS } from "@/graphql/people";
import apolloClientCustomer from "@/graphql/apolloClientCustomer";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";


const EventsScreen = () => {
    const router = useRouter();
    const [isPossess, setIsPosses] = useState(true);
    const [isCurrentOrder, setIsCurrentOrder] = useState(true);
    const [isRecentOrder, setIsRecentOrder] = useState(true);
    const { data, loading, error } = useQuery(GET_ALL_EVENTS, {
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

    const events = data?.getEvents || [];

    const currentEvents = events.filter(
        (event: any) =>
        event.orderStatus !== "Completed" && event.orderStatus !== "Cancelled"
    );
    const recentEvents = events.filter(
        (event: any) =>
        event.orderStatus === "Completed" || event.orderStatus === "Cancelled"
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
                View your previous and recent events. You can also customize
                your event by clicking an event item.
            </p>

            {!isPossess ? (
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
                    <h1 className="text-lg font-poppins_medium mb-2">
                        Current Orders
                    </h1>

                    {!isCurrentOrder ? (
                        <div className="">
                            <h1 className="text-base text-neutral-500 text-center my-5">
                                No Orders
                            </h1>
                            <hr />
                        </div>
                    ) : (
                        <>
                            {currentEvents.map(event => (
                            <OrderItem
                                onClick={() =>
                                    router.push(`/account/event-details/${event.id}`)
                                }
                                key={event.id}
                                name={event.name}
                                date={event.eventDate}
                                address={event.eventAddress}
                            >
                                <StatusLabel label={event.eventStatus}/>
                            </OrderItem>
                            ))}
                        </>
                    )}

                    <h1 className="text-lg font-poppins_medium mt-8 mb-2">
                        Recent Orders
                    </h1>

                    {!isRecentOrder ? (
                        <div className="">
                            <h1 className="text-base text-neutral-500 text-center my-5">
                                No Orders
                            </h1>
                            <hr />
                        </div>
                    ) : (
                        <>
                            {recentEvents.map(event => (
                            <OrderItem
                                onClick={() =>
                                    router.push(`/account/event-details/${event.id}`)
                                }
                                key={event.id}
                                name={event.name}
                                date={event.eventDate}
                                address={event.eventAddress}
                            >
                                <StatusLabel label={event.eventStatus}/>
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
