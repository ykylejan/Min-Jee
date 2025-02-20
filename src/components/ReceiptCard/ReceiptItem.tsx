import { images } from "@/constants";
import React from "react";

const ReceiptItem = () => {
    return (
        <>
            <div className="flex py-6">
                <img
                    src={images.halfsizedFoodWarmer.src}
                    alt="product"
                    className="h-[103px] aspect-square rounded-md object-cover"
                />
                <div className="w-full pl-4">
                    <div className="flex justify-between w-full font-afacad_medium">
                        <h1 className="text-2xl font-afacad_semibold">
                            Half-sized Food Warmer
                        </h1>
                        <h1 className="text-xl">PHP 10.00</h1>
                    </div>
                    <div className="text-[#6B7280] flex flex-col font-afacad space-y-5">
                        <h1 className="text-lg">Rental</h1>
                        <h1 className="text-lg">Qty 1</h1>
                    </div>
                </div>
            </div>
            <hr />
        </>
    );
};

export default ReceiptItem;
