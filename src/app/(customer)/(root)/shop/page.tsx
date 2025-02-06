"use client";

import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsData } from "@/constants";
import { Search } from "lucide-react";
import React, { useState } from "react";

const page = () => {
    const [activeTab, setActiveTab] = useState("rentals");
    const tabTitles: Record<string, string> = {
        rentals: "RENTALS",
        services: "SERVICES",
        events: "EVENTS",
    };
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <div className="text-[#778768] flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl font-caveat_semibold mt-5">
                    {tabTitles[activeTab]}
                </h1>
            </div>

            <div className="px-24 pt-8 pb-4">
                <Tabs
                    defaultValue="rentals"
                    onValueChange={(value) => setActiveTab(value)}
                >
                    <div className="flex justify-center pb-8">
                        <TabsList className="">
                            <TabsTrigger
                                value="rentals"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
                            >
                                Rentals
                            </TabsTrigger>
                            <TabsTrigger
                                value="services"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
                            >
                                Services
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
                            >
                                Events
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex justify-center pb-10">
                        <div className="relative w-[530px]">
                            <Input
                                placeholder={`Search for ${tabTitles[
                                    activeTab
                                ].toLowerCase()}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-6 w-full pl-10"
                            />

                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {Object.keys(tabTitles).map((tabKey) => (
                        <TabsContent
                            key={tabKey}
                            value={tabKey}
                            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                        >
                            {ProductsData.filter(
                                (product) =>
                                    product.category.toLowerCase() === tabKey &&
                                    product.name
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                            ).map((product) => (
                                <div key={product.id}>
                                    <ProductItem
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                    />
                                </div>
                            ))}
                        </TabsContent>
                    ))}

                    {/* {ProductsData.map((product) =>
                        product.category === "Rentals" ? (
                            <TabsContent
                                value={product.category}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                            >
                                <div key={product.id}>
                                    <ProductItem
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                    />
                                </div>
                            </TabsContent>
                        ) : product.category === "Services" ? (
                            <TabsContent
                                value={product.category}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                            >
                                <div key={product.id}>
                                    <ProductItem
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                    />
                                </div>
                            </TabsContent>
                        ) : product.category === "Events" ? (
                            <TabsContent
                                value={product.category}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                            >
                                <div key={product.id}>
                                    <ProductItem
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                    />
                                </div>
                            </TabsContent>
                        ) : (
                            <div className=""></div>
                        )
                    )} */}

                    {/* <TabsContent
                        value="services"
                        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                    >
                        {ProductsData.map((product) => (
                            <div key={product.id}>
                                <ProductItem
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                />
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent
                        value="events"
                        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                    >
                        {ProductsData.map((product) => (
                            <div key={product.id}>
                                <ProductItem
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                />
                            </div>
                        ))}
                    </TabsContent> */}
                </Tabs>
            </div>

            <div className="mb-40" />
        </div>
    );
};

export default page;
