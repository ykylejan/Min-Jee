"use client";

import AddOn from "@/components/AddOn";
import RentalsSection from "@/components/RentalsSection";
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
import { QuantityInput } from "@/components/ui/quantity-input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { images, ProductsDataSample } from "@/constants";
import { Slash } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

interface PageProps {
    params: Promise<{ id: string }>;
}

const page = ({ params }: PageProps) => {
    const { id } = React.use(params);
    
    const [isVenue, setIsVenue] = useState(false);
    const [isKaraoke, setIsKaraoke] = useState(false);

    return (
        <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
            <div className="">
                <div className="flex gap-x-12 justify-center">
                    {ProductsDataSample.filter(
                        (product) => product.id === id
                    ).map((product) => (
                        <Fragment key={product.id}>
                            <div className="">
                                <img
                                    src={product.image.src}
                                    alt="product-item"
                                    className="aspect-square h-[500px] rounded-md object-cover"
                                />
                            </div>

                            <div className="font-afacad w-1/2 px-10">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/"
                                                className="text-lg"
                                            >
                                                <IoMdHome />
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <Slash />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <Link href={"/shop"}>Shop</Link>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <Slash />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-lg">
                                                {product.category}{" "}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>

                                <div className="flex items-center space-x-8 mt-3 justify-between">
                                    <div>
                                        <h1 className="text-5xl font-afacad_semibold">
                                            {product.name}{" "}
                                        </h1>
                                        <h1 className="text-3xl font-afacad">
                                            PHP {product.price.toFixed(2)}{" "}
                                        </h1>
                                    </div>

                                    <MdContentCopy
                                        size={25}
                                        className="text-[#6B7280] hover:text-black cursor-pointer"
                                    />
                                </div>

                                <div className="mt-16">
                                    {product.category === "Rentals" && (
                                        <>
                                            <h1 className="font-afacad_semibold text-md">
                                                Quantity
                                            </h1>
                                            <QuantityInput
                                                placeholder="Enter the amount to rent"
                                                className="h-12 !text-base bg-white"
                                            />
                                        </>
                                    )}
                                    {product.category === "Services" && (
                                        <>
                                            <h1 className="font-afacad_semibold text-md">
                                                Pax
                                            </h1>
                                            <Select>
                                                <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                                                    <SelectValue placeholder="Select the pax amount" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="apple">
                                                            50 pax
                                                        </SelectItem>
                                                        <SelectItem value="banana">
                                                            75 pax
                                                        </SelectItem>
                                                        <SelectItem value="blueberry">
                                                            100 pax
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </>
                                    )}
                                    {product.category === "Events" && (
                                        <>
                                            <h1 className="font-afacad_semibold text-md">
                                                Pax
                                            </h1>
                                            <Select>
                                                <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                                                    <SelectValue placeholder="Select the pax amount" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="apple">
                                                            50 pax
                                                        </SelectItem>
                                                        <SelectItem value="banana">
                                                            75 pax
                                                        </SelectItem>
                                                        <SelectItem value="blueberry">
                                                            100 pax
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <h1 className="font-afacad_semibold text-md mt-6">
                                                Add-ons
                                            </h1>

                                            <div className="mb-14 flex gap-x-10">
                                                <AddOn
                                                    name="Venue"
                                                    price={5000}
                                                    onClick={() => setIsVenue(!isVenue)}
                                                    selected={isVenue}
                                                />
                                                <AddOn
                                                    name="Karaoke"
                                                    price={500}
                                                    onClick={() => setIsKaraoke(!isKaraoke)}
                                                    selected={isKaraoke}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Button className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5">
                                    Add to basket
                                </Button>

                                <div className="mt-16">
                                    <h1 className="font-afacad_semibold mb-2">
                                        Description
                                    </h1>
                                    <p className="text-stone-800">
                                        This half-sized food warmer is perfect
                                        for keeping your dishes warm and ready
                                        to serve at any event. Compact yet
                                        efficient, it is ideal for small
                                        gatherings or catering setups, ensuring
                                        your food stays at the perfect
                                        temperature.
                                    </p>
                                </div>

                                <div className="mt-16">
                                    <h1 className="font-afacad_semibold text-base">
                                        Categories
                                    </h1>
                                    <Badge
                                        variant="outline"
                                        className="text-[#6B7280] font-afacad"
                                    >
                                        {product.category}{" "}
                                    </Badge>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>

                <div className="px-12 pt-32">
                    <RentalsSection label="Related Items" />
                </div>
            </div>
        </div>
    );
};

export default page;
