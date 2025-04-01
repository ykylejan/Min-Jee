"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    Contact,
    History,
    ShoppingCart,
    Tag,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "@/constants";

interface OwnerLayoutProps {
    children: ReactNode;
}

const navLinks = [
    {
        name: "Orders",
        href: "/orders",
        icon: <ShoppingCart />,
    },
    {
        name: "Products",
        href: "/products",
        icon: <Tag />,
    },
    {
        name: "Customers",
        href: "/customers",
        icon: <Users />,
    },
    {
        name: "Partners",
        href: "/partners",
        icon: <Contact />,
    },
    {
        name: "Calendar",
        href: "/calendar",
        icon: <CalendarDays />,
    },
    {
        name: "History",
        href: "/history",
        icon: <History />,
    },
];

const activeButton =
    "bg-[#778768] hover:bg-[#778768]/80 text-white text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3";
const inactiveButton =
    "bg-transparent hover:bg-[#778768] text-[#778768] hover:text-white text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none";

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
    const pathname = usePathname();

    return (
        <div className="bg-[#FFFBF5] flex">
            {/* sidebar */}
            <div className="bg-white border border-[#DEE5EC] w-[303px] h-screen ">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <img
                            src={icons.logoleaf.src}
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

                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link href={link.href} key={link.name}>
                                <Button
                                    className={
                                        isActive ? activeButton : inactiveButton
                                    }
                                >
                                    {link.icon}
                                    <span className="pl-5">{link.name}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* navbar */}
            <div className="w-screen">
                <div className="bg-white border border-[#DEE5EC] text-[#778768] h-[76px] flex items-center px-6 text-2xl font-afacad">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return isActive ? (
                            <span className="ml-8" key={link.name}>
                                {link.name}
                            </span>
                        ) : null;
                    })}
                </div>
                <div className="m-16">{children}</div>
            </div>
        </div>
    );
};

export default OwnerLayout;
