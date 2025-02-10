import React, { useState } from "react";
import { Button } from "../ui/button";
import StatusLabel from "../StatusLabel";
import OrderItem from "./OrderItem";

const OrdersScreen = () => {
    const [isPossess, setIsPosses] = useState(true);
    return (
        <div className="font-afacad text-2xl w-full">
            <h1 className="font-afacad_medium">Orders</h1>
            <p className="text-[#6B7280] text-base mb-10">
                View your previous and current orders. You can also create
                returns or cancel your orders if needed.
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
                <div className="">
                    <h1 className="text-lg font-poppins_medium">
                        Current Orders
                    </h1>

                    <OrderItem name="Art Montebon" date="October 20, 2024" address="03 Red Stone Calinan, Davao City">
                        <StatusLabel label="Verified" />
                    </OrderItem>

                    <h1 className="text-lg font-poppins_medium">
                        Recent Orders
                    </h1>
                </div>
            )}

            <hr />
        </div>
    );
};

export default OrdersScreen;
