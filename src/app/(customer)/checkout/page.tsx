import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductItemCheckout from "@/components/CheckoutPage/CheckoutProductItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Navbar />

            <div className="pb-[80px] px-24">
                <h1>Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <div className="bg-white border border-[#D2D6DA] w-[750px] h-[350px] rounded-lg px-12 pt-6">
                            <div className="">
                                <h1>
                                    <span>Basket List </span>
                                    <span>(2 item)</span>
                                </h1>
                                <h1>This is your current order</h1>
                            </div>

                            <ScrollArea className="h-60">
                                <ProductItemCheckout />
                                <ProductItemCheckout />
                                <ProductItemCheckout />
                            </ScrollArea>
                        </div>

                        <div className="bg-white border border-[#D2D6DA] w-[750px] h-[1000px] rounded-lg px-12">
                            customer details here
                        </div>
                    </div>

                    <div className="bg-white border border-[#D2D6DA] w-[400px] h-[600px] rounded-lg font-afacad">
                        <div className="flex justify-between px-12 py-6">
                            <h1>Order Status</h1>
                            <h1>PENDING</h1>
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
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default page;
