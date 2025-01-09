import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BiSolidCheckShield } from "react-icons/bi";
import Link from "next/link";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[100px]">
            <Navbar />
            <div className="flex flex-col justify-center items-center pt-[120px] pb-[250px]">
                <BiSolidCheckShield className="text-[#778768]" size={90} />
                <h1 className="text-3xl font-intersemibold mt-5">
                    Verified
                </h1>
                <h1 className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[300px] text-center mt-5">
                    Your account has been verified successfully!
                </h1>


                <Button className="bg-[#778768] w-full sm:w-[360px] h-[55px] font-bold mt-6 sm:mt-8">
                    PROCEED
                </Button>

            </div>

            <Footer />
        </div>
    );
};

export default page;
