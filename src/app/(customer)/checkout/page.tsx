"use client";

import React, { useState } from "react";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";
import OrderDetailsSet from "@/components/CheckoutPage/OrderDetailsSet";
import { Button } from "@/components/ui/button";

const page = () => {
    const [isVerified, setIsVerified] = useState("Pending");
    const [isOrderable, setIsOrderable] = useState(false); // State to track orderable status

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
            <div className="pb-[80px] px-24">
                <h1 className="text-2xl font-intermedium py-2">Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <BasketList />

                        {isOrderable ? <OrderDetailsSet /> : <OrderDetails />}
                    </div>

                    {/* hard but cleaner way */}
                    <OrderStatus
                        label={isVerified}
                        onOrderableChange={(orderable) => setIsOrderable(orderable)} // Pass callback
                    >
                        <StatusLabel label={isVerified} />
                    </OrderStatus>

                    {/* easy but messier way */}
                    {/* <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
                        <div className="flex justify-between px-12 py-6">
                            <h1>Order Status</h1>
                            <StatusLabel label={isVerified} />
                        </div>

                        <hr />

                        <div className="py-6">
                            <div className="flex justify-between px-12">
                                <h1>Subtotal</h1>
                                <h1>PHP 150.00</h1>
                            </div>
                            <div className="flex justify-between px-12">
                                <h1>Delivery Fee</h1>
                                <h1>PHP 50.00</h1>
                            </div>
                            <div className="flex justify-between px-12">
                                <h1>Deposit</h1>
                                <h1>PHP 0.00</h1>
                            </div>
                        </div>

                        <hr />

                        <div className="flex justify-between px-12 py-6">
                            <h1>TOTAL</h1>
                            <h1>PHP 200.00</h1>
                        </div>

                        <hr />

                        <div className="flex flex-col gap-y-3 px-12 py-6">
                            <Button
                                onClick={() => {
                                    setIsOrderable(true);
                                }}
                                disabled={isVerified == "Verified" ? false : true}
                                className="bg-[#0F172A] rounded-full"
                            >
                                Place Order
                            </Button>
                            <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                                Cancel Order
                            </Button>
                            <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                                Empty Basket
                            </Button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default page;
