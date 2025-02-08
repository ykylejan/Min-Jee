import React from "react";
import { Button } from "../ui/button";

const OrdersScreen = () => {
    return (
        <div className="font-afacad text-2xl">
            <h1 className="font-afacad_medium">Orders</h1>
            <p className="text-[#6B7280] text-base mb-10">
                View your previous and current orders. You can also create
                returns or cancel your orders if needed.
            </p>
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-poppins_medium text-base mb-5">
                    Nothing to see here
                </h1>
                <h1 className="text-[#6B7280] font-afacad text-base mb-10">
                    Nothing to see here yet. Let us change that :)
                </h1>
                <Button className="bg-[#0F172A] font-poppins_medium text-xs h-12 w-48 rounded-full mb-16">
                    Browse Catalog
                </Button>
            </div>
            <hr />
        </div>
    );
};

export default OrdersScreen;
