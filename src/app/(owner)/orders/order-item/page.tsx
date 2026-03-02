"use client";

import OrderDetailsSection from "@/components/OwnerPage/Order/OrderDetailsSection";
import PaymentDetailsItem from "@/components/OwnerPage/Order/PaymentDetailsItem";
import ProductDetailsItem from "@/components/OwnerPage/Order/ProductDetailsItem";
import { StatusBadge } from "@/components/OwnerPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useOrder } from "../../../../../contexts/OrderContext"; // Adjust path as needed
import Link from "next/link";
import React from "react";

const page = () => {
    const { selectedProducts } = useOrder();
    
    // Calculate total price
    const totalPrice = selectedProducts.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-row gap-x-4 items-center flex-wrap">
                            <h1 className="font-afacad_medium text-2xl sm:text-3xl">
                                Order Details
                            </h1>
                            <StatusBadge status="pending" size="lg" />
                        </div>
                        <Link href={"/orders/order-item/edit-order"}>
                            <Button className="bg-camouflage-400 w-full sm:w-44 h-11 font-afacad text-white hover:bg-camouflage-400/80">
                                Edit Order
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <OrderDetailsSection />

                    <div className="mt-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div className="font-afacad_medium text-xl sm:text-2xl">
                                Product Details
                            </div>
                            <Link href={"/orders/order-item/add-product"}>
                                <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad">
                                    Add Product
                                </Button>
                            </Link>
                        </div>

                        {selectedProducts.length > 0 ? (
                            <div className="space-y-4">
                                {selectedProducts.map(product => (
                                    <ProductDetailsItem 
                                        key={product.id} 
                                        product={product} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                No products added yet. Click "Add Product" to add some.
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <div className="font-afacad_medium text-xl sm:text-2xl">
                            Payment Details
                        </div>

                        <PaymentDetailsItem />
                        
                        {/* Show total price from selected products */}
                        {selectedProducts.length > 0 && (
                            <div className="flex justify-end mt-4 pr-5">
                                <div className="font-afacad_medium text-lg sm:text-xl">
                                    Total: PHP {totalPrice.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <div className="font-afacad_medium text-xl sm:text-2xl mb-4">
                            Customer Notes
                        </div>

                        <Textarea
                            placeholder="Customer's notes seems empty..."
                            className="min-h-32 bg-gray-50"
                            value={
                                "Need three of your 8 seater buffet table, with blue table cloths"
                            }
                            readOnly={true}
                        />
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <Link href={"/orders/order-item/receipt"}>
                            <Button className="bg-transparent border border-camouflage-400 text-camouflage-400 hover:bg-camouflage-400 hover:text-white w-full sm:w-32">
                                View Receipt
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default page;