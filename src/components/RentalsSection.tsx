import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_RENTALS } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface RentalsSectionProps {
    label?: string;
}

const RentalsSection = ({ label }: RentalsSectionProps) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const scrollLeft = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollBy({ left: -600, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollBy({ left: 600, behavior: "smooth" });
        }
    };

    // Rentals data from API
    const { data: rentalsData, loading, error } = useQuery(GET_ALL_RENTALS, {
        client: apolloClient,
        fetchPolicy: "network-only",
    });
    const [rentals, setRentals] = useState<any[]>([]);

    useEffect(() => {
        if (rentalsData?.getRentals) {
            setRentals(rentalsData.getRentals);
        }
    }, [rentalsData]);

    return (
        <div className="pb-24">
            <section className="relative">
                <h1 className="flex justify-between mb-3">
                    <span className="text-3xl font-afacad_semibold">
                        {label ? label : "Our Rentals"}
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
                        {loading ? (
                            <div className="text-neutral-400 py-6">Loading...</div>
                        ) : error ? (
                            <div className="text-red-400 py-6">Failed to load rentals.</div>
                        ) : rentals.length > 0 ? (
                            rentals.map((rental) => (
                                <Link key={rental.id} href={`/shop/rental/${rental.id}`}>
                                    <ProductItem
                                        image={rental.img?.toString() || "/placeholder-product.jpg"}
                                        name={rental.name}
                                        price={
                                            rental.price
                                                ? "PHP " + rental.price
                                                : "Price May Vary"
                                        }
                                    />
                                </Link>
                            ))
                        ) : (
                            <div className="text-neutral-400 py-6">No rentals found.</div>
                        )}
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
        </div>
    );
};

export default RentalsSection;