import React from "react";
import { IoIosCheckmark } from "react-icons/io";

interface OrderDetailsSetProps {
    onOrderableChange: (isOrderable: boolean) => void;
}

const OrderDetailsSet = ({ onOrderableChange }: OrderDetailsSetProps) => {
    const handleEdit = () => {
        // When Edit is clicked, return to the order details form
        onOrderableChange(false);
    };

    return (
        <div>
            <hr className="my-2 sm:my-3" />
            <div className="flex items-center">
                <IoIosCheckmark color="green" className="w-8 h-8 sm:w-10 sm:h-10" />
                <h1 className="text-lg sm:text-xl md:text-2xl font-afacad_medium">Order Details</h1>
            </div>

            <div className="flex justify-between pl-4 sm:pl-6 md:pl-10">
                <div className="font-afacad text-sm sm:text-base">
                    <h1 className="font-afacad_semibold">Shipping Address</h1>
                    <p>Art Montebon</p>
                    <p>Red Stone, Calinan</p>
                    <p>Davao City, 8000</p>
                </div>
                <h1 
                    onClick={handleEdit} 
                    className="text-[#6B7280] text-sm sm:text-base md:text-lg font-afacad underline hover:text-black cursor-pointer"
                >
                    Edit
                </h1>
            </div>
        </div>
    );
};

export default OrderDetailsSet;