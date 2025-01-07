import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Navbar />
            <div className="flex justify-center pb-40">
                <div className="bg-white border border-[##D2D6DA] w-[750px] h-[1200px] rounded-lg px-24 py-20">
                    <h1 className="text-[#6B7280] font-afacad_bold">Order Successful</h1>
                    <h1 className="font-poppins_extrabold text-5xl py-3">Thanks for booking</h1>
                    <h1 className="text-[#6B7280] font-afacad pb-8">
                        We appreciate your order, we are currently processing
                        it. Hang on tight and we’ll send you confirmation soon!
                    </h1>
                    <hr/>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default page;
