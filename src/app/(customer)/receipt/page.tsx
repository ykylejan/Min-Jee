import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Receipt from "@/components/ReceiptCard/Receipt";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Navbar />

            <Receipt />

            <Footer />
        </div>
    );
};

export default page;
