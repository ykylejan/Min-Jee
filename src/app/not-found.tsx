import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
            <section className="text-center flex flex-col justify-center items-center pt-36 pb-48">
                <FaExclamationTriangle className="text-[#FACC15]" size={70} />
                <h1 className="font-afacadsemibold text-6xl mt-3">
                    404 Not Found
                </h1>
                <h1 className="font-afacad text-xl">
                    This page does not exist
                </h1>
                <Link href="/">
                    <Button className="bg-[#778768] font-inter mt-12 w-36">
                        Go back
                    </Button>
                </Link>
            </section>
        </div>
    );
};

export default NotFound;
