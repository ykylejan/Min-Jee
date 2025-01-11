import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductItem from "./ProductItem";

const LandingRentals = () => {
    return (
        <section className="mb-24">
            <h1 className="flex justify-between mb-3">
                <span className="text-3xl font-afacad_semibold">
                    Our Rentals
                </span>
                <Link href="/shop">
                    <span className="text-xl font-afacad_medium flex items-center gap-x-2 hover:text-[#778768] cursor-pointer">
                        View all <ArrowRight size={20} />
                    </span>
                </Link>
            </h1>
            <ScrollArea>
                <div className="flex space-x-5 lg:space-x-10 mb-8">
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
};

export default LandingRentals;
