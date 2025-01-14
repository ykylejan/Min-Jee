import React from "react";
import { Button } from "../ui/button";

const ProductItemCheckout = () => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-auto  rounded-lg flex justify-center items-center p-3 my-3">
            <img
                src="/placeholderProduct.png"
                alt="product-item"
                className="aspect-square h-[70px] rounded-md"
            />

            <div className="w-full pl-5 ">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h1 className="font-afacad_semibold">Rental</h1>
                        <h1>Half-Sized Food Warmer</h1>
                    </div>

                    <h1>PHP 10.00</h1>
                </div>

                <div className="space-x-2">
                    <Button className="h-5">Add</Button>
                    <Button className="h-5">Remove</Button>
                </div>
            </div>


        </div>
    );
};

export default ProductItemCheckout;
