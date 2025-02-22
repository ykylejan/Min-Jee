'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            <section className="text-center flex flex-col justify-center items-center h-screen">
                <FaExclamationTriangle className="text-[#FACC15]" size={70} />
                <h1 className="font-afacad_semibold text-5xl lg:text-6xl mt-3">
                    404 Not Found
                </h1>
                <h1 className="font-afacad text-xl">
                    This page does not exist
                </h1>
                <Button onClick={() => router.back()} className="bg-[#778768] font-inter mt-12 w-36">
                    Go back
                </Button>
            </section>
        </div>
    );
};

export default NotFound;
