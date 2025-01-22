import React from "react";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
            <div className="pb-[80px] px-24">
                <h1 className="text-2xl font-intermedium py-2">Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <BasketList />

                        <OrderDetails />
                    </div>

                    <OrderStatus>
                        <StatusLabel label="Pending" />
                    </OrderStatus>
                </div>
            </div>
        </div>
    );
};

export default page;
