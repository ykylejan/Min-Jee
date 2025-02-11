import React from "react";
import { Menu, ShoppingBasket, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
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

                            <Link href="/account">
                                <span className="hover:underline text-[#778768] cursor-pointer block">
                                    Account
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
                <Link href="/account">
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
                            <SheetTitle>My Basket</SheetTitle>

                            <div className="flex">
                                <img
                                    src="/images/halfsizedFoodWarmer.png"
                                    alt="image"
                                    className="w-20 h-20 rounded-lg"
                                />
                                <div className="px-3 w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="text-base">
                                            <h1 className="font-afacad_semibold">
                                                Half Sized Food Warmer
                                            </h1>
                                            <h1 className="font-afacad text-neutral-400">
                                                Rental
                                            </h1>
                                        </div>
                                        <h1 className="font-afacad underline text-sm text-neutral-400 hover:text-black cursor-pointer">
                                            Remove
                                        </h1>
                                    </div>

                                    <div className="flex justify-between font-afacad text-base mt-3 ">
                                        <h1 className="text-neutral-400">
                                            Qty 1
                                        </h1>
                                        <h1 className="text-black">PHP 7.00</h1>
                                    </div>
                                </div>
                            </div>
                        </SheetHeader>
                        <SheetFooter>
                            <div className="bg-blue-300 w-full flex items-end">
                                <h1 className="text-9xl">rwar</h1>
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;
