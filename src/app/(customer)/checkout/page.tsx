import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductItemCheckout from "@/components/CheckoutPage/CheckoutProductItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
            <Navbar />

            <div className="pb-[80px]">
                <h1>Checkout</h1>
                <div className="bg-white border border-[#D2D6DA] w-[750px] h-[400px] rounded-lg px-12 ">
                    <div className="">
                        <h1>
                            <span>Basket List </span>
                            <span>(2 item)</span>
                        </h1>
                        <h1>This is your current order</h1>
                    </div>

                    <ScrollArea className="flex h-2xl gap-y-5">
                        <ProductItemCheckout />
                        <ProductItemCheckout />
                        <ProductItemCheckout />
                    </ScrollArea>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default page;
