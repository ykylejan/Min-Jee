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
        <div className="bg-white border border-[#D2D6DA] w-full h-auto min-h-[160px] sm:min-h-[180px] md:h-48 rounded-lg p-4 sm:p-5 md:p-7">
            <img src={image} alt="icon" className="h-7 sm:h-8 md:h-9 mb-1"/>
            <h1 className="text-[#6B7280] font-intermedium text-sm sm:text-base">{text}</h1>
            <hr className="mt-2 sm:mt-3" />

            <div className={`flex items-center font-afacad ${isGcash == "GCash" && "hover:font-afacad_semibold cursor-pointer"} p-3 sm:p-4 md:p-5 gap-x-2`}>
                {icon}
                <h1 className="text-[#6B7280] text-sm sm:text-base">{description}</h1>
            </div>
        </div>
    );
};

export default PaymentProcess;
