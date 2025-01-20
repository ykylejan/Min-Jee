"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import React, { useState } from "react";

const page = () => {
    const [activeTab, setActiveTab] = useState("rentals");
    const tabTitles: Record<string, string> = {
        rentals: "RENTALS",
        services: "SERVICES",
        events: "EVENTS",
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Navbar />
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
                                className="text-2xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
                            >
                                Rentals
                            </TabsTrigger>
                            <TabsTrigger
                                value="services"
                                className="text-2xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
                            >
                                Services
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="text-2xl font-afacad data-[state=active]:text-white data-[state=active]:bg-[#778768] /recedata-[state=active]:font-afacad_semibold"
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
                                className="p-6 w-full pl-10"
                            />
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* image = "/placeholderProduct.png",
                        name = "Half-Sized Food Warmer",
                        price = "PHP 8.00 - per day", */}

                    <TabsContent value="rentals" className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10 max-h-[500px]">
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                        </div>
                    </TabsContent>

                    <TabsContent value="services">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10 max-h-[500px]">
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                        </div>
                    </TabsContent>
                    <TabsContent value="events">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10 max-h-[500px]">
                            <ProductItem image="/placeholderProduct.png" name="Half-Sized Food Warmer" price="PHP 8.00" />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="py-96"></div>
            <Footer />
        </div>
    );
};

export default page;
