"use client";

import React, { useState } from "react";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";
import OrderDetailsSet from "@/components/CheckoutPage/OrderDetailsSet";
import OrderDetailsPayment from "@/components/CheckoutPage/OrderDetailsPayment";

const page = () => {
    const [isVerified, setIsVerified] = useState("Verified");
    const [isOrderable, setIsOrderable] = useState(false); // State to track orderable status

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
            <div className="pb-[80px] px-24">
                <h1 className="text-2xl font-intermedium py-2">Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <BasketList />

                        {isOrderable ? (
                            <div>
                                <OrderDetailsSet
                                    onOrderableChange={(orderable) =>
                                        setIsOrderable(orderable)
                                    }
                                />
                                <OrderDetailsPayment />
                            </div>
                        ) : (
                            <OrderDetails />
                        )}
                    </div>

                    {/* hard but cleaner way. don't erase comments, need it for future references..*/}
                    <OrderStatus
                        label={isVerified}
                        onOrderableChange={(orderable) =>
                            setIsOrderable(orderable)
                        } // Pass callback
                    >
                        <StatusLabel label={isVerified} />
                    </OrderStatus>
                </div>
            </div>
        </div>
    );
};

export default page;
