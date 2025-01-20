import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductItemCheckout from "@/components/CheckoutPage/CheckoutProductItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Navbar />

            <div className="pb-[80px] px-24">
                <h1>Checkout</h1>

                <div className="flex gap-x-10">
                    <div className="space-y-10">
                        <div className="bg-white border border-[#D2D6DA] w-[750px] h-[350px] rounded-lg px-12 pt-6">
                            <div className="font-afacad">
                                <h1 className="text-2xl font-afacad_medium">
                                    <span>Basket List </span>
                                    <span>(2 item)</span>
                                </h1>
                                <h1 className="text-[#6B7280]">
                                    This is your current order
                                </h1>
                            </div>

                            <ScrollArea className="h-60">
                                <ProductItemCheckout />
                                <ProductItemCheckout />
                                <ProductItemCheckout />
                            </ScrollArea>
                        </div>

                        <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-12 pt-6 pb-12">
                            <div className="font-afacad">
                                <h1 className="text-2xl font-afacad_medium">
                                    Order Details
                                </h1>
                                <h1 className="text-[#6B7280]">
                                    To order for approval, enter the following
                                    details
                                </h1>
                            </div>

                            <div className="font-afacad space-y-5">
                                <div className="mt-5">
                                    <h1>Name</h1>
                                    <Input placeholder="John Doe" />
                                </div>
                                <div>
                                    <h1>Location Address</h1>
                                    <Input placeholder="03 Red Stone, Calinan, Davao City" />
                                </div>
                                <div className="flex gap-x-3">
                                    <div className="w-1/2">
                                        <h1>Date of Rent</h1>
                                        <Input placeholder="Enter Date" />
                                    </div>
                                    <div className="w-1/2">
                                        <h1>Time of Rent</h1>
                                        <Input placeholder="Enter Date" />
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <h1>Date of Return</h1>
                                    <Input placeholder="Enter Date" />
                                </div>

                                <div className="w-full">
                                    <h1>Phone Number</h1>
                                    <Input placeholder="909-876-5432" />
                                </div>

                                <div className="space-y-3 pb-3">
                                    <h1>Order Obtainment Method</h1>
                                    <RadioGroup
                                        defaultValue="option-one"
                                        className="flex gap-x-10"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="option-one"
                                                id="option-one"
                                                className="border border-[#D2D6DA]"
                                            />
                                            <Label htmlFor="option-one">
                                                Pick Up
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="option-two"
                                                id="option-two"
                                                className="border border-[#D2D6DA]"
                                            />
                                            <Label htmlFor="option-two">
                                                Shipped
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <h1>Note to Owner</h1>
                                    <Textarea placeholder="Write a note of your order here" className="min-h-[120px]"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#D2D6DA] w-[400px] h-fit rounded-lg font-afacad py-3">
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
