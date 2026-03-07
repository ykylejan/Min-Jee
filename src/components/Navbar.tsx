"use client";
import React, { useState } from "react";
import { Bird, Menu, ShoppingBasket, ArrowLeft } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"nav" | "basket">("nav");

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    // Reset to nav view after sheet closes
    setTimeout(() => setMobileView("nav"), 300);
  };

  return (
    <div className="bg-[#334628] opacity-90 h-[70px] text-white flex items-center justify-between fixed top-0 left-0 w-full z-50 px-10 lg:px-24">
      <Link href="/">
        <span className="text-3xl lg:text-3xl font-caveat_brush cursor-pointer">
          MIN-JEE
        </span>
      </Link>

      <div className="lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={(open) => {
          setMobileMenuOpen(open);
          if (!open) setTimeout(() => setMobileView("nav"), 300);
        }}>
          <SheetTrigger>
            <Menu size={25} className="items-center hover:text-[#778768]" />
          </SheetTrigger>
          <SheetContent className="bg-[#FFFBF5] flex flex-col" hideCloseButton>
            {mobileView === "nav" ? (
              <>
                <SheetHeader>
                  <SheetTitle className="text-[#334628] opacity-75 text-xl font-intersemibold ml-3">
                    NAVIGATION
                  </SheetTitle>
                </SheetHeader>
                <SheetDescription className="font-inder text-lg space-y-3 ml-5 flex-1">
                  <Link href="/shop" onClick={handleMobileMenuClose}>
                    <span className="mt-5 hover:underline text-[#778768] cursor-pointer block">
                      Shop
                    </span>
                  </Link>

                  <Link href="/about-us" onClick={handleMobileMenuClose}>
                    <span className="hover:underline text-[#778768] cursor-pointer block">
                      About Us
                    </span>
                  </Link>

                  <Link href="/account" onClick={handleMobileMenuClose}>
                    <span className="hover:underline text-[#778768] cursor-pointer block">
                      Account
                    </span>
                  </Link>

                  <button
                    onClick={() => setMobileView("basket")}
                    className="flex items-center gap-2 hover:underline text-[#778768] cursor-pointer w-full text-left"
                  >
                    <ShoppingBasket size={20} strokeWidth={1.5} />
                    <span>My Basket</span>
                    {cartItems.length > 0 && (
                      <span className="bg-[#778768] text-white text-xs rounded-full px-2 py-0.5">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </SheetDescription>
              </>
            ) : (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <button
                      onClick={() => setMobileView("nav")}
                      className="text-[#778768] hover:text-[#334628]"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <span>My Basket</span>
                  </SheetTitle>
                </SheetHeader>

                {cartItems.length <= 0 ? (
                  <div className="flex flex-col justify-center items-center text-center font-afacad w-full flex-1 pb-10">
                    <Bird className="text-neutral-400" size={60} />
                    <h1 className="text-neutral-500 text-xl">
                      Basket is currently empty
                    </h1>
                    <h1 className="text-neutral-500 text-xs mb-5">
                      It is looking real empty at the moment, care to browse the
                      shops?
                    </h1>
                    <Link href="/shop" onClick={handleMobileMenuClose}>
                      <Button className="bg-[#0F172A] text-white w-full rounded-full">
                        Browse Catalog
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="w-full flex-1">
                      {cartItems.map((item) => (
                        <OrderSideItem
                          id={item.id}
                          key={item.id}
                          name={item.name}
                          category={item.category ?? ""}
                          quantity={item.quantity}
                          price={item.price * item.quantity}
                          image={item.image}
                        />
                      ))}
                    </ScrollArea>

                    <div className="mt-auto pt-4">
                      <Subtotal
                        amount={cartItems.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )}
                      />
                    </div>
                  </>
                )}
              </>
            )}
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
            <div className="relative inline-block">
              <ShoppingBasket
                size={25}
                strokeWidth={1.5}
                className="hover:text-[#778768] cursor-pointer"
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#778768] text-white text-[10px] leading-none rounded-full px-1.5 py-0.5 min-w-[16px] flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
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
                    <Link href="/shop">
                      <Button className="bg-[#0F172A] text-white w-full rounded-full">
                        Browse Catalog
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <ScrollArea className="w-full h-[450px]">
                    {cartItems.map((item) => (
                      <OrderSideItem
                        id={item.id}
                        key={item.id}
                        name={item.name}
                        category={item.category ?? ""}
                        quantity={item.quantity}
                        price={item.price * item.quantity}
                        image={item.image}
                      />
                    ))}
                  </ScrollArea>
                )}
            </SheetHeader>

            <SheetFooter>
              {cartItems.length > 0 && (
                <Subtotal
                  amount={cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
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
