import { ShoppingBasket } from "lucide-react";
import React from "react";

const Navbar = () => {
    return (
        <div className="bg-[#334628] opacity-90 h-[112px] text-white flex items-center justify-between px-24 ">
            <span className="text-4xl font-caveat cursor-pointer">MIN-JEE</span>

            <div className="flex space-x-7 font-inder">
                <span className="text-2xl hover:text-[#778768] cursor-pointer">Shop</span>
                <span className="text-2xl hover:text-[#778768] cursor-pointer">About Us</span>
                <span className="text-2xl hover:text-[#778768] cursor-pointer">Account</span>
                <ShoppingBasket size={30} className="hover:text-[#778768] cursor-pointer"/>
            </div>
        </div>
    );
};

export default Navbar;
