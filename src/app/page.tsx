import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            <div className="relative w-full">
                <img
                    src="landingimage2.png"
                    alt="landing_image"
                    className="w-full object-cover"
                />
                <div className="text-white absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-70">
                    <h1 className="text-3xl font-caveat font-light">
                        PARTY NEEDS AND SERVICES
                    </h1>
                    <h1 className="text-9xl font-caveat_semibold mt-5">
                        MIN-JEE
                    </h1>
                    <h1 className="text-white text-2xl font-sans font-thin px-96 mt-8">
                        Seamless rentals, tailored events—bringing your
                        celebration dreams to life with ease.
                    </h1>
                    <Button className="bg-[#D9D9D9] text-[#3F454E] w-52 h-12 rounded-full font-inder mt-16">Discover our Shop</Button>
                </div>
            </div>
        </div>
    );
};

export default page;
