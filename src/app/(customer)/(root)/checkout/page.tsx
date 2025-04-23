"use client";

import React, { useState } from "react";
import BasketList from "@/components/CheckoutPage/BasketList";
import OrderDetails from "@/components/CheckoutPage/OrderDetails";
import OrderStatus from "@/components/CheckoutPage/OrderStatus";
import StatusLabel from "@/components/StatusLabel";
import OrderDetailsSet from "@/components/CheckoutPage/OrderDetailsSet";
import OrderDetailsPayment from "@/components/CheckoutPage/OrderDetailsPayment";

const Page = () => {
    // Possible states: "" (initial), "Pending", "Verified", "Rejected", "Completed"
    const [orderStatus, setOrderStatus] = useState("Rejected");
    
    // Controls which form to show (order details or payment)
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    // Function to handle status changes - can be passed to child components
    const updateOrderStatus = (status: React.SetStateAction<string>) => {
        setOrderStatus(status);
    };

    // Handle going back from payment to order details
    const handleBackToOrderDetails = () => {
        setShowPaymentForm(false);
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] flex justify-center">
            <div className="pb-[80px] px-24">
                <h1 className="text-2xl font-intermedium py-2">Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <BasketList />

                        {showPaymentForm ? (
                            <div>
                                <OrderDetailsSet 
                                    onOrderableChange={handleBackToOrderDetails} 
                                />
                                <OrderDetailsPayment />
                            </div>
                        ) : (
                            <OrderDetails />
                        )}
                    </div>

                    <OrderStatus
                        orderStatus={orderStatus}
                        updateOrderStatus={updateOrderStatus}
                        showPaymentForm={showPaymentForm}
                        setShowPaymentForm={setShowPaymentForm}
                    >
                        {orderStatus && <StatusLabel label={orderStatus} />}
                    </OrderStatus>
                </div>
            </div>
        </div>
    );
};

export default Page;