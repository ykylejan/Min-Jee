import React from "react";

interface PaymentButtonProps {
    text: string;
    image: any;
    imageActive: any,
    isActive: boolean;
}

const PaymentButtons = ({ text, image, imageActive, isActive }: PaymentButtonProps) => {
    return (
        <div
            className={`bg-white ${
                isActive
                    ? "border-2 border-[#2196F3] shadow-md"
                    : "border border-[#D2D6DA]"
            } font-afacad hover:shadow-md hover:font-afacad_semibold cursor-pointer w-full sm:w-48 md:w-60 h-14 sm:h-16 rounded-lg p-2 sm:p-3`}
        >
            <img src={isActive ? imageActive : image} alt="payment_icon" className="h-4 sm:h-5" />
            <h1
                className={`text-sm sm:text-base ${
                    isActive
                        ? "text-[#2196F3] font-afacad_semibold"
                        : "text-[#6B7280]"
                }`}
            >
                {text}
            </h1>
        </div>
    );
};

export default PaymentButtons;
