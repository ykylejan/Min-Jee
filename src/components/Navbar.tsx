"use client";

import React, { useState } from "react";
import { Menu, ShoppingBasket, X } from "lucide-react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="bg-[#334628] opacity-90 h-[86px] text-white flex items-center justify-between px-14 fixed top-0 left-0 w-full z-50">
            <span className="text-3xl lg:text-4xl font-caveat cursor-pointer">MIN-JEE</span>

            <div className="lg:hidden" onClick={toggleMenu}>
                {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
            </div>

            <div className="lg:flex space-x-7 font-inder hidden">
                <span className="text-xl hover:text-[#778768] cursor-pointer">Shop</span>
                <span className="text-xl hover:text-[#778768] cursor-pointer">About Us</span>
                <span className="text-xl hover:text-[#778768] cursor-pointer">Account</span>
                <ShoppingBasket size={30} strokeWidth={1.5} className="hover:text-[#778768] cursor-pointer"/>
            </div>


            {isMenuOpen && (
                <div className="absolute top-[86px] left-0 w-full bg-[#334628] text-white flex flex-col items-center py-4 space-y-4 lg:hidden">
                    <span className="text-xl hover:text-[#778768] cursor-pointer">Shop</span>
                    <span className="text-xl hover:text-[#778768] cursor-pointer">About Us</span>
                    <span className="text-xl hover:text-[#778768] cursor-pointer">Account</span>
                    <ShoppingBasket size={30} strokeWidth={1.5} className="hover:text-[#778768] cursor-pointer"/>
                </div>
            )}
        </div>
    );
};

export default Navbar;
