import React from "react";
import { Button } from "./ui/button";

const LandingGrid = () => {
    return (
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
    );
};

export default LandingGrid;
