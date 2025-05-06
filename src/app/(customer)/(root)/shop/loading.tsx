"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const loading = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-40">
            <div className="text-[#778768] flex flex-col items-center justify-center text-center">
                <Skeleton className="h-16 w-64 rounded-lg mt-5 bg-camouflage-200" />
            </div>

            <div className="px-24 pt-8 pb-4">
                <div className="flex justify-center pb-8">
                    <Tabs>
                        <TabsList className="opacity-70 pointer-events-none">
                            <TabsTrigger
                                value="rentals"
                                className="text-xl font-afacad"
                            >
                                Rentals
                            </TabsTrigger>
                            <TabsTrigger
                                value="services"
                                className="text-xl font-afacad"
                            >
                                Services
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="text-xl font-afacad"
                            >
                                Events
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex justify-center pb-10">
                    <div className="relative w-[530px]">
                        <div className="bg-white/70 p-6 w-full pl-10 rounded-md border border-input">
                            <Skeleton className="h-5 w-3/4 bg-gray-200" />
                        </div>
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                        />
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10">
                    {Array(8)
                        .fill(0)
                        .map((_, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Skeleton className="h-56 w-full rounded-lg bg-camouflage-100" />

                                <Skeleton className="h-5 w-3/4 mt-2 bg-camouflage-100" />

                                <Skeleton className="h-4 w-1/2 mt-1 bg-camouflage-100" />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default loading;
