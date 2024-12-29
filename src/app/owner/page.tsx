import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    Contact,
    History,
    ShoppingCart,
    Tag,
    Users,
} from "lucide-react";
import React from "react";

const page = () => {
    return (
        <div className="bg-[#FFFBF5] flex">
            <div className="bg-white border border-[#DEE5EC] w-[303px] h-screen">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <img
                            src="leaflogo.svg"
                            alt="logo"
                            className="w-12 h-12"
                        />
                        <span className="text-[#6B7280] text-xl font-caveat ml-3">
                            MIN-JEE
                        </span>
                    </div>

                    <h1 className="text-[#4B5563] text-lg font-semibold">
                        Owner
                    </h1>
                    <h1 className="text-[#6B7280] text-sm mb-4">
                        Rita Dellatan
                    </h1>

                    <Button className="bg-[#778768] text-white text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 ">
                        <ShoppingCart />
                        <span className="pl-5">Orders</span>
                    </Button>
                    <Button className="bg-transparent text-[#778768] text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none ">
                        <Tag />
                        <span className="pl-5">Products</span>
                    </Button>
                    <Button className="bg-transparent text-[#778768] text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none ">
                        <Users />
                        <span className="pl-5">Customers</span>
                    </Button>
                    <Button className="bg-transparent text-[#778768] text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none ">
                        <Contact />
                        <span className="pl-5">Partners</span>
                    </Button>
                    <Button className="bg-transparent text-[#778768] text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none ">
                        <CalendarDays />
                        <span className="pl-5">Calendar</span>
                    </Button>
                    <Button className="bg-transparent text-[#778768] text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none ">
                        <History />
                        <span className="pl-5">History</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white border border-[#DEE5EC] text-[#778768] w-screen h-[76px] flex items-center px-6 text-2xl font-afacad">
                <span className="ml-8">Orders</span>
                
            </div>
        </div>
    );
};

export default page;
