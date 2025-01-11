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
        <div className="bg-[#334628] opacity-90 h-[70px] text-white flex items-center justify-between fixed top-0 left-0 w-full z-50 px-10 lg:px-24">
            <Link href="/">
                <span className="text-3xl lg:text-3xl font-caveat_brush cursor-pointer">
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
                            <SheetTitle className="text-[#334628] opacity-75 text-xl font-intersemibold ml-3">
                                NAVIGATION
                            </SheetTitle>
                        </SheetHeader>
                        <SheetDescription className="font-inder text-lg space-y-3 ml-5">
                            <Link href="/shop">
                                <span className="mt-5 hover:underline text-[#778768] cursor-pointer block">
                                    Shop
                                </span>
                            </Link>

                            <Link href="/*">
                                <span className="hover:underline text-[#778768] cursor-pointer block">
                                    About Us
                                </span>
                            </Link>

                            <Link href="/*">
                                <span className="hover:underline text-[#778768] cursor-pointer block">
                                    Account
                                </span>
                            </Link>

                            <Link href="/*">
                                <span className="hover:underline text-[#778768] cursor-pointer flex items-center gap-x-2">
                                    Basket <ShoppingBasket />
                                </span>
                            </Link>
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="lg:flex space-x-7 font-inder hidden">
                <Link href="/shop">
                    <span className="text-lg hover:text-[#778768] cursor-pointer">
                        Shop
                    </span>
                </Link>
                <Link href="/*">
                    <span className="text-lg hover:text-[#778768] cursor-pointer">
                        About Us
                    </span>
                </Link>
                <Link href="/*">
                    <span className="text-lg hover:text-[#778768] cursor-pointer">
                        Account
                    </span>
                </Link>

                <Sheet>
                    <SheetTrigger>
                        <ShoppingBasket
                            size={25}
                            strokeWidth={1.5}
                            className="hover:text-[#778768] cursor-pointer"
                        />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;
