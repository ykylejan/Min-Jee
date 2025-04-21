"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface OrderStatusProps {
    children: React.ReactNode;
    orderStatus: string;
    updateOrderStatus: (status: string) => void;
    showPaymentForm: boolean;
    setShowPaymentForm: (show: boolean) => void;
}

const OrderStatus = ({
    children,
    orderStatus,
    updateOrderStatus,
    showPaymentForm,
    setShowPaymentForm,
}: OrderStatusProps) => {
    const router = useRouter();

    const handleButtonClick = () => {
        // Initial state -> Pending
        if (orderStatus === "") {
            updateOrderStatus("Pending");
            
            // Simulate order analysis (in a real app, this would be an API call)
            setTimeout(() => {
                updateOrderStatus("Verified");
            }, 12000);
        } 
        // Verified -> Show payment form
        else if (orderStatus === "Verified" && !showPaymentForm) {
            setShowPaymentForm(true);
        } 
        // Payment form shown -> Checkout/Complete order
        else if (orderStatus === "Verified" && showPaymentForm) {
            router.push("/receipt");
            updateOrderStatus("Completed");
        }
    };

    // Determine button text based on current state
    const getButtonText = () => {
        if (orderStatus === "") return "Place Order";
        if (orderStatus === "Pending") return "Analyzing Order";
        if (orderStatus === "Verified") {
            return showPaymentForm ? "Checkout" : "Proceed to Payment";
        }
        return "Place Order";
    };

    // Determine if button should be disabled
    const isButtonDisabled = orderStatus === "Pending" || 
                             orderStatus === "Rejected" || 
                             orderStatus === "Completed";

    return (
        <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
            <div className="flex justify-between px-12 py-6">
                <h1>Order Status</h1>
                {orderStatus && children}
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
                    onClick={handleButtonClick}
                    disabled={isButtonDisabled}
                    className="bg-[#0F172A] rounded-full"
                >
                    {getButtonText()}
                </Button>
                <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                    Cancel Order
                </Button>
                <Button className="bg-transparent text-black rounded-full shadow-none border border-[#D2D6DA]">
                    Empty Basket
                </Button>
            </div>
        </div>
    );
};

export default OrderStatus;