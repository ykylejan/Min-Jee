import OrderDetailsSection from "@/components/OwnerPage/Order/OrderDetailsSection";
import PaymentDetailsItem from "@/components/OwnerPage/Order/PaymentDetailsItem";
import ProductDetailsItem from "@/components/OwnerPage/Order/ProductDetailsItem";
import StatusLabel from "@/components/StatusLabel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";

const page = () => {
    return (
        <div className="bg-white min-h-screen rounded-lg border border-neutral-200 px-12 py-8">
            <div className="flex justify-between">
                <div className="flex flex-row gap-x-6 items-center">
                    <h1 className="font-afacad_medium text-3xl">
                        Order Details:{" "}
                    </h1>
                    <StatusLabel label="Pending" />
                </div>
                <Link href={"/orders/order-item/edit-order"}>
                    <Button className="bg-camouflage-400 w-44 h-12 font-afacad text-white hover:bg-camouflage-400/80">
                        Edit Order
                    </Button>
                </Link>
            </div>

            <OrderDetailsSection />

            <div className="mt-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="font-afacad_medium text-2xl">
                        Product Details
                    </div>
                    <Link href={"/orders/order-item/add-product"}>
                        <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad">
                            Add Product
                        </Button>
                    </Link>
                </div>

                <ProductDetailsItem />
                <ProductDetailsItem />
            </div>

            <div className="mt-10">
                <div className="font-afacad_medium text-2xl">
                    Payment Details
                </div>

                <PaymentDetailsItem />
            </div>

            <div className="mt-10">
                <div className="font-afacad_medium text-2xl">
                    Customer Notes
                </div>

                <Textarea
                    placeholder="Customer's notes seems empty..."
                    className="min-h-32 mt-5"
                    value={
                        "Need three of your 8 seater buffet table, with blue table cloths"
                    }
                    readOnly={true}
                />
            </div>

            <Link href={"/orders/order-item/receipt"}>
                <Button className="bg-transparent border border-camouflage-400 text-camouflage-400 hover:bg-camouflage-400 hover:text-white mt-24 w-32">
                    View Receipt
                </Button>
            </Link>
        </div>
    );
};

export default page;
