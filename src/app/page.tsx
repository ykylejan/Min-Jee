import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductItem from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GiPaperWindmill } from "react-icons/gi";
import { MdChair } from "react-icons/md";
import { FaCalendarDay } from "react-icons/fa";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            <Navbar />
            <div className="relative w-full">
                <img
                    src="landingimage2.png"
                    alt="landing_image"
                    className="w-full object-cover"
                />
                <div className="text-white absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-70">
                    <h1 className="text-2xl font-caveat font-light">
                        PARTY NEEDS AND SERVICES
                    </h1>
                    <h1 className="text-8xl font-caveat_semibold mt-5">
                        MIN-JEE
                    </h1>
                    <h1 className="text-white text-2xl font-sans font-thin px-96 mt-8">
                        Seamless rentals, tailored events—bringing your
                        celebration dreams to life with ease.
                    </h1>
                    <Link href="/shop">
                        <Button className="bg-[#D9D9D9] text-[#3F454E] w-52 h-12 rounded-full font-inder mt-16">
                            Discover our Shop
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="px-24 py-16">
                <section className="mb-24">
                    <h1 className="text-3xl font-afacad_semibold">
                        What We Provide
                    </h1>
                    <hr className="mb-5" />

                    <div className="grid grid-cols-3 grid-rows-1 gap-8">
                        <div className="space-y-2">
                            <MdChair size={60} className="text-[#778768]" />
                            <h1 className="text-xl font-afacad_medium">
                                Event Essentials
                            </h1>
                            <p className="font-afacad">
                                From tables and chairs to elegant dinnerware, we
                                offer a wide range of rental items to suit any
                                event style.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <GiPaperWindmill
                                size={60}
                                className="text-[#778768]"
                            />
                            <h1 className="text-xl font-afacad_medium">
                                Decor and Ambiance
                            </h1>
                            <p className="font-afacad">
                                Transform your venue with our curated collection
                                of decor, lighting, and custom backdrops.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <FaCalendarDay
                                size={60}
                                className="text-[#778768]"
                            />
                            <h1 className="text-xl font-afacad_medium">
                                Tailored Event Planning
                            </h1>
                            <p className="font-afacad">
                                Need assistance bringing your vision to life?
                                Our experts are here to coordinate every detail.
                            </p>
                        </div>
                    </div>
                </section>

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
                        <div className="flex space-x-10 mb-8">
                            <ProductItem />
                            <ProductItem />
                            <ProductItem />
                            <ProductItem />
                            <ProductItem />
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </section>

                <section className="mb-24">
                    <div className="grid grid-cols-4 grid-rows-2 gap-4">
                        <div>
                            <div className="bg-[#778768] opacity-80 w-full h-full p-3"></div>
                        </div>
                        <div className="col-start-1 row-start-2">
                            <img
                                src="/landingPackage1.png"
                                alt="package_image"
                                className="w-full h-full opacity-80"
                            />
                        </div>

                        <div className="col-span-2 row-span-2 col-start-2 row-start-1">
                            <div className="bg-[#334628] opacity-90 text-white w-full h-full flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <h1 className="text-8xl font-caveat_semibold">
                                        MIN-JEE
                                    </h1>
                                    <h1 className="text-xl font-caveat pb-5">
                                        PARTY NEEDS AND SERVICES
                                    </h1>
                                    <Button className="bg-[#D9D9D9] text-[#3F454E] w-56 h-12 rounded-full font-inder">
                                        Discover our Packages
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="col-start-4 row-start-1">
                            <img
                                src="/landingPackage2.png"
                                alt="package_image"
                                className="w-full h-full opacity-80"
                            />
                        </div>
                        <div className="col-start-4 row-start-2">
                            <div className="bg-[#778768] opacity-80 w-full h-full p-3"></div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default page;
