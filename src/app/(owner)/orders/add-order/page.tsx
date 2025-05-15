"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StatusLabel from "@/components/StatusLabel";

interface ProductCardProps {
    category?: string;
    action?: string;
}

const ProductCard = ({ category, action }: ProductCardProps) => {
    const router = useRouter();
    const [isVenue, setIsVenue] = useState(false);
    const [isKaraoke, setIsKaraoke] = useState(false);

    return (
        <div className="flex justify-center">
            <div className="bg-white w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
                <div className="flex gap-x-3 items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    >
                        <MoveLeft
                            width={20}
                            height={20}
                            className="text-neutral-600"
                        />
                    </button>
                    <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
                        Create a New Order
                    </h1>
                </div>

                <div className="mt-12">
                    <div>
                        <h1 className="font-afacad text-neutral-500">
                            Customer Information
                        </h1>
                        <hr />
                    </div>

                    <div className="pt-6 pb-10 space-y-6">
                        <div className="flex justify-between w-full">
                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Customer Name
                                </h1>
                                <Input
                                    placeholder={"Set the product's quantity"}
                                    className="bg-neutral-100/50 w-80 h-12 px-5"
                                />
                            </div>

                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Contact Number
                                </h1>
                                <Input
                                    placeholder={
                                        "Set the customer's contact number"
                                    }
                                    className="bg-neutral-100/50 w-80 h-12 px-5"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-sm text-neutral-500">
                                Location
                            </h1>
                            <Input
                                placeholder={"Set the customer's place address"}
                                className="bg-neutral-100/50 w-full h-12 px-5"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div>
                        <h1 className="font-afacad text-neutral-500">
                            Booking Schedule
                        </h1>
                        <hr />
                    </div>

                    <div className="pt-6 pb-10 space-y-6">
                        <div>
                            <h1 className="text-sm text-neutral-500">
                                Obtainment Method
                            </h1>
                            <Select>
                                <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                                    <SelectValue placeholder="Select Obtainment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="apple">
                                            Shipped
                                        </SelectItem>
                                        <SelectItem value="banana">
                                            Pick-Up
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-between w-full">
                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Date of Booking
                                </h1>
                                <Input
                                    placeholder={"Set the product's quantity"}
                                    className="bg-neutral-100/50 w-80 h-12 px-5"
                                    type="date"
                                />
                            </div>

                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Date of Return
                                </h1>
                                <Input
                                    placeholder={"Set the product's quantity"}
                                    className="bg-neutral-100/50 w-80 h-12 px-5"
                                    type="date"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div>
                        <h1 className="font-afacad text-neutral-500">
                            Delivery Option
                        </h1>
                        <hr />
                    </div>

                    <div className="pt-6 pb-10 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-x-12">
                                <h1 className="text-sm text-neutral-500">
                                    Delivery Fee
                                </h1>
                                <div className="relative w-80">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                                        ₱
                                    </span>
                                    <Input
                                        placeholder={"Set the delivery fee"}
                                        className="bg-neutral-100/50 w-full h-12 pl-10 pr-5"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-x-12">
                                <h1 className="text-sm text-neutral-500">
                                    Deposit Fee
                                </h1>
                                <div className="relative w-80">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                                        ₱
                                    </span>
                                    <Input
                                        placeholder={
                                            "Set the customer's deposit"
                                        }
                                        className="bg-neutral-100/50 w-full h-12 pl-10 pr-5"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div>
                        <h1 className="font-afacad text-neutral-500">
                            Order Status
                        </h1>
                        <hr />
                    </div>

                    <div className="pt-6 pb-10 space-y-6">
                        <div>
                            <h1 className="text-sm text-neutral-500">
                                Select Status for this order item
                            </h1>
                            <Select>
                                <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                                    <SelectValue placeholder="Select Obtainment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="font-afacad">
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="verified">
                                            Verified
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-10 flex justify-end">
                    <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6">
                        Finalize Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
