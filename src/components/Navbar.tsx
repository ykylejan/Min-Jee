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
import OrderSideItem from "./Basketlist/OrderSideItem";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

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

                            <ScrollArea className="w-full h-[450px]">
                                <OrderSideItem />
                                <OrderSideItem />
                                <OrderSideItem />
                                <OrderSideItem />
                                <OrderSideItem />
                                <OrderSideItem />
                                <OrderSideItem />
                            </ScrollArea>

                        </SheetHeader>

                        <SheetFooter>
                            <div className="w-full h-[280px] font-afacad">
                                <hr />
                                <section className="mt-3 mb-10">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-2xl font-afacad_semibold">Subtotal</h1>
                                        <h1 className="text-xl font-afacad_semibold">PHP 17.00</h1>
                                    </div>
                                    <h1 className="text-xs text-neutral-500 pr-20">Deposit and an optional delivery fee will be calculated at checkout</h1>
                                </section>

                                <section className="space-y-3">
                                    <Button className="bg-[#0F172A]  w-full rounded-full">Checkout</Button>
                                    <h1 className="text-center text-xs text-neutral-500">or {" "}
                                        <span className="underline hover:text-black cursor-pointer">Continue Shopping</span>
                                    </h1>
                                </section>
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;
