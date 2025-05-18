"use client";
import React from "react";
import { Bird, Menu, ShoppingBasket, X } from "lucide-react";
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
import Subtotal from "./Basketlist/Subtotal";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Adjust path if needed

const Navbar = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

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
            <Menu size={25} className="items-center hover:text-[#778768]" />
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

              <Link href="/about-us">
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
        <Link href="/about-us">
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

              {cartItems.length <= 0 ? (
                <div className="flex flex-col justify-center items-center text-center font-afacad w-full h-screen pb-40 ">
                  <Bird className="text-neutral-400" size={60} />
                  <h1 className="text-neutral-500 text-xl">
                    Basket is currently empty
                  </h1>
                  <h1 className="text-neutral-500 text-xs mb-5">
                    It is looking real empty at the moment, care to browse the
                    shops?
                  </h1>
                  <a href="/shop">
                    <Button className="bg-[#0F172A] text-white w-full rounded-full">
                      Browse Catalog
                    </Button>
                  </a>
                </div>
              ) : (
                <ScrollArea className="w-full h-[450px]">
                  {cartItems.map((item: any) => (
                    <OrderSideItem
                      id={item.id}
                      key={item.id}
                      name={item.name}
                      category={item.category}
                      quantity={item.quantity}
                      price={item.price * item.quantity}
                      image={item.image}
                    />
                  ))}
                </ScrollArea>
              )}
            </SheetHeader>

            <SheetFooter>
              {cartItems.length <= 0 ? (
                ""
              ) : (
                <Subtotal
                  amount={cartItems.reduce(
                    (total: number, item: any) =>
                      total + item.price * item.quantity,
                    0
                  )}
                />
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
