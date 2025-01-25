"use client";

import React, { useState } from "react";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";
import OrderDetailsSet from "@/components/CheckoutPage/OrderDetailsSet";
import { Button } from "@/components/ui/button";
import { IoIosCheckmark } from "react-icons/io";
import { FcInfo } from "react-icons/fc";
import { MdOutlineUploadFile } from "react-icons/md";
import PaymentButtons from "@/components/CheckoutPage/Payment Details/PaymentButtons";
import { FaTruckFast } from "react-icons/fa6";
import PaymentProcess from "@/components/CheckoutPage/Payment Details/PaymentProcess";
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
                                <OrderDetailsSet />
                                <OrderDetailsPayment />
                            </div>
                        ) : (
                            <OrderDetails />
                        )}


                        {/* <OrderDetailsSet />
                        <OrderDetailsPayment /> */}


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
