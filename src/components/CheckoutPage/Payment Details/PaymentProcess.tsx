import React from "react";

interface PaymentProcessProps {
    text: string;
    image: any;
    description: string;
    icon: any;
    isGcash: string;
}

const PaymentProcess = ({
    text,
    image,
    description,
    icon,
    isGcash,
}: PaymentProcessProps) => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-full h-48 rounded-lg p-7">
            <img src={image} alt="icon" className="h-9 mb-1"/>
            <h1 className="text-[#6B7280] font-intermedium">{text}</h1>
            <hr className="mt-3" />

            <div className={`flex items-center font-afacad ${isGcash == "GCash" && "hover:font-afacad_semibold cursor-pointer"} p-5 gap-x-2`}>
                {icon}
                <h1 className="text-[#6B7280]">{description}</h1>
            </div>
        </div>
    );
};

export default PaymentProcess;
