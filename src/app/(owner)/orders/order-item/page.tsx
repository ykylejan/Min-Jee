
import ProductDetailsItem from "@/components/OwnerPage/ProductDetailsItem";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
    return (
        <div className="bg-white min-h-screen rounded-lg border border-neutral-200 px-12 py-8">
            <div className="flex justify-between">
                <div className="flex flex-row gap-x-4">
                    <h1 className="font-afacad_medium text-2xl">Order Details: </h1>
                    <div className="rounded-full border border-[#FEC15F] bg-[#FFE4B9] flex justify-center items-center w-32 h-8">
                        <h1 className="text-[#FF9D00] font-interbold text-sm">Pending</h1>
                    </div>
                </div>

                <Button className="bg-camouflage-400 w-44 h-12 font-afacad text-lg text-white">
                    Verify Status
                </Button>
            </div>

            <div className="flex flex-row gap-x-10 mt-5 font-afacad text-neutral-500">
                <div className="space-y-3">
                    <h1 className="flex justify-between gap-x-7">
                        <span>Order Number:</span>
                        <span>REF 10225</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Customer Name:</span>
                        <span>Art Montebon</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Contact Number:</span>
                        <span>09987654321</span>
                    </h1>
                </div>

                <div className="border border-r-0"></div>

                <div className="space-y-3">
                    <h1 className="flex justify-between gap-x-7">
                        <span>Obtainment:</span>
                        <span>Shipped</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Location:</span>
                        <span>03 Red Stone, Calinan</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Date of Booking:</span>
                        <span>December 26, 2024</span>
                    </h1>
                </div>
            </div>

            <div className="mt-10">
                <div className="font-afacad_medium text-2xl">Product Details</div>

                <ProductDetailsItem />
            </div>


        </div>
    );
};

export default page;
