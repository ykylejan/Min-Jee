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
import { RiUploadCloudFill } from "react-icons/ri";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
            <div className="bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
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
                        Create Order
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
                                {/* <Input
                                placeholder="Enter the product name"
                                className="bg-neutral-100/50 min-w-80 h-12 px-5"
                            /> */}
                                <Select>
                                    <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
                                        <SelectValue placeholder="Select from the customer list" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">
                                                Kyle Dellatan
                                            </SelectItem>
                                            <SelectItem value="banana">
                                                Art Montebon
                                            </SelectItem>
                                            <SelectItem value="blueberry">
                                                Leonard Orion
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Intended Name
                                </h1>
                                <Input
                                    placeholder={"Set the product's quantity"}
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
                        <div className="flex justify-between w-full">
                            <div>
                                <h1 className="text-sm text-neutral-500">
                                    Pricing
                                </h1>
                                <Input
                                    placeholder="Set the price"
                                    className="bg-neutral-100/50 w-80 h-12 px-5"
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
                        <div>
                            <h1 className="text-sm text-neutral-500">
                                Description
                            </h1>
                            <Textarea
                                placeholder={
                                    "Write the product's description here.."
                                }
                                className="bg-neutral-100/50 w-full h-28 px-5 py-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-10 flex justify-end">
                    <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6">
                        Create Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
