import React from "react";

interface PaymentButtonProps {
    text: string;
    image: any;
    isActive: boolean;
}

const PaymentButtons = ({ text, image, isActive }: PaymentButtonProps) => {
    return (
        <div
            className={`bg-white ${
                isActive
                    ? "border-2 border-[#2196F3]"
                    : "border border-[#D2D6DA]"
            } font-afacad hover:border-2 hover:font-afacad_semibold cursor-pointer w-60 h-16 rounded-lg p-3`}
        >
            <img src={image} alt="payment_icon" className="h-5" />
            <h1
                className={`${
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
