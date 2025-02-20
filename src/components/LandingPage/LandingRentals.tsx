import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import ProductItem from "../ProductItem";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ProductsDataSample } from "@/constants";

const LandingRentals = () => {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const scrollLeft = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <section className="mb-24 relative">
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

            <button
                className="absolute left-1 top-[48%] transform -translate-y-[50%] bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
                onClick={scrollLeft}
                aria-label="Scroll Left"
            >
                <ArrowLeft size={20} color="black" />
            </button>

            <ScrollArea ref={viewportRef}>
                <div className="flex space-x-5 lg:space-x-10 mb-8">

                    {ProductsDataSample.map((sample) => (
                        <ProductItem
                            key={sample.id}
                            image={sample.image}
                            name={sample.name}
                            price={`PHP ${sample.price}`}
                        />
                    ))}


                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>


            <button
                className="absolute right-1 top-[48%] transform -translate-y-[50%] bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
                onClick={scrollRight}
                aria-label="Scroll Right"
            >
                <ArrowRight size={20} color="black" />
            </button>
        </section>
    );
};

export default LandingRentals;
