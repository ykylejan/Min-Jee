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
            <hr className="my-3" />
            <div className="flex items-center">
                <IoIosCheckmark color="green" size={40} />
                <h1 className="text-2xl font-afacad_medium">Order Details</h1>
            </div>

            <div className="flex justify-between pl-10">
                <div className="font-afacad">
                    <h1 className="font-afacad_semibold">Shipping Address</h1>
                    <p>Art Montebon</p>
                    <p>Red Stone, Calinan</p>
                    <p>Davao City, 8000</p>
                </div>
                <h1 
                    onClick={handleEdit} 
                    className="text-[#6B7280] text-lg font-afacad underline hover:text-black cursor-pointer"
                >
                    Edit
                </h1>
            </div>
        </div>
    );
};

export default OrderDetailsSet;