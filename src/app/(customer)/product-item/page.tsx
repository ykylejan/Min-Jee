"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Slash } from "lucide-react";
import React from "react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            <Navbar />

            <div className="flex px-24 py-44 gap-x-28 justify-center">
                <img
                    src="/placeholderProduct2.png"
                    alt="product-item"
                    className="aspect-square h-[500px] rounded-md"
                />

                <div className="font-afacad">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="text-lg">
                                    <IoMdHome />
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components" className="text-lg">
                                    Shop
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-lg">Rentals</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center space-x-8 mt-3">
                        <div>
                            <h1 className="text-5xl font-afacad_semibold">
                                Half-Sized Food Warmer
                            </h1>
                            <h1 className="text-3xl font-afacad">PHP 7.00</h1>
                        </div>

                        <MdContentCopy
                            size={25}
                            className="text-[#6B7280] hover:text-black cursor-pointer"
                        />
                    </div>

                    <div className="mt-16">
                        <h1 className="text-[#6B7280] font-afacad_semibold text-md">
                            Quantity
                        </h1>
                        <QuantityInput
                            placeholder="Enter the amount to rent"
                            className="h-12 text-3xl"
                        />
                    </div>

                    <Button className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5">
                        Add to basket
                    </Button>

                    <div className="mt-16">
                        <h1 className="text-[#6B7280] font-afacad_semibold text-md">
                            Categories
                        </h1>
                        <Badge variant="outline" className="text-[#6B7280] font-afacad" >
                            Rental
                        </Badge>
                    </div>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default page;
