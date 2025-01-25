import React from "react";
import { MdOutlineUploadFile } from "react-icons/md";

interface PaymentProcessProps {
    text: string,
    image: any,
    size: string,
    description: string,
    icon: any,
}

const PaymentProcess = ({text, image, size, description, icon}: PaymentProcessProps) => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-full h-48 rounded-lg p-7">
            <img src={image} alt="icon" className={size} />
            <h1 className="text-[#6B7280] font-intermedium">{text}</h1>
            <hr className="mt-3" />

            <div className="flex items-center p-5 gap-x-2">
                {/* <MdOutlineUploadFile color="#6B7280" size={35} /> */}
                {icon}
                <h1 className="text-[#6B7280] font-afacad">
                    {description}
                </h1>
            </div>
        </div>
    );
};

export default PaymentProcess;
