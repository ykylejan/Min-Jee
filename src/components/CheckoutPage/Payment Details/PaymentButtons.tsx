import React from "react";

interface PaymentButtonProps {
    text: string,
    image: any,
    size: string,
}

const PaymentButtons = ({ text, image, size }: PaymentButtonProps) => {
    return (
        <div className="bg-white border border-[#D2D6DA] font-afacad hover:border-2 hover:font-afacad_semibold cursor-pointer w-60 h-16 rounded-lg p-3">
            <img src={image} alt="payment_icon" className={size} />
            <h1 className="text-[#6B7280]">{text}</h1>
        </div>
    );
};

export default PaymentButtons;
