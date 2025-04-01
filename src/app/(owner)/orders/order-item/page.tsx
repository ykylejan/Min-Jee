
import OrderDetailsSection from "@/components/OwnerPage/OrderDetailsSection";
import OrderStatus from "@/components/OwnerPage/OrderStatus";
import PaymentDetailsItem from "@/components/OwnerPage/PaymentDetailsItem";
import ProductDetailsItem from "@/components/OwnerPage/ProductDetailsItem";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
    return (
        <div className="bg-white min-h-screen rounded-lg border border-neutral-200 px-12 py-8">
            <div className="flex justify-between">
                <div className="flex flex-row gap-x-4">
                    <h1 className="font-afacad_medium text-2xl">Order Details: </h1>
                    {/* other statuses wip */}
                    <OrderStatus />
                </div>

                <Button className="bg-camouflage-400 w-44 h-12 font-afacad text-lg text-white">
                    Verify Status
                </Button>
            </div>

            <OrderDetailsSection />

            <div className="mt-10">
                <div className="font-afacad_medium text-2xl">Product Details</div>

                <ProductDetailsItem />
                <ProductDetailsItem />
            </div>


            <div className="mt-10">
                <div className="font-afacad_medium text-2xl">Payment Details</div>

                <PaymentDetailsItem/>
            </div>


        </div>
    );
};

export default page;
