import React from "react";
import { Menu, ShoppingBasket, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";

const Navbar = () => {
    return (
        <div className="bg-[#334628] opacity-90 h-[86px] text-white flex items-center justify-between fixed top-0 left-0 w-full z-50 px-14 lg:px-28">
            <Link href="/">
                <span className="text-3xl lg:text-4xl font-caveat_brush cursor-pointer">
                    MIN-JEE
                </span>
            </Link>

            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger>
                        <Menu
                            size={25}
                            className="items-center hover:text-[#778768]"
                        />
                    </SheetTrigger>
                    <SheetContent className="bg-[#FFFBF5]">
                        <SheetHeader>
                            <SheetTitle className="text-[#778768] opacity-75 text-3xl font-caveat_brush ml-3">
                                MIN-JEE
                            </SheetTitle>
                        </SheetHeader>
                        <SheetDescription className="font-inder text-xl space-y-2 ml-3">
                            <span className="mt-3 hover:underline text-[#778768] cursor-pointer block">
                                Shop
                            </span>
                            <span className="hover:underline text-[#778768] cursor-pointer block">
                                About Us
                            </span>
                            <span className="hover:underline text-[#778768] cursor-pointer block">
                                Account
                            </span>
                            <span className="hover:underline text-[#778768] cursor-pointer flex items-center gap-x-2">
                                Basket <ShoppingBasket />
                            </span>
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="lg:flex space-x-7 font-inder hidden">
                <Link href="/shop">
                    <span className="text-xl hover:text-[#778768] cursor-pointer">
                        Shop
                    </span>
                </Link>
                <Link href="/*">
                    <span className="text-xl hover:text-[#778768] cursor-pointer">
                        About Us
                    </span>
                </Link>
                <Link href="/*">
                    <span className="text-xl hover:text-[#778768] cursor-pointer">
                        Account
                    </span>
                </Link>
                <ShoppingBasket
                    size={30}
                    strokeWidth={1.5}
                    className="hover:text-[#778768] cursor-pointer"
                />
            </div>
        </div>
    );
};

export default Navbar;
