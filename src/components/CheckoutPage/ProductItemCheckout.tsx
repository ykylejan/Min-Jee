import React, { useState } from "react";
import { Button } from "../ui/button";
import { images } from "@/constants";

const ProductItemCheckout = () => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <div className="bg-white border border-[#D2D6DA] w-auto rounded-lg flex justify-between items-center p-3 my-3 font-afacad">
            <div className="flex items-center">
                <img
                    src={images.halfsizedFoodWarmer.src}
                    alt="product-item"
                    className="aspect-square h-[70px] rounded-md"
                />

                <div className="pl-5">
                    <p className="text-gray-500 text-sm">Rental</p>
                    <h1 className="font-afacad_medium text-xl">Half-Sized Food Warmer</h1>

                    <div className="flex items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                                onClick={decreaseQuantity}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="px-3">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        <button className="ml-4 text-gray-500 hover:text-gray-700">
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h1 className="font-medium">PHP 10.00</h1>
            </div>
        </div>
    );
};

export default ProductItemCheckout;
