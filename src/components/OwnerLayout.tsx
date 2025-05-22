"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Contact,
  DoorOpen, 
  History, Utensils,
  ShoppingCart, Cake, HandPlatter,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { icons } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; // import your custom hook
import { logout } from "@/redux/slices/authSlice"; // import logout action

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
    name: "Bookings",
    href: "/bookings",
    icon: <CalendarDays />,
  },
 
  {
    name: "Rentals",
    href: "/rentals",
    icon: <Utensils />,
  },
  {
    name: "Services",
    href: "/services",
    icon: <HandPlatter />,
  },
  {
    name: "Events",
    href: "/events",
    icon: <Cake />,
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
  // {
  //   name: "Calendar",
  //   href: "/calendar",
  //   icon: <CalendarDays />,
  // },
  {
    name: "History",
    href: "/history",
    icon: <History />,
  },
];

const activeButton =
  "bg-camouflage-400 hover:bg-camouflage-400 text-white text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3";
const inactiveButton =
  "bg-transparent hover:bg-camouflage-400/70 text-camouflage-400 hover:text-white text-base font-medium font-inter w-[247px] h-[46px] rounded-md flex items-center justify-start mb-3 shadow-none";

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Create the onLogout function
  const onLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout()); // Clear auth state
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="bg-[#FFFBF5] min-h-screen flex">
      {/* sidebar - fixed */}
      <div className="bg-white border border-[#DEE5EC] w-[303px] fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <img src={icons.logoleaf.src} alt="logo" className="w-12 h-12" />
            <span className="text-[#6B7280] text-xl font-caveat ml-3">
              MIN-JEE
            </span>
          </div>

          <h1 className="text-[#4B5563] text-lg font-semibold">Owner</h1>
          <h1 className="text-[#6B7280] text-sm mb-4">Rita Dellatan</h1>

          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link href={link.href} key={link.name}>
                <Button className={isActive ? activeButton : inactiveButton}>
                  {link.icon}
                  <span className="pl-5">{link.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* main content - with margin to offset the fixed sidebar */}
      <div className="w-full ml-[303px] min-h-screen flex flex-col">
        {/* navbar - fixed at the top of the content area */}
        <div className="bg-white border border-[#DEE5EC] text-[#778768] h-[76px] flex justify-between items-center px-6 pr-12 text-2xl font-afacad sticky top-0 z-10">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return isActive ? (
              <span className="ml-8" key={link.name}>
                {link.name}
              </span>
            ) : null;
          })}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <DoorOpen />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={onLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* scrollable content */}
        <div className="m-16 flex-grow bg-[#FFFBF5]">{children}</div>
      </div>
    </div>
  );
};

export default OwnerLayout;
