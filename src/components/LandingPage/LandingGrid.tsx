import React from "react";
import { Button } from "../ui/button";
import { images } from "@/constants";

const LandingGrid = () => {
    return (
        <section className="mb-24">
            {/* Mobile Layout: Stacked */}
            <div className="flex flex-col gap-4 md:hidden">
                {/* Center CTA - Full width on mobile */}
                <div className="bg-[#334628] opacity-90 text-white w-full py-12 px-6 flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <h1 className="text-5xl font-caveat_semibold">
                            MIN-JEE
                        </h1>
                        <h1 className="text-lg font-caveat pb-3">
                            PARTY NEEDS AND SERVICES
                        </h1>
                        <Button className="bg-[#D9D9D9] text-[#3F454E] w-44 h-10 rounded-full font-inder text-sm">
                            Discover our Packages
                        </Button>
                    </div>
                </div>
                
                {/* Images in 2x2 grid on mobile */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-camouflage-400 opacity-80 aspect-square"></div>
                    <img
                        src={images.landingPackage2.src}
                        alt="package_image"
                        className="w-full aspect-square object-cover opacity-80"
                    />
                    <img
                        src={images.landingPackage1.src}
                        alt="package_image"
                        className="w-full aspect-square object-cover opacity-80"
                    />
                    <div className="bg-camouflage-400 opacity-80 aspect-square"></div>
                </div>
            </div>

            {/* Tablet Layout: 2 columns */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
                <div className="grid grid-rows-2 gap-4">
                    <div className="bg-camouflage-400 opacity-80 aspect-[4/3]"></div>
                    <img
                        src={images.landingPackage1.src}
                        alt="package_image"
                        className="w-full aspect-[4/3] object-cover opacity-80"
                    />
                </div>
                <div className="bg-[#334628] opacity-90 text-white flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                        <h1 className="text-6xl font-caveat_semibold">
                            MIN-JEE
                        </h1>
                        <h1 className="text-lg font-caveat pb-4">
                            PARTY NEEDS AND SERVICES
                        </h1>
                        <Button className="bg-[#D9D9D9] text-[#3F454E] w-48 h-10 rounded-full font-inder">
                            Discover our Packages
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Layout: Original 4-column grid */}
            <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-4">
                <div>
                    <div className="bg-camouflage-400 opacity-80 w-full h-full p-3 min-h-[150px]"></div>
                </div>
                <div className="col-start-1 row-start-2">
                    <img
                        src={images.landingPackage1.src}
                        alt="package_image"
                        className="w-full h-full object-cover opacity-80 min-h-[150px]"
                    />
                </div>

                <div className="col-span-2 row-span-2 col-start-2 row-start-1">
                    <div className="bg-[#334628] opacity-90 text-white w-full h-full flex items-center justify-center py-12">
                        <div className="text-center space-y-3">
                            <h1 className="text-6xl xl:text-8xl font-caveat_semibold">
                                MIN-JEE
                            </h1>
                            <h1 className="text-lg xl:text-xl font-caveat pb-5">
                                PARTY NEEDS AND SERVICES
                            </h1>
                            <Button className="bg-[#D9D9D9] text-[#3F454E] w-48 xl:w-56 h-10 xl:h-12 rounded-full font-inder">
                                Discover our Packages
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="col-start-4 row-start-1">
                    <img
                        src={images.landingPackage2.src}
                        alt="package_image"
                        className="w-full h-full object-cover opacity-80 min-h-[150px]"
                    />
                </div>
                <div className="col-start-4 row-start-2">
                    <div className="bg-camouflage-400 opacity-80 w-full h-full p-3 min-h-[150px]"></div>
                </div>
            </div>
        </section>
    );
};

export default LandingGrid;
