"use client";

import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsDataSample } from "@/constants";
import { Search } from "lucide-react";
import { TbListSearch } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const page = () => {
    const [isTitle, setIsTitle] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedTab') || 'rentals';
        }
        return 'rentals';
    });

    useEffect(() => {
        localStorage.setItem('selectedTab', isTitle);
    }, [isTitle]);
    
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-40">
            <div className="text-[#778768] flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl font-caveat_semibold mt-5">
                    {isTitle.charAt(0).toUpperCase() + isTitle.slice(1).toLowerCase()}
                </h1>
            </div>

            <div className="px-24 pt-8 pb-4">
                <Tabs
                    defaultValue={isTitle}
                    onValueChange={(value) => {
                        setIsTitle(value)
                    }}
                >
                    <div className="flex justify-center pb-8">
                        <TabsList>
                            <TabsTrigger
                                value="rentals"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 /recedata-[state=active]:font-afacad_semibold"
                            >
                                Rentals
                            </TabsTrigger>
                            <TabsTrigger
                                value="services"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 /recedata-[state=active]:font-afacad_semibold"
                            >
                                Services
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 /recedata-[state=active]:font-afacad_semibold"
                            >
                                Events
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex justify-center pb-10">
                        <div className="relative w-[530px]">
                            <Input
                                placeholder={`Search for ${isTitle.toLowerCase()}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white p-6 w-full pl-10"
                            />

                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {[isTitle].map((tabKey) => {
                        const filteredProducts = ProductsDataSample.filter(
                            (product) =>
                                product.category.toLowerCase() === tabKey &&
                                product.name
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                        );

                        return (
                            <TabsContent
                                key={tabKey}
                                value={tabKey}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
                            >
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Link key={product.id} href={`/shop/${product.id}`} onClick={() => setIsTitle(product.category.toLowerCase())}>
                                            <ProductItem
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                            />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col justify-center items-center text-center mt-10">
                                        <TbListSearch
                                            color="#BDC3C9"
                                            size={65}
                                        />
                                        <h1 className="text-neutral-500 text-2xl font-afacad">
                                            Product not found
                                        </h1>
                                    </div>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};

export default page;
