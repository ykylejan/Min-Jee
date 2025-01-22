import React from "react";
import StatusLabel from "../StatusLabel";
import { Button } from "../ui/button";

interface ChildLabel {
    children: any
}

const OrderStatus = ({ children }: ChildLabel) => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
            <div className="flex justify-between px-12 py-6">
                <h1>Order Status</h1>
                {children}
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
                <Button className="bg-[#0F172A] rounded-full">
                    Place Order
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
