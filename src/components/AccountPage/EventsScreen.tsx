import React, { useState } from "react";
import { Button } from "../ui/button";
import OrderItem from "./OrderItem";
import StatusLabel from "../StatusLabel";

const EventsScreen = () => {
    const [isPossess, setIsPosses] = useState(true);
    const [isCurrentOrder, setIsCurrentOrder] = useState(true);
    const [isRecentOrder, setIsRecentOrder] = useState(true);

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
                            <OrderItem
                                name="Art Montebon"
                                date="October 20, 2024"
                                address="03 Red Stone Calinan, Davao City"
                            >
                                <StatusLabel label="Verified" />
                            </OrderItem>
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
                            <OrderItem
                                name="Art Montebon"
                                date="October 20, 2024"
                                address="03 Red Stone Calinan, Davao City"
                            >
                                <StatusLabel label="Completed" />
                            </OrderItem>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventsScreen;
