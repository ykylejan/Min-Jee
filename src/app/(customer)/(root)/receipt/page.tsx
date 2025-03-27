import Receipt from "@/components/ReceiptCard/Receipt";
import React from "react";


const page = () => {
    const data = {
        customerName: "Kyle Dellatan",
        subtotal: 5000,
        deliveryfee: 100,
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px]">
            <Receipt data={data} />
        </div>
    );
};

export default page;
