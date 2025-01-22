import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import ProductItemCheckout from "./ProductItemCheckout";

const BasketList = () => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-[750px] h-[350px] rounded-lg px-12 pt-6">
            <div className="font-afacad">
                <h1 className="text-2xl font-afacad_medium">
                    <span>Basket List </span>
                    <span>(2 item)</span>
                </h1>
                <h1 className="text-[#6B7280]">This is your current order</h1>
            </div>

            <ScrollArea className="h-60">
                <ProductItemCheckout />
                <ProductItemCheckout />
                <ProductItemCheckout />
            </ScrollArea>
        </div>
    );
};

export default BasketList;
